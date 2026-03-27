import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const app = express();

// ── CORS — only allow known origins ────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://noorkada-pos.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
];
app.use(cors({
  origin: (origin, cb) => {
    // Allow server-to-server / Postman (no origin) in dev only
    if (!origin) return cb(null, process.env.NODE_ENV !== 'production');
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ── Security headers ────────────────────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', [
    "default-src 'none'",
    "script-src 'self'",
    "connect-src 'self' https://*.supabase.co",
    "img-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
  ].join('; '));
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  next();
});

app.use(express.json({ limit: '500kb' }));

// ── Supabase ────────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

// ── JWT secret — refuse to start without a real secret ─────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET env var is missing or too short (min 32 chars).');
  // In serverless we can't exit, so all JWT ops will throw safely below
}

// ── Role hierarchy ─────────────────────────────────────────────────────────────
// staff(0) < receptionist(1) < manager(2) < admin(3) < superadmin(4)
const ROLE_RANK = { staff: 0, receptionist: 1, manager: 2, admin: 3, superadmin: 4 };

// ── In-memory rate limiter (login brute-force protection) ──────────────────────
// Stores { attempts, resetAt } per IP. Resets after WINDOW_MS.
const RATE_LIMIT_MAP = new Map();
const MAX_LOGIN_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const loginRateLimit = (req, res, next) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  let entry = RATE_LIMIT_MAP.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { attempts: 0, resetAt: now + WINDOW_MS };
    RATE_LIMIT_MAP.set(ip, entry);
  }
  entry.attempts++;
  if (entry.attempts > MAX_LOGIN_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({ message: `Too many login attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes.` });
  }
  next();
};

// ── Activity logger ────────────────────────────────────────────────────────────
const log = (user, action, entity, entity_id, details) => {
  supabase.from('activity_logs').insert({
    user_id: user?.id || null,
    username: user?.username || 'system',
    full_name: user?.full_name || '',
    role: user?.role || 'system',
    action,
    entity: entity || null,
    entity_id: entity_id ? String(entity_id) : null,
    details: details || null,
  }).then(() => {}).catch(() => {});
};

// ── Auth middleware ────────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  if (!JWT_SECRET) return res.status(500).json({ message: 'Server misconfiguration' });
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const requireRole = (minRole) => (req, res, next) =>
  auth(req, res, () => {
    if ((ROLE_RANK[req.user?.role] || 0) < (ROLE_RANK[minRole] || 1)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  });

// ── Staff-only rate limiter (100 req/min per user) ────────────────────────────
const STAFF_RATE_MAP = new Map();
const staffApiRateLimit = (userId, res, next) => {
  const now = Date.now();
  let e = STAFF_RATE_MAP.get(userId);
  if (!e || now > e.resetAt) { e = { count: 0, resetAt: now + 60000 }; STAFF_RATE_MAP.set(userId, e); }
  e.count++;
  if (e.count > 100) return res.status(429).json({ message: 'Rate limit exceeded. Try again shortly.' });
  next();
};

// ── Staff-only middleware (role must be exactly 'staff') ──────────────────────
const requireStaff = (req, res, next) =>
  auth(req, res, () => {
    if (req.user?.role !== 'staff') return res.status(403).json({ message: 'Access denied. Staff only.' });
    staffApiRateLimit(req.user.id, res, next);
  });

// ── Input helpers ──────────────────────────────────────────────────────────────
const sanitizeStr = (v, maxLen = 200) =>
  typeof v === 'string' ? v.trim().slice(0, maxLen) : '';

const sanitizeNum = (v, fallback = 0) => {
  const n = Number(v);
  return isFinite(n) ? n : fallback;
};

// ── Setup (first-time admin creation) ─────────────────────────────────────────
app.get('/api/setup', async (_req, res) => {
  const { count } = await supabase.from('users').select('id', { count: 'exact', head: true });
  res.json({ needsSetup: count === 0 });
});

app.post('/api/setup', async (req, res) => {
  const { count } = await supabase.from('users').select('id', { count: 'exact', head: true });
  if (count > 0) return res.status(400).json({ message: 'Setup already completed' });
  const username = sanitizeStr(req.body.username, 50);
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const salonName = sanitizeStr(req.body.salonName, 100);
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
  if (!JWT_SECRET) return res.status(500).json({ message: 'Server misconfiguration' });
  const password_hash = await bcrypt.hash(password, 12);
  const { data, error } = await supabase.from('users').insert({ username, password_hash, role: 'superadmin' }).select().single();
  if (error) return res.status(500).json({ message: 'Could not create account' });
  if (salonName) await supabase.from('settings').upsert({ key: 'salon_name', value: { v: salonName } });
  const token = jwt.sign({ id: data.id, username: data.username, role: data.role }, JWT_SECRET, { expiresIn: '24h' });
  log({ id: data.id, username: data.username, role: data.role }, 'SETUP_COMPLETE', 'user', data.id, { salonName });
  res.json({ token, username: data.username, role: data.role });
});

// ── Login ──────────────────────────────────────────────────────────────────────
app.post('/api/login', loginRateLimit, async (req, res) => {
  const username = sanitizeStr(req.body.username, 50).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  if (!JWT_SECRET) return res.status(500).json({ message: 'Server misconfiguration' });
  const { data: users } = await supabase.from('users').select('*').eq('username', username).limit(1);
  const user = users?.[0];
  // Always run bcrypt even when user not found (prevents timing attacks)
  const dummyHash = '$2a$12$dummyhashtopreventtimingattacksxxxxxxxxxxxxxxxxxx';
  const valid = user ? await bcrypt.compare(password, user.password_hash) : await bcrypt.compare(password, dummyHash).then(() => false);
  if (!user || !valid) {
    log(null, 'LOGIN_FAILED', 'user', null, { attempted_username: username });
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username, full_name: user.full_name || '', role: user.role, floor: user.floor || null },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  log(user, 'LOGIN', 'user', user.id, null);
  res.json({ token, username: user.username, full_name: user.full_name || '', role: user.role, floor: user.floor || null });
});

// forgot-password is not implemented (no SMTP configured)
// Endpoint kept for forward compatibility but clearly returns not-implemented
app.post('/api/forgot-password', (_req, res) => {
  res.status(501).json({ message: 'Password reset is not available. Please contact your administrator.' });
});

// ── Activity Logs (admin+ only) ────────────────────────────────────────────────
app.get('/api/logs', requireRole('admin'), async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 200, 500);
  const offset = Math.max(parseInt(req.query.offset) || 0, 0);
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) return res.status(500).json({ message: 'Failed to fetch logs' });
  res.json(data);
});

