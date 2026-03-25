import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'noorkada-change-this-secret';

// ── Role hierarchy ─────────────────────────────────────────────────────────────
// receptionist(1) < manager(2) < admin(3) < superadmin(4)
const ROLE_RANK = { receptionist: 1, manager: 2, admin: 3, superadmin: 4 };

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
  const token = (req.headers.authorization || '').replace('Bearer ', '');
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

// ── Setup (first-time admin creation) ─────────────────────────────────────────
app.get('/api/setup', async (_req, res) => {
  const { count } = await supabase.from('users').select('id', { count: 'exact', head: true });
  res.json({ needsSetup: count === 0 });
});

app.post('/api/setup', async (req, res) => {
  const { count } = await supabase.from('users').select('id', { count: 'exact', head: true });
  if (count > 0) return res.status(400).json({ message: 'Setup already completed' });
  const { username, password, salonName } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase.from('users').insert({ username, password_hash, role: 'superadmin' }).select().single();
  if (error) return res.status(500).json({ message: error.message });
  if (salonName) await supabase.from('settings').upsert({ key: 'salon_name', value: { v: salonName } });
  const token = jwt.sign({ id: data.id, username: data.username, role: data.role }, JWT_SECRET, { expiresIn: '7d' });
  log({ id: data.id, username: data.username, role: data.role }, 'SETUP_COMPLETE', 'user', data.id, { salonName });
  res.json({ token, username: data.username, role: data.role });
});

