import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';

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
const CACHE_TTL = 60000; // 60 seconds

const cacheGet = (key) => {
  const entry = CACHE.get(key);
  if (!entry) return null;
  return entry; // { data, ts, stale }
};

const cacheSet = (key, data) => {
  CACHE.set(key, { data, ts: Date.now() });
};

const isCacheStale = (entry) => !entry || (Date.now() - entry.ts) > CACHE_TTL;

// ─────────────────────────────────────────────────────────────────────────────
// API fetch with 10-second timeout
// ─────────────────────────────────────────────────────────────────────────────
const fetchWithTimeout = async (url, options = {}, timeoutMs = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') throw new Error('Request timed out. Please check your connection.');
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Virtual List — renders only visible rows (no external library)
// ─────────────────────────────────────────────────────────────────────────────
const ROW_HEIGHT = 58;
const CONTAINER_HEIGHT = 380;
const BUFFER = 4;

function VirtualList({ items, renderRow, emptyMessage = 'No data', containerHeight = CONTAINER_HEIGHT, rowHeight = ROW_HEIGHT }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleCount = Math.ceil(containerHeight / rowHeight);
  const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER);
  const endIdx   = Math.min(items.length - 1, startIdx + visibleCount + BUFFER * 2);
  const totalHeight = items.length * rowHeight;
  const offsetTop = startIdx * rowHeight;

  const onScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  if (!items.length) {
    return (
      <div style={{ textAlign: 'center', padding: '36px 20px', fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22 }}>✂️</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#2A2118', marginBottom: 4 }}>No services recorded</div>
        <div style={{ fontSize: 12, color: '#9A9088', lineHeight: 1.5 }}>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{ height: containerHeight, overflowY: 'auto', position: 'relative', WebkitOverflowScrolling: 'touch' }}
    >
      {/* Total height spacer */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Rendered slice */}
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
const pulse = {
  animation: 'sk-pulse 1.4s ease-in-out infinite',
  background: 'linear-gradient(90deg, #f0ebe3 25%, #e8e0d4 50%, #f0ebe3 75%)',
  backgroundSize: '200% 100%',
  borderRadius: 8,
};

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid #EDE6D8', flex: 1, minWidth: 0 }}>
      <div style={{ ...pulse, height: 10, width: '60%', marginBottom: 10 }} />
      <div style={{ ...pulse, height: 24, width: '80%', marginBottom: 6 }} />
      <div style={{ ...pulse, height: 10, width: '40%' }} />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid #f5f0e8', alignItems: 'center' }}>
      <div style={{ ...pulse, height: 10, flex: 2, borderRadius: 6 }} />
      <div style={{ ...pulse, height: 10, flex: 1, borderRadius: 6 }} />
      <div style={{ ...pulse, height: 10, flex: 1, borderRadius: 6 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Week Bar Chart (SVG, no library)
// ─────────────────────────────────────────────────────────────────────────────
function WeekBarChart({ dailyBreakdown }) {
  if (!dailyBreakdown?.length) return null;
  const maxRev = Math.max(...dailyBreakdown.map(d => d.revenue), 1);
  const W = 320, H = 120, barW = 32, gap = 4;
  const total = dailyBreakdown.length;
  const slotW = W / total;

  const fmt = (v) => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toString();
  const dayLabel = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00Z');
    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getUTCDay()];
  };

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
      <svg viewBox={`0 0 ${W} ${H + 32}`} width="100%" style={{ display: 'block', maxWidth: W, margin: '0 auto', fontFamily: "'Outfit', sans-serif" }}>
        {dailyBreakdown.map((d, i) => {
          const barH = Math.max(4, (d.revenue / maxRev) * (H - 20));
          const x = i * slotW + (slotW - barW) / 2;
          const y = H - barH;
          const isToday = d.date === new Date().toISOString().slice(0, 10);
          return (
            <g key={d.date}>
              <rect x={x} y={y} width={barW} height={barH} rx={6}
                fill={isToday ? '#2A2118' : '#C4A882'} />
              {d.revenue > 0 && (
                <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={9} fill="#6B5030">
                  {fmt(d.revenue)}
                </text>
              )}
              <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize={10} fill={isToday ? '#2A2118' : '#9A9088'} fontWeight={isToday ? '700' : '400'}>
                {dayLabel(d.date)}
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
function SummaryCard({ icon, label, value, sub, color = '#2A2118' }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', border: '1px solid #EDE6D8', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 20, marginBottom: 2 }}>{icon}</div>
      <div style={{ fontSize: 11, color: '#9A9088', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: -.5 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: '#B5A898' }}>{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Access Denied screen (for non-staff reaching this component)
// ─────────────────────────────────────────────────────────────────────────────
function AccessDenied({ onLogout }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, textAlign: 'center', fontFamily: "'Outfit', sans-serif", background: '#FAF7F3' }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>🚫</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#2A2118', marginBottom: 8 }}>Access Denied</div>
      <div style={{ fontSize: 14, color: '#9A9088', marginBottom: 24, maxWidth: 300 }}>
        You do not have permission to access this page.
      </div>
      <button onClick={onLogout} style={{ background: '#2A2118', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
        ← Back to Login
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main StaffDashboard
// ─────────────────────────────────────────────────────────────────────────────
function StaffDashboardInner({ user, token, onLogout }) {
  // Enforce staff-only at the component level
  if (user?.role !== 'staff') return <AccessDenied onLogout={onLogout} />;

  const todayStr = new Date().toISOString().slice(0, 10);
  const [range, setRange]       = useState('today'); // today | week | month | custom
  const [customDate, setCustomDate] = useState(todayStr);
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [svcsPage, setSvcsPage] = useState(1);
  const [svcs, setSvcs]         = useState({ data: [], pagination: { total: 0, pages: 1 } });
  const [svcsLoading, setSvcsLoading] = useState(false);
  const [svcsError, setSvcsError]   = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // 8-hour session timeout
  useEffect(() => {
    const check = setInterval(() => {
      if (Date.now() - lastActivity > 8 * 60 * 60 * 1000) {
        onLogout();
      }
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

  // Build API URL from range/date selection
  const summaryUrl = useCallback(() => {
    if (range === 'week')  return '/api/staff/me/summary?range=week';
    if (range === 'month') return '/api/staff/me/summary?range=month';
    if (range === 'custom') return `/api/staff/me/summary?date=${customDate}`;
    return `/api/staff/me/summary?date=${todayStr}`; // today
  }, [range, customDate, todayStr]);

  const svcsDate = range === 'custom' ? customDate : todayStr;

  // Fetch summary (with stale-while-revalidate cache)
  const fetchSummary = useCallback(async (url, isBackground = false) => {
    const cached = cacheGet(url);
    if (cached) {
      setSummary(cached.data);
      if (!isCacheStale(cached)) { setLoading(false); return; }
      if (!isBackground) setLoading(false); // show stale data while revalidating
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await fetchWithTimeout(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || 'Failed to load summary');
      }
      const data = await res.json();
      cacheSet(url, data);
      setSummary(data);
    } catch (err) {
      if (!cached) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch services list (no cache — always fresh)
  const fetchSvcs = useCallback(async (date, page) => {
    setSvcsLoading(true);
    setSvcsError(null);
    try {
      const res = await fetchWithTimeout(
        `/api/staff/me/services?date=${date}&page=${page}&limit=50`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'Failed'); }
      const data = await res.json();
      setSvcs(data);
    } catch (err) {
      setSvcsError(err.message);
    } finally {
      setSvcsLoading(false);
    }
  }, [token]);

  // Load on mount and when selection changes — show skeleton immediately (optimistic)
  useEffect(() => {
    setSummary(null);
    setLoading(true);
    const url = summaryUrl();
    fetchSummary(url);
  }, [summaryUrl, fetchSummary]);

  useEffect(() => {
    if (range !== 'week' && range !== 'month') {
      setSvcsPage(1);
      fetchSvcs(svcsDate, 1);
    }
  }, [range, svcsDate, fetchSvcs]);

  useEffect(() => {
    if (range !== 'week' && range !== 'month') {
      fetchSvcs(svcsDate, svcsPage);
    }
  }, [svcsPage]);

  const fmt = (v) => 'PKR ' + (Number(v) || 0).toLocaleString('en-PK');

  const dateDisplay = () => {
    if (range === 'week')  return 'This Week (last 7 days)';
    if (range === 'month') return 'This Month';
    if (range === 'custom') return new Date(customDate + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    return new Date(todayStr + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F3', fontFamily: "'Outfit', sans-serif" }}>
      {/* Inject keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        @keyframes sk-pulse { 0%,100%{background-position:200% 0} 50%{background-position:-200% 0} }
        * { box-sizing: border-box; }
        input[type=date]::-webkit-calendar-picker-indicator { opacity: 0.6; cursor: pointer; }
      `}</style>

      {/* Header */}
      <div style={{ background: '#2A2118', padding: '16px 20px 14px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 640, margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: 12, color: '#C4A882', fontWeight: 600, letterSpacing: .5 }}>NOOR KADA</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginTop: 2 }}>
              Hi, {user.full_name || user.username} 👋
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 14px', color: '#FAF7F3', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}
          >Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 80px' }}>

        {/* Date selector */}
        <div style={{ padding: '16px 0 8px' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {[['today','Today'],['week','Week'],['month','Month'],['custom','Pick Date']].map(([v, l]) => (
              <button key={v} onClick={() => setRange(v)} style={{
                flex: v === 'custom' ? 'none' : 1,
                padding: '8px 10px', borderRadius: 10, fontFamily: "'Outfit', sans-serif",
                fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                background: range === v ? '#2A2118' : '#fff',
                color: range === v ? '#fff' : '#6B5030',
                border: range === v ? '1.5px solid #2A2118' : '1.5px solid #E8DECE',
              }}>{l}</button>
            ))}
          </div>
          {range === 'custom' && (
            <input
              type="date"
              value={customDate}
              max={todayStr}
              onChange={e => setCustomDate(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #E8DECE', fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#2A2118', background: '#fff', outline: 'none' }}
            />
          )}
          <div style={{ fontSize: 12, color: '#9A9088', marginTop: 4 }}>{dateDisplay()}</div>
        </div>

        {/* Error state */}
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

        {/* Summary cards */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : (
            <>
              <SummaryCard icon="✂️" label="Services" value={summary?.total_services ?? 0} sub="performed" />
              <SummaryCard icon="👤" label="Clients" value={summary?.total_clients_served ?? 0} sub="served" />
              <SummaryCard icon="💰" label="Revenue" value={
                summary?.total_revenue_generated >= 1000
                  ? 'PKR ' + (summary.total_revenue_generated / 1000).toFixed(1) + 'k'
                  : 'PKR ' + (summary?.total_revenue_generated ?? 0)
              } sub="generated" color="#065F46" />
            </>
          )}
        </div>

        {/* Empty state */}
        {!loading && !error && summary && summary.total_services === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 20px', background: '#fff', borderRadius: 16, border: '1px solid #EDE6D8', marginBottom: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#2A2118', marginBottom: 6 }}>No services logged</div>
            <div style={{ fontSize: 13, color: '#9A9088' }}>No services were recorded for this period. Check back after completing some services.</div>
          </div>
        )}

        {/* Week bar chart */}
        {(range === 'week' || range === 'month') && !loading && summary?.daily_breakdown?.length > 0 && summary.total_services > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EDE6D8', padding: '16px 16px 12px', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6B5030', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>
              Daily Revenue
            </div>
            <WeekBarChart dailyBreakdown={summary.daily_breakdown} />
          </div>
        )}

        {/* Services breakdown */}
        {!loading && !error && summary?.services_breakdown?.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EDE6D8', marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #f5f0e8' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2A2118' }}>Services Breakdown</div>
            </div>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, padding: '8px 16px', background: '#faf7f2', borderBottom: '1px solid #f0ebe3' }}>
              <div style={{ fontSize: 10, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase' }}>Service</div>
              <div style={{ fontSize: 10, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', minWidth: 40 }}>Count</div>
              <div style={{ fontSize: 10, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right', minWidth: 80 }}>Revenue</div>
            </div>
            <VirtualList
              items={summary.services_breakdown}
              containerHeight={Math.min(300, summary.services_breakdown.length * 52 + 10)}
              rowHeight={52}
              renderRow={(item, idx) => (
                <div key={idx} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8,
                  padding: '12px 16px', borderBottom: '1px solid #f9f5f0',
                  background: idx % 2 === 0 ? '#fff' : '#fdfaf7', alignItems: 'center',
                  height: 52,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#2A2118', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.service_name}</div>
                  <div style={{ fontSize: 12, color: '#9A9088', textAlign: 'center', minWidth: 40 }}>×{item.count}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46', textAlign: 'right', minWidth: 80 }}>PKR {item.revenue.toLocaleString('en-PK')}</div>
                </div>
              )}
            />
            {/* Total row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, padding: '12px 16px', borderTop: '2px solid #EDE6D8', background: '#faf7f2' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#2A2118' }}>Total</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#2A2118', textAlign: 'center', minWidth: 40 }}>×{summary.total_services}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#065F46', textAlign: 'right', minWidth: 80 }}>{fmt(summary.total_revenue_generated)}</div>
            </div>
          </div>
        )}

        {/* Per-transaction services list (today / custom date only) */}
        {(range === 'today' || range === 'custom') && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EDE6D8', overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2A2118' }}>Today's Service Log</div>
              {svcs.pagination?.total > 0 && (
                <div style={{ fontSize: 11, color: '#9A9088' }}>{svcs.pagination.total} entries</div>
              )}
            </div>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px', gap: 8, padding: '8px 16px', background: '#faf7f2', borderBottom: '1px solid #f0ebe3' }}>
              <div style={{ fontSize: 10, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase' }}>Service · Customer</div>
              <div style={{ fontSize: 10, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>Qty</div>
              <div style={{ fontSize: 10, color: '#9A9088', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>Revenue</div>
            </div>
            {svcsLoading ? (
              <>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</>
            ) : svcsError ? (
              <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#A0303F', marginBottom: 10 }}>{svcsError}</div>
                <button onClick={() => fetchSvcs(svcsDate, svcsPage)} style={{ background: '#2A2118', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>↺ Retry</button>
              </div>
            ) : (
              <VirtualList
                items={svcs.data || []}
                containerHeight={Math.min(400, Math.max(60, (svcs.data?.length || 1) * ROW_HEIGHT + 10))}
                rowHeight={ROW_HEIGHT}
                emptyMessage="No services logged for this date."
                renderRow={(item, idx) => (
                  <div key={idx} style={{
                    display: 'grid', gridTemplateColumns: '1fr 60px 80px', gap: 8,
                    padding: '10px 16px', borderBottom: '1px solid #f9f5f0',
                    background: idx % 2 === 0 ? '#fff' : '#fdfaf7', alignItems: 'center',
                    height: ROW_HEIGHT,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2A2118', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.service}</div>
                      <div style={{ fontSize: 11, color: '#9A9088', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.customer} · {item.time ? new Date(item.time).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#9A9088', textAlign: 'center' }}>×{item.qty}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46', textAlign: 'right' }}>PKR {item.revenue.toLocaleString('en-PK')}</div>
                  </div>
                )}
              />
            )}
            {/* Pagination */}
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

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: 11, color: '#C4B9AB', paddingTop: 8 }}>Noorkada Staff Portal · Read-only</div>
      </div>
    </div>
  );
}

// Wrap in ErrorBoundary
export default function StaffDashboard(props) {
  return (
    <ErrorBoundary>
      <StaffDashboardInner {...props} />
    </ErrorBoundary>
  );
}