// ── Categories ─────────────────────────────────────────────────────────────────
app.get('/api/categories', auth, async (_req, res) => {
  const { data, error } = await supabase.from('categories').select('*').order('id');
  if (error) return res.status(500).json({ message: 'Failed to fetch categories' });
  res.json(data);
});

app.post('/api/categories', requireRole('manager'), async (req, res) => {
  const name = sanitizeStr(req.body.name, 100);
  const icon = sanitizeStr(req.body.icon, 10);
  const color = sanitizeStr(req.body.color, 20);
  if (!name) return res.status(400).json({ message: 'Name required' });
  const { data, error } = await supabase.from('categories').insert({ name, icon, color }).select().single();
  if (error) return res.status(500).json({ message: 'Failed to create category' });
  log(req.user, 'CREATE_CATEGORY', 'category', data.id, { name });
  res.json(data);
});

app.delete('/api/categories/:id', requireRole('manager'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid ID' });
  const { data: cat } = await supabase.from('categories').select('name').eq('id', id).single();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return res.status(500).json({ message: 'Failed to delete category' });
  log(req.user, 'DELETE_CATEGORY', 'category', id, { name: cat?.name });
  res.json({ success: true });
});

// ── Services ───────────────────────────────────────────────────────────────────
app.get('/api/services', auth, async (_req, res) => {
  const { data, error } = await supabase.from('services').select('*').order('id');
  if (error) return res.status(500).json({ message: 'Failed to fetch services' });
  res.json(data);
});

app.post('/api/services', requireRole('manager'), async (req, res) => {
  const name = sanitizeStr(req.body.name, 200);
  const category = sanitizeStr(req.body.category, 100);
  const price = sanitizeNum(req.body.price, 0);
  const icon = sanitizeStr(req.body.icon, 10);
  const color = sanitizeStr(req.body.color, 20);
  const included_services = Array.isArray(req.body.included_services) ? req.body.included_services.map(s => sanitizeStr(s, 200)) : [];
  if (!name || !category) return res.status(400).json({ message: 'Name and category required' });
  const { data, error } = await supabase.from('services').insert({ name, category, price, icon, color, included_services }).select().single();
  if (error) return res.status(500).json({ message: 'Failed to create service' });
  log(req.user, 'CREATE_SERVICE', 'service', data.id, { name, category, price });
  res.json(data);
});

app.put('/api/services/:id', requireRole('manager'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid ID' });
  const name = sanitizeStr(req.body.name, 200);
  const category = sanitizeStr(req.body.category, 100);
  const price = sanitizeNum(req.body.price, 0);
  const icon = sanitizeStr(req.body.icon, 10);
  const color = sanitizeStr(req.body.color, 20);
  const included_services = Array.isArray(req.body.included_services) ? req.body.included_services.map(s => sanitizeStr(s, 200)) : [];
  const { data, error } = await supabase.from('services').update({ name, category, price, icon, color, included_services }).eq('id', id).select().single();
  if (error) return res.status(500).json({ message: 'Failed to update service' });
  log(req.user, 'UPDATE_SERVICE', 'service', id, { name, category, price });
  res.json(data);
});

app.delete('/api/services/:id', requireRole('manager'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid ID' });
  const { data: svc } = await supabase.from('services').select('name').eq('id', id).single();
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) return res.status(500).json({ message: 'Failed to delete service' });
  log(req.user, 'DELETE_SERVICE', 'service', id, { name: svc?.name });
  res.json({ success: true });
});

// ── Staff ──────────────────────────────────────────────────────────────────────
app.get('/api/stylists', auth, async (_req, res) => {
  const { data, error } = await supabase.from('stylists').select('*').order('id');
  if (error) return res.status(500).json({ message: 'Failed to fetch staff' });
  res.json(data);
});

