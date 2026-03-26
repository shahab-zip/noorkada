import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Error Boundary
// ─────────────────────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', padding: 24, textAlign: 'center', fontFamily: "'Outfit', sans-serif" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#2A2118', marginBottom: 8 }}>Something went wrong</div>
          <div style={{ fontSize: 13, color: '#9A9088', marginBottom: 20 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </div>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
            style={{ background: '#2A2118', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >↺ Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Simple in-memory cache with stale-while-revalidate (60s TTL)
// ─────────────────────────────────────────────────────────────────────────────
const CACHE = new Map();
const CACHE_TTL = 60000;
const cacheGet  = (key) => CACHE.get(key) || null;
const cacheSet  = (key, data) => CACHE.set(key, { data, ts: Date.now() });
const isCacheStale = (entry) => !entry || (Date.now() - entry.ts) > CACHE_TTL;

// ─────────────────────────────────────────────────────────────────────────────
// API fetch with 10-second timeout
// ─────────────────────────────────────────────────────────────────────────────
const fetchWithTimeout = async (url, options = {}, ms = 10000) => {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') throw new Error('Request timed out. Check your connection.');
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const todayISO = () => new Date().toISOString().slice(0, 10);

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const fmtDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-PK', opts) : '';

const fmtMoney = (v) => {
  const n = Number(v) || 0;
  return n >= 1000 ? 'PKR ' + (n / 1000).toFixed(1) + 'k' : 'PKR ' + n.toLocaleString('en-PK');
};

// ─────────────────────────────────────────────────────────────────────────────
// Virtual List — renders only visible rows
// ─────────────────────────────────────────────────────────────────────────────
const ROW_H  = 58;
const CONT_H = 380;
const BUFSZ  = 4;

function VirtualList({ items, renderRow, emptyMessage = 'No services logged for this period.', containerHeight = CONT_H, rowHeight = ROW_H }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleCount = Math.ceil(containerHeight / rowHeight);
  const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFSZ);
  const endIdx   = Math.min(items.length - 1, startIdx + visibleCount + BUFSZ * 2);
  const totalH   = items.length * rowHeight;
  const offsetTop = startIdx * rowHeight;

  const onScroll = useCallback((e) => setScrollTop(e.currentTarget.scrollTop), []);

  if (!items.length) {
    return (
      <div style={{ textAlign: 'center', padding: '36px 20px', fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#F5EFE6,#EDE6D8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 24 }}>✂️</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#2A2118', marginBottom: 6 }}>No services recorded</div>
        <div style={{ fontSize: 12, color: '#9A9088', lineHeight: 1.6, maxWidth: 220, margin: '0 auto' }}>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} onScroll={onScroll}
      style={{ height: containerHeight, overflowY: 'auto', position: 'relative', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ height: totalH, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetTop, left: 0, right: 0 }}>
          {items.slice(startIdx, endIdx + 1).map((item, i) => renderRow(item, startIdx + i))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton loaders
// ─────────────────────────────────────────────────────────────────────────────
const PULSE_STYLE = {
  animation: 'sk-pulse 1.4s ease-in-out infinite',
  background: 'linear-gradient(90deg, #f0ebe3 25%, #e8e0d4 50%, #f0ebe3 75%)',
  backgroundSize: '200% 100%',
  borderRadius: 8,
};

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid #EDE6D8', flex: 1, minWidth: 0 }}>
      <div style={{ ...PULSE_STYLE, height: 10, width: '60%', marginBottom: 10 }} />
      <div style={{ ...PULSE_STYLE, height: 24, width: '80%', marginBottom: 6 }} />
      <div style={{ ...PULSE_STYLE, height: 10, width: '40%' }} />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid #f5f0e8', alignItems: 'center' }}>
      <div style={{ ...PULSE_STYLE, height: 10, flex: 2, borderRadius: 6 }} />
      <div style={{ ...PULSE_STYLE, height: 10, flex: 1, borderRadius: 6 }} />
      <div style={{ ...PULSE_STYLE, height: 10, flex: 1, borderRadius: 6 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Week/Range Bar Chart (SVG, no library)
// ─────────────────────────────────────────────────────────────────────────────
function BarChart({ dailyBreakdown }) {
  if (!dailyBreakdown?.length) return null;
  const maxRev = Math.max(...dailyBreakdown.map(d => d.revenue), 1);
  const todayStr = todayISO();
  const W = 340, H = 110;
  const n = dailyBreakdown.length;
  // Cap at 31 bars visually
  const items = n > 31 ? dailyBreakdown.slice(-31) : dailyBreakdown;
  const total = items.length;
  const barW = Math.max(6, Math.min(28, Math.floor((W - 8) / total) - 4));
  const slotW = (W - 8) / total;

  const fmt = (v) => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toString();
  const label = (dateStr, idx) => {
    if (total <= 14) {
      const d = new Date(dateStr + 'T00:00:00Z');
      return ['S','M','T','W','T','F','S'][d.getUTCDay()];
    }
    // For ranges >14 show date numbers only at intervals
    if (idx === 0 || idx === total - 1 || idx % Math.ceil(total / 6) === 0) {
      return new Date(dateStr + 'T00:00:00Z').getUTCDate().toString();
    }
    return '';
  };

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
      <svg viewBox={`0 0 ${W} ${H + 28}`} width="100%" style={{ display: 'block', maxWidth: W, margin: '0 auto', fontFamily: "'Outfit', sans-serif" }}>
        {items.map((d, i) => {
          const barH = Math.max(4, (d.revenue / maxRev) * (H - 18));
          const x = 4 + i * slotW + (slotW - barW) / 2;
          const y = H - barH;
          const isToday = d.date === todayStr;
          return (
            <g key={d.date}>
              <rect x={x} y={y} width={barW} height={barH} rx={Math.min(5, barW / 2)}
                fill={isToday ? '#2A2118' : '#C4A882'} opacity={d.revenue === 0 ? 0.25 : 1} />
              {d.revenue > 0 && barW >= 14 && (
                <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={8} fill="#6B5030">{fmt(d.revenue)}</text>
              )}
              <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize={9}
                fill={isToday ? '#2A2118' : '#9A9088'} fontWeight={isToday ? '700' : '400'}>
                {label(d.date, i)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary Card
// ─────────────────────────────────────────────────────────────────────────────
function SummaryCard({ icon, label, value, sub, bg = '#fff', accent = '#2A2118' }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: '16px 14px', border: '1px solid #EDE6D8', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
      <div style={{ fontSize: 10, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent, letterSpacing: -.5, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: '#B5A898' }}>{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Access Denied
// ─────────────────────────────────────────────────────────────────────────────
function AccessDenied({ onLogout }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, textAlign: 'center', fontFamily: "'Outfit', sans-serif", background: '#FAF7F3' }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>🚫</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#2A2118', marginBottom: 8 }}>Access Denied</div>
      <div style={{ fontSize: 14, color: '#9A9088', marginBottom: 24, maxWidth: 300 }}>You don't have permission to access this page.</div>
      <button onClick={onLogout} style={{ background: '#2A2118', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>← Back to Login</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Date Range Picker component
// ─────────────────────────────────────────────────────────────────────────────
function DateRangePicker({ from, to, maxDate, onChange }) {
  const presets = [
    { label: 'Last 7 days',  fn: () => [daysAgo(6), maxDate] },
    { label: 'Last 14 days', fn: () => [daysAgo(13), maxDate] },
    { label: 'Last 30 days', fn: () => [daysAgo(29), maxDate] },
    { label: 'This month',   fn: () => [maxDate.slice(0, 7) + '-01', maxDate] },
  ];

  // Check if a preset is currently active
  const isPresetActive = (fn) => {
    const [pf, pt] = fn();
    return from === pf && to === pt;
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      border: '1.5px solid #E8DECE',
      padding: '14px 16px',
      marginTop: 8,
      boxShadow: '0 4px 20px rgba(42,33,24,0.07)',
    }}>
      {/* Two date inputs */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
        {/* From */}
        <div style={{ flex: 1, background: '#FAF7F3', borderRadius: 10, padding: '10px 12px', border: '1.5px solid #EDE6D8' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#C4A882', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>From</div>
          <input
            type="date"
            value={from}
            max={to || maxDate}
            onChange={e => onChange(e.target.value, to)}
            style={{ width: '100%', border: 'none', outline: 'none', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: '#2A2118', background: 'transparent', cursor: 'pointer' }}
          />
        </div>

        {/* Arrow divider */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F5EFE6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#C4A882' }}>→</div>
        </div>

        {/* To */}
        <div style={{ flex: 1, background: '#FAF7F3', borderRadius: 10, padding: '10px 12px', border: '1.5px solid #EDE6D8' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#C4A882', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>To</div>
          <input
            type="date"
            value={to}
            min={from}
            max={maxDate}
            onChange={e => onChange(from, e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: '#2A2118', background: 'transparent', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Quick presets */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#9A9088', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 7 }}>Quick select</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {presets.map(({ label, fn }) => {
            const active = isPresetActive(fn);
            return (
              <button
                key={label}
                onClick={() => { const [f, t] = fn(); onChange(f, t); }}
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  border: active ? '1.5px solid #2A2118' : '1.5px solid #EDE6D8',
                  background: active ? '#2A2118' : '#FAF7F3',
                  color: active ? '#fff' : '#6B5030',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.15s',
                }}
              >{label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main StaffDashboard
// ─────────────────────────────────────────────────────────────────────────────
function StaffDashboardInner({ user, token, onLogout }) {
  if (user?.role !== 'staff') return <AccessDenied onLogout={onLogout} />;

  const TODAY = todayISO();

  const [range, setRange]         = useState('today');
  const [customFrom, setCustomFrom] = useState(daysAgo(6));
  const [customTo, setCustomTo]     = useState(TODAY);

  const [summary, setSummary]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const [svcsPage, setSvcsPage]   = useState(1);
  const [svcs, setSvcs]           = useState({ data: [], pagination: { total: 0, pages: 1 } });
  const [svcsLoading, setSvcsLoading] = useState(false);
  const [svcsError, setSvcsError]   = useState(null);

  const [lastActivity, setLastActivity] = useState(Date.now());

  // 8-hour inactivity logout
  useEffect(() => {
    const check = setInterval(() => {
      if (Date.now() - lastActivity > 8 * 60 * 60 * 1000) onLogout();
    }, 60000);
    const bump = () => setLastActivity(Date.now());
    window.addEventListener('click', bump);
    window.addEventListener('keydown', bump);
    window.addEventListener('touchstart', bump);
    return () => {
      clearInterval(check);
      window.removeEventListener('click', bump);
      window.removeEventListener('keydown', bump);
      window.removeEventListener('touchstart', bump);
    };
  }, [lastActivity, onLogout]);

  // Build summary URL
  const summaryUrl = useCallback(() => {
    if (range === 'week')   return '/api/staff/me/summary?range=week';
    if (range === 'month')  return '/api/staff/me/summary?range=month';
    if (range === 'custom') return `/api/staff/me/summary?from=${customFrom}&to=${customTo}`;
    return `/api/staff/me/summary?date=${TODAY}`;
  }, [range, customFrom, customTo, TODAY]);

  // Fetch summary with SWR cache
  const fetchSummary = useCallback(async (url, isBackground = false) => {
    const cached = cacheGet(url);
    if (cached) {
      setSummary(cached.data);
      if (!isCacheStale(cached)) { setLoading(false); return; }
      if (!isBackground) setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetchWithTimeout(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'Failed to load summary'); }
      const data = await res.json();
      cacheSet(url, data);
      setSummary(data);
    } catch (err) {
      if (!cached) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch services list
  const fetchSvcs = useCallback(async (page, from, to, date) => {
    setSvcsLoading(true);
    setSvcsError(null);
    try {
      const qs = (from && to)
        ? `from=${from}&to=${to}&page=${page}&limit=50`
        : `date=${date || TODAY}&page=${page}&limit=50`;
      const res = await fetchWithTimeout(
        `/api/staff/me/services?${qs}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'Failed'); }
      setSvcs(await res.json());
    } catch (err) {
      setSvcsError(err.message);
    } finally {
      setSvcsLoading(false);
    }
  }, [token, TODAY]);

  // Re-fetch when range / custom dates change
  useEffect(() => {
    setSummary(null);
    setLoading(true);
    fetchSummary(summaryUrl());
  }, [summaryUrl, fetchSummary]);

  const needsSvcsList = (range === 'today' || range === 'custom');

  useEffect(() => {
    if (!needsSvcsList) return;
    setSvcsPage(1);
    if (range === 'custom') fetchSvcs(1, customFrom, customTo, null);
    else fetchSvcs(1, null, null, TODAY);
  }, [range, customFrom, customTo]);

  useEffect(() => {
    if (!needsSvcsList) return;
    if (range === 'custom') fetchSvcs(svcsPage, customFrom, customTo, null);
    else fetchSvcs(svcsPage, null, null, TODAY);
  }, [svcsPage]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const dateDisplay = () => {
    if (range === 'week')   return 'Last 7 days';
    if (range === 'month')  return 'This month so far';
    if (range === 'custom') {
      if (customFrom === customTo) return fmtDate(customFrom, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      return `${fmtDate(customFrom, { day: 'numeric', month: 'short' })} – ${fmtDate(customTo, { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    return fmtDate(TODAY, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const svcLogTitle = () => {
    if (range === 'custom') {
      if (customFrom === customTo) return `Service Log · ${fmtDate(customFrom, { day: 'numeric', month: 'short' })}`;
      return `Service Log · ${fmtDate(customFrom, { day: 'numeric', month: 'short' })} – ${fmtDate(customTo, { day: 'numeric', month: 'short' })}`;
    }
    return "Today's Service Log";
  };

  const showChart = !loading && summary?.daily_breakdown?.length > 1 && summary.total_services > 0;

  // initials for avatar
  const initials = (user.full_name || user.username || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F3', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        @keyframes sk-pulse { 0%,100%{background-position:200% 0} 50%{background-position:-200% 0} }
        * { box-sizing: border-box; }
        input[type=date]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
        input[type=date] { -webkit-appearance: none; }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #2A2118 0%, #3D3020 100%)', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Avatar */}
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#C4A882,#8B6940)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{initials}</span>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#C4A882', fontWeight: 600, letterSpacing: .8 }}>NOOR KADA · STAFF</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginTop: 1 }}>
                {user.full_name || user.username}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, padding: '6px 14px', color: '#FAF7F3', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif', letterSpacing: .3" }}
          >Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px' }}>

        {/* ── Range Selector ───────────────────────────────────────────────── */}
        <div style={{ padding: '16px 0 4px' }}>
          {/* Connected pill tabs */}
          <div style={{ display: 'flex', background: '#fff', borderRadius: 12, border: '1.5px solid #E8DECE', overflow: 'hidden', marginBottom: 10 }}>
            {[
              ['today',  'Today'],
              ['week',   'This Week'],
              ['month',  'This Month'],
              ['custom', '⊞ Range'],
            ].map(([v, l], idx, arr) => (
              <button
                key={v}
                onClick={() => setRange(v)}
                style={{
                  flex: 1, padding: '9px 4px',
                  fontFamily: "'Outfit', sans-serif", fontSize: 11.5, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: range === v ? '#2A2118' : 'transparent',
                  color: range === v ? '#fff' : '#6B5030',
                  border: 'none',
                  borderRight: idx < arr.length - 1 ? '1.5px solid #E8DECE' : 'none',
                  letterSpacing: .2,
                }}
              >{l}</button>
            ))}
          </div>

          {/* Custom date range picker */}
          {range === 'custom' && (
            <DateRangePicker
              from={customFrom}
              to={customTo}
              maxDate={TODAY}
              onChange={(f, t) => { setCustomFrom(f); setCustomTo(t); }}
            />
          )}

          {/* Date label */}
          <div style={{ fontSize: 12, color: '#9A9088', marginTop: range === 'custom' ? 10 : 4, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 11 }}>📅</span>
            <span>{dateDisplay()}</span>
          </div>
        </div>

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {error && (
          <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#991B1B' }}>Could not load data</div>
              <div style={{ fontSize: 11, color: '#B91C1C', marginTop: 2 }}>{error}</div>
            </div>
            <button onClick={() => { setError(null); fetchSummary(summaryUrl()); }}
              style={{ background: '#2A2118', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              ↺ Retry
            </button>
          </div>
        )}

        {/* ── Summary Cards ────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : (
            <>
              <SummaryCard
                icon="✂️" label="Services"
                value={summary?.total_services ?? 0}
                sub="performed"
                bg="#F5F0FF" accent="#5B21B6"
              />
              <SummaryCard
                icon="👥" label="Clients"
                value={summary?.total_clients_served ?? 0}
                sub="served"
                bg="#EFF6FF" accent="#1D4ED8"
              />
              <SummaryCard
                icon="💰" label="Revenue"
                value={fmtMoney(summary?.total_revenue_generated)}
                sub="generated"
                bg="#ECFDF5" accent="#065F46"
              />
            </>
          )}
        </div>

        {/* ── Empty state ──────────────────────────────────────────────────── */}
        {!loading && !error && summary && summary.total_services === 0 && (
          <div style={{ textAlign: 'center', padding: '36px 20px', background: '#fff', borderRadius: 16, border: '1px solid #EDE6D8', marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#F5EFE6,#EDE6D8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 26 }}>✂️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#2A2118', marginBottom: 6 }}>No services logged</div>
            <div style={{ fontSize: 13, color: '#9A9088', lineHeight: 1.6, maxWidth: 240, margin: '0 auto' }}>No services were recorded for this period.</div>
          </div>
        )}

        {/* ── Bar Chart ────────────────────────────────────────────────────── */}
        {showChart && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EDE6D8', padding: '16px 16px 12px', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6B5030', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>
              Daily Revenue
            </div>
            <BarChart dailyBreakdown={summary.daily_breakdown} />
          </div>
        )}

        {/* ── Services Breakdown ───────────────────────────────────────────── */}
        {!loading && !error && summary?.services_breakdown?.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EDE6D8', marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ padding: '13px 16px 9px', borderBottom: '1px solid #f5f0e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2A2118' }}>Services Breakdown</div>
              <div style={{ fontSize: 11, color: '#9A9088' }}>{summary.services_breakdown.length} types</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, padding: '7px 16px', background: '#faf7f2', borderBottom: '1px solid #f0ebe3' }}>
              <div style={{ fontSize: 9, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase' }}>Service</div>
              <div style={{ fontSize: 9, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', minWidth: 40 }}>Count</div>
              <div style={{ fontSize: 9, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right', minWidth: 80 }}>Revenue</div>
            </div>
            <VirtualList
              items={summary.services_breakdown}
              containerHeight={Math.min(280, summary.services_breakdown.length * 50 + 10)}
              rowHeight={50}
              renderRow={(item, idx) => (
                <div key={idx} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8,
                  padding: '11px 16px', borderBottom: '1px solid #f9f5f0',
                  background: idx % 2 === 0 ? '#fff' : '#fdfaf7', alignItems: 'center', height: 50,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#2A2118', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.service_name}</div>
                  <div style={{ fontSize: 12, color: '#9A9088', textAlign: 'center', minWidth: 40 }}>×{item.count}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46', textAlign: 'right', minWidth: 80 }}>PKR {item.revenue.toLocaleString('en-PK')}</div>
                </div>
              )}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, padding: '11px 16px', borderTop: '2px solid #EDE6D8', background: '#faf7f2' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#2A2118' }}>Total</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#2A2118', textAlign: 'center', minWidth: 40 }}>×{summary.total_services}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#065F46', textAlign: 'right', minWidth: 80 }}>{fmtMoney(summary.total_revenue_generated)}</div>
            </div>
          </div>
        )}

        {/* ── Per-transaction log (Today + Custom) ─────────────────────────── */}
        {needsSvcsList && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EDE6D8', overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '13px 16px 9px', borderBottom: '1px solid #f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2A2118' }}>{svcLogTitle()}</div>
              {svcs.pagination?.total > 0 && (
                <div style={{ fontSize: 11, color: '#9A9088' }}>{svcs.pagination.total} entries</div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 54px 82px', gap: 8, padding: '7px 16px', background: '#faf7f2', borderBottom: '1px solid #f0ebe3' }}>
              <div style={{ fontSize: 9, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase' }}>Service · Customer</div>
              <div style={{ fontSize: 9, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>Qty</div>
              <div style={{ fontSize: 9, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>Revenue</div>
            </div>
            {svcsLoading ? (
              <>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</>
            ) : svcsError ? (
              <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#A0303F', marginBottom: 10 }}>{svcsError}</div>
                <button
                  onClick={() => {
                    if (range === 'custom') fetchSvcs(svcsPage, customFrom, customTo, null);
                    else fetchSvcs(svcsPage, null, null, TODAY);
                  }}
                  style={{ background: '#2A2118', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>↺ Retry</button>
              </div>
            ) : (
              <VirtualList
                items={svcs.data || []}
                containerHeight={Math.min(400, Math.max(60, (svcs.data?.length || 1) * ROW_H + 10))}
                rowHeight={ROW_H}
                emptyMessage="No services logged for this period."
                renderRow={(item, idx) => (
                  <div key={idx} style={{
                    display: 'grid', gridTemplateColumns: '1fr 54px 82px', gap: 8,
                    padding: '10px 16px', borderBottom: '1px solid #f9f5f0',
                    background: idx % 2 === 0 ? '#fff' : '#fdfaf7', alignItems: 'center', height: ROW_H,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2A2118', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.service}</div>
                      <div style={{ fontSize: 11, color: '#9A9088', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.customer}
                        {item.time ? ' · ' + new Date(item.time).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : ''}
                        {item.time ? ' ' + new Date(item.time).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#9A9088', textAlign: 'center' }}>×{item.qty}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46', textAlign: 'right' }}>PKR {item.revenue.toLocaleString('en-PK')}</div>
                  </div>
                )}
              />
            )}
            {svcs.pagination?.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, padding: '12px 16px', borderTop: '1px solid #f0ebe3' }}>
                <button disabled={svcsPage <= 1} onClick={() => setSvcsPage(p => p - 1)}
                  style={{ background: svcsPage <= 1 ? '#f5f0e8' : '#2A2118', color: svcsPage <= 1 ? '#C4B9AB' : '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, cursor: svcsPage <= 1 ? 'default' : 'pointer' }}>
                  ← Prev
                </button>
                <span style={{ fontSize: 12, color: '#9A9088' }}>Page {svcsPage} of {svcs.pagination.pages}</span>
                <button disabled={svcsPage >= svcs.pagination.pages} onClick={() => setSvcsPage(p => p + 1)}
                  style={{ background: svcsPage >= svcs.pagination.pages ? '#f5f0e8' : '#2A2118', color: svcsPage >= svcs.pagination.pages ? '#C4B9AB' : '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, cursor: svcsPage >= svcs.pagination.pages ? 'default' : 'pointer' }}>
                  Next →
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: 11, color: '#C4B9AB', paddingTop: 4 }}>
          Noorkada Staff Portal · Read-only
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboard(props) {
  return (
    <ErrorBoundary>
      <StaffDashboardInner {...props} />
    </ErrorBoundary>
  );
}