// ── Login ──────────────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  const { data: users } = await supabase.from('users').select('*').eq('username', username.toLowerCase().trim()).limit(1);
  const user = users?.[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    log(null, 'LOGIN_FAILED', 'user', null, { attempted_username: username.toLowerCase().trim() });
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign({ id: user.id, username: user.username, full_name: user.full_name || '', role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  log(user, 'LOGIN', 'user', user.id, null);
  res.json({ token, username: user.username, full_name: user.full_name || '', role: user.role });
});

app.post('/api/forgot-password', async (_req, res) => {
  res.json({ message: 'If an account exists, a reset link was sent.' });
});

// ── Activity Logs (admin+ only) ────────────────────────────────────────────────
app.get('/api/logs', requireRole('admin'), async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 200, 500);
  const offset = parseInt(req.query.offset) || 0;
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

// ── Categories (manager+ can mutate) ──────────────────────────────────────────
app.get('/api/categories', async (_req, res) => {
  const { data, error } = await supabase.from('categories').select('*').order('id');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post('/api/categories', requireRole('manager'), async (req, res) => {
  const { name, icon, color } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const { data, error } = await supabase.from('categories').insert({ name, icon, color }).select().single();
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'CREATE_CATEGORY', 'category', data.id, { name });
  res.json(data);
});

app.delete('/api/categories/:id', requireRole('manager'), async (req, res) => {
  const { data: cat } = await supabase.from('categories').select('name').eq('id', req.params.id).single();
  const { error } = await supabase.from('categories').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'DELETE_CATEGORY', 'category', req.params.id, { name: cat?.name });
  res.json({ success: true });
});

// ── Services (manager+ can mutate) ────────────────────────────────────────────
app.get('/api/services', async (_req, res) => {
  const { data, error } = await supabase.from('services').select('*').order('id');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post('/api/services', requireRole('manager'), async (req, res) => {
  const { name, category, price, icon, color, included_services } = req.body;
  if (!name || !category) return res.status(400).json({ message: 'Name and category required' });
  const { data, error } = await supabase.from('services').insert({ name, category, price: price || 0, icon, color, included_services: included_services || [] }).select().single();
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'CREATE_SERVICE', 'service', data.id, { name, category, price });
  res.json(data);
});

app.put('/api/services/:id', requireRole('manager'), async (req, res) => {
  const { name, category, price, icon, color, included_services } = req.body;
  const { data, error } = await supabase.from('services').update({ name, category, price, icon, color, included_services }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'UPDATE_SERVICE', 'service', req.params.id, { name, category, price });
  res.json(data);
});

app.delete('/api/services/:id', requireRole('manager'), async (req, res) => {
  const { data: svc } = await supabase.from('services').select('name').eq('id', req.params.id).single();
  const { error } = await supabase.from('services').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'DELETE_SERVICE', 'service', req.params.id, { name: svc?.name });
  res.json({ success: true });
});

// ── Staff (manager+ can mutate) ───────────────────────────────────────────────
app.get('/api/stylists', async (_req, res) => {
  const { data, error } = await supabase.from('stylists').select('*').order('id');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post('/api/stylists', requireRole('manager'), async (req, res) => {
  const { name, phone, email, address, color, position } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const joined_date = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase.from('stylists').insert({ name, phone: phone || '', email: email || '', address: address || '', color: color || '#B08040', joined_date, position: position || '' }).select().single();
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'CREATE_STAFF', 'staff', data.id, { name, position, phone, email });
  res.json(data);
});

app.put('/api/stylists/:id', requireRole('manager'), async (req, res) => {
  const { name, phone, email, address, color, position } = req.body;
  const { data, error } = await supabase.from('stylists').update({ name, phone, email, address, color, position }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'UPDATE_STAFF', 'staff', req.params.id, { name, position });
  res.json(data);
});

app.delete('/api/stylists/:id', requireRole('manager'), async (req, res) => {
  const { data: sty } = await supabase.from('stylists').select('name').eq('id', req.params.id).single();
  const { error } = await supabase.from('stylists').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'DELETE_STAFF', 'staff', req.params.id, { name: sty?.name });
  res.json({ success: true });
});

// ── Staff Positions (manager+ can mutate) ──────────────────────────────────────
app.get('/api/staff-positions', async (_req, res) => {
  const { data, error } = await supabase.from('staff_positions').select('*').order('name');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post('/api/staff-positions', requireRole('manager'), async (req, res) => {
  const { name, emoji } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const { data, error } = await supabase.from('staff_positions').insert({ name: name.trim(), emoji: emoji || '👤' }).select().single();
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'CREATE_STAFF_POSITION', 'staff_position', data.id, { name });
  res.json(data);
});

app.delete('/api/staff-positions/:id', requireRole('manager'), async (req, res) => {
  const { data: pos } = await supabase.from('staff_positions').select('name').eq('id', req.params.id).single();
  const { error } = await supabase.from('staff_positions').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'DELETE_STAFF_POSITION', 'staff_position', req.params.id, { name: pos?.name });
  res.json({ success: true });
});

// ── Transactions ───────────────────────────────────────────────────────────────
app.get('/api/transactions', requireRole('receptionist'), async (_req, res) => {
  const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(2000);
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post('/api/transactions', async (req, res) => {
  const { tab_name, cust_name, cust_phone, cart, total, pay_mode, disc_mode, disc_pct, disc_flat, disc_reason, disc_courtesy_by, note, staff_name, split_cash, split_other_mode, split_other_amt } = req.body;
  const { data, error } = await supabase.from('transactions').insert({
    tab_name, cust_name, cust_phone, cart: cart || [], total: total || 0,
    pay_mode, disc_mode, disc_pct: disc_pct || 0, disc_flat: disc_flat || 0,
    disc_reason: disc_reason || '', disc_courtesy_by: disc_courtesy_by || '',
    note: note || '', staff_name: staff_name || '',
    split_cash: split_cash || 0, split_other_mode: split_other_mode || 'ONLINE', split_other_amt: split_other_amt || 0
  }).select().single();
  if (error) return res.status(500).json({ message: error.message });
  // Log with actor from token if present
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  let actor = null;
  try { actor = jwt.verify(token, JWT_SECRET); } catch {}
  log(actor, 'CREATE_TRANSACTION', 'transaction', data.id, {
    cust_name, total, pay_mode, staff_name,
    items: (cart || []).length,
    disc_mode: disc_mode || 'none',
  });
  res.json(data);
});

app.put('/api/transactions/:id', requireRole('receptionist'), async (req, res) => {
  const {
    cart, total, pay_mode, cust_name, cust_phone, staff_name,
    disc_mode, disc_pct, disc_flat, disc_reason, disc_courtesy_by,
    note, split_cash, split_other_mode, split_other_amt, edit_note
  } = req.body;

  // Fetch current state to store as amendment snapshot
  const { data: current, error: fetchErr } = await supabase
    .from('transactions').select('*').eq('id', req.params.id).single();
  if (fetchErr || !current) return res.status(404).json({ message: 'Transaction not found' });

  const amendment = {
    edited_at: new Date().toISOString(),
    edited_by: req.user.username,
    edit_note: edit_note || '',
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
    cart: cart || [],
    total: total || 0,
    pay_mode: pay_mode || 'CASH',
    cust_name: cust_name || 'Walk-in',
    tab_name: cust_name || current.tab_name || 'Walk-in',
    cust_phone: cust_phone || '',
    staff_name: staff_name || '',
    disc_mode: disc_mode || 'none',
    disc_pct: disc_pct || 0,
    disc_flat: disc_flat || 0,
    disc_reason: disc_reason || '',
    disc_courtesy_by: disc_courtesy_by || '',
    note: note || '',
    split_cash: split_cash || 0,
    split_other_mode: split_other_mode || 'ONLINE',
    split_other_amt: split_other_amt || 0,
    amendments: [...prevAmendments, amendment],
  };

  let { data, error } = await supabase.from('transactions').update(updates).eq('id', req.params.id).select().single();

  // If amendments column doesn't exist yet, retry without it
  if (error && (error.message?.includes('amendments') || error.code === '42703')) {
    const { amendments: _omit, ...updatesWithoutAmendments } = updates;
    const result = await supabase.from('transactions').update(updatesWithoutAmendments).eq('id', req.params.id).select().single();
    data = result.data;
    error = result.error;
  }

  if (error) return res.status(500).json({ message: error.message });

  log(req.user, 'EDIT_TRANSACTION', 'transaction', req.params.id, {
    cust_name: cust_name || current.cust_name,
    old_total: current.total,
    new_total: total,
    edit_note: edit_note || '',
  });
  res.json(data);
});

// ── Users ──────────────────────────────────────────────────────────────────────
app.get('/api/users', requireRole('manager'), async (_req, res) => {
  const { data, error } = await supabase.from('users').select('id, username, full_name, email, role, created_at').order('id');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post('/api/users', requireRole('manager'), async (req, res) => {
  const { username, password, role, email, full_name } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  const actorRank = ROLE_RANK[req.user.role] || 0;
  const targetRank = ROLE_RANK[role] || 1;
  if (targetRank >= actorRank) return res.status(403).json({ message: 'Cannot create a user with equal or higher role' });
  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase.from('users')
    .insert({ username: username.toLowerCase().trim(), full_name: full_name || '', password_hash, role: role || 'receptionist', email: email || '' })
    .select('id, username, full_name, email, role, created_at').single();
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'CREATE_USER', 'user', data.id, { username: data.username, full_name: data.full_name, role: data.role });
  res.json(data);
});

// Must be defined BEFORE /api/users/:id
app.put('/api/users/profile', auth, async (req, res) => {
  const { password, currentPassword } = req.body;
  const { data: users } = await supabase.from('users').select('*').eq('id', req.user.id).limit(1);
  const user = users?.[0];
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (currentPassword) {
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });
  }
  if (password) {
    const password_hash = await bcrypt.hash(password, 10);
    await supabase.from('users').update({ password_hash }).eq('id', req.user.id);
    log(req.user, 'CHANGE_PASSWORD', 'user', req.user.id, null);
  }
  res.json({ success: true, message: 'Password updated successfully' });
});

app.put('/api/users/:id', requireRole('manager'), async (req, res) => {
  const { role, password, username } = req.body;
  const actorRank = ROLE_RANK[req.user.role] || 0;
  const isSelf = String(req.user.id) === String(req.params.id);

  if (!isSelf) {
    const { data: target } = await supabase.from('users').select('role').eq('id', req.params.id).single();
    if (!target) return res.status(404).json({ message: 'User not found' });
    if ((ROLE_RANK[target.role] || 0) >= actorRank) return res.status(403).json({ message: 'Cannot modify a user with equal or higher role' });
    if (role && (ROLE_RANK[role] || 0) >= actorRank) return res.status(403).json({ message: 'Cannot assign equal or higher role' });
  }

  const updates = {};
  if (username) updates.username = username.toLowerCase().trim();
  if (req.body.full_name !== undefined) updates.full_name = req.body.full_name;
  if (!isSelf && role) updates.role = role;
  if (password) updates.password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase.from('users').update(updates).eq('id', req.params.id).select('id, username, full_name, email, role').single();
  if (error) return res.status(500).json({ message: error.message });
  const changes = {};
  if (username) changes.username = username;
  if (!isSelf && role) changes.role = role;
  if (password) changes.password_changed = true;
  log(req.user, isSelf ? 'UPDATE_OWN_PROFILE' : 'UPDATE_USER', 'user', req.params.id, changes);
  res.json(data);
});

app.delete('/api/users/:id', requireRole('manager'), async (req, res) => {
  if (String(req.user.id) === String(req.params.id)) return res.status(400).json({ message: 'Cannot delete yourself' });
  const actorRank = ROLE_RANK[req.user.role] || 0;
  const { data: target } = await supabase.from('users').select('role, username').eq('id', req.params.id).single();
  if (!target) return res.status(404).json({ message: 'User not found' });
  if ((ROLE_RANK[target.role] || 0) >= actorRank) return res.status(403).json({ message: 'Cannot delete a user with equal or higher role' });
  const { error } = await supabase.from('users').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  log(req.user, 'DELETE_USER', 'user', req.params.id, { deleted_username: target.username, deleted_role: target.role });
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

export default app;