app.post('/api/stylists', requireRole('manager'), async (req, res) => {
  const name = sanitizeStr(req.body.name, 100);
  const phone = sanitizeStr(req.body.phone, 20);
  const email = sanitizeStr(req.body.email, 200);
  const address = sanitizeStr(req.body.address, 300);
  const color = sanitizeStr(req.body.color, 20) || '#B08040';
  const position = sanitizeStr(req.body.position, 100);
  if (!name) return res.status(400).json({ message: 'Name required' });
  const joined_date = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase.from('stylists').insert({ name, phone, email, address, color, joined_date, position }).select().single();
  if (error) return res.status(500).json({ message: 'Failed to create staff member' });
  log(req.user, 'CREATE_STAFF', 'staff', data.id, { name, position, phone, email });
  res.json(data);
});

app.put('/api/stylists/:id', requireRole('manager'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid ID' });
  const name = sanitizeStr(req.body.name, 100);
  const phone = sanitizeStr(req.body.phone, 20);
  const email = sanitizeStr(req.body.email, 200);
  const address = sanitizeStr(req.body.address, 300);
  const color = sanitizeStr(req.body.color, 20);
  const position = sanitizeStr(req.body.position, 100);
  if (!name) return res.status(400).json({ message: 'Name is required' });
  // Uniqueness checks (exclude self)
  if (phone) {
    const { data: ex } = await supabase.from('stylists').select('id').eq('phone', phone).neq('id', id).maybeSingle();
    if (ex) return res.status(400).json({ message: 'Phone number is already registered to another staff member' });
  }
  if (email) {
    const { data: ex1 } = await supabase.from('stylists').select('id').eq('email', email).neq('id', id).maybeSingle();
    const { data: ex2 } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
    if (ex1 || ex2) return res.status(400).json({ message: 'Email address is already in use' });
  }
  const { data, error } = await supabase.from('stylists').update({ name, phone, email, address, color, position }).eq('id', id).select().single();
  if (error) return res.status(500).json({ message: 'Failed to update staff member' });
  log(req.user, 'UPDATE_STAFF', 'staff', id, { name, position });
  res.json(data);
});

app.delete('/api/stylists/:id', requireRole('manager'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid ID' });
  const { data: sty } = await supabase.from('stylists').select('name').eq('id', id).single();
  const { error } = await supabase.from('stylists').delete().eq('id', id);
  if (error) return res.status(500).json({ message: 'Failed to delete staff member' });
  log(req.user, 'DELETE_STAFF', 'staff', id, { name: sty?.name });
  res.json({ success: true });
});

// ── Staff Positions ────────────────────────────────────────────────────────────
app.get('/api/staff-positions', auth, async (_req, res) => {
  const { data, error } = await supabase.from('staff_positions').select('*').order('name');
  if (error) return res.status(500).json({ message: 'Failed to fetch positions' });
  res.json(data);
});

app.post('/api/staff-positions', requireRole('manager'), async (req, res) => {
  const name = sanitizeStr(req.body.name, 100);
  const emoji = sanitizeStr(req.body.emoji, 10) || '👤';
  if (!name) return res.status(400).json({ message: 'Name required' });
  const { data, error } = await supabase.from('staff_positions').insert({ name, emoji }).select().single();
  if (error) return res.status(500).json({ message: 'Failed to create position' });
  log(req.user, 'CREATE_STAFF_POSITION', 'staff_position', data.id, { name });
  res.json(data);
});

app.delete('/api/staff-positions/:id', requireRole('manager'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid ID' });
  const { data: pos } = await supabase.from('staff_positions').select('name').eq('id', id).single();
  const { error } = await supabase.from('staff_positions').delete().eq('id', id);
  if (error) return res.status(500).json({ message: 'Failed to delete position' });
  log(req.user, 'DELETE_STAFF_POSITION', 'staff_position', id, { name: pos?.name });
  res.json({ success: true });
});

// ── Transactions ───────────────────────────────────────────────────────────────
app.get('/api/transactions', requireRole('receptionist'), async (req, res) => {
  let q = supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(2000);
  if (req.user.floor) q = q.eq('floor', req.user.floor);
  const { data, error } = await q;
  if (error) return res.status(500).json({ message: 'Failed to fetch transactions' });
  res.json(data);
});

app.post('/api/transactions', requireRole('receptionist'), async (req, res) => {
  const cust_name = sanitizeStr(req.body.cust_name, 200) || 'Walk-in';
  const cust_phone = sanitizeStr(req.body.cust_phone, 30);
  const tab_name = sanitizeStr(req.body.tab_name, 200) || cust_name;
  const pay_mode = sanitizeStr(req.body.pay_mode, 20) || 'CASH';
  const disc_mode = sanitizeStr(req.body.disc_mode, 20) || 'none';
  const disc_reason = sanitizeStr(req.body.disc_reason, 300);
  const disc_courtesy_by = sanitizeStr(req.body.disc_courtesy_by, 100);
  const note = sanitizeStr(req.body.note, 500);
  const staff_name = sanitizeStr(req.body.staff_name, 100);
  const split_other_mode = sanitizeStr(req.body.split_other_mode, 20) || 'ONLINE';
  const total = sanitizeNum(req.body.total, 0);
  const disc_pct = sanitizeNum(req.body.disc_pct, 0);
  const disc_flat = sanitizeNum(req.body.disc_flat, 0);
  const split_cash = sanitizeNum(req.body.split_cash, 0);
  const split_other_amt = sanitizeNum(req.body.split_other_amt, 0);
  const cart = Array.isArray(req.body.cart) ? req.body.cart.slice(0, 100) : [];

  const { data, error } = await supabase.from('transactions').insert({
    tab_name, cust_name, cust_phone, cart, total,
    pay_mode, disc_mode, disc_pct, disc_flat,
    disc_reason, disc_courtesy_by,
    note, staff_name,
    split_cash, split_other_mode, split_other_amt,
    floor: req.user.floor || 'male'
  }).select().single();
  if (error) return res.status(500).json({ message: 'Failed to save transaction' });
  log(req.user, 'CREATE_TRANSACTION', 'transaction', data.id, {
    cust_name, total, pay_mode, staff_name,
    items: cart.length,
    disc_mode: disc_mode || 'none',
  });
  res.json(data);
});

