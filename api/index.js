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
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'noorkada-change-this-secret';

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

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (!['admin', 'superadmin', 'manager'].includes(req.user?.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  });
};

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
  if (salonName) {
    await supabase.from('settings').upsert({ key: 'salon_name', value: { v: salonName } });
  }
  const token = jwt.sign({ id: data.id, username: data.username, role: data.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username: data.username, role: data.role });
});

// ── Login ──────────────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  const { data: users } = await supabase.from('users').select('*').eq('username', username.toLowerCase()).limit(1);
  const user = users?.[0];
  if (!user) return res.status(401).json({ message: 'Invalid username or password' });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: 'Invalid username or password' });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username: user.username, role: user.role });
});

app.post('/api/forgot-password', async (req, res) => {
  // Email reset not implemented without SMTP config; just return success message
  res.json({ message: 'If an account exists, a reset link was sent.' });
});

// ── Categories ─────────────────────────────────────────────────────────────────
app.get('/api/categories', async (_req, res) => {
  const { data, error } = await supabase.from('categories').select('*').order('id');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post('/api/categories', auth, async (req, res) => {
  const { name, icon, color } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const { data, error } = await supabase.from('categories').insert({ name, icon, color }).select().single();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.delete('/api/categories/:id', auth, async (req, res) => {
  const { error } = await supabase.from('categories').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  res.json({ success: true });
});

// ── Services ───────────────────────────────────────────────────────────────────
app.get('/api/services', async (_req, res) => {
  const { data, error } = await supabase.from('services').select('*').order('id');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post('/api/services', auth, async (req, res) => {
  const { name, category, price, icon, color, included_services } = req.body;
  if (!name || !category) return res.status(400).json({ message: 'Name and category required' });
  const { data, error } = await supabase.from('services').insert({ name, category, price: price || 0, icon, color, included_services: included_services || [] }).select().single();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.put('/api/services/:id', auth, async (req, res) => {
  const { name, category, price, icon, color, included_services } = req.body;
  const { data, error } = await supabase.from('services').update({ name, category, price, icon, color, included_services }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.delete('/api/services/:id', auth, async (req, res) => {
  const { error } = await supabase.from('services').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  res.json({ success: true });
});

// ── Stylists ───────────────────────────────────────────────────────────────────
app.get('/api/stylists', async (_req, res) => {
  const { data, error } = await supabase.from('stylists').select('*').order('id');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post('/api/stylists', auth, async (req, res) => {
  const { name, phone, email, address, color } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const joined_date = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase.from('stylists').insert({ name, phone: phone || '', email: email || '', address: address || '', color: color || '#B08040', joined_date }).select().single();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.put('/api/stylists/:id', auth, async (req, res) => {
  const { name, phone, email, address, color } = req.body;
  const { data, error } = await supabase.from('stylists').update({ name, phone, email, address, color }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.delete('/api/stylists/:id', auth, async (req, res) => {
  const { error } = await supabase.from('stylists').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  res.json({ success: true });
});

// ── Transactions ───────────────────────────────────────────────────────────────
app.get('/api/transactions', auth, async (req, res) => {
  const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(1000);
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
  res.json(data);
});

// ── Users ──────────────────────────────────────────────────────────────────────
app.get('/api/users', auth, async (req, res) => {
  const { data, error } = await supabase.from('users').select('id, username, email, role, created_at').order('id');
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.post('/api/users', auth, async (req, res) => {
  const { username, password, role, email } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase.from('users').insert({ username: username.toLowerCase(), password_hash, role: role || 'receptionist', email: email || '' }).select('id, username, email, role, created_at').single();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

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
  }
  res.json({ success: true });
});

app.put('/api/users/:id', auth, async (req, res) => {
  const { role, password } = req.body;
  const updates = {};
  if (role) updates.role = role;
  if (password) updates.password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase.from('users').update(updates).eq('id', req.params.id).select('id, username, email, role').single();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

app.delete('/api/users/:id', auth, async (req, res) => {
  if (String(req.user.id) === String(req.params.id)) return res.status(400).json({ message: 'Cannot delete yourself' });
  const { error } = await supabase.from('users').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ message: error.message });
  res.json({ success: true });
});

// ── Settings ───────────────────────────────────────────────────────────────────
app.get('/api/settings/smtp', auth, async (req, res) => {
  const { data } = await supabase.from('settings').select('value').eq('key', 'smtp').single();
  res.json(data?.value || {});
});

app.post('/api/settings/smtp', auth, async (req, res) => {
  await supabase.from('settings').upsert({ key: 'smtp', value: req.body });
  res.json({ success: true });
});

export default app;
