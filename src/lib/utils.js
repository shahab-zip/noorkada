// ─── Utility Functions ────────────────────────────────────────────────────────

export const fmt = (n, compact = false) => {
  const v = Number(n) || 0;
  if (compact && v >= 1000) return `PKR ${(v / 1000).toFixed(1)}k`;
  return `PKR ${v.toLocaleString("en-PK")}`;
};

export const fmtPKR = fmt;

export const esc = (str) =>
  String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const todayStr = () => new Date().toISOString().split("T")[0];

export const genSlip = () => `NK${Date.now().toString().slice(-6)}`;

export const normalizeTxn = (t) => {
  const createdAt = t.created_at ? new Date(t.created_at) : null;
  return {
    ...t,
    customerName: t.cust_name || t.customerName || "Walk-in",
    customerPhone: t.cust_phone || t.customerPhone || "",
    stylist: t.staff_name || t.stylist || "",
    payMode: t.pay_mode || t.payMode || "CASH",
    discMode: t.disc_mode || t.discMode || "none",
    discPct: t.disc_pct ?? t.discPct ?? 0,
    discFlat: t.disc_flat ?? t.discFlat ?? 0,
    discountAmt:
      t.discountAmt ??
      (t.disc_flat > 0
        ? t.disc_flat
        : t.disc_pct > 0
        ? Math.round((t.total / (1 - t.disc_pct / 100)) * (t.disc_pct / 100))
        : 0),
    discReason: t.disc_reason || t.discReason || "",
    discCourtesyBy: t.disc_courtesy_by || t.discCourtesyBy || "",
    splitCash: t.split_cash ?? t.splitCash ?? 0,
    splitOtherMode: t.split_other_mode || t.splitOtherMode || "ONLINE",
    splitOtherAmt: t.split_other_amt ?? t.splitOtherAmt ?? 0,
    slip: t.slip || `NK${String(t.id || "").slice(-6)}`,
    date:
      t.date ||
      (createdAt ? createdAt.toISOString().split("T")[0] : todayStr()),
    time:
      t.time ||
      (createdAt
        ? createdAt.toLocaleTimeString("en-PK", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""),
  };
};