app.put('/api/transactions/:id', requireRole('receptionist'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid ID' });

  const cust_name = sanitizeStr(req.body.cust_name, 200) || 'Walk-in';
  const cust_phone = sanitizeStr(req.body.cust_phone, 30);
  const pay_mode = sanitizeStr(req.body.pay_mode, 20) || 'CASH';
  const disc_mode = sanitizeStr(req.body.disc_mode, 20) || 'none';
  const disc_reason = sanitizeStr(req.body.disc_reason, 300);
  const disc_courtesy_by = sanitizeStr(req.body.disc_courtesy_by, 100);
  const note = sanitizeStr(req.body.note, 500);
  const staff_name = sanitizeStr(req.body.staff_name, 100);
  const split_other_mode = sanitizeStr(req.body.split_other_mode, 20) || 'ONLINE';
  const edit_note = sanitizeStr(req.body.edit_note, 500);
  const total = sanitizeNum(req.body.total, 0);
  const disc_pct = sanitizeNum(req.body.disc_pct, 0);
  const disc_flat = sanitizeNum(req.body.disc_flat, 0);
  const split_cash = sanitizeNum(req.body.split_cash, 0);
  const split_other_amt = sanitizeNum(req.body.split_other_amt, 0);
  const cart = Array.isArray(req.body.cart) ? req.body.cart.slice(0, 100) : [];

  const { data: current, error: fetchErr } = await supabase
    .from('transactions').select('*').eq('id', id).single();
  if (fetchErr || !current) return res.status(404).json({ message: 'Transaction not found' });

  const amendment = {
    edited_at: new Date().toISOString(),
    edited_by: req.user.username,
    edit_note,
    snapshot: {
      cart: current.cart,
      total: current.total,
      pay_mode: current.pay_mode,
      cust_name: current.cust_name,
      cust_phone: current.cust_phone,
      staff_name: current.staff_name,
      disc_mode: current.disc_mode,
      disc_pct: current.disc_pct,
      disc_flat: current.disc_flat,
      disc_reason: current.disc_reason,
    }
  };

  const prevAmendments = Array.isArray(current.amendments) ? current.amendments : [];

  const updates = {
    cart, total, pay_mode,
    cust_name,
    tab_name: cust_name || current.tab_name || 'Walk-in',
    cust_phone,
    staff_name,
    disc_mode, disc_pct, disc_flat, disc_reason, disc_courtesy_by,
    note,
    split_cash, split_other_mode, split_other_amt,
    amendments: [...prevAmendments, amendment],
  };

  let { data, error } = await supabase.from('transactions').update(updates).eq('id', id).select().single();

  if (error && (error.message?.includes('amendments') || error.code === '42703')) {
    const { amendments: _omit, ...updatesWithoutAmendments } = updates;
    const result = await supabase.from('transactions').update(updatesWithoutAmendments).eq('id', id).select().single();
    data = result.data;
    error = result.error;
  }

  if (error) return res.status(500).json({ message: 'Failed to update transaction' });

  log(req.user, 'EDIT_TRANSACTION', 'transaction', id, {
    cust_name: cust_name || current.cust_name,
    old_total: current.total,
    new_total: total,
    edit_note,
  });
  res.json(data);
});

// ── Users ──────────────────────────────────────────────────────────────────────
app.get('/api/users', requireRole('manager'), async (_req, res) => {
  const { data, error } = await supabase.from('users').select('id, username, full_name, email, role, floor, created_at').order('id');
  if (error) return res.status(500).json({ message: 'Failed to fetch users' });
  res.json(data);
});

app.post('/api/users', requireRole('manager'), async (req, res) => {
  const username = sanitizeStr(req.body.username, 50).toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const role = sanitizeStr(req.body.role, 20) || 'receptionist';
  const email = sanitizeStr(req.body.email, 200);
  const full_name = sanitizeStr(req.body.full_name, 100);
  const floorRaw = sanitizeStr(req.body.floor, 10);
  const floor = ['male', 'female'].includes(floorRaw) ? floorRaw : null;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
  if (!(role in ROLE_RANK)) return res.status(400).json({ message: 'Invalid role' });
  const actorRank = ROLE_RANK[req.user.role] || 0;
  const targetRank = ROLE_RANK[role] || 1;
  if (targetRank >= actorRank) return res.status(403).json({ message: 'Cannot create a user with equal or higher role' });
  const password_hash = await bcrypt.hash(password, 12);
  const { data, error } = await supabase.from('users')
    .insert({ username, full_name, password_hash, role, email, floor })
    .select('id, username, full_name, email, role, floor, created_at').single();
  if (error) return res.status(500).json({ message: error.code === '23505' ? 'Username already exists' : 'Failed to create user' });
  log(req.user, 'CREATE_USER', 'user', data.id, { username: data.username, full_name: data.full_name, role: data.role, floor: data.floor });
  res.json(data);
});

// Must be defined BEFORE /api/users/:id
app.put('/api/users/profile', auth, async (req, res) => {
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const currentPassword = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
  if (password && password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
  const { data: users } = await supabase.from('users').select('*').eq('id', req.user.id).limit(1);
  const user = users?.[0];
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (currentPassword) {
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });
  }
  if (password) {
    const password_hash = await bcrypt.hash(password, 12);
    await supabase.from('users').update({ password_hash }).eq('id', req.user.id);
    log(req.user, 'CHANGE_PASSWORD', 'user', req.user.id, null);
  }
  res.json({ success: true, message: 'Password updated successfully' });
});

app.put('/api/users/:id', requireRole('manager'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid ID' });
  const role = sanitizeStr(req.body.role, 20);
  const username = sanitizeStr(req.body.username, 50);
  const full_name = sanitizeStr(req.body.full_name, 100);
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  if (password && password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
  const actorRank = ROLE_RANK[req.user.role] || 0;
  const isSelf = String(req.user.id) === String(id);

  if (!isSelf) {
    const { data: target } = await supabase.from('users').select('role').eq('id', id).single();
    if (!target) return res.status(404).json({ message: 'User not found' });
    if ((ROLE_RANK[target.role] || 0) >= actorRank) return res.status(403).json({ message: 'Cannot modify a user with equal or higher role' });
    if (role && (ROLE_RANK[role] || 0) >= actorRank) return res.status(403).json({ message: 'Cannot assign equal or higher role' });
  }

  // Username uniqueness check (exclude self)
  if (username) {
    const norm = username.toLowerCase();
    const { data: ex } = await supabase.from('users').select('id').eq('username', norm).neq('id', id).maybeSingle();
    if (ex) return res.status(400).json({ message: 'Username is already taken' });
  }
  const floorRaw2 = req.body.hasOwnProperty('floor') ? sanitizeStr(req.body.floor, 10) : undefined;
  const updates = {};
  if (username) updates.username = username.toLowerCase();
  if (full_name !== undefined) updates.full_name = full_name;
  if (!isSelf && role && ROLE_RANK[role]) updates.role = role;
  if (password) updates.password_hash = await bcrypt.hash(password, 12);
  if (!isSelf && floorRaw2 !== undefined) updates.floor = ['male', 'female'].includes(floorRaw2) ? floorRaw2 : null;
  const { data, error } = await supabase.from('users').update(updates).eq('id', id).select('id, username, full_name, email, role, floor').single();
  if (error) return res.status(500).json({ message: 'Failed to update user' });
  const changes = {};
  if (username) changes.username = username;
  if (!isSelf && role) changes.role = role;
  if (password) changes.password_changed = true;
  log(req.user, isSelf ? 'UPDATE_OWN_PROFILE' : 'UPDATE_USER', 'user', id, changes);
  res.json(data);
});

app.delete('/api/users/:id', requireRole('manager'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid ID' });
  if (String(req.user.id) === String(id)) return res.status(400).json({ message: 'Cannot delete yourself' });
  const actorRank = ROLE_RANK[req.user.role] || 0;
  const { data: target } = await supabase.from('users').select('role, username').eq('id', id).single();
  if (!target) return res.status(404).json({ message: 'User not found' });
  if ((ROLE_RANK[target.role] || 0) >= actorRank) return res.status(403).json({ message: 'Cannot delete a user with equal or higher role' });
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) return res.status(500).json({ message: 'Failed to delete user' });
  log(req.user, 'DELETE_USER', 'user', id, { deleted_username: target.username, deleted_role: target.role });
  res.json({ success: true });
});

// ── Settings (admin+ only) ─────────────────────────────────────────────────────
app.get('/api/settings/smtp', requireRole('admin'), async (_req, res) => {
  const { data } = await supabase.from('settings').select('value').eq('key', 'smtp').single();
  res.json(data?.value || {});
});

app.post('/api/settings/smtp', requireRole('admin'), async (req, res) => {
  await supabase.from('settings').upsert({ key: 'smtp', value: req.body });
  log(req.user, 'UPDATE_SMTP_SETTINGS', 'settings', 'smtp', null);
  res.json({ success: true });
});

// ── Branding settings (readable by all authenticated, writable by manager+) ───
app.get('/api/settings/branding', requireRole('receptionist'), async (_req, res) => {
  const { data } = await supabase.from('settings').select('value').eq('key', 'branding').single();
  res.json(data?.value || {});
});

app.post('/api/settings/branding', requireRole('manager'), async (req, res) => {
  const { salonName, salonLogo, salonAddress, showSalonName } = req.body;
  await supabase.from('settings').upsert({ key: 'branding', value: { salonName, salonLogo, salonAddress, showSalonName } });
  log(req.user, 'UPDATE_BRANDING', 'settings', 'branding', null);
  res.json({ success: true });
});

// ── Staff Dashboard Endpoints (role === 'staff' only) ─────────────────────────

// Helper: parse & validate date string YYYY-MM-DD
const parseDate = (d) => {
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  const dt = new Date(d + 'T00:00:00Z');
  return isNaN(dt.getTime()) ? null : d;
};

// Compute summary stats from transactions for a staff member's name
const buildSummary = (txns, staffName) => {
  let totalServices = 0, totalRevenue = 0;
  const clientSet = new Set();
  const serviceBreakdown = {};
  const dailyMap = {};
  for (const txn of (txns || [])) {
    let txnHasStaff = false;
    for (const item of (txn.cart || [])) {
      if (item.stylist !== staffName) continue;
      txnHasStaff = true;
      const qty = item.qty || 1;
      const rev = (item.price || 0) * qty;
      totalServices += qty;
      totalRevenue += rev;
      const svc = item.service || 'Unknown';
      if (!serviceBreakdown[svc]) serviceBreakdown[svc] = { count: 0, revenue: 0 };
      serviceBreakdown[svc].count += qty;
      serviceBreakdown[svc].revenue += rev;
      const day = txn.created_at ? txn.created_at.slice(0, 10) : 'unknown';
      if (!dailyMap[day]) dailyMap[day] = { revenue: 0, services: 0 };
      dailyMap[day].revenue += rev;
      dailyMap[day].services += qty;
    }
    if (txnHasStaff) {
      clientSet.add((txn.cust_phone || '') + '|' + (txn.cust_name || '') + '|' + txn.id);
    }
  }
  return {
    totalServices, totalRevenue,
    totalClients: clientSet.size,
    serviceBreakdown: Object.entries(serviceBreakdown)
      .map(([name, v]) => ({ service_name: name, count: v.count, revenue: v.revenue }))
      .sort((a, b) => b.revenue - a.revenue),
    dailyMap,
  };
};

// POST /api/staff/create — unified: creates stylist profile + optional login account atomically
app.post('/api/staff/create', requireRole('manager'), async (req, res) => {
  const full_name  = sanitizeStr(req.body.full_name, 100);
  const phone      = sanitizeStr(req.body.phone, 20);
  const email      = sanitizeStr(req.body.email, 200);
  const address    = sanitizeStr(req.body.address, 300);
  const position   = sanitizeStr(req.body.position, 100);
  const username   = sanitizeStr(req.body.username, 50) ? sanitizeStr(req.body.username, 50).toLowerCase().replace(/\s/g, '') : '';
  const password   = typeof req.body.password === 'string' ? req.body.password : '';
  const role       = sanitizeStr(req.body.role, 20) || 'staff';
  const floorRaw3  = sanitizeStr(req.body.floor, 10);
  const validFloor = ['male', 'female'].includes(floorRaw3) ? floorRaw3 : null;

  if (!full_name) return res.status(400).json({ message: 'Full name is required' });

  const actorRank  = ROLE_RANK[req.user.role] || 0;
  const hasLogin   = !!(username && password);

  if (hasLogin) {
    if (!(role in ROLE_RANK)) return res.status(400).json({ message: 'Invalid role' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const targetRank = ROLE_RANK[role];
    if (targetRank >= actorRank) return res.status(403).json({ message: 'Cannot assign equal or higher role' });
  }

  // Uniqueness pre-checks
  if (phone) {
    const { data: ex } = await supabase.from('stylists').select('id').eq('phone', phone).maybeSingle();
    if (ex) return res.status(400).json({ message: 'Phone number is already registered to another staff member' });
  }
  if (email) {
    const { data: ex1 } = await supabase.from('stylists').select('id').eq('email', email).maybeSingle();
    const { data: ex2 } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
    if (ex1 || ex2) return res.status(400).json({ message: 'Email address is already in use' });
  }
  if (hasLogin) {
    const { data: ex } = await supabase.from('users').select('id').eq('username', username).maybeSingle();
    if (ex) return res.status(400).json({ message: 'Username is already taken' });
  }

  let stylistRecord = null;
  try {
    const joined_date = new Date().toISOString().split('T')[0];
    const { data: s, error: sErr } = await supabase
      .from('stylists')
      .insert({ name: full_name, phone: phone || '', email: email || '', address: address || '', position: position || '', joined_date, color: '#B08040' })
      .select().single();
    if (sErr) throw new Error(sErr.message || 'Failed to create staff profile');
    stylistRecord = s;

    let userRecord = null;
    if (hasLogin) {
      const password_hash = await bcrypt.hash(password, 12);
      const { data: u, error: uErr } = await supabase
        .from('users')
        .insert({ username, full_name, password_hash, role, email: email || '', floor: validFloor })
        .select('id, username, full_name, email, role, floor, created_at').single();
      if (uErr) {
        await supabase.from('stylists').delete().eq('id', stylistRecord.id);
        throw new Error(uErr.code === '23505' ? 'Username already exists' : (uErr.message || 'Failed to create login account'));
      }
      userRecord = u;
    }

    log(req.user, 'CREATE_STAFF_UNIFIED', 'staff', stylistRecord.id, { name: full_name, username: username || null, role: hasLogin ? role : null, position });
    res.json({ stylist: stylistRecord, user: userRecord });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/staff/me/summary?date=YYYY-MM-DD | ?range=week|month | ?from=YYYY-MM-DD&to=YYYY-MM-DD
app.get('/api/staff/me/summary', requireStaff, async (req, res) => {
  const staffName = req.user.full_name;
  if (!staffName) return res.status(400).json({ message: 'Staff profile incomplete — full_name required' });

  const todayStr = new Date().toISOString().slice(0, 10);
  let dateStart, dateEnd, dateLabel;

  const range     = sanitizeStr(req.query.range, 10);
  const fromParam = sanitizeStr(req.query.from, 10);
  const toParam   = sanitizeStr(req.query.to, 10);

  if (fromParam && toParam) {
    // Custom date range
    dateStart = parseDate(fromParam);
    dateEnd   = parseDate(toParam);
    if (!dateStart || !dateEnd) return res.status(400).json({ message: 'Invalid date range. Use YYYY-MM-DD' });
    if (dateStart > dateEnd) return res.status(400).json({ message: 'from must be ≤ to' });
    dateLabel = 'custom';
  } else if (range === 'week') {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 6);
    dateStart = d.toISOString().slice(0, 10);
    dateEnd = todayStr;
    dateLabel = 'week';
  } else if (range === 'month') {
    dateStart = todayStr.slice(0, 7) + '-01';
    dateEnd = todayStr;
    dateLabel = 'month';
  } else {
    const rawDate = sanitizeStr(req.query.date, 10) || todayStr;
    dateStart = parseDate(rawDate);
    if (!dateStart) return res.status(400).json({ message: 'Invalid date. Use YYYY-MM-DD' });
    dateEnd = dateStart;
    dateLabel = dateStart;
  }

  try {
    const { data: txns, error } = await supabase
      .from('transactions')
      .select('id, cart, cust_name, cust_phone, created_at')
      .gte('created_at', dateStart + 'T00:00:00.000Z')
      .lte('created_at', dateEnd + 'T23:59:59.999Z')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (error) throw error;

    const { totalServices, totalRevenue, totalClients, serviceBreakdown, dailyMap } = buildSummary(txns, staffName);

    // Build daily breakdown for week/month view (for bar chart)
    const dailyBreakdown = [];
    if (dateStart !== dateEnd) {
      const cur = new Date(dateStart + 'T00:00:00Z');
      const end = new Date(dateEnd + 'T00:00:00Z');
      while (cur <= end) {
        const d = cur.toISOString().slice(0, 10);
        dailyBreakdown.push({ date: d, revenue: dailyMap[d]?.revenue || 0, services: dailyMap[d]?.services || 0 });
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
    }

    // Build individual service log entries
    const serviceLog = [];
    for (const txn of (txns || [])) {
      for (const item of (txn.cart || [])) {
        if (item.stylist !== staffName) continue;
        const qty = item.qty || 1;
        const rev = (item.price || 0) * qty;
        const slip = `NK${String(txn.id || '').slice(-6)}`;
        const custLabel = txn.cust_name || 'Walk-in';
        const timeStr = txn.created_at ? new Date(txn.created_at).toLocaleString('en-PK', { timeZone: 'Asia/Karachi', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) : '';
        serviceLog.push({ slip, service_name: item.service || 'Unknown', customer: custLabel, qty, revenue: rev, time: timeStr });
      }
    }

    res.json({
      staff_id: req.user.id,
      staff_name: staffName,
      date: dateLabel,
      date_start: dateStart,
      date_end: dateEnd,
      total_services: totalServices,
      total_clients_served: totalClients,
      total_revenue_generated: totalRevenue,
      currency: 'PKR',
      services_breakdown: serviceBreakdown,
      daily_breakdown: dailyBreakdown,
      service_log: serviceLog,
    });
  } catch (err) {
    console.error('Staff summary error:', err);
    res.status(500).json({ message: 'Failed to load summary. Please try again.' });
  }
});

// GET /api/staff/me/services?date=YYYY-MM-DD | ?from=YYYY-MM-DD&to=YYYY-MM-DD  &page=1&limit=50
app.get('/api/staff/me/services', requireStaff, async (req, res) => {
  const staffName = req.user.full_name;
  if (!staffName) return res.status(400).json({ message: 'Staff profile incomplete' });

  const fromParam = sanitizeStr(req.query.from, 10);
  const toParam   = sanitizeStr(req.query.to, 10);
  let dateStart, dateEnd;

  if (fromParam && toParam) {
    dateStart = parseDate(fromParam);
    dateEnd   = parseDate(toParam);
    if (!dateStart || !dateEnd) return res.status(400).json({ message: 'Invalid date range. Use YYYY-MM-DD' });
    if (dateStart > dateEnd) return res.status(400).json({ message: 'from must be ≤ to' });
  } else {
    const rawDate = sanitizeStr(req.query.date, 10) || new Date().toISOString().slice(0, 10);
    dateStart = parseDate(rawDate);
    if (!dateStart) return res.status(400).json({ message: 'Invalid date. Use YYYY-MM-DD' });
    dateEnd = dateStart;
  }

  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(500, Math.max(1, parseInt(req.query.limit) || 500));
  const offset = (page - 1) * limit;

  try {
    const { data: txns, error } = await supabase
      .from('transactions')
      .select('id, cart, cust_name, cust_phone, pay_mode, total, created_at')
      .gte('created_at', dateStart + 'T00:00:00.000Z')
      .lte('created_at', dateEnd + 'T23:59:59.999Z')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;

    const rows = [];
    for (const txn of (txns || [])) {
      for (const item of (txn.cart || [])) {
        if (item.stylist !== staffName) continue;
        const slip = `NK${String(txn.id || '').slice(-6)}`;
        rows.push({
          txn_id: txn.id,
          slip,
          service: item.service || 'Unknown',
          category: item.category || '',
          qty: item.qty || 1,
          price: item.price || 0,
          revenue: (item.price || 0) * (item.qty || 1),
          customer: txn.cust_name || 'Walk-in',
          time: txn.created_at,
        });
      }
    }

    res.json({
      data: rows.slice(offset, offset + limit),
      pagination: { page, limit, total: rows.length, pages: Math.ceil(rows.length / limit) || 1 },
    });
  } catch (err) {
    console.error('Staff services error:', err);
    res.status(500).json({ message: 'Failed to load services. Please try again.' });
  }
});

// GET /api/staff/admin/:staffId/summary (manager+ can view any staff member's summary)
app.get('/api/staff/admin/:staffId/summary', requireRole('manager'), async (req, res) => {
  const staffUserId = parseInt(req.params.staffId);
  if (!Number.isInteger(staffUserId)) return res.status(400).json({ message: 'Invalid staff ID' });

  const { data: staffUser } = await supabase.from('users').select('id, full_name, role').eq('id', staffUserId).single();
  if (!staffUser) return res.status(404).json({ message: 'Staff member not found' });

  const staffName = staffUser.full_name;
  if (!staffName) return res.status(400).json({ message: 'Staff profile incomplete' });

  const todayStr = new Date().toISOString().slice(0, 10);
  const range     = sanitizeStr(req.query.range, 10);
  const fromParam = sanitizeStr(req.query.from, 10);
  const toParam   = sanitizeStr(req.query.to, 10);
  let dateStart, dateEnd, dateLabel;

  if (fromParam && toParam) {
    dateStart = parseDate(fromParam);
    dateEnd   = parseDate(toParam);
    if (!dateStart || !dateEnd) return res.status(400).json({ message: 'Invalid date range. Use YYYY-MM-DD' });
    if (dateStart > dateEnd) return res.status(400).json({ message: 'from must be ≤ to' });
    dateLabel = 'custom';
  } else if (range === 'week') {
    const d = new Date(); d.setUTCDate(d.getUTCDate() - 6);
    dateStart = d.toISOString().slice(0, 10); dateEnd = todayStr; dateLabel = 'week';
  } else if (range === 'month') {
    dateStart = todayStr.slice(0, 7) + '-01'; dateEnd = todayStr; dateLabel = 'month';
  } else {
    const rawDate = sanitizeStr(req.query.date, 10) || todayStr;
    dateStart = parseDate(rawDate);
    if (!dateStart) return res.status(400).json({ message: 'Invalid date' });
    dateEnd = dateStart; dateLabel = dateStart;
  }

  try {
    const { data: txns, error } = await supabase
      .from('transactions')
      .select('id, cart, cust_name, cust_phone, created_at')
      .gte('created_at', dateStart + 'T00:00:00.000Z')
      .lte('created_at', dateEnd + 'T23:59:59.999Z')
      .order('created_at', { ascending: false })
      .limit(2000);
    if (error) throw error;

    const { totalServices, totalRevenue, totalClients, serviceBreakdown, dailyMap } = buildSummary(txns, staffName);
    const dailyBreakdown = [];
    if (dateStart !== dateEnd) {
      const cur = new Date(dateStart + 'T00:00:00Z');
      const end = new Date(dateEnd + 'T00:00:00Z');
      while (cur <= end) {
        const d = cur.toISOString().slice(0, 10);
        dailyBreakdown.push({ date: d, revenue: dailyMap[d]?.revenue || 0, services: dailyMap[d]?.services || 0 });
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
    }
    // Build individual service log entries
    const serviceLog = [];
    for (const txn of (txns || [])) {
      for (const item of (txn.cart || [])) {
        if (item.stylist !== staffName) continue;
        const qty = item.qty || 1;
        const rev = (item.price || 0) * qty;
        const slip = `NK${String(txn.id || '').slice(-6)}`;
        const custLabel = txn.cust_name || 'Walk-in';
        const timeStr = txn.created_at ? new Date(txn.created_at).toLocaleString('en-PK', { timeZone: 'Asia/Karachi', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) : '';
        serviceLog.push({ slip, service_name: item.service || 'Unknown', customer: custLabel, qty, revenue: rev, time: timeStr });
      }
    }
    res.json({
      staff_id: staffUser.id, staff_name: staffName,
      date: dateLabel, date_start: dateStart, date_end: dateEnd,
      total_services: totalServices, total_clients_served: totalClients,
      total_revenue_generated: totalRevenue, currency: 'PKR',
      services_breakdown: serviceBreakdown, daily_breakdown: dailyBreakdown,
      service_log: serviceLog,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load summary' });
  }
});

// ── 404 catch-all ──────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

export default app;
