import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";

// Suppress console output in production
const isDev = import.meta.env.DEV;
const devLog = isDev ? console.error.bind(console) : () => {};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
// STYLISTS and STYLIST_COLORS are now fetched from the backend dynamically.

// SERVICES and PRICES are now fetched from the backend.


const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Noorkada brand logo — baked in, device-independent
const NOORKADA_LOGO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/7QCEUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAGgcAigAYkZCTUQwYTAwMGFkOTAxMDAwMDM0MDMwMDAwNDkwNTAwMDA1NTA1MDAwMDYxMDUwMDAwNTkwOTAwMDBmMDBkMDAwMDQ5MGUwMDAwNTUwZTAwMDA2MTBlMDAwMDQ5MTMwMDAwAP/bAIQABQYGCwgLCwsLCw0LCwsNDg4NDQ4ODw0ODg4NDxAQEBEREBAQEA8TEhMPEBETFBQTERMWFhYTFhUVFhkWGRYWEgEFBQUKBwoICQkICwgKCAsKCgkJCgoMCQoJCgkMDQsKCwsKCw0MCwsICwsMDAwNDQwMDQoLCg0MDQ0MExQTExOc/8IAEQgAlgCWAwEiAAIRAQMRAf/EAKQAAQEBAAMBAQAAAAAAAAAAAAAHBgEEBQIDEAACAgIABAUFAQAAAAAAAAADBAECAAUREhQwExUgJEAQISI0YDMRAAEBBAUJBAcHBQAAAAAAAAECAAMRIQQSMUFREyIyYXGBsdHwEDBCoSMzUpHB4fEUIEBDU2JygpKi0uISAQABAwMDAwQDAQAAAAAAAAERACExQVFhcYGRobHwEDDB4SBA0fH/2gAMAwEAAgADAAAAAbKAAAD4lGv6LjcpjTXPIAAEassaLKAAA/DAFGTrpONpOa1wfXZnFHcgAI1ZY0WUAAGA9zPUJx5vcnXpnh0D0MUfO98T23IACNWWNFlPk6mE8OvOMRombP2/TT5Q3Ph4OqOcLpuxMXHod/ZdE8DdeF4bncgRqyxossz/AA9Zxoe93pcc0P8AfBnZ03z2HOSxXZ8Nxtvcy1ZPiTezsT0Z17vWNjhtzJisxvTZlzXcpswnFHnpsMNqffcfch0v6nQ8qrif0Gc9Q7m9z/5GVq/WzxnddlaQI1ZY05soHz9DC9ehDG/L0nGb7+2zxovBwdLMn7Pg0AwHd2RyAjVljRZQAAT/AFOO2ziaUT2MGbnMeJ7h96ccgAI1ZY0WUAAH5yqsjCbvI5NxWecnrHIAACNWWNFlRoWVGhZUaFlRoWWf5oWVGhZUaFlRoWVGhZY0H//aAAgBAQABBQLsTPDAt9U38HYhKfHtbz0U281mJ4/CbRGzFSH1thEgle5e8Ujx2HM8qNkPHTsItSwUVS108yOe4/7g7jUKUWaoxUg6kgqJUrKMeONL82u5NuR+Y44zq7CsntqkybxjOx5sSVhYfYMeoa+bENPVtjxV0bMbZSxKobSrH0ZQExnkQMqMSlPMjMzAHsHsbit6Znhn32Z6UikGdGK+yX8PAGg1HtTU+L7Mi1q2i0BYobHi2dMANQ1dbhanLVwOpNPD0bhuZxFWFhnNUNNYGzBD/wCej/XZuSlKnA/FLmpjpqoh1aPT0tblgcTsj4p93cFspHbGNmwDNfr+Wcf5m2KUikbdqYhQHgDOaoa+GTZWWGe99XQVr5uCWtiy9QU2TvTD1SkhpM8MOxfYWUTZXwg6kgCF1yZr/wBpliAU1K8ktjxZdO7xrDK9kLVlfY/Rv8XSEgdUxy8bNu3M4ipCw/Q7WVjGAJ6lYisbTYQGupS6en0c08TKu2sO2xV6iirdG6iHUdX9jRaupSn1THHLauRzZZ2+KaoYJY2taW6x3FtvQk46nVmmmNNqNa4TGTqy4tqBCns7I1sGMKVMc142YqY+ukB6mqjHuu5x9+0pRmvuNbirg2ItWLQyzROmtWkNO5t6WFZZmh64bT15uicnFNbQE921YtB9aVWyW3qb4burGxgdhZSutWkVfg9J4rnZ/9oACAEDAAE/Af6T/9oACAECAAE/Af6T/9oACAEBAQY/Au4ibAyDEhArZO6P1+H4JLtEkKPpFXwZGSzVutC7zbJ0gVVDxWf3c/wecJ3KFoaCs9yepYHUwUmYVZ3pUowAtLeh9E69s2nZ1vaP2pdbf/s1WkCui5Y68rWrINYFilUwWfOD+WqXXn3rqj+HTXsFgYGpERAlIANWQY4i8bWKVCINzZSjkqRei368WSurVjc1KWLJJ3j6d7P8x3Adbmm2Vopqn2OXItUe+jeDGQPLYWjEQbJUfPeG8WJ1xYItNqjie5rLMA0KO4KhieoebRXRwR+wz+LZhmLUm0MHjv1jqcrYMEqzXmGOzl2Z6Z42FvH7/kxgAhItPU2q0Z3IeJXUB5tHLojhVlwYIpKKkbFjQP3otfkUcOauDBKRAC5kIUc5dl7faXUniNL9wviyVixQasjMeeR282yVJB/lf8xraIMQb2JQYwMCwcO9FJmdlp3cWCEiADVjM3DEtnJICxGBtGtluF6Tkw/pu+6KO7mpelvsG/gwTfao4litVgZVKeY5nWqwMuNlU8GH8lMS7TXVg2TWKqx4TJQOosuhJmSuAVgm9g4daahv1nabmifWKt1amiZANXPqXdgx+tp1S7KQRZCB2y7MnSU5NVyvAeyqt2kE6KvC2WeKrvFYTE9fYmjp0ETX1ss2sEiQEgwcImt5wPNkIwE9t/mxWqwNlAEukJsV4vf1BnqnLyKk2n2562i8JNIFzzHVj2O6Oi16Z7OuDBCbvM4tLTVJPPc1ZWm8mewunSRkxatQ89Wq9qoeIUiF4Mj1raqoRBuLejeehNqDP3dlKjbHyj9GK1XeZwZVJeaStHn8B2Bw70UmZ13ndxZ3RHIhXEzgi/5/NkvnIiirVWPidvkWB0Xg3L+Y7KOTYUw3z5sVKMALWNIeDMToDZyv19go7ualaW+7fwYJvtUcT91NKSIp0Xo1YsmcU2ggtASAaok+kV/jr5NFXrF26hcO2u4zF2wsG7BslSRA+1z5hgUaaM5BaosCvYt2WCUiCRYxnF5cnnqYv3umqyOu/f8AfrUd6XUfDaloF+kDUJ8Grk5ReJao6SXzzBNgaP2YQ8+PwaosZJeBs9/PsgdLwqwPJlO1aTow3NEiC/aTItD7W8h1rasYvFYq5d0hw7kt7fgm9hMJEhWN57M4QVcoW/Nqrz0jm44dYHc1dBiC1KIsl7+9n+lLr3tVXuN4b9Vxw/14NFB2i8NAzBYJSM6xCA2f6xZrL2nvXdJR4JK2dRDVkHmNvZXcrLlWqz5NA0mXnw+LVjF489pXw74gzBtbKUYn+N//AEGqvMxfkesPwcdFftY7WeOns1u9DXHr3MVr9Y9zlcvwSlrhB2EwHCPn3X//2gAIAQECAT8h+wZUgFVwBmpEDwXs6u+THA/pCRMoWC8RqPvA2mh7qVxtym479amOtJHoadFn1oAIyOH+lE4j8lk4aBHMsmPiys6b0u0KV90+B5TAVf24j0df0o4XpNBk4sC/ZsPKCh0OEnyzw0Z8OE/PUyU9c3Ohs+YO77ouNp1/gd5o3q0fIogtY5r0YQmw0+RQk85ElNM4NdHJp5LOaZFb73OHSYraCz75PuuDCnOfd0JQCNkbiVJgOZZ4lZP1Vjy0S5HXL9E0MkW6SPNT9v6XroW8HomB8hcv4PstCnq6uwZXgoUAteDvED111jd0dpowegTrH5KmWkhqZW5Ek7lHIN1h7/JPpchdn3TPeaN5GyY9KPAdP+zlx6UuwMny7F3FC9CPVUCzt9cbeeofyIqYAlXAFAmUdv8A6PFD4GgBAU6TYFl4Ji5LYpXvUGNk99zkKxFh6bnZtU1FknX6MPC+81iDYzBu+0v1oQYUguI60eGWinJ8s06/aU+gxN+yoTT8uq8utL9snj9Wq0iYzm7oOdR2qSkx7vJPCPEfxvAhWZj9k/6oQ37g57aHBTqQM8roHK2KMG6gaGknA7ktEeU+kqSyaQdJ/wBmiDjENiSb9WMFO7tecvlyVMGQ3GT0iQ8SheK0hBJgOXkt6MVa3C8WnbrzQIkBVcAZacizwncHX0D6HpwfA+408ZqChFjwza/58xQzcuNPr4brYtuGDk5Kt9mIqHUmpi0lgsfSSSQMer2QcqETDANArGGxDI0R1x6TR5XM3V15NKbBy7uwcrYpeTkKXRwhY7GiojGssIYW5RN6fO69pBqHI5uaBn6Io9oNp4m7xTE8LuqZXK0c2qHnXo90FM5Z7+Q0Hm6vLQBWwZayppIdnLZdwUjpym3iwTIZ2cU5HnBJRpa4450n11s7z9LNsR3PxTF8LGqYHVq5mr0mEcR2Ov0bbtqHpGxvRoZwaBbub/sKh1AVrHwPoNB3I7ZijZPJpw0UtVA+H3FRzHK4KvUOFxOB7t30O4bIZjD3n/VGG76hz2MHH8XgKQM6Pw7hvSEqa2uvpZEk4aEBAADAGCmcooIuh1c7N71ZbA7vgrz0qNaSalVE2WR5Gfp0qSE7TI8cR2velUQ3UGk86cxT0wkDqZgcnqVCmsCgCDHS52e7SiolndYMns6Njr/IAiSNkcJSXKC7/b/tdWei9BfWpQpZ0x3C9+VWmBRnIcoPodWvZKf20nrnjdbSiHgH0fEAOT/RqVy1vnKDsidIpCcWGw+j3pPgWZ8xrdwcgO+ies/antlxwsvmg60TSSlhfd+AcUIklxrAgNk67OHtQwWaB9i48W6h/QKETIm5XJkvu/P3WRNH+7SOGLgwm5+6u8nxqry6ysmW3WPyWpABYIkidKPtZqyuLZifOl6Xtym9Dt7z90DJX3DaeGU6lA5g5NTYaPwpBIbjTvgFtcegY4rGJuB/A0lkjN5OjTrd5+8aYBA3EaUNBnMG0Y4G/Wo6LHezcLh5dp+gjPGf6MyemPR1655rHftbHAnKFkc4ZKe1Wu6bdRr4wf0i6h87ysysMIvH2v/aAAwDAQACAAMCAAAQ8888l4888o8888xl888o88855Bc88o4hddgxRM8oxdpM4ld9loc4BpNFldVo88c9VlNM8o888hB1c88o888Mdc888owwwwgwwwwg/9oACAEDAAE/EP6T/9oACAECAAE/EP6T/9oACAEBAgE/EPsH4YZAEpdACWs6y/YI7AnuP9JTujy4ekZoIHJGs3l2vNc5VOse+vj8VQAABBERuIlkT+lbE7ZHc3c2ujerW5febTQPcUmo7miNkbiI/df+RmAfLBdbF6vgloffwPjYA83+LxXwc8wv5K1yvafkTIagJqUSVf8AGbJc0SamdZLlYuPJfupmEjcz8Hp0UQPwPkWxljYYFQBAiT1Yr0dTRIPiaP8AE0S5ka+GkOEeCsjPDdHDEuXMgo039M9Ax4+77sNihtn5AoqjoAhkRsjs1l1HEGvsgb9KZg8FgH5SVOTiS9SK+U2wZ7uteqQAr6j14xwF7/Zsel1EwK40BaTwMfMgw9Ck0dk2479ilAGMzfYnUTTNq74gJi6ePXkqKMobBsp7ruH0wDMTsXbRxBRUk7/ll8Nb89UY35XqXSk/pW2OWc26kFcbvYWfammlJyvl+LQUM/xEk8hAEqugF2tLhfQ6azIUEGUKBsfOaLswnubONMbjpevbiM+4gy9kYpGmq1OQV0rjOy3CfDhSzp03TD5tofwDgAkDiIpzLwBHXCRLhIiJWi03d5nepA8oA31Hq11vRzSOeppMMAmAwHSo3EAAzmQOqyzFZY4PyAjn/GlOKL90/wDKpDevQol0eEq6Od2HRLka6YBGVtMohK7xlVfvAO0ffSc1aCdhybhL4chfORLKY88dfB9BaBe5FFE8QXCrCOJvoa+LPYoJ6DoAlHYCa+YZknwtAAIMFB6B81OcMBhYWCeWH2r9N6kJjGnnoyIAERkRwjtXwuv/AI5mnZ/Xe6af0CL2Qq5SepVUPvAiHAeK/wCwraBOyegaiMDCu0YHFcnfhMA1gBu18gggPOaTtIuV53w+mk8x+kIiaRyPDwHLPplCJ8ykyOLGCkCDqjELp3OdxVq0fn28mmlIEAVGAC6roBmvZf1n4galJpDR5gHBQDo6JA/xNEhNGsxh1cXkZYHZqxapLP4UvRXPYmLJzLHBLgrB1c/ADjv0Xpsjv8KO50q2cIHUW5vUGdhUugd1Q4xHp/VSkIA2714O6/E+tByfbp7i4DVsVHo/boZ3Tx9JoG/9sfY0QYdOx/idm6/x6bNIo8SqR0STXYsxqyIoEcA6AIA2Aira9r2jGczsFYT3X+0Hl0SpAkkHUnPmCgCIIkI3Ea1h+Ddbzo9tLaX4jtvH5FIaLmebxSWxYruGUamrL7ud0VsEZsdWVVurdbtGhQhZlpt3N8OHZ8Cdzs38kAY6AKCERsiWRptWoSV1Y7nGgnpL7sXjWMrnzbemoqwEiQ7CUprJGhSXUL1nvfBUCU3VxD/EC/RRwmLjXy9CTmGp5+mnmo/woBiZZPRLocF2asi3i5h0VAhA4Owh5J/tXYTR/Pyb34GFO2FS4a/PZUNIAES4jhHUrShgDpaP+KrhkkzztJvaATLIAuJZrbR1zf1H3fG263B2pIWzZUZEuMWQI6lfCoUAvKF85zaRaNBvyHIaKslLPvK9idXdzhRunODoT4Z0lC33bFhL4Ka0qAYb13pD1zZToACIkiNkRsiVkGiXsnYBOtD9KKjtSK+aSWcl3LRs+8FFyoBCJslfnD1Kf8Bo0L8Of5Nl9EIEZRBmGBh2YR7/ANEklu1lwwnsPhVrE5aZyQl2H1ZuliB7th/SyXpSE6YRvf7X/9k=";
const fmt = (n, compact = false) => { const v = Number(n) || 0; if (compact && v >= 1000) return `PKR ${(v / 1000).toFixed(1)}k`; return `PKR ${v.toLocaleString("en-PK")}`; };
const esc = (str) => String(str || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const todayStr = () => new Date().toISOString().split("T")[0];
const genSlip = () => `NK${Date.now().toString().slice(-6)}`;

// Normalize Supabase snake_case transaction fields → camelCase used throughout the UI
const normalizeTxn = (t) => {
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
    discountAmt: t.discountAmt ?? (t.disc_flat > 0 ? t.disc_flat : t.disc_pct > 0 ? Math.round((t.total / (1 - t.disc_pct / 100)) * (t.disc_pct / 100)) : 0),
    discReason: t.disc_reason || t.discReason || "",
    discCourtesyBy: t.disc_courtesy_by || t.discCourtesyBy || "",
    splitCash: t.split_cash ?? t.splitCash ?? 0,
    splitOtherMode: t.split_other_mode || t.splitOtherMode || "ONLINE",
    splitOtherAmt: t.split_other_amt ?? t.splitOtherAmt ?? 0,
    slip: t.slip || `NK${String(t.id || "").slice(-6)}`,
    date: t.date || (createdAt ? createdAt.toISOString().split("T")[0] : todayStr()),
    time: t.time || (createdAt ? createdAt.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }) : ""),
  };
};

// Transactions are now fetched from the backend api.
const DEMO = [];

// ─── CATALOGUE DATA (from Noor Kada Men & Women Catalogues) ───────────────────
const MOCK_CATEGORIES = [
  { id: 1,  name: "Hair Cut & Styling (Men)",   icon: "✂️",  color: "#1A3A5C" },
  { id: 2,  name: "Beard Grooming",              icon: "🪒",  color: "#3C2218" },
  { id: 3,  name: "Hair Treatments (Men)",       icon: "💆",  color: "#1A3C28" },
  { id: 4,  name: "Hair Chemicals (Men)",        icon: "🎨",  color: "#2C1A3C" },
  { id: 5,  name: "Facial Treatment",            icon: "✨",  color: "#5C3A1A" },
  { id: 6,  name: "Aesthetic Treatment",         icon: "💎",  color: "#1A2C5C" },
  { id: 7,  name: "Hands & Feet",                icon: "🤲",  color: "#3C3A1A" },
  { id: 8,  name: "Waxing (Men)",                icon: "🕯️", color: "#283C1A" },
  { id: 9,  name: "Royal Massage",               icon: "💆",  color: "#1A3C3C" },
  { id: 10, name: "Groom Make Overs",            icon: "🤵",  color: "#1A1A3C" },
  { id: 11, name: "Groom Packages",              icon: "📦",  color: "#3C1A2C" },
  { id: 12, name: "Executive Deals (Men)",       icon: "⭐",  color: "#3C2C1A" },
  { id: 13, name: "Everyday Deals (Men)",        icon: "🌟",  color: "#3C261A" },
  { id: 14, name: "Hair Cut & Styling (Women)",  icon: "✂️",  color: "#5C1A3A" },
  { id: 15, name: "Hair Treatment (Women)",      icon: "💆",  color: "#3A1A5C" },
  { id: 16, name: "Hair Chemicals (Women)",      icon: "🎨",  color: "#5C1A5C" },
  { id: 17, name: "Waxing (Women)",              icon: "🕯️", color: "#3A2C1A" },
  { id: 18, name: "Nail Art & Enhancement",      icon: "💅",  color: "#5C1A2C" },
  { id: 19, name: "Eye Lashes",                  icon: "👁️", color: "#1A3A5C" },
  { id: 20, name: "Mehndi Artist",               icon: "🌿",  color: "#2C5C1A" },
  { id: 21, name: "Hair Extension",              icon: "🌊",  color: "#1A4A5C" },
  { id: 22, name: "Bridal Make Overs",           icon: "👰",  color: "#5C1A1A" },
  { id: 23, name: "Bridal Packages",             icon: "🎊",  color: "#5C2E1A" },
  { id: 24, name: "Party Make Ups",              icon: "🎉",  color: "#3A1A5C" },
  { id: 25, name: "Executive Skin & Wax",        icon: "💫",  color: "#5C2A3A" },
  { id: 26, name: "Executive Skin & Hair",       icon: "💄",  color: "#2A5C3A" },
  { id: 27, name: "Everyday Skin & Wax",         icon: "🌸",  color: "#5C3A2A" },
  { id: 28, name: "Everyday Skin & Hair",        icon: "🌺",  color: "#3A2A5C" },
  { id: 29, name: "Everyday Other Deals",        icon: "🎁",  color: "#2A3A5C" },
];

const _c = (cat) => (MOCK_CATEGORIES.find(c => c.name === cat) || {}).color || "#B08040";
const MOCK_SERVICES = [
  // ── Hair Cut & Styling (Men) ───────────────────────────────────────────────
  { id: 101, name: "Executive Cut",                        category: "Hair Cut & Styling (Men)", price: 1999,  icon: "✂️",  color: _c("Hair Cut & Styling (Men)") },
  { id: 102, name: "Exclusive Child Cut",                  category: "Hair Cut & Styling (Men)", price: 1799,  icon: "✂️",  color: _c("Hair Cut & Styling (Men)") },
  { id: 103, name: "Classic Precision Cut",                category: "Hair Cut & Styling (Men)", price: 1499,  icon: "✂️",  color: _c("Hair Cut & Styling (Men)") },
  { id: 104, name: "Classic Child Cut",                    category: "Hair Cut & Styling (Men)", price: 1349,  icon: "✂️",  color: _c("Hair Cut & Styling (Men)") },
  { id: 105, name: "Head Shave",                           category: "Hair Cut & Styling (Men)", price: 1499,  icon: "✂️",  color: _c("Hair Cut & Styling (Men)") },
  { id: 106, name: "Exclusive Couture Design",             category: "Hair Cut & Styling (Men)", price: 1499,  icon: "✂️",  color: _c("Hair Cut & Styling (Men)") },
  { id: 107, name: "Signature Luxe Hair Design",           category: "Hair Cut & Styling (Men)", price: 999,   icon: "✂️",  color: _c("Hair Cut & Styling (Men)") },
  { id: 108, name: "Head Wash",                            category: "Hair Cut & Styling (Men)", price: 349,   icon: "🚿",  color: _c("Hair Cut & Styling (Men)") },
  // ── Beard Grooming ────────────────────────────────────────────────────────
  { id: 201, name: "Executive Wet Shave",                  category: "Beard Grooming", price: 999,  icon: "🪒", color: _c("Beard Grooming") },
  { id: 202, name: "Fade Beard",                           category: "Beard Grooming", price: 999,  icon: "🪒", color: _c("Beard Grooming") },
  { id: 203, name: "Simple Wet Shave",                     category: "Beard Grooming", price: 699,  icon: "🪒", color: _c("Beard Grooming") },
  { id: 204, name: "Basic Beard & Shaping",                category: "Beard Grooming", price: 699,  icon: "🪒", color: _c("Beard Grooming") },
  { id: 205, name: "Beard Trimming",                       category: "Beard Grooming", price: 699,  icon: "🪒", color: _c("Beard Grooming") },
  { id: 206, name: "Neck Line Hair Remover",               category: "Beard Grooming", price: 449,  icon: "🪒", color: _c("Beard Grooming") },
  { id: 207, name: "Moustache & Shaping",                  category: "Beard Grooming", price: 449,  icon: "🪒", color: _c("Beard Grooming") },
  // ── Hair Treatments (Men) ─────────────────────────────────────────────────
  { id: 301, name: "Keratin A",                            category: "Hair Treatments (Men)", price: 17999, icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 302, name: "Keratin B",                            category: "Hair Treatments (Men)", price: 11999, icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 303, name: "Hair Perming Treatment",               category: "Hair Treatments (Men)", price: 10999, icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 304, name: "Dry & Damage Treatment",               category: "Hair Treatments (Men)", price: 4899,  icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 305, name: "Anti-Dandruff Treatment",              category: "Hair Treatments (Men)", price: 4899,  icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 306, name: "Metal Detox Treatment",                category: "Hair Treatments (Men)", price: 4899,  icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 307, name: "Pre-Light Damage Treatment",           category: "Hair Treatments (Men)", price: 4899,  icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 308, name: "Protein Treatment",                    category: "Hair Treatments (Men)", price: 4899,  icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 309, name: "Keratin Mask (Frequency Treatment)",   category: "Hair Treatments (Men)", price: 4899,  icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 310, name: "Basic Protein Treatment",              category: "Hair Treatments (Men)", price: 3499,  icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 311, name: "Keratin Mask",                         category: "Hair Treatments (Men)", price: 1599,  icon: "💆", color: _c("Hair Treatments (Men)") },
  // ── Hair Chemicals (Men) ──────────────────────────────────────────────────
  { id: 401, name: "Hair Color (Transformation)",          category: "Hair Chemicals (Men)", price: 25999, icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 402, name: "Sticking Up To 10 Levels Full Head",   category: "Hair Chemicals (Men)", price: 19999, icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 403, name: "Sticking Up To 7 Levels Full Head",    category: "Hair Chemicals (Men)", price: 14999, icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 404, name: "Ammonia Free Full Dye",                category: "Hair Chemicals (Men)", price: 3499,  icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 405, name: "Hair Dye",                             category: "Hair Chemicals (Men)", price: 2999,  icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 406, name: "Ammonia Free Beard Dye",               category: "Hair Chemicals (Men)", price: 1999,  icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 407, name: "Beard Dye",                            category: "Hair Chemicals (Men)", price: 1499,  icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 408, name: "Hair Shiner",                          category: "Hair Chemicals (Men)", price: 1499,  icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 409, name: "Sticking Per Slick",                   category: "Hair Chemicals (Men)", price: 1499,  icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 410, name: "Side Burns Color",                     category: "Hair Chemicals (Men)", price: 999,   icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 411, name: "Beard Shiner",                         category: "Hair Chemicals (Men)", price: 749,   icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 412, name: "Moustache Color",                      category: "Hair Chemicals (Men)", price: 499,   icon: "🎨", color: _c("Hair Chemicals (Men)") },
  // ── Facial Treatment (shared) ─────────────────────────────────────────────
  { id: 501, name: "Guinot Whitening Facial",              category: "Facial Treatment", price: 10999, icon: "✨", color: _c("Facial Treatment") },
  { id: 502, name: "Thalgo Whitening Facial",              category: "Facial Treatment", price: 7499,  icon: "✨", color: _c("Facial Treatment") },
  { id: 503, name: "Janssen Whitening Facial",             category: "Facial Treatment", price: 5999,  icon: "✨", color: _c("Facial Treatment") },
  { id: 504, name: "Regular Whitening Facial",             category: "Facial Treatment", price: 3899,  icon: "✨", color: _c("Facial Treatment") },
  { id: 505, name: "Guinot Short Facial",                  category: "Facial Treatment", price: 5999,  icon: "✨", color: _c("Facial Treatment") },
  { id: 506, name: "Thalgo Short Facial",                  category: "Facial Treatment", price: 4499,  icon: "✨", color: _c("Facial Treatment") },
  { id: 507, name: "Janssen Short Facial",                 category: "Facial Treatment", price: 3499,  icon: "✨", color: _c("Facial Treatment") },
  { id: 508, name: "Regular Short Facial",                 category: "Facial Treatment", price: 1899,  icon: "✨", color: _c("Facial Treatment") },
  { id: 509, name: "Collagen Mask",                        category: "Facial Treatment", price: 1449,  icon: "✨", color: _c("Facial Treatment") },
  { id: 510, name: "Mineral Mask",                         category: "Facial Treatment", price: 649,   icon: "✨", color: _c("Facial Treatment") },
  { id: 511, name: "Sheet Mask",                           category: "Facial Treatment", price: 449,   icon: "✨", color: _c("Facial Treatment") },
  { id: 512, name: "Face & Neck Polish",                   category: "Facial Treatment", price: 349,   icon: "✨", color: _c("Facial Treatment") },
  { id: 513, name: "Nose Strip",                           category: "Facial Treatment", price: 299,   icon: "✨", color: _c("Facial Treatment") },
  // ── Aesthetic Treatment (shared) ──────────────────────────────────────────
  { id: 601, name: "Whitening Drips (Premium)",            category: "Aesthetic Treatment", price: 24999, icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 602, name: "Microblading",                         category: "Aesthetic Treatment", price: 14999, icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 603, name: "Hydra Facial 14 Steps",                category: "Aesthetic Treatment", price: 12499, icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 604, name: "Whitening Drips",                      category: "Aesthetic Treatment", price: 11999, icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 605, name: "Acne Treatment",                       category: "Aesthetic Treatment", price: 10999, icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 606, name: "PRGF",                                 category: "Aesthetic Treatment", price: 10499, icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 607, name: "Meso Therapy",                         category: "Aesthetic Treatment", price: 9999,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 608, name: "Hand Rejuvenation",                    category: "Aesthetic Treatment", price: 8499,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 609, name: "BB Glow",                              category: "Aesthetic Treatment", price: 7849,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 610, name: "PRP + Micro Needling",                 category: "Aesthetic Treatment", price: 7499,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 611, name: "Hydra Facial 6 Steps",                 category: "Aesthetic Treatment", price: 6899,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 612, name: "BB Glow Basic",                        category: "Aesthetic Treatment", price: 4899,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 613, name: "Mole Removal",                         category: "Aesthetic Treatment", price: 2000,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 614, name: "LED Photo Therapy",                    category: "Aesthetic Treatment", price: 1899,  icon: "💎", color: _c("Aesthetic Treatment") },
  // ── Hands & Feet (shared) ─────────────────────────────────────────────────
  { id: 701, name: "Deluxe Hands Repair",                  category: "Hands & Feet", price: 3449, icon: "🤲", color: _c("Hands & Feet") },
  { id: 702, name: "Deluxe Feet Repair",                   category: "Hands & Feet", price: 3449, icon: "🤲", color: _c("Hands & Feet") },
  { id: 703, name: "Classic Hands Repair",                 category: "Hands & Feet", price: 2449, icon: "🤲", color: _c("Hands & Feet") },
  { id: 704, name: "Classic Feet Repair",                  category: "Hands & Feet", price: 2449, icon: "🤲", color: _c("Hands & Feet") },
  { id: 705, name: "Express Hands Repair",                 category: "Hands & Feet", price: 1449, icon: "🤲", color: _c("Hands & Feet") },
  { id: 706, name: "Express Feet Repair",                  category: "Hands & Feet", price: 1449, icon: "🤲", color: _c("Hands & Feet") },
  { id: 707, name: "Paraffin Wax Hands & Feet",            category: "Hands & Feet", price: 2399, icon: "🤲", color: _c("Hands & Feet") },
  { id: 708, name: "Paraffin Wax Hands/Feet (Each)",       category: "Hands & Feet", price: 1399, icon: "🤲", color: _c("Hands & Feet") },
  { id: 709, name: "Hands & Feet Whitening Polisher",      category: "Hands & Feet", price: 1399, icon: "🤲", color: _c("Hands & Feet") },
  { id: 710, name: "Hands Nail Cut, Shape & File",         category: "Hands & Feet", price: 949,  icon: "🤲", color: _c("Hands & Feet") },
  // ── Waxing (Men) ──────────────────────────────────────────────────────────
  { id: 801, name: "Full Body Wax",                        category: "Waxing (Men)", price: 12999, icon: "🕯️", color: _c("Waxing (Men)") },
  { id: 802, name: "Full Face Wax",                        category: "Waxing (Men)", price: 949,   icon: "🕯️", color: _c("Waxing (Men)") },
  { id: 803, name: "Full Arms/Legs (Mega Wax)",            category: "Waxing (Men)", price: 949,   icon: "🕯️", color: _c("Waxing (Men)") },
  { id: 804, name: "Half Arms/Legs (Mini Wax)",            category: "Waxing (Men)", price: 649,   icon: "🕯️", color: _c("Waxing (Men)") },
  { id: 805, name: "Nose Wax",                             category: "Waxing (Men)", price: 449,   icon: "🕯️", color: _c("Waxing (Men)") },
  { id: 806, name: "Cheeks/Ears Wax",                      category: "Waxing (Men)", price: 449,   icon: "🕯️", color: _c("Waxing (Men)") },
  { id: 807, name: "Eye Brows/Forehead Wax",               category: "Waxing (Men)", price: 449,   icon: "🕯️", color: _c("Waxing (Men)") },
  { id: 808, name: "Eye Brows Threading",                  category: "Waxing (Men)", price: 299,   icon: "🕯️", color: _c("Waxing (Men)") },
  // ── Royal Massage (shared) ────────────────────────────────────────────────
  { id: 901, name: "Head & Shoulders Oil Massage (30 min)", category: "Royal Massage", price: 1499, icon: "💆", color: _c("Royal Massage") },
  { id: 902, name: "Feet Massage (30 min)",                 category: "Royal Massage", price: 1499, icon: "💆", color: _c("Royal Massage") },
  { id: 903, name: "Head & Shoulders Oil Therapy (15 min)", category: "Royal Massage", price: 999,  icon: "💆", color: _c("Royal Massage") },
  { id: 904, name: "Feet Massage (15 min)",                 category: "Royal Massage", price: 999,  icon: "💆", color: _c("Royal Massage") },
  { id: 905, name: "Scalp Oiling",                          category: "Royal Massage", price: 699,  icon: "💆", color: _c("Royal Massage") },
  { id: 906, name: "Vibrating Massage Therapy",             category: "Royal Massage", price: 999,  icon: "💆", color: _c("Royal Massage") },
  // ── Groom Make Overs ──────────────────────────────────────────────────────
  { id: 1001, name: "Reception / Shahlima",                category: "Groom Make Overs", price: 19999, icon: "🤵", color: _c("Groom Make Overs") },
  { id: 1002, name: "Barat",                               category: "Groom Make Overs", price: 14999, icon: "🤵", color: _c("Groom Make Overs") },
  { id: 1003, name: "Mehndi Makeover",                     category: "Groom Make Overs", price: 9999,  icon: "🤵", color: _c("Groom Make Overs") },
  { id: 1004, name: "Executive Makeover",                  category: "Groom Make Overs", price: 5999,  icon: "🤵", color: _c("Groom Make Overs") },
  { id: 1005, name: "Groom Makeover",                      category: "Groom Make Overs", price: 4999,  icon: "🤵", color: _c("Groom Make Overs") },
  { id: 1006, name: "Camera Smart Makeover",               category: "Groom Make Overs", price: 2999,  icon: "🤵", color: _c("Groom Make Overs") },
  { id: 1007, name: "Dress Up",                            category: "Groom Make Overs", price: 499,   icon: "🤵", color: _c("Groom Make Overs") },
  { id: 1008, name: "Hot/Cold Shower",                     category: "Groom Make Overs", price: 1099,  icon: "🤵", color: _c("Groom Make Overs") },
  // ── Groom Packages ────────────────────────────────────────────────────────
  { id: 1101, name: "Groom 3 Days Signature Package",      category: "Groom Packages", price: 33999, icon: "📦", color: _c("Groom Packages") },
  { id: 1102, name: "Groom 3 Days Basic Package",          category: "Groom Packages", price: 21999, icon: "📦", color: _c("Groom Packages") },
  // ── Executive Deals (Men) ─────────────────────────────────────────────────
  { id: 1201, name: "Ultimate Relaxation & Grooming",      category: "Executive Deals (Men)", price: 12399, icon: "⭐", color: _c("Executive Deals (Men)") },
  { id: 1202, name: "Signature Grooming Experience",       category: "Executive Deals (Men)", price: 10999, icon: "⭐", color: _c("Executive Deals (Men)") },
  { id: 1203, name: "Complete Hair & Skin Care",           category: "Executive Deals (Men)", price: 8899,  icon: "⭐", color: _c("Executive Deals (Men)") },
  { id: 1204, name: "Luxury Hair & Beard Grooming",        category: "Executive Deals (Men)", price: 7899,  icon: "⭐", color: _c("Executive Deals (Men)") },
  { id: 1205, name: "Keratin & Grooming Combo",            category: "Executive Deals (Men)", price: 5899,  icon: "⭐", color: _c("Executive Deals (Men)") },
  { id: 1206, name: "Complete Relaxation & Styling",       category: "Executive Deals (Men)", price: 4499,  icon: "⭐", color: _c("Executive Deals (Men)") },
  // ── Everyday Deals (Men) ──────────────────────────────────────────────────
  { id: 1301, name: "Ultimate Grooming Package",           category: "Everyday Deals (Men)", price: 8999, icon: "🌟", color: _c("Everyday Deals (Men)") },
  { id: 1302, name: "Complete Grooming & Relaxation",      category: "Everyday Deals (Men)", price: 6499, icon: "🌟", color: _c("Everyday Deals (Men)") },
  { id: 1303, name: "Executive Grooming Experience",       category: "Everyday Deals (Men)", price: 4999, icon: "🌟", color: _c("Everyday Deals (Men)") },
  { id: 1304, name: "Signature Luxe Grooming",             category: "Everyday Deals (Men)", price: 4799, icon: "🌟", color: _c("Everyday Deals (Men)") },
  { id: 1305, name: "Ultimate Grooming Package (Standard)",category: "Everyday Deals (Men)", price: 3999, icon: "🌟", color: _c("Everyday Deals (Men)") },
  { id: 1306, name: "Complete Grooming & Relaxation (Std)",category: "Everyday Deals (Men)", price: 3749, icon: "🌟", color: _c("Everyday Deals (Men)") },
  { id: 1307, name: "Ultimate Relaxation & Hair Styling",  category: "Everyday Deals (Men)", price: 3399, icon: "🌟", color: _c("Everyday Deals (Men)") },
  { id: 1308, name: "Keratin Hair Care",                   category: "Everyday Deals (Men)", price: 2999, icon: "🌟", color: _c("Everyday Deals (Men)") },
  // ── Hair Cut & Styling (Women) ────────────────────────────────────────────
  { id: 1401, name: "Executive Cut",                       category: "Hair Cut & Styling (Women)", price: 3899, icon: "✂️", color: _c("Hair Cut & Styling (Women)") },
  { id: 1402, name: "Classic Precision Cut",               category: "Hair Cut & Styling (Women)", price: 1899, icon: "✂️", color: _c("Hair Cut & Styling (Women)") },
  { id: 1403, name: "Child Cut",                           category: "Hair Cut & Styling (Women)", price: 1349, icon: "✂️", color: _c("Hair Cut & Styling (Women)") },
  { id: 1404, name: "Exclusive Couture Styling",           category: "Hair Cut & Styling (Women)", price: 3449, icon: "✂️", color: _c("Hair Cut & Styling (Women)") },
  { id: 1405, name: "Signature Luxe Hair Design",          category: "Hair Cut & Styling (Women)", price: 2799, icon: "✂️", color: _c("Hair Cut & Styling (Women)") },
  { id: 1406, name: "Elegant Event Styling",               category: "Hair Cut & Styling (Women)", price: 1899, icon: "✂️", color: _c("Hair Cut & Styling (Women)") },
  { id: 1407, name: "Blow Dry Styling",                    category: "Hair Cut & Styling (Women)", price: 799,  icon: "💨", color: _c("Hair Cut & Styling (Women)") },
  { id: 1408, name: "Head Wash",                           category: "Hair Cut & Styling (Women)", price: 349,  icon: "🚿", color: _c("Hair Cut & Styling (Women)") },
  // ── Hair Treatment (Women) ────────────────────────────────────────────────
  { id: 1501, name: "Xtenso Loreal",                       category: "Hair Treatment (Women)", price: 27999, icon: "💆", color: _c("Hair Treatment (Women)") },
  { id: 1502, name: "Keratin A (Gk Company)",              category: "Hair Treatment (Women)", price: 27999, icon: "💆", color: _c("Hair Treatment (Women)") },
  { id: 1503, name: "Keratin B (Brazilian Company)",       category: "Hair Treatment (Women)", price: 19499, icon: "💆", color: _c("Hair Treatment (Women)") },
  { id: 1504, name: "Hair Perming Treatment",              category: "Hair Treatment (Women)", price: 19499, icon: "💆", color: _c("Hair Treatment (Women)") },
  { id: 1505, name: "Anti Dandruff Treatment",             category: "Hair Treatment (Women)", price: 4899,  icon: "💆", color: _c("Hair Treatment (Women)") },
  { id: 1506, name: "Dry & Damage Treatment",              category: "Hair Treatment (Women)", price: 4899,  icon: "💆", color: _c("Hair Treatment (Women)") },
  { id: 1507, name: "Protein Treatment",                   category: "Hair Treatment (Women)", price: 4899,  icon: "💆", color: _c("Hair Treatment (Women)") },
  { id: 1508, name: "Pre Light Damage Control Treatment",  category: "Hair Treatment (Women)", price: 4899,  icon: "💆", color: _c("Hair Treatment (Women)") },
  { id: 1509, name: "Metal Detox Treatment",               category: "Hair Treatment (Women)", price: 4899,  icon: "💆", color: _c("Hair Treatment (Women)") },
  { id: 1510, name: "Keratin Mask (Frequency Treatment)",  category: "Hair Treatment (Women)", price: 4899,  icon: "💆", color: _c("Hair Treatment (Women)") },
  { id: 1511, name: "Basic Protein Treatment",             category: "Hair Treatment (Women)", price: 3499,  icon: "💆", color: _c("Hair Treatment (Women)") },
  { id: 1512, name: "Keratin Mask",                        category: "Hair Treatment (Women)", price: 1599,  icon: "💆", color: _c("Hair Treatment (Women)") },
  // ── Hair Chemicals (Women) ────────────────────────────────────────────────
  { id: 1601, name: "Microwave Hair Color",                category: "Hair Chemicals (Women)", price: 43999, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1602, name: "Balayage",                            category: "Hair Chemicals (Women)", price: 34499, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1603, name: "Foilayage",                           category: "Hair Chemicals (Women)", price: 34499, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1604, name: "Non Bleach (Balayage/Low/High Light)",category: "Hair Chemicals (Women)", price: 29499, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1605, name: "Ombre",                               category: "Hair Chemicals (Women)", price: 28999, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1606, name: "Money Piece With Peek A Boo",         category: "Hair Chemicals (Women)", price: 27499, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1607, name: "Peek A Boo",                          category: "Hair Chemicals (Women)", price: 24499, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1608, name: "Reverse Peek A Boo",                  category: "Hair Chemicals (Women)", price: 24499, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1609, name: "Chunky Highlights",                   category: "Hair Chemicals (Women)", price: 24499, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1610, name: "Low Lights",                          category: "Hair Chemicals (Women)", price: 24499, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1611, name: "High Lights",                         category: "Hair Chemicals (Women)", price: 24499, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1612, name: "Dyed Tips",                           category: "Hair Chemicals (Women)", price: 18999, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1613, name: "One Dye",                             category: "Hair Chemicals (Women)", price: 11499, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1614, name: "Money Piece",                         category: "Hair Chemicals (Women)", price: 10999, icon: "🎨", color: _c("Hair Chemicals (Women)") },
  { id: 1615, name: "Roots Touch Up",                      category: "Hair Chemicals (Women)", price: 5499,  icon: "🎨", color: _c("Hair Chemicals (Women)") },
  // ── Waxing (Women) ────────────────────────────────────────────────────────
  { id: 1701, name: "Full Body Wax",                       category: "Waxing (Women)", price: 10999, icon: "🕯️", color: _c("Waxing (Women)") },
  { id: 1702, name: "Full Arms/Legs (Mega Wax)",           category: "Waxing (Women)", price: 949,   icon: "🕯️", color: _c("Waxing (Women)") },
  { id: 1703, name: "Full Face Wax",                       category: "Waxing (Women)", price: 949,   icon: "🕯️", color: _c("Waxing (Women)") },
  { id: 1704, name: "Half Arms/Legs (Mini Wax)",           category: "Waxing (Women)", price: 649,   icon: "🕯️", color: _c("Waxing (Women)") },
  { id: 1705, name: "Nose Wax",                            category: "Waxing (Women)", price: 449,   icon: "🕯️", color: _c("Waxing (Women)") },
  { id: 1706, name: "Cheeks Wax",                          category: "Waxing (Women)", price: 449,   icon: "🕯️", color: _c("Waxing (Women)") },
  { id: 1707, name: "Eye Brows/Upper Lips/Forehead",       category: "Waxing (Women)", price: 449,   icon: "🕯️", color: _c("Waxing (Women)") },
  { id: 1708, name: "Eye Brows Threading",                 category: "Waxing (Women)", price: 299,   icon: "🕯️", color: _c("Waxing (Women)") },
  // ── Nail Art & Enhancement ────────────────────────────────────────────────
  { id: 1801, name: "Acrylic Hands & Feet",                category: "Nail Art & Enhancement", price: 9999, icon: "💅", color: _c("Nail Art & Enhancement") },
  { id: 1802, name: "Acrylic Full Set",                    category: "Nail Art & Enhancement", price: 6499, icon: "💅", color: _c("Nail Art & Enhancement") },
  { id: 1803, name: "Gel X",                               category: "Nail Art & Enhancement", price: 5499, icon: "💅", color: _c("Nail Art & Enhancement") },
  { id: 1804, name: "Poly Gel",                            category: "Nail Art & Enhancement", price: 5499, icon: "💅", color: _c("Nail Art & Enhancement") },
  { id: 1805, name: "Acrylic Fill",                        category: "Nail Art & Enhancement", price: 2999, icon: "💅", color: _c("Nail Art & Enhancement") },
  { id: 1806, name: "French Nail",                         category: "Nail Art & Enhancement", price: 1499, icon: "💅", color: _c("Nail Art & Enhancement") },
  { id: 1807, name: "Nail Art (Per Finger)",               category: "Nail Art & Enhancement", price: 199,  icon: "💅", color: _c("Nail Art & Enhancement") },
  // ── Eye Lashes ────────────────────────────────────────────────────────────
  { id: 1901, name: "Mega Lash",                           category: "Eye Lashes", price: 14999, icon: "👁️", color: _c("Eye Lashes") },
  { id: 1902, name: "Hybrid Lash",                         category: "Eye Lashes", price: 12999, icon: "👁️", color: _c("Eye Lashes") },
  { id: 1903, name: "Anime Lash",                          category: "Eye Lashes", price: 12999, icon: "👁️", color: _c("Eye Lashes") },
  { id: 1904, name: "Classic Lash",                        category: "Eye Lashes", price: 10999, icon: "👁️", color: _c("Eye Lashes") },
  { id: 1905, name: "Mega Lash Refill 4 Weeks",            category: "Eye Lashes", price: 8499,  icon: "👁️", color: _c("Eye Lashes") },
  { id: 1906, name: "Hybrid Lash Refill 4 Weeks",          category: "Eye Lashes", price: 7999,  icon: "👁️", color: _c("Eye Lashes") },
  { id: 1907, name: "Anime Lash Refill 4 Weeks",           category: "Eye Lashes", price: 7999,  icon: "👁️", color: _c("Eye Lashes") },
  { id: 1908, name: "Classic Lash Refill 4 Weeks",         category: "Eye Lashes", price: 7499,  icon: "👁️", color: _c("Eye Lashes") },
  { id: 1909, name: "Hybrid Lash Refill 2 Weeks",          category: "Eye Lashes", price: 6499,  icon: "👁️", color: _c("Eye Lashes") },
  { id: 1910, name: "Mega Lash Refill 2 Weeks",            category: "Eye Lashes", price: 6499,  icon: "👁️", color: _c("Eye Lashes") },
  { id: 1911, name: "Anime Lash Refill 2 Weeks",           category: "Eye Lashes", price: 6499,  icon: "👁️", color: _c("Eye Lashes") },
  { id: 1912, name: "Classic Lash Refill 2 Weeks",         category: "Eye Lashes", price: 5499,  icon: "👁️", color: _c("Eye Lashes") },
  // ── Mehndi Artist ─────────────────────────────────────────────────────────
  { id: 2001, name: "Bridal Mehndi Hands Per Side",        category: "Mehndi Artist", price: 3999, icon: "🌿", color: _c("Mehndi Artist") },
  { id: 2002, name: "Bridal Feet Mehndi",                  category: "Mehndi Artist", price: 3999, icon: "🌿", color: _c("Mehndi Artist") },
  { id: 2003, name: "Hands Front Sides",                   category: "Mehndi Artist", price: 1849, icon: "🌿", color: _c("Mehndi Artist") },
  { id: 2004, name: "Hands Back Sides",                    category: "Mehndi Artist", price: 1849, icon: "🌿", color: _c("Mehndi Artist") },
  { id: 2005, name: "Feet Mehndi",                         category: "Mehndi Artist", price: 1849, icon: "🌿", color: _c("Mehndi Artist") },
  // ── Hair Extension ────────────────────────────────────────────────────────
  { id: 2101, name: "Hair Extension 28 Inches (100Gm)",    category: "Hair Extension", price: 72999, icon: "🌊", color: _c("Hair Extension") },
  { id: 2102, name: "Hair Extension 24 Inches (100Gm)",    category: "Hair Extension", price: 63999, icon: "🌊", color: _c("Hair Extension") },
  { id: 2103, name: "Hair Extension 20 Inches (100Gm)",    category: "Hair Extension", price: 52999, icon: "🌊", color: _c("Hair Extension") },
  // ── Bridal Make Overs ─────────────────────────────────────────────────────
  { id: 2201, name: "Barat Make Over (Premium Artist)",    category: "Bridal Make Overs", price: 49999, icon: "👰", color: _c("Bridal Make Overs") },
  { id: 2202, name: "Barat Make Over (Signature Artist)",  category: "Bridal Make Overs", price: 39999, icon: "👰", color: _c("Bridal Make Overs") },
  { id: 2203, name: "Barat Make Over (Senior Artist)",     category: "Bridal Make Overs", price: 29999, icon: "👰", color: _c("Bridal Make Overs") },
  { id: 2204, name: "Walima Make Over (Premium Artist)",   category: "Bridal Make Overs", price: 44999, icon: "👰", color: _c("Bridal Make Overs") },
  { id: 2205, name: "Walima Make Over (Signature Artist)", category: "Bridal Make Overs", price: 34999, icon: "👰", color: _c("Bridal Make Overs") },
  { id: 2206, name: "Walima Make Over (Senior Artist)",    category: "Bridal Make Overs", price: 24999, icon: "👰", color: _c("Bridal Make Overs") },
  { id: 2207, name: "Engagement/Nikkah Make Over (Sig.)", category: "Bridal Make Overs", price: 29999, icon: "👰", color: _c("Bridal Make Overs") },
  { id: 2208, name: "Engagement/Nikkah Make Over (Senior)",category: "Bridal Make Overs", price: 19999, icon: "👰", color: _c("Bridal Make Overs") },
  { id: 2209, name: "Mehndi Make Over (Signature)",        category: "Bridal Make Overs", price: 18999, icon: "👰", color: _c("Bridal Make Overs") },
  { id: 2210, name: "Mehndi Make Over (Senior Artist)",    category: "Bridal Make Overs", price: 14999, icon: "👰", color: _c("Bridal Make Overs") },
  // ── Bridal Packages ───────────────────────────────────────────────────────
  { id: 2301, name: "3 Days Bridal Package (Premium)",     category: "Bridal Packages", price: 104999, icon: "🎊", color: _c("Bridal Packages") },
  { id: 2302, name: "3 Days Bridal Package (Signature)",   category: "Bridal Packages", price: 88999,  icon: "🎊", color: _c("Bridal Packages") },
  { id: 2303, name: "3 Days Bridal Package (Senior)",      category: "Bridal Packages", price: 73999,  icon: "🎊", color: _c("Bridal Packages") },
  // ── Party Make Ups ────────────────────────────────────────────────────────
  { id: 2401, name: "Party Make Up (Premium)",             category: "Party Make Ups", price: 11999, icon: "🎉", color: _c("Party Make Ups") },
  { id: 2402, name: "Party Make Up (Signature)",           category: "Party Make Ups", price: 9999,  icon: "🎉", color: _c("Party Make Ups") },
  { id: 2403, name: "Party Make Up (Senior)",              category: "Party Make Ups", price: 7999,  icon: "🎉", color: _c("Party Make Ups") },
  // ── Executive Skin & Wax ──────────────────────────────────────────────────
  { id: 2501, name: "Hydra Glow & Relaxation",             category: "Executive Skin & Wax", price: 15499, icon: "💫", color: _c("Executive Skin & Wax") },
  { id: 2502, name: "Guinot Glow & Transformation",        category: "Executive Skin & Wax", price: 13399, icon: "💫", color: _c("Executive Skin & Wax") },
  { id: 2503, name: "Thalgo Facial Grooming",              category: "Executive Skin & Wax", price: 10999, icon: "💫", color: _c("Executive Skin & Wax") },
  { id: 2504, name: "Janssen Skin Revitalization",         category: "Executive Skin & Wax", price: 9599,  icon: "💫", color: _c("Executive Skin & Wax") },
  // ── Executive Skin & Hair ─────────────────────────────────────────────────
  { id: 2601, name: "Ultimate Spa Experience",             category: "Executive Skin & Hair", price: 14999, icon: "💄", color: _c("Executive Skin & Hair") },
  { id: 2602, name: "Premium Rejuvenation Package",        category: "Executive Skin & Hair", price: 13199, icon: "💄", color: _c("Executive Skin & Hair") },
  { id: 2603, name: "Luxury Grooming Retreat",             category: "Executive Skin & Hair", price: 10599, icon: "💄", color: _c("Executive Skin & Hair") },
  { id: 2604, name: "Classic Beauty Transformation",       category: "Executive Skin & Hair", price: 9499,  icon: "💄", color: _c("Executive Skin & Hair") },
  // ── Everyday Skin & Wax ───────────────────────────────────────────────────
  { id: 2701, name: "The Luxe Glow Ritual",                category: "Everyday Skin & Wax", price: 7899, icon: "🌸", color: _c("Everyday Skin & Wax") },
  { id: 2702, name: "The Polished Glow Ritual",            category: "Everyday Skin & Wax", price: 6699, icon: "🌸", color: _c("Everyday Skin & Wax") },
  { id: 2703, name: "The Brightening Ritual",              category: "Everyday Skin & Wax", price: 6299, icon: "🌸", color: _c("Everyday Skin & Wax") },
  { id: 2704, name: "The Essential Glow Ritual",           category: "Everyday Skin & Wax", price: 5999, icon: "🌸", color: _c("Everyday Skin & Wax") },
  // ── Everyday Skin & Hair ──────────────────────────────────────────────────
  { id: 2801, name: "Signature Grooming Ritual",           category: "Everyday Skin & Hair", price: 7999, icon: "🌺", color: _c("Everyday Skin & Hair") },
  { id: 2802, name: "Essential Grooming Ritual",           category: "Everyday Skin & Hair", price: 6899, icon: "🌺", color: _c("Everyday Skin & Hair") },
  { id: 2803, name: "Radiance Care Ritual",                category: "Everyday Skin & Hair", price: 6399, icon: "🌺", color: _c("Everyday Skin & Hair") },
  { id: 2804, name: "Classic Renewal Ritual",              category: "Everyday Skin & Hair", price: 5899, icon: "🌺", color: _c("Everyday Skin & Hair") },
  // ── Everyday Other Deals ──────────────────────────────────────────────────
  { id: 2901, name: "Hair Perfection & Care",              category: "Everyday Other Deals", price: 6499, icon: "🎁", color: _c("Everyday Other Deals") },
  { id: 2902, name: "Relax & Revitalize",                  category: "Everyday Other Deals", price: 5399, icon: "🎁", color: _c("Everyday Other Deals") },
  { id: 2903, name: "Keratin And Care",                    category: "Everyday Other Deals", price: 4499, icon: "🎁", color: _c("Everyday Other Deals") },
  { id: 2904, name: "Full Body Smooth",                    category: "Everyday Other Deals", price: 3799, icon: "🎁", color: _c("Everyday Other Deals") },
  { id: 2905, name: "Complete Hand & Facial Care",         category: "Everyday Other Deals", price: 3699, icon: "🎁", color: _c("Everyday Other Deals") },
  { id: 2906, name: "Head-To-Toe Relaxation",              category: "Everyday Other Deals", price: 3499, icon: "🎁", color: _c("Everyday Other Deals") },
  { id: 2907, name: "Smooth & Radiant",                    category: "Everyday Other Deals", price: 3499, icon: "🎁", color: _c("Everyday Other Deals") },
  { id: 2908, name: "Radiant Skin & Hair Care",            category: "Everyday Other Deals", price: 3399, icon: "🎁", color: _c("Everyday Other Deals") },
  { id: 2909, name: "Quick Hair & Skin Care",              category: "Everyday Other Deals", price: 2799, icon: "🎁", color: _c("Everyday Other Deals") },
];

const DEFAULT_COURTESY_PERSONS = ["Owner", "Manager", "Ahmed", "Ayesha", "Sara", "Usman", "Fatima", "Ali"];

// ── Shared salon/spa emoji set ─────────────────────────────────────────────────
const SALON_EMOJIS = [
  // Hair
  "✂️","💇","💈","🪮","🧴","💆","🧖","🪒","🚿","🛁","🧼","🪥",
  // Face & Makeup
  "💄","💅","👄","💋","👁️","🫦","🪭","👃","🧖‍♀️","🧖‍♂️","🫧","💦",
  // Skin & Beauty
  "✨","🌟","💫","⭐","🌸","🌺","🌼","🌻","🌹","🪷","🌷","🍀",
  // Spa & Wellness
  "🧘","🛀","🌿","🍃","🌱","🪴","🌾","💐","🫚","🧪","💊","🩺",
  // Tools
  "🪄","🖌️","🔧","🧲","💡","🔥","⚡","🎨","🖼️","🪞","🧹","🧺",
  // Colors
  "🎨","🌈","🔴","🟠","🟡","🟢","🔵","🟣","🤍","🖤","🤎","⚪",
  // Nails & Accessories
  "💍","💎","💎","🎀","🎗️","🏅","🥇","🌙","☀️","🦋","🌊","💨",
  // Business & Management
  "👔","💼","📋","🗓️","✅","🔑","🎯","🏆","👑","🎁","🛎️","📞",
  // People & Roles
  "💪","🤲","🙌","👐","🤝","👩‍⚕️","👨‍⚕️","🧑‍⚕️","💁","🙋","🧑‍🎨","👩‍🎨",
  // Extra spa
  "🫁","🌊","🕯️","🪔","🧸","🫖","🍵","🌴","🏝️","🌺","🏮","🔮",
];

// ── Reusable emoji picker dropdown ────────────────────────────────────────────
function EmojiPickerDropdown({ value, onChange, defaultEmoji = "✨" }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        title="Pick emoji"
        style={{ width: 44, height: 44, borderRadius: 12, border: `1.5px solid ${open ? "#B08040" : "#EDE6D8"}`, background: "#FFF", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(44,33,24,.06)" }}
      >{value || defaultEmoji}</button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 9999, background: "#FDFBF7", border: "1.5px solid #EDE6D8", borderRadius: 16, padding: 14, boxShadow: "0 8px 32px rgba(44,33,24,.22)", width: 300 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9A9088", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".06em" }}>Quick Pick</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12, maxHeight: 220, overflowY: "auto" }}>
            {SALON_EMOJIS.map((em, i) => (
              <button key={`${em}-${i}`} type="button" onClick={() => { onChange(em); setOpen(false); }}
                style={{ width: 34, height: 34, borderRadius: 8, border: value === em ? "2px solid #B08040" : "1.5px solid #EDE6D8", background: value === em ? "#FEF3C7" : "#FFF", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {em}
              </button>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #EDE6D8", paddingTop: 10 }}>
            <div style={{ fontSize: 11, color: "#9A9088", marginBottom: 6 }}>Or type / paste any emoji:</div>
            <input
              value={value}
              onChange={e => { const v = [...e.target.value].slice(-2).join(""); onChange(v || defaultEmoji); }}
              placeholder="😊"
              style={{ width: "100%", boxSizing: "border-box", fontSize: 22, textAlign: "center", border: "1.5px solid #EDE6D8", borderRadius: 10, padding: "8px", outline: "none", background: "#FFF" }}
              onKeyDown={e => { if (e.key === "Enter") setOpen(false); }}
            />
            <div style={{ fontSize: 10, color: "#C4B9AB", marginTop: 5, textAlign: "center" }}>Press Ctrl+Cmd+Space (Mac) or Win+. (Windows)</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── RBAC Helpers ───────────────────────────────────────────────────────────────
// staff(0) < receptionist(1) < manager(2) < admin(3) < superadmin(4)
const ROLE_RANK = { staff: 0, receptionist: 1, manager: 2, admin: 3, superadmin: 4 };
const hasNavAccess = (role, v) => {
  if (role === 'staff') return false; // staff use StaffDashboard, not POS
  if (v === 'pos') return true;
  if (v === 'history') return true;
  if (v === 'settings') return (ROLE_RANK[role] || 0) >= 2;
  return (ROLE_RANK[role] || 0) >= 3; // dashboard requires admin+
};
const creatableRoles = (role) => {
  if (role === 'superadmin') return [['receptionist','Receptionist'],['staff','Staff'],['manager','Manager'],['admin','Admin']];
  if (role === 'admin')      return [['receptionist','Receptionist'],['staff','Staff'],['manager','Manager']];
  if (role === 'manager')    return [['receptionist','Receptionist'],['staff','Staff']];
  return [];
};
const canDeleteUser = (actorRole, targetRole) => {
  if (actorRole === 'superadmin') return true;
  if (actorRole === 'admin') return (ROLE_RANK[targetRole] || 0) < 3;
  if (actorRole === 'manager') return targetRole === 'staff';
  return false;
};
const roleBadgeStyle = (role) => {
  const map = {
    superadmin:   ['#FEE2E2','#991B1B'],
    admin:        ['#D1FAE5','#065F46'],
    manager:      ['#FEF3C7','#92400E'],
    receptionist: ['#DBEAFE','#1E40AF'],
    staff:        ['#F3E8FF','#6B21A8'],
  };
  const [bg, col] = map[role] || map.receptionist;
  return { background: bg, color: col };
};

// ── SVG Sparkline ─────────────────────────────────────────────────────────────
function Spark({ data, color, h = 28, w = 80 }) {
  if (!data || data.length < 2) return null;
  const mx = Math.max(...data, 1), mn = Math.min(...data, 0), rng = mx - mn || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - mn) / rng) * (h - 4) - 2]);
  const line = pts.map(p => p.join(",")).join(" ");
  const area = `${pts[0][0]},${h} ${line} ${pts[pts.length - 1][0]},${h}`;
  const id = `sp${color.replace(/\W/g, "")}x`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible", display: "block" }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5" fill={color} />
    </svg>
  );
}

// ── Donut ─────────────────────────────────────────────────────────────────────
function Donut({ slices, size = 96 }) {
  const total = slices.reduce((s, d) => s + d.v, 0) || 1;
  const r = 36, cx = 48, cy = 48; let cum = -Math.PI / 2;
  const paths = slices.filter(s => s.v > 0).map(s => {
    const pct = s.v / total, a0 = cum, a1 = cum + pct * 2 * Math.PI; cum = a1;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const lg = pct > 0.5 ? 1 : 0;
    const d = pct >= 0.999 ? `M ${cx - r},${cy} A ${r},${r},0,1,1,${cx + r - .01},${cy}` : `M ${x0},${y0} A ${r},${r},0,${lg},1,${x1},${y1}`;
    return { d, color: s.color };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 96 96">
      <circle cx={48} cy={48} r={36} fill="none" stroke="#EEE8DF" strokeWidth="12" />
      {paths.map((p, i) => <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth="12" strokeLinecap="butt" />)}
      <circle cx={48} cy={48} r={24} fill="#FDFAF6" />
    </svg>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgBar({ pct, color = "#B08040", h = 5 }) {
  return (
    <div style={{ height: h, borderRadius: h / 2, background: "#EEE8DF", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.max(pct, 0)}%`, borderRadius: h / 2, background: color, transition: "width 0.9s cubic-bezier(.22,1,.36,1)" }} />
    </div>
  );
}

// ── Client Flow ───────────────────────────────────────────────────────────────
function ClientFlow({ data, isMobile }) {
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const hourLabels = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm"];
  const slots = hours.map((h, i) => ({ h, label: hourLabels[i], count: data.filter(d => d.hour === h).reduce((s, d) => s + d.count, 0) }));
  const mx = Math.max(...slots.map(s => s.count), 1);
  const peak = slots.reduce((a, b) => b.count > a.count ? b : a, slots[0]);
  const quiet = slots.filter(s => s.count > 0).reduce((a, b) => b.count < a.count ? b : a, slots.find(s => s.count > 0) || slots[0]);
  const busyDays = DAYS.map((day, di) => ({ day, count: data.filter(d => d.day === di).reduce((s, d) => s + d.count, 0) }));
  const mxDay = Math.max(...busyDays.map(d => d.count), 1);
  const peakDay = busyDays.reduce((a, b) => b.count > a.count ? b : a, busyDays[0]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 20 }}>
      {/* Insight pills */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <div><div style={{ fontSize: 11, color: "#92400E", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Peak Hour</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#78350F" }}>{peak?.label || "—"} <span style={{ fontSize: 11, fontWeight: 500 }}>· {peak?.count || 0} visits</span></div></div>
        </div>
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🌿</span>
          <div><div style={{ fontSize: 11, color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Quietest Hour</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#14532D" }}>{quiet?.label || "—"} <span style={{ fontSize: 11, fontWeight: 500 }}>· {quiet?.count || 0} visits</span></div></div>
        </div>
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>📅</span>
          <div><div style={{ fontSize: 11, color: "#1E40AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Busiest Day</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1E3A8A" }}>{peakDay?.day || "—"} <span style={{ fontSize: 11, fontWeight: 500 }}>· {peakDay?.count || 0} visits</span></div></div>
        </div>
      </div>

      {/* Hourly bar chart */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#6B5540", marginBottom: 12 }}>Visits by Hour</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
          {slots.map((s, i) => {
            const h = Math.max(Math.round((s.count / mx) * 88), s.count > 0 ? 4 : 2);
            const isPeak = s.h === peak?.h;
            return (
              <div key={s.h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {s.count > 0 && <div style={{ fontSize: 9, fontWeight: 600, color: isPeak ? "#B08040" : "#C4B9AB" }}>{s.count}</div>}
                <div style={{
                  width: "100%", height: h, borderRadius: "4px 4px 0 0",
                  background: isPeak ? "linear-gradient(180deg,#D4A043,#B08040)" : s.count > 0 ? "#D4C4A8" : "#EEE6D8",
                  transition: "height .8s cubic-bezier(.22,1,.36,1)", position: "relative"
                }}>
                  {isPeak && <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: 10 }}>⭐</div>}
                </div>
                <div style={{ fontSize: 9, color: isPeak ? "#B08040" : "#B8AFA5", fontWeight: isPeak ? 700 : 400, textAlign: "center", whiteSpace: "nowrap" }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day of week flow — horizontal bars */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#6B5540", marginBottom: 12 }}>Visits by Day</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {busyDays.map(({ day, count }) => {
            const pct = Math.round(count / mxDay * 100) || 0;
            const isPeak = day === peakDay?.day;
            return (
              <div key={day} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, fontSize: 12, fontWeight: isPeak ? 700 : 400, color: isPeak ? "#B08040" : "#9A9088" }}>{day}</div>
                <div style={{ flex: 1, height: 24, borderRadius: 6, background: "#F5F0E8", overflow: "hidden", position: "relative" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`, minWidth: pct > 0 ? 8 : 0, borderRadius: 6,
                    background: isPeak ? "linear-gradient(90deg,#D4A043,#B08040)" : "#D4C4A8",
                    transition: "width .9s cubic-bezier(.22,1,.36,1)", display: "flex", alignItems: "center", paddingLeft: 8
                  }}>
                    {pct > 12 && <span style={{ fontSize: 10, fontWeight: 600, color: isPeak ? "#FFF" : "#8B6914", whiteSpace: "nowrap" }}>{count} visits</span>}
                  </div>
                  {pct <= 12 && count > 0 && <span style={{ position: "absolute", left: pct > 0 ? `${pct + 2}%` : "6px", top: "50%", transform: "translateY(-50%)", fontSize: 10, fontWeight: 500, color: "#B8AFA5" }}>{count}</span>}
                </div>
                {isPeak && <span style={{ fontSize: 10, fontWeight: 700, color: "#B08040", whiteSpace: "nowrap" }}>Peak ⭐</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Searchable Stylist Picker ─────────────────────────────────────────────────
function StylistPicker({ value, onChange, color, id, stylists = [], highlight = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 200 });
  const ref = React.useRef(null);
  const triggerRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const dropRef = React.useRef(null);
  const filtered = stylists.filter(s => s.name.toLowerCase().startsWith(query.toLowerCase()));

  // Close on outside click — check both trigger and portal dropdown
  React.useEffect(() => {
    const handler = e => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (open) return setOpen(false);
    // Read the trigger's exact viewport position
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom, left: r.left, width: r.width });
    }
    setOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 40);
  };

  const select = (name) => {
    onChange(name);
    setOpen(false);
    setQuery("");
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange("");
    setOpen(false);
  };

  // Build the dropdown as a React Portal into document.body
  const dropdown = open ? ReactDOM.createPortal(
    <div ref={dropRef} style={{
      position: "fixed",
      top: dropPos.top,
      left: dropPos.left,
      width: dropPos.width,
      zIndex: 99999,
      background: "#FFFFFF",
      borderRadius: "0 0 12px 12px",
      boxShadow: "0 8px 32px rgba(44,33,24,.18), 0 2px 8px rgba(44,33,24,.08)",
      border: `1.5px solid ${highlight ? "#A0303F" : "#EDE6D8"}`,
      borderTop: "none",
      overflow: "hidden",
    }}>
      {/* Search input */}
      <div style={{ padding: "9px 10px", borderBottom: "1px solid #F0EAE0", display: "flex", alignItems: "center", gap: 7 }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="#C4B9AB" strokeWidth="1.4" />
          <path d="M10 10l2.5 2.5" stroke="#C4B9AB" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a name…"
          style={{
            border: "none", outline: "none", fontSize: 12, color: "#2A2118",
            background: "transparent", flex: 1, fontFamily: "'Outfit',sans-serif"
          }}
        />
        {query && <button onClick={() => setQuery("")} style={{ color: "#D4C4B0", fontSize: 13, background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>}
      </div>

      {/* Options */}
      <div style={{ maxHeight: 200, overflowY: "auto" }}>
        {filtered.length === 0
          ? <div style={{ padding: "12px 14px", fontSize: 12, color: "#C4B9AB", textAlign: "center" }}>No match found</div>
          : filtered.map(sty => {
            const isSelected = sty.name === value;
            const styColor = sty.color || "#B08040";
            return (
              <div key={sty.name} onClick={() => select(sty.name)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", cursor: "pointer",
                  background: isSelected ? "#FAF5EC" : "transparent",
                  transition: "background .12s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = isSelected ? "#FAF5EC" : "#FDFAF6"}
                onMouseLeave={e => e.currentTarget.style.background = isSelected ? "#FAF5EC" : "transparent"}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: styColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#FFF", flexShrink: 0
                }}>{sty.name[0]}</div>
                <span style={{ fontSize: 13, fontWeight: isSelected ? 600 : 400, color: isSelected ? styColor : "#2A2118", flex: 1 }}>{sty.name}</span>
                {isSelected && <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7l3.5 3.5 6-6" stroke={styColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>}
              </div>
            );
          })
        }
      </div>

      {/* Clear option if assigned */}
      {value && (
        <div style={{ borderTop: "1px solid #F0EAE0" }}>
          <div onClick={() => select("")} style={{ padding: "8px 12px", fontSize: 11, color: "#B8AFA5", cursor: "pointer", textAlign: "center", transition: "background .12s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#FDFAF6"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            Remove assignment
          </div>
        </div>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <div ref={ref} style={{ position: "relative", flex: 1 }}>
      {/* Trigger — slim row */}
      <div ref={triggerRef} id={id} onClick={handleOpen} style={{
        display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
        padding: "7px 11px",
        borderRadius: open ? "8px 8px 0 0" : 8,
        transition: "all .15s",
        background: open ? "#FFFFFF" : highlight ? "#FEF2F2" : "#F8F4EE",
        border: `1.5px solid ${highlight ? "#FECACA" : "#EDE6D8"}`,
        borderBottom: open ? "1px solid #F0EAE0" : `1.5px solid ${highlight ? "#FECACA" : "#EDE6D8"}`,
        boxShadow: highlight ? "0 0 0 2px rgba(239, 68, 68, 0.1)" : "none"
      }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, opacity: .45 }}>
          <circle cx="6" cy="5" r="3" stroke={highlight ? "#A0303F" : "#6B5540"} strokeWidth="1.4" />
          <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke={highlight ? "#A0303F" : "#6B5540"} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {value
          ? <><div style={{
            width: 18, height: 18, borderRadius: "50%", background: color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 700, color: "#FFF", flexShrink: 0
          }}>{value[0]}</div>
            <span style={{ fontSize: 12, fontWeight: 600, color, flex: 1 }}>{value}</span>
            <button onClick={clear} style={{ color: "#C4B9AB", fontSize: 14, background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, marginLeft: 4 }}>×</button>
          </>
          : <span style={{ fontSize: 12, color: highlight ? "#A0303F" : "#C4B9AB", flex: 1, fontWeight: highlight ? 600 : 400 }}>{highlight ? "Select Staff Required" : "Assign staff…"}</span>
        }
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}>
          <path d="M1 1l4 4 4-4" stroke={highlight ? "#A0303F" : "#C4B9AB"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {dropdown}
    </div>
  );
}

// ─── CourtesyPicker ─────────────────────────────────────────────────────────
function CourtesyPicker({ value, onChange, persons = [] }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [dropPos, setDropPos] = React.useState({ top: 0, left: 0, width: 200 });
  const triggerRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const dropRef = React.useRef(null);

  const filtered = persons.filter(p => p.toLowerCase().includes(query.toLowerCase()));

  React.useEffect(() => {
    const handler = e => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (open) return setOpen(false);
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom, left: r.left, width: r.width });
    }
    setOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 40);
  };

  const select = (name) => { onChange(name); setOpen(false); setQuery(""); };
  const clear = (e) => { e.stopPropagation(); onChange(""); setOpen(false); };

  const dropdown = open ? ReactDOM.createPortal(
    <div ref={dropRef} style={{
      position: "fixed", top: dropPos.top, left: dropPos.left, width: dropPos.width,
      zIndex: 99999, background: "#FFFFFF", borderRadius: "0 0 12px 12px",
      boxShadow: "0 8px 32px rgba(44,33,24,.18), 0 2px 8px rgba(44,33,24,.08)",
      border: "1.5px solid #EDE6D8", borderTop: "none", overflow: "hidden",
    }}>
      <div style={{ padding: "9px 10px", borderBottom: "1px solid #F0EAE0", display: "flex", alignItems: "center", gap: 7 }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="#C4B9AB" strokeWidth="1.4" />
          <path d="M10 10l2.5 2.5" stroke="#C4B9AB" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search name…"
          style={{ border: "none", outline: "none", fontSize: 12, color: "#2A2118", background: "transparent", flex: 1, fontFamily: "'Outfit',sans-serif" }} />
        {query && <button onClick={() => setQuery("")} style={{ color: "#D4C4B0", fontSize: 13, background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>}
      </div>
      <div style={{ maxHeight: 200, overflowY: "auto" }}>
        {filtered.length === 0
          ? <div style={{ padding: "12px 14px", fontSize: 12, color: "#C4B9AB", textAlign: "center" }}>No match found</div>
          : filtered.map(p => {
            const isSelected = p === value;
            return (
              <div key={p} onClick={() => select(p)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", cursor: "pointer", background: isSelected ? "#FAF5EC" : "transparent", transition: "background .12s" }}
                onMouseEnter={e => e.currentTarget.style.background = isSelected ? "#FAF5EC" : "#FDFAF6"}
                onMouseLeave={e => e.currentTarget.style.background = isSelected ? "#FAF5EC" : "transparent"}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#B08040", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#FFF", flexShrink: 0 }}>{p[0].toUpperCase()}</div>
                <span style={{ fontSize: 13, fontWeight: isSelected ? 600 : 400, color: isSelected ? "#B08040" : "#2A2118", flex: 1 }}>{p}</span>
                {isSelected && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3.5 3.5 6-6" stroke="#B08040" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
            );
          })
        }
      </div>
      {value && (
        <div style={{ borderTop: "1px solid #F0EAE0" }}>
          <div onClick={() => select("")} style={{ padding: "8px 12px", fontSize: 11, color: "#B8AFA5", cursor: "pointer", textAlign: "center", transition: "background .12s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#FDFAF6"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            Clear selection
          </div>
        </div>
      )}
    </div>, document.body
  ) : null;

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <div ref={triggerRef} onClick={handleOpen} style={{
        display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
        padding: "7px 10px", borderRadius: open ? "8px 8px 0 0" : 8,
        background: open ? "#FFFFFF" : "#F8F4EE",
        border: `1.5px solid #EDE6D8`,
        borderBottom: open ? "1px solid #F0EAE0" : "1.5px solid #EDE6D8",
        transition: "all .15s",
      }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, opacity: .45 }}>
          <circle cx="6" cy="5" r="3" stroke="#6B5540" strokeWidth="1.4" />
          <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#6B5540" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {value
          ? <><div style={{ width: 18, height: 18, borderRadius: "50%", background: "#B08040", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#FFF", flexShrink: 0 }}>{value[0].toUpperCase()}</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#B08040", flex: 1 }}>{value}</span>
            <button onClick={clear} style={{ color: "#C4B9AB", fontSize: 14, background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, marginLeft: 4 }}>×</button>
          </>
          : <span style={{ fontSize: 12, color: "#C4B9AB", flex: 1 }}>👤 Courtesy by (optional)…</span>
        }
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}>
          <path d="M1 1l4 4 4-4" stroke="#C4B9AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {dropdown}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function NoorKadaPOS({ user, onLogout }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  React.useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const [transactions, setTransactions] = useState([]);
  const [view, setView] = useState(() => localStorage.getItem('noorkada_view') || "pos");

  // Force users to allowed view based on their role
  React.useEffect(() => {
    if (!hasNavAccess(user.role, view)) {
      setView("pos");
    }
  }, [user.role, view]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem('noorkada_token');
  const cartPanelRef = React.useRef(null);

  // Dynamic Services State
  const [dbServices, setDbServices] = useState(MOCK_SERVICES);
  const [dbStylists, setDbStylists] = useState([]);
  const [staffPositions, setStaffPositions] = useState([]);
  const [newPositionName, setNewPositionName] = useState("");
  const [newPositionEmoji, setNewPositionEmoji] = useState("👤");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [dbUsers, setDbUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSvc, setNewSvc] = useState({ name: "", category: "", price: "", icon: "✦", color: "#B08040", included_services: [] });
  const [adminTab, setAdminTab] = useState(() => localStorage.getItem('noorkada_adminTab') || "services"); // services, staff, profile, courtesy
  const [courtesyPersons, setCourtesyPersons] = useState(() => {
    try { const s = localStorage.getItem('noorkada_courtesy_persons'); return s ? JSON.parse(s) : DEFAULT_COURTESY_PERSONS; } catch (e) { return DEFAULT_COURTESY_PERSONS; }
  });
  const [newCourtesyName, setNewCourtesyName] = useState("");
  const [staffSubTab, setStaffSubTab] = useState(() => localStorage.getItem('noorkada_staffSubTab') || "stylists"); // users, stylists
  const [addingUnified, setAddingUnified] = useState(null); // unified add-staff form state
  // Search states for admin tables
  const [svcSearch, setSvcSearch] = useState("");
  const [catSearch, setCatSearch] = useState("");
  const [stylistSearch, setStylistSearch] = useState('');
  const [staffUnifiedSearch, setStaffUnifiedSearch] = useState('');
  const [userSearch, setUserSearch] = useState("");
  const [courtesySearch, setCourtesySearch] = useState("");
  const [editingUser, setEditingUser] = useState(null); // { id, username, role, password }
  const [profilePw, setProfilePw] = useState("");
  const [profilePwConfirm, setProfilePwConfirm] = useState("");
  const [editingSvc, setEditingSvc] = useState(null); // { id, name, category, price }
  const [editingStylist, setEditingStylist] = useState(null); // { id, name, phone, address, email }
  const [delSvcConfirmId, setDelSvcConfirmId] = useState(null); // { id }
  const [delStylistConfirmId, setDelStylistConfirmId] = useState(null);
  const [delUserConfirmId, setDelUserConfirmId] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logSearch, setLogSearch] = useState("");
  const [logActionFilter, setLogActionFilter] = useState("");
  const [logUserFilter, setLogUserFilter] = useState("");

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const r = await fetch('/api/logs?limit=200', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await r.json();
      if (Array.isArray(data)) setActivityLogs(data);
    } catch (e) { devLog('Fetch logs error:', e); }
    setLogsLoading(false);
  };

  // ── Edit Bill state ──────────────────────────────────────────────────────────
  const [editingBill, setEditingBill] = useState(null); // original txn being edited
  const [editCart, setEditCart] = useState([]);
  const [editPayMode, setEditPayMode] = useState("CASH");
  const [editSplitCash, setEditSplitCash] = useState(0);
  const [editSplitOtherMode, setEditSplitOtherMode] = useState("ONLINE");
  const [editSplitOtherAmt, setEditSplitOtherAmt] = useState(0);
  const [editCustName, setEditCustName] = useState("");
  const [editCustPhone, setEditCustPhone] = useState("");
  const [editStaff, setEditStaff] = useState("");
  const [editDiscMode, setEditDiscMode] = useState("none");
  const [editDiscPct, setEditDiscPct] = useState(0);
  const [editDiscFlat, setEditDiscFlat] = useState(0);
  const [editDiscReason, setEditDiscReason] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editNoteReason, setEditNoteReason] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editSavedTxn, setEditSavedTxn] = useState(null); // set after successful save
  const [editShowOriginal, setEditShowOriginal] = useState(false);
  const [editSvcSearch, setEditSvcSearch] = useState("");
  const [editShowAmendments, setEditShowAmendments] = useState(false);

  const openEditBill = (txn) => {
    setEditingBill(txn);
    setEditCart((txn.cart || []).map((item, i) => ({ ...item, _eid: i })));
    setEditPayMode(txn.payMode || "CASH");
    setEditSplitCash(txn.splitCash || 0);
    setEditSplitOtherMode(txn.splitOtherMode || "ONLINE");
    setEditSplitOtherAmt(txn.splitOtherAmt || 0);
    setEditCustName(txn.customerName || "");
    setEditCustPhone(txn.customerPhone || "");
    setEditStaff(txn.stylist || "");
    setEditDiscMode(txn.discMode || "none");
    setEditDiscPct(txn.discPct || 0);
    setEditDiscFlat(txn.discFlat || 0);
    setEditDiscReason(txn.discReason || "");
    setEditNote(txn.note || "");
    setEditNoteReason("");
    setEditSaving(false);
    setEditSavedTxn(null);
    setEditShowOriginal(false);
    setEditSvcSearch("");
    setEditShowAmendments(false);
  };

  const closeEditBill = () => setEditingBill(null);

  const editBillTotal = useMemo(() => {
    const subtotal = editCart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
    if (editDiscMode === "pct" && editDiscPct > 0) return Math.round(subtotal * (1 - editDiscPct / 100));
    if (editDiscMode === "flat" && editDiscFlat > 0) return Math.max(0, subtotal - editDiscFlat);
    return subtotal;
  }, [editCart, editDiscMode, editDiscPct, editDiscFlat]);

  const saveEditBill = async () => {
    if (!editingBill || !editCart.length) return;
    setEditSaving(true);
    try {
      const staffSummary = [...new Set(editCart.map(i => i.stylist || editStaff || "Unassigned").filter(Boolean))].join(", ");
      const body = {
        cart: editCart.map(({ _eid, ...rest }) => rest),
        total: editBillTotal,
        pay_mode: editPayMode,
        cust_name: editCustName || "Walk-in",
        cust_phone: editCustPhone || "",
        staff_name: staffSummary,
        disc_mode: editDiscMode,
        disc_pct: editDiscMode === "pct" ? editDiscPct : 0,
        disc_flat: editDiscMode === "flat" ? editDiscFlat : 0,
        disc_reason: editDiscReason || "",
        note: editNote || "",
        split_cash: editPayMode === "SPLIT" ? editSplitCash : 0,
        split_other_mode: editPayMode === "SPLIT" ? editSplitOtherMode : "ONLINE",
        split_other_amt: editPayMode === "SPLIT" ? editSplitOtherAmt : 0,
        edit_note: editNoteReason || "",
      };
      const r = await fetch(`/api/transactions/${editingBill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.message || "Failed to save");
      }
      const updated = normalizeTxn(await r.json());
      setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
      const subtotal = (updated.cart || []).reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
      setEditSavedTxn({ ...updated, subtotal });
    } catch (e) {
      showToast(`Error: ${e.message}`, "error");
    }
    setEditSaving(false);
  };

  const [smtpSettings, setSmtpSettings] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    smtp_from_name: 'Noorkada POS',
    smtp_from_email: ''
  });

  const [toast, setToast] = useState(null); // { msg, type: 'success' | 'error' }
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchServices = async () => {
    try {
      const r = await fetch('/api/services', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await r.json();
      if (Array.isArray(data) && data.length > 0) setDbServices(data);
    } catch (e) { /* keep catalogue mock data */ }
  };

  const fetchStylists = async () => {
    try {
      const r = await fetch('/api/stylists', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await r.json();
      if (Array.isArray(data)) setDbStylists(data);
    } catch (e) { devLog('Fetch stylists error:', e); }
  };

  const fetchStaffPositions = async () => {
    try {
      const r = await fetch('/api/staff-positions', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await r.json();
      if (Array.isArray(data)) setStaffPositions(data);
    } catch (e) { devLog('Fetch staff positions error:', e); }
  };

  const addService = async () => {
    if (!newSvc.name || !newSvc.price || !newSvc.category) return showToast("Please fill name, category and price", "error");
    try {
      const r = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...newSvc, price: Number(newSvc.price) })
      });
      if (r.ok) {
        setShowAddModal(false);
        setNewSvc({ name: "", category: "", price: "", icon: "✦", color: "#B08040", included_services: [] });
        fetchServices();
        showToast("Service added successfully!");
      }
    } catch (e) { showToast("Error adding service", "error"); }
  };

  const deleteService = async (id) => {
    try {
      const r = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        fetchServices();
        setDelSvcConfirmId(null);
        showToast("Service deleted successfully!");
      }
    } catch (e) { showToast("Error deleting service", "error"); }
  };

  const addCategory = async (cat) => {
    try {
      const r = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(cat)
      });
      if (r.ok) {
        const newC = await r.json();
        setCategories(prev => [...prev, newC]);
        showToast("Category added successfully!");
      }
    } catch (e) { showToast("Error adding category", "error"); }
  };

  const deleteCategory = async (id) => {
    try {
      const r = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        fetchServices(); // Refresh services to ensure local state is consistent
        showToast("Category deleted successfully!");
      }
      setDelCatConfirmId(null);
    } catch (e) { showToast("Error deleting category", "error"); }
  };

  const deleteStylist = async (id) => {
    try {
      const r = await fetch(`/api/stylists/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        fetchStylists();
        showToast("Staff member deleted successfully!");
      }
      setDelStylistConfirmId(null);
    } catch (e) { showToast("Error deleting stylist", "error"); }
  };

  const deleteUser = async (id) => {
    try {
      const r = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (r.ok) {
        setDbUsers(prev => prev.filter(u => u.id !== id));
        showToast("User deleted successfully!");
      }
      setDelUserConfirmId(null);
    } catch (e) { showToast("Error deleting user", "error"); }
  };

  // Transform flat services to nested object
  const SERVICES = useMemo(() => {
    const obj = {};
    const activeCatNames = categories.map(c => c.name);

    categories.forEach(c => {
      obj[c.name] = { icon: c.icon, color: c.color, items: [] };
    });

    dbServices.forEach(s => {
      if (activeCatNames.includes(s.category)) {
        if (!obj[s.category]) obj[s.category] = { icon: s.icon || '🛠️', color: s.color || '#555', items: [] };
        if (!obj[s.category].items.includes(s.name)) obj[s.category].items.push(s.name);
      }
    });
    return obj;
  }, [dbServices, categories]);

  const getServiceData = (service, category) => {
    return dbServices.find(s => s.name === service && s.category === category) || {};
  };

  const getCatColor = (svcName, category) => {
    const s = getServiceData(svcName, category);
    return s ? s.color : "#B08040";
  };


  // Fetch transactions, categories, and users on mount if admin
  React.useEffect(() => {
    fetchServices();
    fetchStylists();
    fetchStaffPositions();
    fetch('/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()).then(data => { if (Array.isArray(data) && data.length > 0) setCategories(data); }).catch(() => {});

    if (ROLE_RANK[user.role] >= 1) {
      fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setTransactions(data.map(normalizeTxn));
        })
        .catch(err => devLog('Fetch transactions error:', err));

      fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setDbUsers(data);
        })
        .catch(err => devLog('Fetch users error:', err));

      fetch('/api/settings/smtp', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) setSmtpSettings(data);
        })
        .catch(err => devLog('Fetch SMTP settings error:', err));

      // Load branding from Supabase — syncs logo/name across all devices
      fetch('/api/settings/branding', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            if (data.salonName) { setSalonName(data.salonName); localStorage.setItem('noorkada_salonName', data.salonName); }
            if (data.salonLogo) { setSalonLogo(data.salonLogo); localStorage.setItem('noorkada_salonLogo', data.salonLogo); }
            if (data.salonAddress !== undefined) { setSalonAddress(data.salonAddress || ""); localStorage.setItem('noorkada_salonAddress', data.salonAddress || ""); }
            if (data.showSalonName !== undefined) { setShowSalonName(data.showSalonName); localStorage.setItem('noorkada_showSalonName', String(data.showSalonName)); }
          }
        })
        .catch(err => devLog('Fetch branding error:', err));
    }
  }, [user.role, token]);
  const [dashTab, setDashTab] = useState(() => localStorage.getItem('noorkada_dashTab') || "overview");

  React.useEffect(() => {
    localStorage.setItem('noorkada_view', view);
    localStorage.setItem('noorkada_adminTab', adminTab);
    localStorage.setItem('noorkada_staffSubTab', staffSubTab);
    localStorage.setItem('noorkada_dashTab', dashTab);
    if (adminTab === 'logs' && ROLE_RANK[user.role] >= 3) fetchLogs();
  }, [view, adminTab, staffSubTab, dashTab]);

  React.useEffect(() => {
    localStorage.setItem('noorkada_courtesy_persons', JSON.stringify(courtesyPersons));
  }, [courtesyPersons]);


  // Auto-synced names: stylists + manager/admin users only (receptionists excluded)
  const autoCourtesyNames = useMemo(() => {
    const names = new Set();
    dbStylists.forEach(s => { if (s.name && s.name.trim()) names.add(s.name.trim()); });
    dbUsers.forEach(u => {
      // Only include manager-level and above — not receptionists
      if ((ROLE_RANK[u.role] || 0) >= 2) {
        const n = (u.full_name || u.username || "").trim();
        if (n) names.add(n);
      }
    });
    return [...names].sort();
  }, [dbStylists, dbUsers]);

  // Full merged list for the dropdown (auto + manual, deduped)
  const allCourtesyPersons = useMemo(() => {
    const combined = new Set([...autoCourtesyNames, ...courtesyPersons]);
    return [...combined].sort();
  }, [autoCourtesyNames, courtesyPersons]);

  const [showCatLabelModal, setShowCatLabelModal] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("✨");
  const [delCatConfirmId, setDelCatConfirmId] = useState(null);
  const [stylistWarningOpen, setStylistWarningOpen] = useState(false);
  const [dashRange, setDashRange] = useState("30d");
  const [dashCFrom, setDashCFrom] = useState("");
  const [dashCTo, setDashCTo] = useState("");
  const [fStylist, setFStylist] = useState("");
  const [fCat, setFCat] = useState("");
  const [fPay, setFPay] = useState("");
  const [checkoutAttempted, setCheckoutAttempted] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // POS – multi-tab system
  const newTab = (n = 1) => ({
    id: Date.now() + n, label: "Client " + n,
    cart: [], custName: "", custPhone: "", payMode: "CASH",
    discMode: "none", discPct: 0, discFlat: 0, discItem: "", discItemPct: 0, discItemFlat: 0, discItemMode: "pct", discReason: "", discCourtesyBy: "",
    note: "", collapsed: false, footerCollapsed: true, cartCollapsed: true, staffSlipPrinted: false,
    splitCash: 0, splitOtherMode: "ONLINE", splitOtherAmt: 0
  });
  const [tabs, setTabs] = useState(() => {
    try {
      const saved = localStorage.getItem('noorkada_tabs');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return [newTab(1)];
  });
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem('noorkada_activeTab');
      if (saved) return parseInt(saved, 10);
    } catch (e) { }
    return 0;
  }); // index

  React.useEffect(() => {
    localStorage.setItem('noorkada_tabs', JSON.stringify(tabs));
    localStorage.setItem('noorkada_activeTab', activeTab.toString());
  }, [tabs, activeTab]);

  const [activeCat, setActiveCat] = useState("All");
  const [doneSlip, setDoneSlip] = useState(null);
  const [staffSlipPreview, setStaffSlipPreview] = useState(null);

  const emptyTab = { cart: [], custName: "", custPhone: "", payMode: "CASH", discMode: "none", discPct: 0, discFlat: 0, itemDiscounts: {}, discReason: "", discCourtesyBy: "", note: "", collapsed: false, footerCollapsed: true, cartCollapsed: true, staffSlipPrinted: false, splitCash: 0, splitOtherMode: "ONLINE", splitOtherAmt: 0 };
  const tab = tabs[activeTab] || tabs[0] || emptyTab;
  const updTab = (patch) => setTabs(prev => prev.map((t, i) => i === activeTab ? { ...t, ...patch, staffSlipPrinted: patch.staffSlipPrinted !== undefined ? patch.staffSlipPrinted : (patch.cart || patch.discPct || patch.discFlat || patch.itemDiscounts ? false : t.staffSlipPrinted) } : t));
  const [undoTab, setUndoTab] = useState(null); // { tab, idx, timer }

  const addTab = () => {
    const t = newTab(tabs.length + 1);
    setTabs(prev => [...prev, t]);
    setActiveTab(tabs.length);
  };
  const [confirmClose, setConfirmClose] = useState(null); // { idx }
  const closeTab = (idx, e) => {
    e.stopPropagation();
    const t = tabs[idx];
    const hasData = t.cart.length > 0 || t.custName;
    if (hasData) { setConfirmClose({ idx }); return; }
    doCloseTab(idx);
  };
  const doCloseTab = (idx, showUndo = true) => {
    const t = tabs[idx];
    if (showUndo) {
      if (undoTab?.timer) clearTimeout(undoTab.timer);
      const timer = setTimeout(() => setUndoTab(null), 5000);
      setUndoTab({ tab: t, idx, timer });
    } else {
      setUndoTab(null);
    }
    const next = tabs.filter((_, i) => i !== idx);
    setTabs(next);
    setActiveTab(Math.min(activeTab, Math.max(next.length - 1, 0)));
    setConfirmClose(null);
  };
  const restoreTab = () => {
    if (!undoTab) return;
    clearTimeout(undoTab.timer);
    setTabs(prev => [...prev.slice(0, undoTab.idx), undoTab.tab, ...prev.slice(undoTab.idx)]);
    setActiveTab(undoTab.idx);
    setUndoTab(null);
  };

  // shortcuts to current tab fields
  const cart = tab.cart;
  const custName = tab.custName;
  const custPhone = tab.custPhone;
  const payMode = tab.payMode;
  const discMode = tab.discMode;
  const discPct = tab.discPct;
  const discFlat = tab.discFlat;
  const itemDiscounts = tab.itemDiscounts || {}; // Map of cartItem.id -> discountData (type, value)
  const discReason = tab.discReason;
  const discCourtesyBy = tab.discCourtesyBy || "";
  const note = tab.note;
  const collapsed = tab.collapsed;
  const footerCollapsed = tab.footerCollapsed !== false;
  const cartCollapsed = tab.cartCollapsed !== false;

  const setCart = v => updTab({ cart: v });
  const setCustName = v => updTab({ custName: v });
  const setCustPhone = v => updTab({ custPhone: v });
  const setPayMode = v => updTab({ payMode: v });
  const setDiscMode = v => updTab({ discMode: v });
  const setDiscPct = v => updTab({ discPct: v });
  const setDiscFlat = v => updTab({ discFlat: v });
  const setItemDiscounts = v => updTab({ itemDiscounts: v });
  const setDiscItemFlat = v => updTab({ discItemFlat: v });
  const setDiscItemMode = v => updTab({ discItemMode: v });
  const setDiscReason = v => updTab({ discReason: v });
  const setDiscCourtesyBy = v => updTab({ discCourtesyBy: v });
  const setNote = v => updTab({ note: v });
  const setCollapsed = v => updTab({ collapsed: v });
  const setFooterCollapsed = v => updTab({ footerCollapsed: v });
  const setCartCollapsed = v => updTab({ cartCollapsed: v });
  const splitCash = tab.splitCash || 0;
  const splitOtherMode = tab.splitOtherMode || "ONLINE";
  const splitOtherAmt = tab.splitOtherAmt || 0;
  const setSplitCash = v => updTab({ splitCash: v });
  const setSplitOtherMode = v => updTab({ splitOtherMode: v });
  const setSplitOtherAmt = v => updTab({ splitOtherAmt: v });

  // History
  const [hQ, setHQ] = useState("");
  const [hDate, setHDate] = useState("");
  const [hSty, setHSty] = useState("");
  const [hCat, setHCat] = useState("");
  const [hPay, setHPay] = useState("");
  const [hRange, setHRange] = useState("all");
  const [hFrom, setHFrom] = useState("");
  const [hTo, setHTo] = useState("");
  const [hTab, setHTab] = useState("transactions"); // transactions | clients
  const [hNavFromClient, setHNavFromClient] = useState(null); // { name, key } — set when navigating from a client profile
  const [expandedAmendments, setExpandedAmendments] = useState(new Set());
  const toggleAmendments = (id) => setExpandedAmendments(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const [clientQ, setClientQ] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [viewingAmendment, setViewingAmendment] = useState(null); // txn to show in amendment comparison modal
  const [viewingStaffSummary, setViewingStaffSummary] = useState(null); // admin viewing a staff member's summary

  // Fetch staff summary when admin opens the staff summary modal
  // NOTE: this effect MUST stay after the viewingStaffSummary useState above (TDZ guard)
  React.useEffect(() => {
    if (!viewingStaffSummary?.userId || !viewingStaffSummary?.loading) return;
    const { userId, date, range: vRange } = viewingStaffSummary;
    let url = `/api/staff/admin/${userId}/summary`;
    if (vRange === 'week')  url += '?range=week';
    else if (vRange === 'month') url += '?range=month';
    else url += `?date=${date}`;
    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json().then(d => r.ok ? d : Promise.reject(d)))
      .then(data => setViewingStaffSummary(prev => prev ? { ...prev, loading: false, data, error: null } : null))
      .catch(err => setViewingStaffSummary(prev => prev ? { ...prev, loading: false, error: err?.message || 'Failed to load' } : null));
  }, [viewingStaffSummary?.userId, viewingStaffSummary?.loading, viewingStaffSummary?.date, viewingStaffSummary?.range]);

  const [salonName, setSalonName] = useState(() => {
    try { return localStorage.getItem('noorkada_salonName') || "Noorkada POS"; } catch (e) { return "Noorkada POS"; }
  });
  const [salonAddress, setSalonAddress] = useState(() => {
    try { return localStorage.getItem('noorkada_salonAddress') || ""; } catch (e) { return ""; }
  });
  const [salonLogo, setSalonLogo] = useState(() => {
    try { return localStorage.getItem('noorkada_salonLogo') || "default"; } catch (e) { return "default"; }
  });
  const [showSalonName, setShowSalonName] = useState(() => {
    try {
      const raw = localStorage.getItem('noorkada_showSalonName');
      if (raw === 'false') return false;
      return true; // default to true if null or anything else
    } catch (e) { return true; }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('noorkada_showSalonName', showSalonName ? 'true' : 'false');
    } catch (e) {
      devLog('Failed to save showSalonName', e);
    }
  }, [showSalonName]);

  const [cartWidth, setCartWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('noorkada_cartWidth');
      if (saved) return parseInt(saved, 10);
    } catch (e) { }
    return 318;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('noorkada_salonName', salonName);
      localStorage.setItem('noorkada_salonLogo', salonLogo);
      localStorage.setItem('noorkada_salonAddress', salonAddress);
    } catch (e) { devLog('Failed to save name/logo', e); }

    // Sync branding to Supabase so all devices get the same logo/name
    if (token && ROLE_RANK[user?.role] >= 2) {
      fetch('/api/settings/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ salonName, salonLogo, salonAddress, showSalonName })
      }).catch(err => devLog('Branding sync error:', err));
    }

    try {
      // Update browser tab title
      document.title = salonName || "Noorkada POS";

      // Update browser favicon
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      if (salonLogo === 'default') {
        const initial = (salonName ? salonName[0].toUpperCase() : "N");
        link.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%232A2118"/><text x="50" y="68" font-size="52" font-family="Outfit, sans-serif" font-weight="bold" fill="%23F5E6C8" text-anchor="middle">${initial}</text></svg>`;
      } else {
        link.href = salonLogo;
      }
    } catch (e) {
      devLog('Failed to update favicon', e);
    }
  }, [salonName, salonLogo, salonAddress, showSalonName, token, user?.role]);

  React.useEffect(() => {
    localStorage.setItem('noorkada_cartWidth', cartWidth.toString());
  }, [cartWidth]);

  const ranged = useMemo(() => {
    let t = transactions;
    if (dashCFrom || dashCTo) t = t.filter(x => (!dashCFrom || x.date >= dashCFrom) && (!dashCTo || x.date <= dashCTo));
    else { const days = dashRange === "today" ? 1 : dashRange === "7d" ? 7 : dashRange === "30d" ? 30 : dashRange === "90d" ? 90 : 99999; const cut = new Date(); cut.setDate(cut.getDate() - days); t = t.filter(x => new Date(x.date) >= cut); }
    if (fStylist) t = t.filter(x =>
      (Array.isArray(x.cart) && x.cart.some(c => c.stylist === fStylist)) ||
      (x.stylist || "").split(',').map(s => s.trim()).includes(fStylist)
    );
    if (fPay) t = t.filter(x => x.payMode === fPay);
    if (fCat) t = t.filter(x => x.cart.some(c => c.category === fCat));
    return t;
  }, [transactions, dashRange, dashCFrom, dashCTo, fStylist, fPay, fCat]);

  const S = useMemo(() => {
    const t = ranged, td = todayStr(), todayT = t.filter(x => x.date === td);
    const nd = dashRange === "7d" ? 7 : 30;
    const revD = [], cstD = [];
    for (let i = nd - 1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const ds = d.toISOString().split("T")[0]; const dt = t.filter(x => x.date === ds); revD.push(dt.reduce((s, x) => s + x.total, 0)); cstD.push(dt.length); }
    const cR = {}, cC = {}, sR = {}, sC = {};
    t.forEach(x => x.cart.forEach(c => { cR[c.category] = (cR[c.category] || 0) + c.price * c.qty; cC[c.category] = (cC[c.category] || 0) + c.qty; sR[c.service] = (sR[c.service] || 0) + c.price * c.qty; sC[c.service] = (sC[c.service] || 0) + c.qty; }));
    const styM = {};
    t.forEach(x => {
      // txnSty: fallback only used when a cart item has no individual stylist.
      // For single-stylist txns (no comma), use that name. Otherwise "Unassigned"
      // (new txns always have c.stylist set per-item, so txnSty is rarely used).
      const txnSty = x.stylist && !x.stylist.includes(',') ? x.stylist : "Unassigned";
      x.cart.forEach(c => {
        const sty = c.stylist || txnSty;
        if (!styM[sty]) styM[sty] = { rev: 0, cust: 0, svcs: 0, cats: {} };
        styM[sty].rev += c.price * c.qty;
        styM[sty].svcs += c.qty;
        styM[sty].cats[c.category] = (styM[sty].cats[c.category] || 0) + c.qty;
      });
      // Count customer per transaction under each unique stylist in it
      const uniqStys = [...new Set(x.cart.map(c => c.stylist || txnSty))];
      uniqStys.forEach(sty => { if (!styM[sty]) styM[sty] = { rev: 0, cust: 0, svcs: 0, cats: {} }; styM[sty].cust++; });
    });
    const pR = { CASH: 0, ONLINE: 0, SPLIT: 0 }, pC = { CASH: 0, ONLINE: 0, SPLIT: 0 };
    t.forEach(x => { pR[x.payMode] = (pR[x.payMode] || 0) + x.total; pC[x.payMode] = (pC[x.payMode] || 0) + 1; });
    const hm = []; t.forEach(x => { const dow = new Date(x.date).getDay(), hr = parseInt(x.time?.split(":")?.[0] || "12"); const ex = hm.find(h => h.day === dow && h.hour === hr); if (ex) ex.count++; else hm.push({ day: dow, hour: hr, count: 1 }); });
    const dR = Array(7).fill(0), dC = Array(7).fill(0);
    t.forEach(x => { const dow = new Date(x.date).getDay(); dR[dow] += x.total; dC[dow]++; });
    const mR = {}; t.forEach(x => { const m = x.date.slice(0, 7); mR[m] = (mR[m] || 0) + x.total; });
    const totR = t.reduce((s, x) => s + x.total, 0), totC = t.length;
    return { totR, totC, avg: totC ? Math.round(totR / totC) : 0, todayR: todayT.reduce((s, x) => s + x.total, 0), todayC: todayT.length, totDisc: t.reduce((s, x) => s + (x.discountAmt || 0), 0), revD, cstD, cR, cC, sR, sC, styM, pR, pC, hm, dR, dC, mR };
  }, [ranged, dashRange]);

  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const da = discMode === "pct" ? Math.round(sub * (discPct / 100))
    : discMode === "flat" ? Math.min(discFlat, sub)
      : discMode === "item" ? cart.reduce((totalDisc, item) => {
        const d = itemDiscounts[item.id];
        if (!d) return totalDisc;
        const itemTotal = item.price * item.qty;
        const disc = d.mode === "flat" ? Math.min(d.value, itemTotal) : Math.round(itemTotal * (d.value / 100));
        return totalDisc + disc;
      }, 0)
        : 0;
  const total = sub - da;

  const toggleCart = (service, category) => {
    const dbSvc = getServiceData(service, category);
    const newItem = { service, category, price: dbSvc.price || 0, qty: 1, stylist: "", id: Date.now() + Math.random(), included_services: dbSvc.included_services || [] };
    const newCart = [...cart, newItem];
    const patch = { cart: newCart };
    if (cart.length === 0 && custName) patch.collapsed = true;
    updTab(patch);
  };
  const removeOneFromCart = (service, category) => {
    const matches = cart.filter(i => i.service === service && i.category === category);
    if (!matches.length) return;
    const lastId = matches[matches.length - 1].id;
    updTab({ cart: cart.filter(i => i.id !== lastId) });
  };
  const updStylist = (id, s) => updTab({ cart: cart.map(i => i.id === id ? { ...i, stylist: s } : i) });
  const updQty = (id, d) => updTab({ cart: cart.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i) });
  const remItem = id => updTab({ cart: cart.filter(i => i.id !== id) });
  const checkout = (overrideStylistCheck = false) => {
    if (!cart.length) return;

    // Check for missing stylists
    const missingStylists = cart.some(i => !i.stylist);
    if (missingStylists && overrideStylistCheck !== true) {
      setCheckoutAttempted(true);
      setStylistWarningOpen(true);
      return;
    }

    // Reset attempt flag if we pass or override
    setCheckoutAttempted(false);
    setCheckoutLoading(true);

    const stylistSummary = [...new Set(cart.map(i => i.stylist || "Unassigned"))].join(", ");

    // For "item" mode, we aggregate the discounts into the cart items saved to DB
    const processedCart = cart.map(item => {
      const d = itemDiscounts[item.id];
      if (discMode === "item" && d && d.value > 0) {
        return { ...item, discountMode: d.mode, discountValue: d.value };
      }
      return item;
    });

    const txn = {
      tab_name: custName || "Walk-in",
      cust_name: custName || "Walk-in",
      cust_phone: custPhone || "",
      staff_name: stylistSummary,
      pay_mode: payMode,
      cart: processedCart,
      total,
      disc_mode: discMode,
      disc_pct: discMode === "pct" ? discPct : 0,
      disc_flat: discMode === "flat" ? discFlat : 0,
      disc_reason: discReason || "",
      disc_courtesy_by: discCourtesyBy || "",
      note: note || "",
      split_cash: splitCash || 0,
      split_other_mode: splitOtherMode || "ONLINE",
      split_other_amt: splitOtherAmt || 0,
    };

    // Post to backend
    fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(txn)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.error || err.message || "Unknown server error"); });
        }
        return res.json();
      })
      .then(rawTxn => {
        const savedTxn = normalizeTxn(rawTxn);
        const calcSubtotal = (savedTxn.cart || []).reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
        const slipData = { ...savedTxn, subtotal: calcSubtotal };
        setTransactions(prev => [savedTxn, ...prev]);
        setCheckoutLoading(false);
        setDoneSlip(slipData);
        updTab({ staffSlipPrinted: false });
        doCloseTab(activeTab, false);
      })
      .catch(err => {
        setCheckoutLoading(false);
        devLog('Checkout error:', err);
        showToast(`Save Error: ${err.message}`, "error");
      });
  };

  const printHTML = (html) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;opacity:0;';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
    setTimeout(() => {
      try { iframe.contentWindow.focus(); iframe.contentWindow.print(); } catch(e) {}
      setTimeout(() => { try { document.body.removeChild(iframe); } catch(e) {} }, 2000);
    }, 500);
  };

  // ── Reprint any saved transaction receipt ────────────────────────────────────
  const printReceipt = (s, isReprint = false) => {
    printHTML(`<!DOCTYPE html><html><head>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'Outfit',sans-serif;padding:6px;color:#000;background:#fff;font-size:13px;line-height:1.5;width:75mm;}
      .center{text-align:center;}
      .logo{font-family:'Playfair Display',serif;font-size:26px;font-weight:400;letter-spacing:0.5px;margin-bottom:4px;color:#000;}
      .sub{font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;font-weight:400;color:#000;}
      .header-info{font-size:12px;color:#000;margin-bottom:14px;text-align:center;}
      .header-line{margin-bottom:3px;font-weight:400;color:#000;}
      .cust-name{font-weight:400;text-transform:uppercase;letter-spacing:0.5px;color:#000;}
      .divider{border:none;border-top:1.5px solid #000;margin:10px 0;}
      .tbl-head{display:flex;justify-content:space-between;font-weight:400;margin-bottom:8px;font-size:12px;border-bottom:1.5px solid #000;padding-bottom:6px;}
      .svc-row{display:flex;justify-content:space-between;margin-bottom:10px;align-items:flex-start;font-size:12px;}
      .svc-info{flex:1;padding-right:8px;}
      .svc-name{font-weight:400;color:#000;}
      .svc-stylist{font-size:11px;color:#000;margin-top:2px;font-weight:400;}
      .svc-qty{width:30px;text-align:center;font-weight:400;color:#000;}
      .svc-amt{width:75px;text-align:right;font-weight:400;color:#000;}
      .disc-line{font-size:11px;color:#000;font-weight:400;margin-top:2px;}
      .summary{padding:0 2px;margin-bottom:16px;}
      .sum-row{display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px;font-weight:400;color:#000;}
      .total-row{display:flex;justify-content:space-between;font-size:15px;font-weight:400;margin-top:10px;padding-top:10px;border-top:2px solid #000;align-items:center;color:#000;}
      .footer{text-align:center;font-size:11px;color:#000;margin-top:18px;border-top:1px dashed #000;padding-top:12px;font-weight:400;}
      .stars{font-size:14px;letter-spacing:4px;}
      .reprint-badge{text-align:center;font-size:10px;color:#000;font-weight:400;margin-bottom:10px;border:1px solid #000;padding:3px 8px;display:inline-block;}
      @page{size:79mm auto;margin:2mm;}
      @media print{body{padding:4px;width:75mm;}}
    </style>
    </head><body>
      <div class="center">
        <img src="${NOORKADA_LOGO}" style="max-height:60px;max-width:150px;margin:0 auto 8px;display:block;object-fit:contain;" />
        <div class="sub">Noor Kada</div>
        ${isReprint ? `<div style="margin-bottom:8px;"><span class="reprint-badge">** REPRINT **</span></div>` : ""}
        <div class="header-info">
          <div class="header-line">Receipt #: ${esc(s.slip)}</div>
          <div class="header-line">Date: ${esc(s.date)} | Time: ${esc(s.time || "")}</div>
          <div class="header-line">Customer: <span class="cust-name">${esc(s.customerName || 'Walk-in')}</span></div>
          <div class="header-line">Payment: ${esc(s.payMode || 'CASH')}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="tbl-head">
        <div style="flex:1;">Service / Stylist</div>
        <div style="width:30px;text-align:center;">Qty</div>
        <div style="width:75px;text-align:right;">Amount</div>
      </div>
      ${(s.cart || []).map(item => `
        <div class="svc-row">
          <div class="svc-info">
            <div class="svc-name">${esc(item.service)}</div>
            <div class="svc-stylist">Stylist: ${esc(item.stylist || "Unassigned")}</div>
            ${item.category === 'Deal' && item.included_services?.length > 0 ? `<div style="font-size:10px;color:#000;font-weight:400;margin-top:2px;">${item.included_services.join(', ')}</div>` : ""}
          </div>
          <div class="svc-qty">${item.qty}</div>
          <div class="svc-amt">
            PKR ${(item.price * item.qty).toLocaleString("en-PK")}
            ${item.discountValue > 0 ? `<div class="disc-line">-${item.discountMode === 'pct' ? `${item.discountValue}%` : `PKR ${item.discountValue}`}</div>` : ""}
          </div>
        </div>`).join("")}
      <div class="divider"></div>
      <div class="summary">
        <div class="sum-row"><span>Subtotal</span><span>PKR ${(s.subtotal || (s.cart||[]).reduce((a,i)=>a+(i.price||0)*(i.qty||1),0)).toLocaleString("en-PK")}</span></div>
        ${s.discountAmt > 0 ? `<div class="sum-row"><span>Discount ${(() => { const pct = s.discPct || s.discount || 0; const parts = []; if (s.discReason) parts.push(s.discReason); if (s.discMode === 'pct' && pct > 0) parts.push(pct + '%'); return parts.length ? '(' + parts.join(' · ') + ')' : ''; })()}</span><span>-PKR ${s.discountAmt.toLocaleString("en-PK")}</span></div>${s.discCourtesyBy ? `<div class="sum-row" style="font-size:11px;color:#000;font-style:italic;margin-top:-4px;"><span>Courtesy by: ${esc(s.discCourtesyBy)}</span><span></span></div>` : ""}` : ""}
        <div class="total-row">
          <span>Total Amount</span>
          <span>PKR ${s.total.toLocaleString("en-PK")}</span>
        </div>
      </div>
      <div class="footer">
        Thank you for choosing Noorkada!<br/>
        We look forward to seeing you again.<br/>
        <span class="stars">★ ★ ★ ★ ★</span>
      </div>
    </body></html>`);
  };

  const printStaffSlip = () => {
    if (!cart.length) return;
    const s = {
      customerName: custName || "Walk-in",
      date: todayStr(),
      time: new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }),
      cart: cart,
      note: note,
      total: total,
      slip: tab.id ? `ORDER-${tab.id.toString().slice(-4)}` : "ORDER-NEW"
    };
    printHTML(`<!DOCTYPE html><html><head>
      <title>Staff Slip - ${esc(s.customerName)}</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Outfit',sans-serif;padding:6px;color:#000;background:#fff;font-size:13px;line-height:1.5;width:75mm;}
        .center{text-align:center;}
        .header-tag{border:2px solid #000;padding:5px;font-size:11px;font-weight:400;letter-spacing:1.5px;margin-bottom:14px;text-align:center;text-transform:uppercase;color:#000;}
        .logo{font-family:'Playfair Display',serif;font-size:26px;font-weight:400;letter-spacing:0.5px;margin-bottom:4px;color:#000;}
        .sub{font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;font-weight:400;color:#000;}
        .divider{border:none;border-top:1.5px solid #000;margin:10px 0;}
        .row{display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px;}
        .row .lbl{font-weight:400;color:#000;}
        .row .val{font-weight:400;color:#000;text-align:right;}
        .svc-list{margin-top:12px;}
        .svc-item{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;border-bottom:1px dashed #000;padding-bottom:8px;}
        .svc-name{font-size:13px;font-weight:400;color:#000;flex:1;padding-right:10px;}
        .svc-stylist{font-size:12px;color:#000;font-weight:400;text-align:right;flex-shrink:0;}
        .footer{text-align:center;font-size:11px;color:#000;margin-top:20px;border-top:1px dashed #000;padding-top:12px;font-weight:400;}
        .stars{font-size:14px;letter-spacing:4px;}
        @page{size:79mm auto;margin:2mm;}
        @media print{body{padding:4px;width:75mm;}}
      </style>
    </head><body>
      <div class="header-tag">Staff Service Slip</div>
      <div class="center">
        <img src="${NOORKADA_LOGO}" style="max-height:55px;max-width:140px;margin:0 auto 8px;display:block;object-fit:contain;" />
        <div class="sub">Noor Kada</div>
      </div>
      <div class="divider"></div>
      <div class="row"><span class="lbl">Order #</span><span class="val">${esc(s.slip)}</span></div>
      <div class="row"><span class="lbl">Customer</span><span class="val">${esc(s.customerName)}</span></div>
      <div class="row"><span class="lbl">Date &amp; Time</span><span class="val">${esc(s.date)} ${esc(s.time)}</span></div>
      <div class="divider"></div>
      <div class="svc-list">
        ${s.cart.map(item => `
          <div class="svc-item">
            <div class="svc-name">${esc(item.service)}${item.qty > 1 ? ` (x${item.qty})` : ""}</div>
            <div class="svc-stylist">${item.stylist ? `Stylist: ${esc(item.stylist)}` : "No Staff"}</div>
          </div>`).join("")}
      </div>
      ${s.note ? `<div style="margin-top:12px;padding:8px;border:1px solid #000;font-size:11px;font-weight:700;color:#000;"><strong>Customer Note:</strong><br/>${esc(s.note)}</div>` : ""}
      <div class="footer">
        Thank you for choosing Noorkada!<br/>
        We look forward to seeing you again.<br/>
        <span class="stars">★ ★ ★ ★ ★</span>
      </div>
    </body></html>`);
    updTab({ staffSlipPrinted: true });
  };
  const clients = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const phone = (t.customerPhone || "").trim().replace(/\s+/g, "");
      const name = (t.customerName || "Walk-in").trim();
      // Group by phone number if available, otherwise by name
      const key = phone ? `phone:${phone}` : `name:${name.toLowerCase()}`;
      if (!map[key]) map[key] = { key, name, phone, visits: [], spend: 0, services: {} };
      // Always update to the most recent non-Walk-in name for this phone
      if (phone && name && name.toLowerCase() !== "walk-in") map[key].name = name;
      if (phone && !map[key].phone) map[key].phone = phone;
      map[key].visits.push(t);
      map[key].spend += t.total;
      (t.cart || []).forEach(s => { map[key].services[s.service] = (map[key].services[s.service] || 0) + (s.qty || 1); });
    });
    return Object.values(map)
      .map(cl => ({
        ...cl,
        visits: cl.visits.sort((a, b) => b.date.localeCompare(a.date)),
        avg: Math.round(cl.spend / cl.visits.length),
        topSvcs: Object.entries(cl.services).sort((a, b) => b[1] - a[1]).slice(0, 3),
        lastVisit: cl.visits[0]?.date || "",
        tier: cl.visits.length >= 20 ? "💎 Diamond" : cl.visits.length >= 10 ? "🥇 Gold" : cl.visits.length >= 5 ? "🥈 Silver" : "🌱 New",
        tierColor: cl.visits.length >= 20 ? "#0E7490" : cl.visits.length >= 10 ? "#B08040" : cl.visits.length >= 5 ? "#6B7280" : "#1A6B4A",
      }))
      .sort((a, b) => b.visits.length - a.visits.length);
  }, [transactions]);

  const filteredClients = useMemo(() => {
    let res = clients;
    if (clientQ.trim()) {
      const q = clientQ.trim().toLowerCase();
      res = res.filter(cl => cl.name.toLowerCase().includes(q) || (cl.phone || "").includes(q));
    }
    if (tierFilter) res = res.filter(cl => cl.tier.includes(tierFilter));
    return res;
  }, [clients, clientQ, tierFilter]);

  const [expandedClient, setExpandedClient] = useState(null);

  const histTxns = useMemo(() => {
    let t = transactions;
    // Period filter
    if (hFrom || hTo) t = t.filter(x => (!hFrom || x.date >= hFrom) && (!hTo || x.date <= hTo));
    else if (hRange && hRange !== "all") { const days = hRange === "today" ? 1 : hRange === "7d" ? 7 : hRange === "30d" ? 30 : 90; const cut = new Date(); cut.setDate(cut.getDate() - days); t = t.filter(x => new Date(x.date) >= cut); }
    // Other filters
    const q = hQ.toLowerCase();
    return t.filter(x =>
      (!q || x.customerName.toLowerCase().includes(q) || x.slip.toLowerCase().includes(q) || (x.customerPhone || "").includes(q)) &&
      (!hDate || x.date === hDate) &&
      (!hSty || (Array.isArray(x.cart) && x.cart.some(c => (c.stylist || "Unassigned") === hSty)) || (x.stylist || "").split(',').map(s => s.trim()).includes(hSty)) &&
      (!hCat || x.cart.some(c => c.category === hCat)) &&
      (!hPay || x.payMode === hPay)
    );
  }, [transactions, hQ, hDate, hSty, hCat, hPay, hRange, hFrom, hTo]);
  const fMetric = "revenue";
  const resetF = () => { setDashRange("30d"); setDashCFrom(""); setDashCTo(""); setFStylist(""); setFCat(""); setFPay(""); };
  const hasF = fStylist || fCat || fPay || dashCFrom || dashCTo;

  const exportCSV = () => {
    const label = fMetric === "revenue" ? "Revenue (PKR)" : fMetric === "visits" ? "Visits" : fMetric === "avg" ? "Avg Ticket (PKR)" : "Discount (PKR)";
    const periodStr = dashCFrom ? `${dashCFrom} to ${dashCTo || "today"}` : dashRange;
    const filename = `Noorkada_${fMetric}_${periodStr}${fStylist ? "_" + fStylist : ""}${fCat ? "_" + fCat : ""}${fPay ? "_" + fPay : ""}.csv`;
    const rows = [
      ["Noorkada Analytics Export"],
      ["Period", periodStr],
      fStylist ? ["Staff", fStylist] : ["Staff", "All"],
      fCat ? ["Category", fCat] : ["Category", "All"],
      fPay ? ["Payment", fPay] : ["Payment", "All"],
      ["Metric", label],
      ["Generated", new Date().toLocaleString("en-PK")],
      [],
      ["Slip", "Date", "Time", "Customer", "Phone", "Staff", "Payment", "Services", "Subtotal", "Discount", "Total", label]
    ];
    ranged.forEach(t => {
      const metricVal = fMetric === "revenue" ? t.total : fMetric === "visits" ? 1 : fMetric === "avg" ? t.total : fMetric === "discount" ? t.discountAmt || 0 : t.total;
      rows.push([
        t.slip, t.date, t.time || "",
        `"${t.customerName}"`,
        t.customerPhone || "",
        `"${t.stylist}"`,
        t.payMode,
        `"${t.cart.map(i => i.service + (i.qty > 1 ? ` x${i.qty}` : ``)).join(", ")}"`,
        t.subtotal, t.discountAmt || 0, t.total, metricVal
      ]);
    });
    // Summary at bottom
    const totRev = ranged.reduce((s, t) => s + t.total, 0);
    const totDisc = ranged.reduce((s, t) => s + (t.discountAmt || 0), 0);
    const avgTicket = ranged.length ? Math.round(totRev / ranged.length) : 0;
    rows.push([]);
    rows.push(["SUMMARY"]);
    rows.push(["Total Transactions", ranged.length]);
    rows.push(["Total Revenue", totRev]);
    rows.push(["Total Discounts", totDisc]);
    rows.push(["Average Ticket", avgTicket]);
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };
  const exportHistCSV = () => {
    const filename = `Noorkada_History${hSty ? "_" + hSty : ""}${hCat ? "_" + hCat : ""}${hPay ? "_" + hPay : ""}${hRange !== "all" ? "_" + hRange : ""}.csv`;
    const rows = [
      ["Noorkada Transaction History Export"],
      ["Generated", new Date().toLocaleString("en-PK")],
      ["Total Records", histTxns.length],
      ["Total Revenue", histTxns.reduce((s, t) => s + t.total, 0)],
      ["Total Discounts", histTxns.reduce((s, t) => s + (t.discountAmt || 0), 0)],
      [],
      ["Slip", "Date", "Time", "Customer", "Phone", "Staff", "Payment", "Services", "Subtotal", "Discount", "Total"]
    ];
    histTxns.forEach(t => {
      rows.push([
        t.slip, t.date, t.time || "",
        `"${t.customerName}"`, t.customerPhone || "",
        `"${t.stylist}"`, t.payMode,
        `"${t.cart.map(i => i.service + (i.qty > 1 ? ` x${i.qty}` : ``)).join(", ")}"`,
        t.subtotal, t.discountAmt || 0, t.total
      ]);
    });
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };

  // const getCatColor removed (already defined at top of NoorKadaPOS)

  const now = new Date();

  React.useEffect(() => {
    const handler = (e) => {
      if (e.key !== "Escape") return;
      // Priority order: innermost/most recent modal first
      if (stylistWarningOpen) { setStylistWarningOpen(false); return; }
      if (confirmClose) { setConfirmClose(false); return; }
      if (delCatConfirmId) { setDelCatConfirmId(null); return; }
      if (delSvcConfirmId) { setDelSvcConfirmId(null); return; }
      if (delStylistConfirmId) { setDelStylistConfirmId(null); return; }
      if (delUserConfirmId) { setDelUserConfirmId(null); return; }
      if (showCatLabelModal) { setShowCatLabelModal(false); return; }
      if (showAddModal) { setShowAddModal(false); return; }
      if (staffSlipPreview) { setStaffSlipPreview(null); return; }
      if (viewingStaffSummary) { setViewingStaffSummary(null); return; }
      if (viewingAmendment) { setViewingAmendment(null); return; }
      if (editingBill) { closeEditBill(); return; }
      if (doneSlip) { setDoneSlip(null); return; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [doneSlip, showAddModal, stylistWarningOpen, confirmClose, delCatConfirmId, delSvcConfirmId, delStylistConfirmId, delUserConfirmId, showCatLabelModal, staffSlipPreview, viewingAmendment, editingBill, viewingStaffSummary]);

  return (
    <div style={{ fontFamily: "'Outfit','Helvetica Neue',sans-serif", background: "#FDFAF6", minHeight: "100vh", color: "#2A2118" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:#F5F0E8;}
        ::-webkit-scrollbar-thumb{background:#D4C4A8;border-radius:4px;}
        input,select{outline:none;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
        input[type=number]{-moz-appearance:textfield;}
        .fade{animation:fi .28s ease both;}
        @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .inp{font-family:'Outfit',sans-serif;font-size:13px;background:#FFF;border:1.5px solid #E8E0D4;border-radius:8px;color:#2A2118;padding:9px 13px;width:100%;transition:border-color .2s;}
        .inp:focus{border-color:#B08040;}
        .inp::placeholder{color:#C4B9AB;}
        select.inp option{background:#FFF;color:#2A2118;}
        .card{background:#FFFFFF;border:1px solid #EDE6D8;border-radius:14px;padding:20px;box-shadow:0 1px 6px rgba(44,33,24,.05);}
        .card-sm{background:#FFFFFF;border:1px solid #EDE6D8;border-radius:12px;padding:16px;box-shadow:0 1px 4px rgba(44,33,24,.04);}
        .svc-btn{font-family:'Outfit',sans-serif;font-size:13px;font-weight:400;padding:13px 14px;border-radius:11px;cursor:pointer;border:1.5px solid #EDE6D8;background:#FFFFFF;color:#3D3028;text-align:left;transition:all .18s;position:relative;line-height:1.3;box-shadow:0 1px 4px rgba(44,33,24,.05);}
        .svc-btn:hover{border-color:#C4A870;box-shadow:0 5px 18px rgba(176,128,64,.18);transform:translateY(-2px);background:#FFFDF9;}
        .svc-btn.sel{color:#FFF;border-color:transparent;box-shadow:0 6px 24px rgba(0,0,0,.18);transform:translateY(-1px);}
        .cat-pill{font-family:'Outfit',sans-serif;font-size:12px;font-weight:400;padding:7px 15px;border-radius:100px;cursor:pointer;border:1.5px solid #E8E0D4;background:transparent;color:#9A9088;white-space:nowrap;transition:all .18s;letter-spacing:.2px;}
        .cat-pill:hover{border-color:#C4A870;color:#6B5030;background:#FBF6EE;}
        .cat-pill.on{font-weight:400;}
        .nav-tab{font-family:'Outfit',sans-serif;font-size:12px;font-weight:400;letter-spacing:1.5px;text-transform:uppercase;padding:8px 18px;border-radius:7px;cursor:pointer;border:none;transition:all .2s;}
        .nav-tab.on{background:#2A2118;color:#FDFAF6;}
        .nav-tab.off{background:transparent;color:#9A9088;}
        .nav-tab.off:hover{color:#2A2118;}
        .rbtn{font-family:'Outfit',sans-serif;font-size:12px;font-weight:400;letter-spacing:.3px;padding:5px 11px;border-radius:6px;cursor:pointer;border:1.5px solid #E8E0D4;background:transparent;color:#9A9088;transition:all .18s;}
        .rbtn.on{background:#2A2118;color:#FDFAF6;border-color:#2A2118;}
        .rbtn:hover:not(.on){border-color:#C4A870;color:#6B5030;}
        .tbtn{font-family:'Outfit',sans-serif;font-size:12px;font-weight:400;padding:7px 16px;border-radius:100px;cursor:pointer;border:1.5px solid #E8E0D4;background:transparent;color:#9A9088;transition:all .18s;letter-spacing:.2px;}
        .tbtn.on{background:#2A2118;color:#FDFAF6;border-color:#2A2118;}
        .tbtn:hover:not(.on){border-color:#C4A870;color:#6B5030;}
        .btn-gold{font-family:'Outfit',sans-serif;font-size:13px;font-weight:400;background:linear-gradient(135deg,#2A2118,#4A3828);color:#F5E6C8;border:none;border-radius:11px;padding:14px;cursor:pointer;width:100%;transition:all .22s;letter-spacing:.4px;box-shadow:0 4px 14px rgba(42,33,24,.25);}
        .btn-gold:hover{background:linear-gradient(135deg,#3A3028,#5A4838);box-shadow:0 6px 20px rgba(42,33,24,.32);transform:translateY(-1px);}
        .btn-ghost{font-family:'Outfit',sans-serif;font-size:12px;font-weight:400;background:transparent;color:#9A9088;border:1.5px solid #E8E0D4;border-radius:11px;padding:10px;cursor:pointer;width:100%;transition:all .2s;}
        .btn-ghost:hover{border-color:#C4A870;color:#6B5030;background:#FFFDF9;}
        .qty-btn{width:26px;height:26px;border-radius:50%;border:1.5px solid #E8E0D4;background:#FFF;color:#6B5030;font-size:15px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;line-height:1;flex-shrink:0;}
        .qty-btn:hover{border-color:#B08040;background:#FBF6EE;}
        .badge{display:inline-block;font-family:'Outfit',sans-serif;font-size:10px;font-weight:400;padding:2px 9px;border-radius:100px;letter-spacing:.3px;}
        .hrow{transition:all .18s;cursor:default;}
        .hrow:hover{border-color:#C4A870!important;box-shadow:0 3px 16px rgba(176,128,64,.12)!important;}
        .ovl{position:fixed;inset:0;background:rgba(42,33,24,.55);display:flex;align-items:center;justify-content:center;z-index:999;backdrop-filter:blur(10px);animation:fi .2s;}
        .divhr{height:1px;background:#EDE6D8;margin:12px 0;}
        .catstrip{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;}
        .catstrip::-webkit-scrollbar{display:none;}
        .filter-label{font-family:'Outfit',sans-serif;font-size:11px;color:#9A9088;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;}

        /* Analytics Responsive */
        @media(max-width:768px){
          .analytics-container { padding: 16px 14px!important; }
          .analytics-filter-bar { padding: 12px 14px!important; }
          .filter-row { display: flex!important; flex-direction: column!important; gap: 8px!important; align-items: stretch!important; margin-bottom: 12px!important; }
          .filter-label { margin-bottom: 3px!important; font-size: 10px!important; color: #B08040!important; font-weight: 700!important; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr)!important; gap: 8px!important; }
          .dash-grid-2-1 { grid-template-columns: 1fr!important; gap: 12px!important; }
          .dash-grid-2 { grid-template-columns: 1fr!important; gap: 12px!important; }
          .dash-grid-auto { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr))!important; }
          .filter-row > div { flex: none!important; width: 100%!important; }
          .filter-row > div > input.inp, .filter-row > div > select.inp { width: 100%!important; height: 38px!important; }
        }
      `}</style>

      {/* ══ TOPBAR ══════════════════════════════════════════════════════════ */}
      <header style={{ background: "#FFFFFF", borderBottom: "1px solid #EDE6D8", minHeight: 64, display: "flex", alignItems: "center", padding: "0 16px", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(44,33,24,.07)", gap: 8, flexWrap: "nowrap", overflow: "hidden" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "8px", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            <img src={NOORKADA_LOGO} alt="Noorkada Logo" style={{ width: "auto", height: "100%", maxWidth: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ maxWidth: 180, flex: "0 0 180px", overflow: "hidden" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: "#2A2118", lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{salonName.split(' ')[0] || salonName}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#C4A870", letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 400, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{salonName.split(' ').slice(1).join(' ') || "Noor Kada"}</div>
          </div>
        </div>

        {/* Nav (Desktop) */}
        <div className="nav-tabs-container" style={{ display: "flex", gap: 2, background: "#F5F0E8", padding: "4px", borderRadius: "100px" }}>
          {[
            ["pos", "🛒", "POS"],
            hasNavAccess(user.role, 'dashboard') && ["dashboard", "📊", "Analytics"],
            hasNavAccess(user.role, 'history')   && ["history", "📋", "History"],
            hasNavAccess(user.role, 'settings')  && ["settings", "🛡️", "Dashboard"]
          ].filter(Boolean).map(([v, ic, l]) => (
            <button key={v} className={`nav-tab ${view === v ? "on" : "off"}`} onClick={() => setView(v)}>
              <span style={{ marginRight: 6, fontSize: 13 }}>{ic}</span>{l}
            </button>
          ))}
        </div>

        {/* Hamburger Toggle (Mobile) */}
        <button className="hamburger-btn" onClick={() => setMobileMenuOpen(true)} style={{ display: "none" }}>
          ☰
        </button>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <>
            <div className="mobile-nav-dimmer" onClick={() => setMobileMenuOpen(false)} />
            <div className="mobile-nav-overlay">
              <div className="mobile-nav-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="user-avatar-bubble">
                      {user.username ? user.username[0].toUpperCase() : 'A'}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#2A2118", lineHeight: 1.2 }}>{user.full_name || user.username}</div>
                      <div style={{ fontSize: 11, color: "#B08040", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{user.role}</div>
                    </div>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", fontSize: 24, padding: 4, cursor: "pointer", color: "#9A9088" }}>×</button>
                </div>

                {/* Stats Section replacing old username/role */}
                <div style={{ textAlign: "left", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "#C4A870", textTransform: "uppercase", letterSpacing: 1, fontWeight: 800, display: "block", marginBottom: 2 }}>{user.full_name || user.username}</span>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#2A2118", display: "flex", alignItems: "center", gap: 8 }}>
                    {now.toLocaleDateString("en-PK", { weekday: "long", day: "numeric", month: "long" })}
                  </div>
                  {hasNavAccess(user.role, 'dashboard') && (
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#9A9088", marginTop: 2 }}>
                      <span style={{ color: "#B08040", fontWeight: 600 }}>{S.todayC}</span> guests today
                      <span style={{ margin: "0 6px", color: "#D4C4A8" }}>·</span>
                      <span style={{ color: "#B08040", fontWeight: 600 }}>{fmt(S.todayR, true)}</span> revenue
                    </div>
                  )}
                </div>
              </div>

              <div className="mobile-nav-list">
                {[
                  ["pos", "🛒", "POS"],
                  hasNavAccess(user.role, 'dashboard') && ["dashboard", "📊", "Analytics"],
                  hasNavAccess(user.role, 'history')   && ["history", "📋", "History"],
                  hasNavAccess(user.role, 'settings')  && ["settings", "🛡️", "Dashboard"]
                ].filter(Boolean).map(([v, ic, l]) => (
                  <button
                    key={v}
                    className={`mobile-nav-item ${view === v ? "active" : ""}`}
                    onClick={() => { setView(v); setMobileMenuOpen(false); }}
                  >
                    <span>{ic}</span>
                    {l}
                  </button>
                ))}
              </div>

              <div className="mobile-nav-footer">
                <button
                  onClick={onLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1.5px solid #F5E8E8",
                    background: "#FFF5F5",
                    color: "#A0303F",
                    fontSize: "16px",
                    fontWeight: 700,
                    fontFamily: "'Outfit', sans-serif",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ fontSize: 20 }}>🚪</span> Logout
                </button>
              </div>
            </div>
          </>
        )}

        {/* User stats (Desktop) */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, flex: "0 0 auto", maxWidth: "100%", overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", lineHeight: 1.2, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#2A2118", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>{user.full_name || user.username}</span>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 500, color: "#9A9088", whiteSpace: "nowrap" }}>
              {now.toLocaleDateString("en-PK", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            {ROLE_RANK[user.role] >= 3 && (
              <div className="header-stats" style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#9A9088", whiteSpace: "nowrap" }}>
                <span style={{ color: "#B08040", fontWeight: 600 }}>{S.todayC}</span> guests today
                <span style={{ margin: "0 4px", color: "#D4C4A8" }}>·</span>
                <span style={{ color: "#B08040", fontWeight: 600 }}>{fmt(S.todayR, true)}</span> revenue
              </div>
            )}
          </div>
          <button onClick={onLogout} style={{
            background: "transparent", border: "1.5px solid #E8E0D4", borderRadius: "100px", padding: "6px 14px",
            fontSize: 11, fontWeight: 600, color: "#9A9088", cursor: "pointer", transition: "all .2s", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap", flexShrink: 0
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#A0303F"; e.currentTarget.style.color = "#A0303F"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E0D4"; e.currentTarget.style.color = "#9A9088"; }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ══ POS VIEW ════════════════════════════════════════════════════════ */}
      {view === "pos" && (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", overflow: "hidden" }} className="fade">

          {/* ── Client Tab Bar ── */}
          <div style={{
            display: "flex", alignItems: "center", background: "#FFFFFF", borderBottom: "1px solid #EDE6D8",
            padding: "0 14px", gap: 1, height: 48, overflowX: "auto", flexShrink: 0
          }} className="catstrip">
            {tabs.map((t, i) => {
              const active = i === activeTab, hasItems = t.cart.length > 0;
              return (
                <div key={t.id} onClick={() => setActiveTab(i)} style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "0 10px 0 10px", height: "100%",
                  cursor: "pointer", borderBottom: active ? "2.5px solid #B08040" : "2.5px solid transparent",
                  color: active ? "#2A2118" : "#9A9088", transition: "all .15s", flexShrink: 0, userSelect: "none"
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: active ? "#2A2118" : hasItems ? "#C4A870" : "#EDE6D8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: active ? "#F5E6C8" : hasItems ? "#FFF" : "#B8AFA5"
                  }}>
                    {t.custName ? t.custName[0].toUpperCase() : (i + 1)}
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: active ? 600 : 400, whiteSpace: "nowrap",
                    maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis"
                  }}>
                    {t.custName || t.label}
                  </span>
                  {hasItems && <span style={{
                    background: active ? "#B08040" : "#C4B9AB", color: "#FFF",
                    borderRadius: "100px", fontSize: 9, fontWeight: 700, padding: "1px 6px"
                  }}>{t.cart.length}</span>}
                  <button onClick={e => closeTab(i, e)} style={{
                    color: "#D4C4B0", fontSize: 14, background: "none", border: "none",
                    cursor: "pointer", padding: "0 2px", lineHeight: 1, marginLeft: 1
                  }}>×</button>
                </div>
              );
            })}
            <button onClick={addTab} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "0 14px", height: "100%",
              background: "none", border: "none", cursor: "pointer", color: "#B8AFA5",
              fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 500, flexShrink: 0,
              whiteSpace: "nowrap", borderBottom: "2.5px solid transparent", transition: "color .15s"
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#B08040"}
              onMouseLeave={e => e.currentTarget.style.color = "#B8AFA5"}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>&nbsp;New Client
            </button>
          </div>

          {/* ── POS Main ── */}
          {tabs.length === 0 ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: "#9A9088" }}>
              <div style={{ fontSize: 48, opacity: 0.3 }}>🛒</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 600 }}>No Active Client</div>
              <div style={{ fontSize: 13 }}>Click <strong>+ New Client</strong> above to start a billing session</div>
              <button onClick={addTab} className="btn-gold" style={{ width: "auto", padding: "10px 24px", marginTop: 8, borderRadius: 10 }}>+ New Client</button>
            </div>
          ) : (
            <div className="pos-main" style={{ display: "flex", flex: 1, overflow: "hidden" }}>

              {/* Left – service picker */}
              <div className="svc-picker-container" style={{ flex: isMobile && !cartCollapsed ? "0 0 35%" : 1, display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid #EDE6D8" }}>

                {/* Customer info bar (Collapsible on Mobile) */}
                <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EDE6D8" }}>
                  {(isMobile && collapsed) ? (
                    <div
                      className="client-summary-row"
                      onClick={() => isMobile && setCollapsed(false)}
                      style={{
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        background: "#FDFAF6"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#2A2118", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ opacity: 0.6 }}>👤</span> {custName || "Walk-in"}
                        </div>
                        {custPhone && (
                          <div style={{ fontSize: 12, color: "#9A9088", display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ opacity: 0.6 }}>📞</span> {custPhone}
                          </div>
                        )}
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#B08040", background: "#F5F0E8", padding: "2px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                          {payMode === 'CASH' ? '💵 Cash' : payMode === 'ONLINE' ? '📱 Online' : payMode === 'CARD' ? '💳 Card' : '🔀 Split'}
                        </div>
                      </div>
                      <button
                        style={{ background: "none", border: "none", color: "#B08040", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "4px 8px" }}
                        onClick={(e) => { e.stopPropagation(); isMobile && setCollapsed(false); }}
                      >
                        Edit ✎
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: "10px 14px", display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", position: "relative" }}>
                      <input className="inp" placeholder="👤  Name" value={custName}
                        onChange={e => setCustName(e.target.value)} style={{ flex: "1 1 160px" }} />
                      <input className="inp" placeholder="📞  Phone" value={custPhone}
                        onChange={e => setCustPhone(e.target.value)} style={{ flex: "1 1 130px" }} />
                      <select className="inp" value={payMode} onChange={e => setPayMode(e.target.value)} style={{ flex: "0 0 140px" }}>
                        <option value="CASH">💵  Cash</option>
                        <option value="ONLINE">📱  Online</option>
                        <option value="CARD">💳  Card</option>
                        <option value="SPLIT">🔀  Split</option>
                      </select>
                      {isMobile && cart.length > 0 && (
                        <button
                          onClick={() => setCollapsed(true)}
                          style={{
                            background: "#F5F0E8", border: "none", borderRadius: "8px", padding: "4px 10px",
                            display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                            color: "#B08040", fontSize: 12, fontWeight: 700, fontFamily: "'Outfit', sans-serif"
                          }}
                          title="Collapse"
                        >
                          Hide ▴
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Search bar */}
                <div style={{ padding: "10px 14px 0", background: "#FDFAF6" }}>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: 0.35, pointerEvents: "none" }}>🔍</span>
                    <input
                      className="inp"
                      placeholder="Search services..."
                      value={svcSearch}
                      onChange={e => setSvcSearch(e.target.value)}
                      style={{ width: "100%", paddingLeft: 34, boxSizing: "border-box", fontSize: 13, height: 38, borderRadius: 10 }}
                    />
                    {svcSearch && (
                      <button onClick={() => setSvcSearch("")} style={{
                        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                        width: 20, height: 20, borderRadius: "50%", background: "#E8E0D4",
                        border: "none", cursor: "pointer", fontSize: 11, color: "#7A6858", lineHeight: 1,
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>✕</button>
                    )}
                  </div>
                </div>

                {/* Category strip */}
                <div style={{ padding: "8px 14px 10px", background: "#FDFAF6", borderBottom: "1px solid #EDE6D8" }}>
                  <div className="catstrip">
                    {[["All", "🌟", "#B08040"], ...Object.entries(SERVICES).map(([cat, { icon, color }]) => [cat, icon, color])].map(([cat, icon, color]) => {
                      const on = activeCat === cat;
                      return (
                        <button key={cat} className={`cat-pill ${on ? "on" : ""}`}
                          style={on ? { color, borderColor: color, background: `${color}12` } : {}}
                          onClick={() => setActiveCat(cat)}>
                          <span style={{ marginRight: 4 }}>{icon}</span>{cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Services */}
                <div className="svc-grid-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 14px", background: "#FDFAF6" }}>
                  {svcSearch.trim()
                    ? (() => {
                        const q = svcSearch.trim().toLowerCase();
                        const results = dbServices.filter(s => s.name.toLowerCase().includes(q));
                        if (results.length === 0) return (
                          <div style={{ textAlign: "center", color: "#9A9088", padding: "48px 0", fontSize: 14 }}>
                            <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                            No services found for "<strong>{svcSearch}</strong>"
                          </div>
                        );
                        // Group results by category
                        const grouped = results.reduce((acc, s) => {
                          if (!acc[s.category]) acc[s.category] = [];
                          acc[s.category].push(s);
                          return acc;
                        }, {});
                        return (
                          <div>
                            <div style={{ fontSize: 12, color: "#9A9088", marginBottom: 14, fontWeight: 500 }}>
                              {results.length} result{results.length !== 1 ? "s" : ""} for "<strong style={{ color: "#B08040" }}>{svcSearch}</strong>"
                            </div>
                            {Object.entries(grouped).map(([cat, svcs]) => {
                              const catMeta = MOCK_CATEGORIES.find(c => c.name === cat) || { icon: "✦", color: "#B08040" };
                              return (
                                <div key={cat} style={{ marginBottom: 28 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${catMeta.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{catMeta.icon}</div>
                                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: "#2A2118" }}>{cat}</span>
                                    <div style={{ flex: 1, height: 1, background: "#EDE6D8" }} />
                                    <span style={{ fontSize: 11, color: "#C4B9AB", fontWeight: 500, background: "#F5F0E8", padding: "2px 8px", borderRadius: 6 }}>{svcs.length} match{svcs.length !== 1 ? "es" : ""}</span>
                                  </div>
                                  <div className="svc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(158px,1fr))", gap: 9 }}>
                                    {svcs.map(s => {
                                      const inCartCount = cart.filter(i => i.service === s.name && i.category === s.category).length; const inCart = inCartCount > 0;
                                      return (
                                        <div key={s.id} className={`svc-btn ${inCart ? "sel" : ""}`} role="button" tabIndex={0}
                                          style={inCart ? { background: catMeta.color } : {}} onClick={() => toggleCart(s.name, s.category)} onKeyDown={e => (e.key==='Enter'||e.key===' ') && toggleCart(s.name, s.category)}>
                                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 5, wordBreak: "break-word", overflowWrap: "anywhere", lineHeight: "1.25" }}>{s.name}</div>
                                          <div style={{ fontSize: 12, fontWeight: 600, color: inCart ? "rgba(255,255,255,.88)" : "#B08040" }}>{fmt(s.price)}</div>
                                          {inCart && (
                                            <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, background: "rgba(255,255,255,.15)", borderRadius: 8, padding: "3px 5px" }}>
                                              <button onClick={e => { e.stopPropagation(); removeOneFromCart(s.name, s.category); }} style={{ background: "rgba(255,255,255,.22)", border: "none", borderRadius: 6, width: 22, height: 22, color: "#FFF", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, fontWeight: 600 }}>−</button>
                                              <span style={{ fontSize: 13, fontWeight: 700, color: "#FFF", minWidth: 20, textAlign: "center" }}>{inCartCount}</span>
                                              <button onClick={e => { e.stopPropagation(); toggleCart(s.name, s.category); }} style={{ background: "rgba(255,255,255,.22)", border: "none", borderRadius: 6, width: 22, height: 22, color: "#FFF", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, fontWeight: 600 }}>+</button>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()
                    : activeCat === "All"
                    ? Object.entries(SERVICES).map(([cat, { icon, color, items }]) => (
                      <div key={cat} style={{ marginBottom: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{icon}</div>
                          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: "#2A2118" }}>{cat}</span>
                          <div style={{ flex: 1, height: 1, background: "#EDE6D8" }} />
                          <span style={{ fontSize: 11, color: "#C4B9AB", fontWeight: 500, background: "#F5F0E8", padding: "2px 8px", borderRadius: 6 }}>{items.length}</span>
                        </div>
                        <div className="svc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(158px,1fr))", gap: 9 }}>
                          {items.map(svc => {
                            const inCartCount = cart.filter(i => i.service === svc && i.category === cat).length; const inCart = inCartCount > 0;
                            return (
                              <div key={svc} className={`svc-btn ${inCart ? "sel" : ""}`} role="button" tabIndex={0}
                                style={inCart ? { background: color } : {}} onClick={() => toggleCart(svc, cat)} onKeyDown={e => (e.key==='Enter'||e.key===' ') && toggleCart(svc, cat)}>
                                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 5, wordBreak: "break-word", overflowWrap: "anywhere", lineHeight: "1.25" }}>{svc}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: inCart ? "rgba(255,255,255,.88)" : "#B08040" }}>{fmt(getServiceData(svc, cat).price || 0)}</div>
                                {inCart && (
                                  <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, background: "rgba(255,255,255,.15)", borderRadius: 8, padding: "3px 5px" }}>
                                    <button onClick={e => { e.stopPropagation(); removeOneFromCart(svc, cat); }} style={{ background: "rgba(255,255,255,.22)", border: "none", borderRadius: 6, width: 22, height: 22, color: "#FFF", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, fontWeight: 600 }}>−</button>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#FFF", minWidth: 20, textAlign: "center" }}>{inCartCount}</span>
                                    <button onClick={e => { e.stopPropagation(); toggleCart(svc, cat); }} style={{ background: "rgba(255,255,255,.22)", border: "none", borderRadius: 6, width: 22, height: 22, color: "#FFF", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, fontWeight: 600 }}>+</button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                    : (() => {
                      const { icon, color, items } = SERVICES[activeCat];
                      return (
                        <>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 12px", background: "#FFFFFF", borderRadius: 12, border: "1px solid #EDE6D8", boxShadow: "0 1px 4px rgba(44,33,24,.04)" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: "#2A2118" }}>{activeCat}</div>
                              <div style={{ fontSize: 11, color: "#C4B9AB", marginTop: 1 }}>{items.length} services available</div>
                            </div>
                          </div>
                          <div className="svc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(158px,1fr))", gap: 9 }}>
                            {items.map(svc => {
                              const inCartCount = cart.filter(i => i.service === svc && i.category === activeCat).length; const inCart = inCartCount > 0;
                              return (
                                <div key={svc} className={`svc-btn ${inCart ? "sel" : ""}`} role="button" tabIndex={0}
                                  style={inCart ? { background: color } : {}} onClick={() => toggleCart(svc, activeCat)} onKeyDown={e => (e.key==='Enter'||e.key===' ') && toggleCart(svc, activeCat)}>
                                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 5, wordBreak: "break-word", overflowWrap: "anywhere", lineHeight: "1.25" }}>{svc}</div>
                                  <div style={{ fontSize: 12, fontWeight: 600, color: inCart ? "rgba(255,255,255,.88)" : "#B08040" }}>{fmt(getServiceData(svc, activeCat).price || 0)}</div>
                                  {inCart && (
                                    <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, background: "rgba(255,255,255,.15)", borderRadius: 8, padding: "3px 5px" }}>
                                      <button onClick={e => { e.stopPropagation(); removeOneFromCart(svc, activeCat); }} style={{ background: "rgba(255,255,255,.22)", border: "none", borderRadius: 6, width: 22, height: 22, color: "#FFF", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, fontWeight: 600 }}>−</button>
                                      <span style={{ fontSize: 13, fontWeight: 700, color: "#FFF", minWidth: 20, textAlign: "center" }}>{inCartCount}</span>
                                      <button onClick={e => { e.stopPropagation(); toggleCart(svc, activeCat); }} style={{ background: "rgba(255,255,255,.22)", border: "none", borderRadius: 6, width: 22, height: 22, color: "#FFF", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, fontWeight: 600 }}>+</button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()
                  }
                </div>
              </div>

              <div
                className="resizer"
                title="Drag to resize cart"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.body.style.cursor = "col-resize";
                  const startX = e.clientX;
                  const startW = cartWidth;

                  const onMouseMove = (moveEvent) => {
                    const newWidth = Math.max(280, Math.min(startW - (moveEvent.clientX - startX), 600));
                    if (cartPanelRef.current) {
                      cartPanelRef.current.style.width = newWidth + "px";
                    }
                  };

                  const onMouseUp = (moveEvent) => {
                    document.body.style.cursor = "default";
                    window.removeEventListener("mousemove", onMouseMove);
                    window.removeEventListener("mouseup", onMouseUp);
                    const finalWidth = Math.max(280, Math.min(startW - (moveEvent.clientX - startX), 600));
                    setCartWidth(finalWidth);
                  };

                  window.addEventListener("mousemove", onMouseMove);
                  window.addEventListener("mouseup", onMouseUp);
                }}
                style={{
                  width: 6,
                  background: "transparent",
                  cursor: "col-resize",
                  zIndex: 10,
                  borderLeft: "1px solid #EDE6D8",
                  transition: "background .2s",
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#E8E0D4"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              />

              {/* Right – bill panel */}
              <div
                ref={cartPanelRef}
                className="bill-panel"
                style={{
                  width: cartWidth,
                  flex: isMobile ? (!cartCollapsed ? "0 0 65%" : "0 0 auto") : "none",
                  display: "flex",
                  flexDirection: "column",
                  background: "#F8F4EE",
                  overflow: "hidden",
                  minHeight: isMobile ? (cartCollapsed ? "44px" : "120px") : "none"
                }}
              >
                {/* Bill header */}
                <div
                  onClick={() => {
                    if (isMobile) {
                      const newCartState = !cartCollapsed;
                      setCartCollapsed(newCartState);
                      if (!newCartState) setFooterCollapsed(true); // Close footer if opening cart
                    }
                  }}
                  style={{
                    padding: "14px 16px 12px",
                    background: "#FFFFFF",
                    borderBottom: "1px solid #EDE6D8",
                    cursor: isMobile ? "pointer" : "default",
                    userSelect: "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: "#2A2118", letterSpacing: -0.2 }}>Current Bill</div>
                      {isMobile && (
                        <div style={{
                          fontSize: 10, fontWeight: 600, color: "#B08040",
                          background: "#F5F0E8", padding: "2px 8px", borderRadius: 100,
                          display: "flex", alignItems: "center", gap: 3
                        }}>
                          {cartCollapsed ? "Details ▾" : "Hide ▴"}
                        </div>
                      )}
                    </div>
                    {cart.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ background: "#2A2118", color: "#F5E6C8", borderRadius: "100px", fontSize: 10, fontWeight: 600, padding: "2px 9px", fontFamily: "'Outfit',sans-serif" }}>{cart.reduce((s, i) => s + i.qty, 0)} items</span>
                      </div>
                    )}
                  </div>
                  {(custName || custPhone) && (!isMobile || !cartCollapsed) && (
                    <div className="fade" style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      {custName && <span style={{ fontSize: 11, color: "#9A9088" }}>👤 <span style={{ color: "#5A4030", fontWeight: 600 }}>{custName}</span></span>}
                      {custPhone && <span style={{ fontSize: 11, color: "#9A9088", background: "#F5F0E8", padding: "1px 8px", borderRadius: 100 }}>📞 {custPhone}</span>}
                    </div>
                  )}
                </div>

                {/* Cart items */}
                {(!isMobile || !cartCollapsed) && (
                  <div className="cart-scroll fade" style={{ flex: 1, overflowY: "auto", overflowX: "visible", padding: "12px 10px" }}>
                    {!cart.length
                      ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: "40px 20px" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(145deg,#EEE6D8,#F5EFE4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 4px 16px rgba(44,33,24,.08)" }}>✨</div>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#A89880", textAlign: "center" }}>No services selected</div>
                        <div style={{ fontSize: 12, color: "#C4B9AB", textAlign: "center", lineHeight: 1.5 }}>Tap any service from the left<br/>panel to add it here</div>
                      </div>
                      : cart.map(item => {
                        const color = getCatColor(item.service, item.category);
                        const stObj = item.stylist ? dbStylists.find(s => s.name === item.stylist) : null;
                        const sColor = stObj ? stObj.color || "#B08040" : "#D4C4B0";
                        return (
                          <div key={item.id} style={{
                            background: "#FFFFFF", borderRadius: 12, marginBottom: 9,
                            border: `1.5px solid ${item.stylist ? sColor + "40" : "#EDE6D8"}`,
                            overflow: "visible", transition: "all .2s", position: "relative", zIndex: 1,
                            boxShadow: "0 1px 4px rgba(44,33,24,.04)"
                          }}>
                            {/* Main row */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px" }}>
                              {/* Category icon */}
                              <div style={{
                                width: 38, height: 38, borderRadius: 10, background: `${color}18`,
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0
                              }}>
                                {SERVICES[item.category]?.icon || "✦"}
                              </div>

                              {/* Name + stylist chip */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: 13, fontWeight: 600, color: "#2A2118",
                                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                }}>{item.service}</div>
                                {item.category === 'Deal' && item.included_services?.length > 0 && (
                                  <div style={{ fontSize: 10, color: "#9A9088", marginTop: 4, paddingBottom: 4, whiteSpace: "normal", display: "flex", flexDirection: "column", gap: 2 }}>
                                    {item.included_services.map((inc, i) => (
                                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <span style={{ minWidth: 4, height: 4, borderRadius: '50%', background: '#C4B9AB' }} />
                                        <span style={{ lineHeight: 1.2 }}>{inc}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div style={{
                                  marginTop: item.category === 'Deal' ? 2 : 4, display: "inline-flex", alignItems: "center",
                                  background: `${color}12`, borderRadius: 100, padding: "2px 9px"
                                }}>
                                  <span style={{ fontSize: 10, fontWeight: 600, color }}>{item.category}</span>
                                </div>
                              </div>

                              {/* Qty placeholder for spacing */}
                              <div style={{ width: 14 }} />

                              {/* Price + delete */}
                              <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: "#B08040", fontFamily: "'Outfit',sans-serif" }}>{fmt(item.price * item.qty, true)}</span>
                                <button onClick={() => remItem(item.id)} style={{
                                  width: 22, height: 22, borderRadius: "50%", background: "#F5F0E8",
                                  border: "none", cursor: "pointer", color: "#9A9088", fontSize: 14,
                                  display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
                                  transition: "all .15s", flexShrink: 0
                                }}
                                  onMouseEnter={e => { e.currentTarget.style.background = "#FECACA"; e.currentTarget.style.color = "#991B1B"; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = "#F5F0E8"; e.currentTarget.style.color = "#9A9088"; }}
                                >×</button>
                              </div>
                            </div>

                            {/* Stylist picker — hidden but triggered by chip above */}
                            <div style={{ padding: 0 }}>
                              <StylistPicker
                                id={`sp-${item.id}`}
                                value={item.stylist || ""}
                                onChange={s => {
                                  updStylist(item.id, s);
                                  if (s) setCheckoutAttempted(false); // Clear warning highlight when assigned
                                }}
                                color={sColor}
                                stylists={dbStylists}
                                highlight={checkoutAttempted && !item.stylist}
                              />
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                )}

                {/* Bill footer (Collapsible) */}
                {cart.length > 0 && (
                  <div className="bill-footer" style={{ background: "#FFFFFF", borderTop: "1px solid #EDE6D8", display: "flex", flexDirection: "column", flex: "0 0 auto" }}>

                    {/* Header Row (Total) - Always Visible, acts as toggle on mobile & desktop */}
                    <div
                      onClick={() => {
                        const newFooterState = !footerCollapsed;
                        setFooterCollapsed(newFooterState);
                        if (isMobile && !newFooterState) setCartCollapsed(true); // Close cart if opening footer
                      }}
                      style={{
                        padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                        cursor: "pointer", userSelect: "none"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 800, color: "#2A2118", letterSpacing: -0.5 }}>
                          Total
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{
                            fontSize: 10, fontWeight: 600, color: "#B08040",
                            background: "#F5F0E8", padding: "2px 10px", borderRadius: 100,
                            display: "flex", alignItems: "center", gap: 4, transition: "all 0.2s"
                          }}>
                            {footerCollapsed ? "Details ▾" : "Hide ▴"}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#2A2118", fontFamily: "'Outfit',sans-serif" }}>{fmt(total)}</div>
                    </div>

                    {/* Collapsible Panel: All Billing & Checkout Actions */}
                    {!footerCollapsed && (
                      <div className="fade" style={{
                        background: "#FFFFFF",
                        overflowY: "auto",
                        maxHeight: isMobile ? "75vh" : "70vh", // Increased mobile height to fit items
                        paddingBottom: isMobile ? "env(safe-area-inset-bottom, 20px)" : 0
                      }}>
                        <div style={{ padding: "14px 14px 0" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9A9088", marginBottom: 10 }}>
                            <span>Subtotal</span>
                            <span style={{ color: "#2A2118", fontWeight: 500 }}>{fmt(sub)}</span>
                          </div>

                          {/* Advanced Discount Selection */}
                          <div style={{ marginBottom: 12, background: "#F8F5F0", borderRadius: 10, overflow: "hidden", border: "1px solid #EDE6D8" }}>
                            <div style={{ display: "flex", borderBottom: "1px solid #EDE6D8" }}>
                              {[["none", "No Disc."], ["pct", "% Off"], ["flat", "Fixed"], ["item", "Item"]].map(([m, l]) => (
                                <button key={m} onClick={() => setDiscMode(m)} style={{
                                  flex: 1, padding: "7px 4px", fontSize: 11, fontWeight: 600, fontFamily: "'Outfit',sans-serif",
                                  border: "none", cursor: "pointer", transition: "all .15s", letterSpacing: .2,
                                  background: discMode === m ? "#2A2118" : "transparent",
                                  color: discMode === m ? "#FAF7F3" : "#9A9088",
                                  borderRight: m !== "item" ? "1px solid #EDE6D8" : "none"
                                }}>{l}</button>
                              ))}
                            </div>

                            {discMode !== "none" && (
                              <div style={{ padding: "10px 11px", display: "flex", flexDirection: "column", gap: 8 }}>
                                {discMode === "pct" && (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                      <span style={{ fontSize: 11, color: "#9A9088", fontWeight: 600 }}>Discount %</span>
                                      <input type="number" min="0" max="100" className="inp" value={discPct}
                                        onChange={e => setDiscPct(Math.min(100, Math.max(0, +e.target.value)))}
                                        style={{ width: 50, padding: "4px 6px", fontSize: 11, textAlign: "center", height: 26 }} />
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                      {[5, 10, 15, 20, 25].map(p => (
                                        <button key={p} onClick={() => setDiscPct(p)} style={{
                                          padding: "4px 7px", fontSize: 10, fontWeight: 700, fontFamily: "'Outfit',sans-serif",
                                          borderRadius: 6, border: "1.5px solid", cursor: "pointer", transition: "all .1s",
                                          background: discPct === p ? "#2A2118" : "white",
                                          borderColor: discPct === p ? "#2A2118" : "#E0D8CC",
                                          color: discPct === p ? "#FAF7F3" : "#6B5030",
                                          flex: "1 1 auto", minWidth: 40
                                        }}>{p}%</button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {discMode === "flat" && (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                      <span style={{ fontSize: 11, color: "#9A9088", fontWeight: 600 }}>Amount (PKR)</span>
                                      <input type="number" min="0" className="inp" value={discFlat}
                                        onChange={e => setDiscFlat(Math.max(0, +e.target.value))}
                                        style={{ width: 70, padding: "4px 6px", fontSize: 11, textAlign: "center", height: 26 }} />
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                      {[100, 200, 500, 1000].map(a => (
                                        <button key={a} onClick={() => setDiscFlat(a)} style={{
                                          padding: "4px 7px", fontSize: 10, fontWeight: 700, fontFamily: "'Outfit',sans-serif",
                                          borderRadius: 6, border: "1.5px solid", cursor: "pointer", transition: "all .1s",
                                          background: discFlat === a ? "#2A2118" : "white",
                                          borderColor: discFlat === a ? "#2A2118" : "#E0D8CC",
                                          color: discFlat === a ? "#FAF7F3" : "#6B5030",
                                          flex: "1 1 auto", minWidth: 46
                                        }}>{a}</button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {discMode === "item" && (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                      <span style={{ fontSize: 11, color: "#9A9088", whiteSpace: "nowrap" }}>Select Item</span>
                                      <select
                                        className="inp"
                                        value=""
                                        onChange={e => {
                                          if (!e.target.value) return;
                                          const id = e.target.value;
                                          if (!itemDiscounts[id]) {
                                            setItemDiscounts({ ...itemDiscounts, [id]: { mode: "pct", value: 0 } });
                                          }
                                        }}
                                        style={{ flex: 1, padding: "5px 8px", fontSize: 12 }}
                                      >
                                        <option value="">Add service to discount...</option>
                                        {cart.map(i => (
                                          <option key={i.id} value={i.id} disabled={!!itemDiscounts[i.id]}>
                                            {i.service} {!!itemDiscounts[i.id] ? '(Added)' : ''}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    {Object.keys(itemDiscounts).length > 0 && (
                                      <div style={{ maxHeight: 105, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, padding: "2px 0", borderTop: "1px dashed #E0D8CC", paddingTop: 8 }}>
                                        {Object.entries(itemDiscounts).map(([idStr, d]) => {
                                          const item = cart.find(i => i.id.toString() === idStr);
                                          if (!item) return null;
                                          return (
                                            <div key={idStr} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                              <span style={{ fontSize: 12, color: "#2A2118", fontWeight: 600, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.service}</span>
                                              <div style={{ display: "flex", background: "#E8E0D4", borderRadius: 7, padding: 2 }}>
                                                <button onClick={() => setItemDiscounts({ ...itemDiscounts, [idStr]: { ...d, mode: "pct" } })} style={{ padding: "4px 8px", border: "none", borderRadius: 5, fontSize: 10, fontWeight: 700, cursor: "pointer", background: d.mode === "pct" ? "#2A2118" : "transparent", color: d.mode === "pct" ? "#FFF" : "#9A9088" }}>%</button>
                                                <button onClick={() => setItemDiscounts({ ...itemDiscounts, [idStr]: { ...d, mode: "flat" } })} style={{ padding: "4px 8px", border: "none", borderRadius: 5, fontSize: 10, fontWeight: 700, cursor: "pointer", background: d.mode === "flat" ? "#2A2118" : "transparent", color: d.mode === "flat" ? "#FFF" : "#9A9088" }}>Rs</button>
                                              </div>
                                              <input type="number" min="0" className="inp" value={d.value}
                                                onChange={e => setItemDiscounts({ ...itemDiscounts, [idStr]: { ...d, value: Math.max(0, +e.target.value) } })}
                                                style={{ width: 50, padding: "5px 7px", fontSize: 12, textAlign: "center" }} />
                                              <button onClick={() => {
                                                const next = { ...itemDiscounts };
                                                delete next[idStr];
                                                setItemDiscounts(next);
                                              }} style={{ background: "none", border: "none", color: "#A0303F", fontSize: 16, cursor: "pointer", padding: "0 4px" }}>×</button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {/* Courtesy By + Reason */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: discMode === "item" ? 4 : 0 }}>
                                  <CourtesyPicker value={discCourtesyBy} onChange={setDiscCourtesyBy} persons={allCourtesyPersons} />
                                  <input className="inp" placeholder="Reason..." value={discReason} onChange={e => setDiscReason(e.target.value)} style={{ fontSize: 12, padding: "7px 10px" }} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Split Payment Breakdown */}
                        {payMode === "SPLIT" && (
                          <div style={{ margin: "0 14px 12px", background: "#F8F4EE", border: "1.5px solid #E8E0D4", borderRadius: 11, overflow: "hidden" }}>
                            <div style={{ padding: "9px 12px", borderBottom: "1px solid #EDE6D8", fontSize: 11, fontWeight: 700, color: "#B08040", textTransform: "uppercase", letterSpacing: 0.8 }}>
                              🔀 Split Payment Breakdown
                            </div>
                            <div style={{ padding: "12px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
                              {/* Cash row */}
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 7, background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>💵</div>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#2A2118", flex: 1 }}>Cash</span>
                                <input
                                  type="number" min="0" className="inp"
                                  value={splitCash || ""}
                                  placeholder="0"
                                  onChange={e => {
                                    const val = Math.max(0, +e.target.value);
                                    setSplitCash(val);
                                    setSplitOtherAmt(Math.max(0, total - val));
                                  }}
                                  style={{ width: 90, padding: "6px 9px", fontSize: 13, fontWeight: 600, textAlign: "right" }}
                                />
                              </div>
                              {/* Other gateway row */}
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 7, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                                  {splitOtherMode === "CARD" ? "💳" : "📱"}
                                </div>
                                <select className="inp" value={splitOtherMode} onChange={e => setSplitOtherMode(e.target.value)} style={{ flex: 1, padding: "6px 8px", fontSize: 12, fontWeight: 600 }}>
                                  <option value="ONLINE">📱 Online</option>
                                  <option value="CARD">💳 Card</option>
                                </select>
                                <input
                                  type="number" min="0" className="inp"
                                  value={splitOtherAmt || ""}
                                  placeholder="0"
                                  onChange={e => {
                                    const val = Math.max(0, +e.target.value);
                                    setSplitOtherAmt(val);
                                    setSplitCash(Math.max(0, total - val));
                                  }}
                                  style={{ width: 90, padding: "6px 9px", fontSize: 13, fontWeight: 600, textAlign: "right" }}
                                />
                              </div>
                              {/* Balance indicator */}
                              {(() => {
                                const sum = (splitCash || 0) + (splitOtherAmt || 0);
                                const diff = total - sum;
                                if (sum === 0) return null;
                                return (
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", borderRadius: 8, background: Math.abs(diff) < 1 ? "#F0FDF4" : "#FFF7ED", border: `1px solid ${Math.abs(diff) < 1 ? "#BBF7D0" : "#FED7AA"}` }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: Math.abs(diff) < 1 ? "#166534" : "#92400E" }}>
                                      {Math.abs(diff) < 1 ? "✅ Amounts match" : diff > 0 ? `⚠️ PKR ${diff.toLocaleString()} remaining` : `⚠️ PKR ${Math.abs(diff).toLocaleString()} over`}
                                    </span>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: "#2A2118" }}>Total: {fmt(total)}</span>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons (Now inside collapsible) */}
                        <div style={{ padding: "8px 14px 16px", display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
                          {/* Two print options */}
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={() => {
                                if (!cart.length) return;
                                setStaffSlipPreview({
                                  customerName: custName || "Walk-in",
                                  customerPhone: custPhone || "",
                                  date: todayStr(),
                                  time: new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }),
                                  cart,
                                  note,
                                  total,
                                  slip: tab.id ? `NK${String(tab.id).slice(-6)}` : "NEW"
                                });
                              }}
                              style={{ flex: 1, height: 50, fontSize: 13, fontWeight: 700, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#5A4030", color: "#F5E6C8", border: "none", cursor: "pointer" }}
                            >
                              <span style={{ fontSize: 17 }}>🖨️</span> Staff Slip
                            </button>
                            <button
                              onClick={checkout}
                              disabled={checkoutLoading}
                              className="btn-gold"
                              style={{ flex: 1, height: 50, fontSize: 13, fontWeight: 700, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: checkoutLoading ? 0.7 : 1 }}
                            >
                              {checkoutLoading ? '⏳' : <><span style={{ fontSize: 17 }}>🧾</span> Print Bill</>}
                            </button>
                          </div>
                          {tab.staffSlipPrinted && (
                            <div className="fade" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <div style={{ padding: "4px 8px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, fontSize: 11, color: "#166534", display: "flex", alignItems: "center", gap: 6 }}>
                                <span>✅</span> Staff slip printed
                                <button onClick={() => updTab({ staffSlipPrinted: false })} style={{ marginLeft: "auto", background: "none", border: "none", color: "#166534", fontSize: 10, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Reprint?</button>
                              </div>
                              <button onClick={checkout} disabled={checkoutLoading} className="btn-gold" style={{ width: "100%", height: 46, fontSize: 15, fontWeight: 700, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: checkoutLoading ? 0.7 : 1 }}>
                                {checkoutLoading ? '⏳ Processing...' : <><span style={{fontSize:18}}>💳</span> COMPLETE TRANSACTION</>}
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => { if (confirm("Clear entire bill?")) updTab({ cart: [], discMode: "none", discPct: 0, discFlat: 0, itemDiscounts: {}, discReason: "", discCourtesyBy: "", note: "" }); }}
                            style={{ background: "none", border: "none", color: "#9A9088", fontSize: 11, fontWeight: 600, cursor: "pointer", textDecoration: "underline", marginTop: 4 }}
                          >
                            Clear Bill
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}


      {/* ══ ANALYTICS ═══════════════════════════════════════════════════════ */}
      {view === "dashboard" && (
        <div style={{ padding: "20px 24px 80px", overflowY: "auto", height: "calc(100dvh - 62px)", paddingBottom: "env(safe-area-inset-bottom, 80px)" }} className="fade analytics-container">

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color: "#2A2118" }}>Analytics</div>
              <div style={{ fontSize: 11, color: "#9A9088", marginTop: 3 }}>
                {ranged.length} transactions
                {fStylist && <span style={{ color: "#B08040" }}> · ✂️ {fStylist}</span>}
                {fCat && <span style={{ color: "#B08040" }}> · {fCat}</span>}
                {fPay && <span style={{ color: "#B08040" }}> · {fPay}</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, width: isMobile ? "100%" : "auto", overflowX: "auto", paddingBottom: isMobile ? 4 : 0 }} className="catstrip">
              {[["overview", "Overview"], ["stylists", "Stylists"], ["services", "Services"], ["time", "Time"], ["discounts", "Discounts"]].map(([t, l]) => (
                <button key={t} className={`tbtn ${dashTab === t ? "on" : ""}`} onClick={() => setDashTab(t)} style={{ flexShrink: 0 }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Filter bar */}
          <div className="analytics-filter-bar" style={{ background: "#FFFFFF", border: "1px solid #EDE6D8", borderRadius: 14, padding: "16px 18px", marginBottom: 18, boxShadow: "0 1px 6px rgba(44,33,24,.04)" }}>
            {/* Row 1: Period · Custom Range · Stylist · Category */}
            <div className="filter-row" style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end", marginBottom: 14 }}>
              <div>
                <div className="filter-label">Period</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[["today", "Today"], ["7d", "7d"], ["30d", "30d"], ["90d", "90d"], ["all", "All"]].map(([r, l]) => (
                    <button key={r} className={`rbtn ${dashRange === r && !dashCFrom ? "on" : ""}`}
                      onClick={() => { setDashRange(r); setDashCFrom(""); setDashCTo(""); }}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="filter-label">Custom Range</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input type="date" className="inp" value={dashCFrom} onChange={e => { setDashCFrom(e.target.value); setDashRange(""); }} onClick={e => { try { e.target.showPicker(); } catch (err) { } }} style={{ width: 130, padding: "5px 10px", fontSize: 11, cursor: "pointer" }} />
                  <span style={{ color: "#C4B9AB", fontSize: 12 }}>→</span>
                  <input type="date" className="inp" value={dashCTo} onChange={e => { setDashCTo(e.target.value); setDashRange(""); }} onClick={e => { try { e.target.showPicker(); } catch (err) { } }} style={{ width: 130, padding: "5px 10px", fontSize: 11, cursor: "pointer" }} />
                </div>
              </div>
              <div>
                <div className="filter-label">Stylist</div>
                <select className="inp" value={fStylist} onChange={e => setFStylist(e.target.value)} style={{ width: 136, padding: "5px 10px", fontSize: 12 }}>
                  <option value="">All Stylists</option>
                  {[...new Set([...dbStylists.map(s => s.name), ...Object.keys(S.styM)])].filter(n => n && n !== "Unassigned").sort().map(n => <option key={n} value={n}>{n}</option>)}
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>
              <div>
                <div className="filter-label">Category</div>
                <select className="inp" value={fCat} onChange={e => setFCat(e.target.value)} style={{ width: 148, padding: "5px 10px", fontSize: 12 }}>
                  <option value="">All Categories</option>
                  {Object.keys(SERVICES).map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            {/* Row 2: Payment · Metric · Actions */}
            <div className="filter-row" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", paddingTop: 12, borderTop: "1px solid #F0EAE0" }}>
              <div>
                <div className="filter-label">Payment</div>
                <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: isMobile ? 4 : 0 }} className="catstrip">
                  {[["", "All"], ["CASH", "Cash"], ["ONLINE", "Online"], ["CARD", "Card"], ["SPLIT", "Split"]].map(([v, l]) => (
                    <button key={l} className={`rbtn ${fPay === v ? "on" : ""}`} onClick={() => setFPay(v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                {hasF && (
                  <button onClick={resetF}
                    style={{
                      fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#9A9088", background: "transparent",
                      border: "1.5px solid #E8E0D4", borderRadius: 7, padding: "7px 13px", cursor: "pointer"
                    }}>
                    ↺ Reset filters
                  </button>
                )}
                {ROLE_RANK[user.role] >= 3 && (
                <button onClick={exportCSV}
                  style={{
                    fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600,
                    color: "#FFFFFF", background: "#2A2118", border: "none", borderRadius: 7,
                    padding: "7px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#4A3828"}
                  onMouseLeave={e => e.currentTarget.style.background = "#2A2118"}>
                  ⬇ Export CSV
                </button>
                )}
              </div>
            </div>
          </div>

          {/* ─ OVERVIEW ─ */}
          {dashTab === "overview" && (
            <div className="fade">
              {/* KPI row */}
              {(() => {
                const metricMap = { revenue: "Total Revenue", visits: "Customers", avg: "Avg. Ticket", discount: "Discounts" };
                const activeLabel = metricMap[fMetric];
                const kpis = [
                  { id: "revenue", label: "Total Revenue", v: S.totR, color: "#B08040", fmt: v => fmt(v, true), spark: S.revD },
                  { id: "visits", label: "Customers", v: S.totC, color: "#5B3A8A", fmt: v => v.toLocaleString(), spark: S.cstD },
                  { id: "avg", label: "Avg. Ticket", v: S.avg, color: "#1A6B4A", fmt: v => fmt(v, true) },
                  { id: "discount", label: "Discounts", v: S.totDisc, color: "#A0303F", fmt: v => fmt(v, true) },
                ];
                return (
                  <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
                    {kpis.map(k => (
                      <div key={k.label} className="card" style={{ borderTop: `3px solid ${k.color}` }}>
                        <div style={{ fontSize: 11, color: "#9A9088", textTransform: "uppercase", letterSpacing: 1, fontWeight: 400, marginBottom: 8 }}>{k.label}</div>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 700, color: k.color, lineHeight: 1, marginBottom: k.spark ? 10 : 0 }}>{k.fmt(k.v)}</div>
                        {k.spark && <Spark data={k.spark} color={k.color} h={28} w={90} />}
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="dash-grid-2-1" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 270px", gap: 14, marginBottom: 14 }}>
                {/* Metric Trend (responds to fMetric) */}
                <div className="card">
                  {(() => {
                    const mCfg = {
                      revenue: { label: "Revenue Trend", data: S.revD, color: "#B08040", fmt: v => fmt(v, true) },
                      visits: { label: "Visits Trend", data: S.cstD, color: "#5B3A8A", fmt: v => v },
                      avg: { label: "Avg Ticket Trend", data: S.revD.map((v, i) => S.cstD[i] ? Math.round(v / S.cstD[i]) : 0), color: "#1A6B4A", fmt: v => fmt(v, true) },
                      discount: { label: "Discount Trend", data: S.revD.map((_, i) => { const ds = ranged.filter(t => { const d = new Date(t.date); d.setHours(0, 0, 0, 0); const ref = new Date(); ref.setHours(0, 0, 0, 0); ref.setDate(ref.getDate() - (S.revD.length - 1 - i)); return d.getTime() === ref.getTime(); }); return ds.reduce((s, t) => s + (t.discountAmt || 0), 0); }), color: "#A0303F", fmt: v => fmt(v, true) },
                    };
                    const cfg = mCfg[fMetric] || mCfg.revenue;
                    const mx = Math.max(...cfg.data, 1);
                    return (<>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#2A2118", marginBottom: 14 }}>{cfg.label}</div>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 84 }}>
                        {cfg.data.map((v, i) => {
                          const h = Math.max(Math.round((v / mx) * 78), v > 0 ? 3 : 1);
                          const isToday = i === cfg.data.length - 1;
                          return <div key={i} title={cfg.fmt(v)} style={{ flex: 1, height: h, background: isToday ? cfg.color : v > 0 ? cfg.color + "70" : "#EEE6D8", borderRadius: "2px 2px 0 0", transition: "height .8s", minHeight: 1 }} />;
                        })}
                      </div>
                      <div style={{ height: 1, background: "#EDE6D8", margin: "5px 0 4px" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#B8AFA5" }}><span>Earlier</span><span style={{ color: cfg.color, fontWeight: 600 }}>Today</span></div>
                    </>);
                  })()}
                </div>

                {/* Category donut */}
                <div className="card">
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#2A2118", marginBottom: 12 }}>By Category</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Donut size={88} slices={Object.entries(S.cR).map(([cat, v]) => ({ v, color: SERVICES[cat]?.color || "#B08040" }))} />
                    <div style={{ flex: 1 }}>
                      {Object.entries(S.cR).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([cat, rev]) => {
                        const tot = Object.values(S.cR).reduce((s, v) => s + v, 0) || 1;
                        return (
                          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: 2, background: SERVICES[cat]?.color || "#B08040", flexShrink: 0 }} />
                            <div style={{ fontSize: 12, color: "#9A9088", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat}</div>
                            <div style={{ fontSize: 12, color: "#6B5030", fontWeight: 600 }}>{Math.round(rev / tot * 100)}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="dash-grid-2" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {/* Payment split */}
                <div className="card">
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#2A2118", marginBottom: 14 }}>Payment Methods</div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 10 }}>
                    {[["CASH", "#1A6B4A", "💵"], ["ONLINE", "#2A3A8A", "📱"], ["CARD", "#6B3A8A", "💳"], ["SPLIT", "#7A4A14", "🔀"]].map(([m, color, ic]) => {
                      const tot = Object.values(S.pR).reduce((s, v) => s + v, 0) || 1;
                      const pct = Math.round((S.pR[m] || 0) / tot * 100);
                      return (
                        <div key={m} style={{ background: "#FDFAF6", borderRadius: 10, padding: "13px 10px", border: "1px solid #EDE6D8", textAlign: "center" }}>
                          <div style={{ fontSize: 22, marginBottom: 6 }}>{ic}</div>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 700, color }}>{pct}%</div>
                          <div style={{ fontSize: 11, color: "#9A9088", marginTop: 2, fontWeight: 500 }}>{m}</div>
                          <div style={{ fontSize: 11, color: "#6B5030", marginTop: 4, fontWeight: 500 }}>{fmt(S.pR[m] || 0, true)}</div>
                          <div style={{ fontSize: 11, color: "#B8AFA5" }}>{S.pC[m] || 0} txns</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Best days */}
                <div className="card">
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#2A2118", marginBottom: 14 }}>Busiest Days</div>
                  {DAYS.map((day, i) => {
                    const mx = Math.max(...S.dR, 1), pct = Math.round(S.dR[i] / mx * 100) || 0;
                    const best = S.dR[i] === Math.max(...S.dR);
                    return (
                      <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 30, fontSize: 11, color: best ? "#B08040" : "#9A9088", fontWeight: best ? 600 : 400 }}>{day}</div>
                        <div style={{ flex: 1 }}><ProgBar pct={pct} color={best ? "#B08040" : "#D4C4A8"} /></div>
                        <div style={{ fontSize: 12, color: "#9A9088", minWidth: 50, textAlign: "right" }}>{fmt(S.dR[i], true)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Client Flow */}
              <div className="card">
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#2A2118" }}>Client Flow</div>
                    <div style={{ fontSize: 12, color: "#B8AFA5", marginTop: 2 }}>When your guests visit most</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#C4B9AB" }}>{ranged.length} total visits</div>
                </div>
                <ClientFlow data={S.hm} isMobile={isMobile} />
              </div>
            </div>
          )}

          {/* ─ STYLISTS ─ */}
          {dashTab === "stylists" && (
            <div className="fade">
              {fStylist ? (() => {
                // ── Stylist Profile View ──
                const sData = S.styM[fStylist] || { rev: 0, cust: 0, svcs: 0, cats: {} };
                const color = dbStylists.find(s => s.name === fStylist)?.color || (fStylist === "Unassigned" ? "#C4B9AB" : "#B08040");
                const avg = sData.cust ? Math.round(sData.rev / sData.cust) : 0;
                const topCat = Object.entries(sData.cats).sort((a, b) => b[1] - a[1])[0];
                // Per-service breakdown for this stylist
                const svcBreakdown = {};
                ranged.forEach(x => {
                  x.cart.forEach(c => {
                    const sty = c.stylist || (x.stylist && !x.stylist.includes(',') ? x.stylist : "Unassigned");
                    if (sty !== fStylist) return;
                    if (!svcBreakdown[c.service]) svcBreakdown[c.service] = { rev: 0, qty: 0, category: c.category };
                    svcBreakdown[c.service].rev += c.price * c.qty;
                    svcBreakdown[c.service].qty += c.qty;
                  });
                });
                // Transactions where this stylist did at least one service
                const styTxns = ranged.filter(x =>
                  x.cart.some(c => c.stylist === fStylist) ||
                  (x.stylist || "").split(',').map(s => s.trim()).includes(fStylist)
                ).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

                return (
                  <div>
                    {/* Back nav */}
                    <button onClick={() => setFStylist("")}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "1.5px solid #E8E0D4", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, color: "#6B5030", cursor: "pointer", marginBottom: 14, fontFamily: "'Outfit',sans-serif" }}>
                      ← All Stylists
                    </button>

                    {/* Profile header */}
                    <div className="card" style={{ marginBottom: 14, borderLeft: `4px solid ${color}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                        <div style={{ width: 56, height: 56, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#FFF", flexShrink: 0 }}>{fStylist[0]}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "#2A2118" }}>{fStylist}</div>
                          <div style={{ fontSize: 12, color: "#9A9088", marginTop: 2 }}>{sData.svcs} services performed · {sData.cust} clients served</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 24, fontWeight: 800, color: "#2A2118" }}>{fmt(sData.rev, true)}</div>
                          <div style={{ fontSize: 12, color: "#9A9088" }}>Avg ticket: {fmt(avg, true)}</div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 10 }}>
                        {[["Total Revenue", fmt(sData.rev, true)], ["Clients", sData.cust], ["Services", sData.svcs], ["Specialty", topCat?.[0] || "—"]].map(([l, v]) => (
                          <div key={l} style={{ background: "#FDFAF6", borderRadius: 10, padding: "12px 14px", border: "1px solid #EDE6D8" }}>
                            <div style={{ fontSize: 10, color: "#B8AFA5", textTransform: "uppercase", letterSpacing: .8, fontWeight: 600 }}>{l}</div>
                            <div style={{ fontSize: 15, color: "#2A2118", fontWeight: 700, marginTop: 5 }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      {/* Services breakdown */}
                      <div className="card">
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#2A2118", marginBottom: 12 }}>Services Breakdown</div>
                        {Object.entries(svcBreakdown).sort((a, b) => b[1].rev - a[1].rev).length === 0
                          ? <div style={{ fontSize: 12, color: "#C4B9AB", textAlign: "center", padding: 16 }}>No services found</div>
                          : Object.entries(svcBreakdown).sort((a, b) => b[1].rev - a[1].rev).map(([svc, d]) => {
                            const mxSvc = Math.max(...Object.values(svcBreakdown).map(s => s.rev), 1);
                            const col = getCatColor(svc, d.category);
                            return (
                              <div key={svc} style={{ marginBottom: 10 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                                  <span style={{ color: "#2A2118", fontWeight: 600 }}>{svc}</span>
                                  <span style={{ color: "#9A9088" }}>{d.qty}× · {fmt(d.rev, true)}</span>
                                </div>
                                <ProgBar pct={Math.round(d.rev / mxSvc * 100)} color={col} h={4} />
                              </div>
                            );
                          })}
                      </div>

                      {/* Category distribution */}
                      <div className="card">
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#2A2118", marginBottom: 12 }}>Category Distribution</div>
                        {Object.entries(sData.cats).sort((a, b) => b[1] - a[1]).map(([cat, qty]) => {
                          const mxCat = Math.max(...Object.values(sData.cats), 1);
                          const catRev = Object.entries(svcBreakdown).filter(([, d]) => d.category === cat).reduce((s, [, d]) => s + d.rev, 0);
                          const col = getCatColor("", cat);
                          return (
                            <div key={cat} style={{ marginBottom: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                                <span style={{ color: "#2A2118", fontWeight: 600 }}>{cat}</span>
                                <span style={{ color: "#9A9088" }}>{qty} services · {fmt(catRev, true)}</span>
                              </div>
                              <ProgBar pct={Math.round(qty / mxCat * 100)} color={col} h={4} />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Full service history */}
                    <div className="card">
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#2A2118", marginBottom: 14 }}>Service History <span style={{ fontSize: 12, color: "#9A9088", fontWeight: 400 }}>({styTxns.length} transactions)</span></div>
                      {styTxns.length === 0
                        ? <div style={{ fontSize: 12, color: "#C4B9AB", textAlign: "center", padding: 16 }}>No history found</div>
                        : styTxns.map(txn => {
                          const myItems = txn.cart.filter(c => c.stylist === fStylist || (!c.stylist && (txn.stylist || "").split(',').map(s => s.trim()).includes(fStylist)));
                          const myRev = myItems.reduce((s, c) => s + c.price * c.qty, 0);
                          return (
                            <div key={txn.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: "1px solid #F0EAE0" }}>
                              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>👤</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: "#2A2118" }}>{txn.customerName}</span>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: "#2A2118" }}>{fmt(myRev, true)}</span>
                                </div>
                                <div style={{ fontSize: 11, color: "#9A9088", marginBottom: 5 }}>#{txn.slip} · {txn.date} at {txn.time}</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                  {myItems.map((c, i) => (
                                    <span key={i} style={{ fontSize: 11, background: `${getCatColor(c.service, c.category)}14`, color: getCatColor(c.service, c.category), border: `1px solid ${getCatColor(c.service, c.category)}28`, borderRadius: 100, padding: "2px 9px", fontWeight: 600 }}>
                                      {c.service}{c.qty > 1 ? ` ×${c.qty}` : ""} · {fmt(c.price * c.qty, true)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })() : (
                // ── All-Stylists Leaderboard ──
                (() => {
                  const entries = Object.entries(S.styM).sort((a, b) => b[1].rev - a[1].rev);
                  const mx = Math.max(...entries.map(([, d]) => d.rev), 1);
                  const medals = ["🥇", "🥈", "🥉"];
                  if (!entries.length) return <div style={{ textAlign: "center", padding: 48, color: "#C4B9AB", fontSize: 13 }}>No data for this period</div>;
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {entries.map(([name, data], i) => {
                        const color = dbStylists.find(s => s.name === name)?.color || (name === "Unassigned" ? "#C4B9AB" : "#B08040");
                        const topCat = Object.entries(data.cats).sort((a, b) => b[1] - a[1])[0];
                        const avg = data.cust ? Math.round(data.rev / data.cust) : 0;
                        const pct = Math.round(data.rev / mx * 100);
                        return (
                          <div key={name} className="card" style={{ borderLeft: `4px solid ${color}`, padding: "14px 18px", cursor: "pointer" }}
                            onClick={() => setFStylist(name)}>
                            {/* Top row: rank + avatar + name + revenue */}
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                              <div style={{ fontSize: 18, width: 26, textAlign: "center", flexShrink: 0 }}>
                                {medals[i] || <span style={{ fontSize: 12, color: "#C4B9AB", fontWeight: 700 }}>#{i + 1}</span>}
                              </div>
                              <div style={{ width: 42, height: 42, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#FFF", fontWeight: 700, flexShrink: 0 }}>{name[0]}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "#2A2118", marginBottom: 1 }}>{name}</div>
                                <div style={{ fontSize: 11, color: "#B8AFA5" }}>{data.svcs} services · {data.cust} clients</div>
                              </div>
                              <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div style={{ fontSize: 17, fontWeight: 800, color: "#2A2118" }}>{fmt(data.rev, true)}</div>
                                <div style={{ fontSize: 11, color: "#B8AFA5" }}>avg {fmt(avg, true)}</div>
                              </div>
                            </div>
                            {/* Progress bar */}
                            <div style={{ marginBottom: 12 }}>
                              <ProgBar pct={pct} color={color} h={5} />
                            </div>
                            {/* Stats row */}
                            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 8 }}>
                              {[
                                ["Clients", data.cust],
                                ["Services", data.svcs],
                                ["Avg Ticket", fmt(avg, true)],
                                ["Specialty", topCat?.[0] || "—"],
                              ].map(([l, v]) => (
                                <div key={l} style={{ background: "#FDFAF6", borderRadius: 8, padding: "8px 10px", border: "1px solid #EDE6D8" }}>
                                  <div style={{ fontSize: 10, color: "#B8AFA5", textTransform: "uppercase", letterSpacing: .8, fontWeight: 600, marginBottom: 3 }}>{l}</div>
                                  <div style={{ fontSize: 13, color: "#3D3028", fontWeight: 700 }}>{v}</div>
                                </div>
                              ))}
                            </div>
                            <div style={{ marginTop: 8, fontSize: 11, color: "#C4B9AB", textAlign: "right" }}>Click to view full profile →</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* ─ SERVICES ─ */}
          {dashTab === "services" && (
            <div className="fade">
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {/* Top by Revenue */}
                <div className="card">
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#2A2118", marginBottom: 16 }}>Top by Revenue</div>
                  {!Object.keys(S.sR).length
                    ? <div style={{ fontSize: 12, color: "#C4B9AB", textAlign: "center", padding: 24 }}>No data</div>
                    : Object.entries(S.sR).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([svc, rev], i) => {
                      const mx = Math.max(...Object.values(S.sR), 1);
                      const color = getCatColor(svc);
                      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                      return (
                        <div key={svc} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: i < 3 ? "#2A2118" : "#5A4838", fontWeight: i < 3 ? 700 : 500 }}>
                              {medal ? <span style={{ marginRight: 5 }}>{medal}</span> : <span style={{ marginRight: 5, color: "#C4B9AB" }}>#{i + 1}</span>}{svc}
                            </span>
                            <span style={{ fontSize: 12, color: "#2A2118", fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8 }}>{fmt(rev, true)} <span style={{ color: "#B8AFA5", fontWeight: 400 }}>· {S.sC[svc]}×</span></span>
                          </div>
                          <ProgBar pct={Math.round(rev / mx * 100)} color={color} h={5} />
                        </div>
                      );
                    })}
                </div>

                {/* Most Requested */}
                <div className="card">
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#2A2118", marginBottom: 16 }}>Most Requested</div>
                  {!Object.keys(S.sC).length
                    ? <div style={{ fontSize: 12, color: "#C4B9AB", textAlign: "center", padding: 24 }}>No data</div>
                    : Object.entries(S.sC).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([svc, cnt], i) => {
                      const mx = Math.max(...Object.values(S.sC), 1);
                      const color = getCatColor(svc);
                      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                      return (
                        <div key={svc} style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: i < 3 ? "#2A2118" : "#5A4838", fontWeight: i < 3 ? 700 : 500 }}>
                              {medal ? <span style={{ marginRight: 5 }}>{medal}</span> : <span style={{ marginRight: 5, color: "#C4B9AB" }}>#{i + 1}</span>}{svc}
                            </span>
                            <span style={{ fontSize: 12, color: "#2A2118", fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8 }}>{cnt}× <span style={{ color: "#B8AFA5", fontWeight: 400 }}>· {fmt(S.sR[svc] || 0, true)}</span></span>
                          </div>
                          <ProgBar pct={Math.round(cnt / mx * 100)} color={color} h={5} />
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Category Overview */}
              <div className="card">
                <div style={{ fontSize: 15, fontWeight: 700, color: "#2A2118", marginBottom: 14 }}>Category Overview</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
                  {Object.entries(S.cR).sort((a, b) => b[1] - a[1]).map(([cat, rev]) => {
                    const { icon, color } = SERVICES[cat] || { icon: "•", color: "#B08040" };
                    return (
                      <div key={cat} style={{ background: "#FDFAF6", borderRadius: 10, padding: 14, border: "1px solid #EDE6D8", borderTop: `3px solid ${color}` }}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#2A2118", marginBottom: 2 }}>{cat}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color }}>{fmt(rev, true)}</div>
                        <div style={{ fontSize: 11, color: "#B8AFA5", marginTop: 5 }}>{S.cC[cat] || 0} services</div>
                      </div>
                    );
                  })}
                  {!Object.keys(S.cR).length && <div style={{ fontSize: 12, color: "#C4B9AB", padding: 20 }}>No data</div>}
                </div>
              </div>
            </div>
          )}

          {/* ─ TIME ─ */}
          {dashTab === "time" && (() => {
            const totalVisits = ranged.length;
            const activeDays = S.cstD.filter(v => v > 0).length || 1;
            const avgDaily = Math.round(totalVisits / activeDays);
            const peakDay = DAYS[S.dR.indexOf(Math.max(...S.dR))];
            const peakDayVisits = Math.max(...S.dR);
            const dxMR = Math.max(...Object.values(S.mR), 1);
            const monthEntries = Object.entries(S.mR).sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
            return (
              <div className="fade">
                {/* KPI strip */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "Total Visits", value: totalVisits, sub: "in selected period", icon: "👥" },
                    { label: "Avg Per Active Day", value: avgDaily, sub: "clients / day", icon: "📈" },
                    { label: "Busiest Day", value: peakDay, sub: `${peakDayVisits} visits`, icon: "🔥" },
                    { label: "Active Days", value: activeDays, sub: "days with visits", icon: "📅" },
                  ].map(k => (
                    <div key={k.label} className="card" style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{k.icon}</div>
                      <div style={{ fontSize: 10, color: "#B8AFA5", textTransform: "uppercase", letterSpacing: .8, fontWeight: 600, marginBottom: 4 }}>{k.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#2A2118", lineHeight: 1 }}>{k.value}</div>
                      <div style={{ fontSize: 11, color: "#9A9088", marginTop: 4 }}>{k.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Daily trend + Monthly Revenue */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  {/* Daily trend */}
                  <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#2A2118" }}>Daily Customers</div>
                      <div style={{ fontSize: 11, color: "#9A9088" }}>Last {S.cstD.length} days</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 96, marginBottom: 8 }}>
                      {S.cstD.map((v, i) => {
                        const mx = Math.max(...S.cstD, 1);
                        const h = Math.max(Math.round((v / mx) * 88), v > 0 ? 4 : 2);
                        const isToday = i === S.cstD.length - 1;
                        const isPeak = v === mx && mx > 0;
                        return (
                          <div key={i} title={`${v} visits`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                            {(isToday || isPeak) && v > 0 && <div style={{ fontSize: 8, fontWeight: 700, color: isToday ? "#B08040" : "#9A9088" }}>{v}</div>}
                            <div style={{ width: "100%", height: h, background: isToday ? "#B08040" : isPeak ? "#C4903A" : v > 0 ? "#DDD0B0" : "#F0EAE0", borderRadius: "3px 3px 0 0", minHeight: 2 }} />
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#C4B9AB" }}>
                      <span>Earlier</span>
                      <span style={{ color: "#B08040", fontWeight: 700 }}>Today</span>
                    </div>
                  </div>

                  {/* Monthly Revenue */}
                  <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#2A2118" }}>Monthly Revenue</div>
                      <div style={{ fontSize: 11, color: "#9A9088" }}>Last 6 months</div>
                    </div>
                    {!monthEntries.length
                      ? <div style={{ fontSize: 12, color: "#C4B9AB", textAlign: "center", padding: 24 }}>No data</div>
                      : monthEntries.map(([month, rev], idx) => {
                        const [yr, mo] = month.split("-");
                        const isLatest = idx === monthEntries.length - 1;
                        const pct = Math.round(rev / dxMR * 100);
                        return (
                          <div key={month} style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                              <span style={{ fontSize: 12, color: isLatest ? "#2A2118" : "#9A9088", fontWeight: isLatest ? 700 : 400 }}>{MONTHS[parseInt(mo) - 1]} {yr}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: isLatest ? "#B08040" : "#9A9088" }}>{fmt(rev, true)}</span>
                            </div>
                            <ProgBar pct={pct} color={isLatest ? "#B08040" : "#D4C4A8"} h={6} />
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Day-of-Week — full-width horizontal bars */}
                <div className="card" style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#2A2118" }}>Busiest Days of the Week</div>
                      <div style={{ fontSize: 12, color: "#B8AFA5", marginTop: 2 }}>Revenue & visits by weekday</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#B8AFA5" }}>{totalVisits} total visits</div>
                  </div>
                  {DAYS.map((day, i) => {
                    const mxR = Math.max(...S.dR, 1);
                    const pct = Math.round(S.dR[i] / mxR * 100);
                    const best = S.dR[i] === mxR;
                    return (
                      <div key={day} style={{ display: "grid", gridTemplateColumns: "52px 1fr 90px 60px", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: best ? 700 : 500, color: best ? "#2A2118" : "#9A9088" }}>{day}{best ? " 🔥" : ""}</div>
                        <div style={{ position: "relative", height: 10, background: "#F0EAE0", borderRadius: 100, overflow: "hidden" }}>
                          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct || 1}%`, background: best ? "#B08040" : "#D4C4A8", borderRadius: 100, transition: "width .4s ease" }} />
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: best ? "#2A2118" : "#9A9088", textAlign: "right" }}>{fmt(S.dR[i], true)}</div>
                        <div style={{ fontSize: 11, color: "#B8AFA5", textAlign: "right" }}>{S.dC[i]} visits</div>
                      </div>
                    );
                  })}
                </div>

                {/* Client Flow Analysis */}
                <div className="card">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#2A2118" }}>Client Flow Analysis</div>
                      <div style={{ fontSize: 12, color: "#B8AFA5", marginTop: 2 }}>Hourly visit patterns across the day</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#C4B9AB" }}>{totalVisits} total visits</div>
                  </div>
                  <ClientFlow data={S.hm} isMobile={isMobile} />
                </div>
              </div>
            );
          })()}

          {/* ─ DISCOUNTS ─ */}
          {dashTab === "discounts" && (() => {
            const today = todayStr();
            const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 6);
            const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 29);
            const toDateStr = d => d.toISOString().slice(0, 10);
            const discTxns = ranged.filter(t => t.discountAmt > 0);

            // Per-person stats
            const personMap = {};
            discTxns.forEach(t => {
              const person = t.discCourtesyBy || "(Not specified)";
              if (!personMap[person]) personMap[person] = { count: 0, totalAmt: 0, totalPct: 0, pctCount: 0, flatCount: 0, history: [] };
              const p = personMap[person];
              p.count++;
              p.totalAmt += t.discountAmt || 0;
              if (t.discMode === "pct" && t.discount > 0) { p.totalPct += t.discount; p.pctCount++; }
              else { p.flatCount++; }
              p.history.push(t);
            });

            const sortedPersons = Object.entries(personMap).sort((a, b) => b[1].totalAmt - a[1].totalAmt);
            const grandTotal = discTxns.reduce((s, t) => s + (t.discountAmt || 0), 0);
            const grandCount = discTxns.length;

            // Daily breakdown for chart (last 14 days)
            const dayMap = {};
            for (let i = 13; i >= 0; i--) {
              const d = new Date(); d.setDate(d.getDate() - i);
              dayMap[toDateStr(d)] = 0;
            }
            discTxns.forEach(t => { if (dayMap[t.date] !== undefined) dayMap[t.date] += t.discountAmt || 0; });
            const dayKeys = Object.keys(dayMap);
            const dayVals = Object.values(dayMap);
            const maxDay = Math.max(...dayVals, 1);

            return (
              <div className="fade">
                {/* Summary row */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
                  {[
                    { label: "Total Discounted", val: fmt(grandTotal, true), sub: `${grandCount} transactions`, color: "#A0303F" },
                    { label: "Avg Discount", val: grandCount ? fmt(Math.round(grandTotal / grandCount), true) : "—", sub: "per transaction", color: "#B08040" },
                    { label: "Discount Rate", val: ranged.length ? `${Math.round(grandCount / ranged.length * 100)}%` : "—", sub: "of all transactions", color: "#1A3A5C" },
                    { label: "People Tracking", val: sortedPersons.filter(([k]) => k !== "(Not specified)").length, sub: "courtesy staff", color: "#3C2218" },
                  ].map(({ label, val, sub, color }) => (
                    <div key={label} className="card" style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 11, color: "#9A9088", fontWeight: 600, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontSize: 11, color: "#B8AFA5", marginTop: 3 }}>{sub}</div>
                    </div>
                  ))}
                </div>

                {/* 14-day discount bar chart */}
                <div className="card" style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#2A2118", marginBottom: 14 }}>Discount Trend — Last 14 Days</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 70, marginBottom: 8 }}>
                    {dayVals.map((v, i) => {
                      const h = Math.max(Math.round(v / maxDay * 62), v > 0 ? 4 : 2);
                      const isToday = dayKeys[i] === today;
                      return (
                        <div key={i} title={`${dayKeys[i]}: ${fmt(v)}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                          {v > 0 && <div style={{ fontSize: 7, color: isToday ? "#A0303F" : "#D4C4A8" }}>{fmt(v, true)}</div>}
                          <div style={{ width: "100%", height: h, background: isToday ? "#A0303F" : v > 0 ? "#D4708080" : "#EEE6D8", borderRadius: "2px 2px 0 0", minHeight: 2 }} />
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#B8AFA5" }}>
                    <span>{dayKeys[0]}</span><span style={{ color: "#A0303F", fontWeight: 600 }}>Today</span>
                  </div>
                </div>

                {/* Per-person table */}
                <div className="card" style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#2A2118", marginBottom: 14 }}>Discount by Courtesy Person</div>
                  {sortedPersons.length === 0 && <div style={{ fontSize: 12, color: "#C4B9AB", padding: 10 }}>No discounts recorded in this period.</div>}
                  {sortedPersons.map(([person, stats]) => {
                    const pct = grandTotal ? Math.round(stats.totalAmt / grandTotal * 100) : 0;
                    const avgAmt = stats.count ? Math.round(stats.totalAmt / stats.count) : 0;
                    const avgPct = stats.pctCount ? Math.round(stats.totalPct / stats.pctCount) : 0;
                    return (
                      <div key={person} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #F0EBE3" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: person === "(Not specified)" ? "#EDE6D8" : "#2A2118", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: person === "(Not specified)" ? "#9A9088" : "#FAF7F3", fontWeight: 700 }}>
                              {person === "(Not specified)" ? "?" : person.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 14, color: "#2A2118" }}>{person}</div>
                              <div style={{ fontSize: 11, color: "#9A9088" }}>{stats.count} discount{stats.count !== 1 ? "s" : ""} given</div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, color: "#A0303F" }}>{fmt(stats.totalAmt, true)}</div>
                            <div style={{ fontSize: 11, color: "#9A9088" }}>{pct}% of total</div>
                          </div>
                        </div>
                        <ProgBar pct={pct} color="#A0303F" />
                        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                          {[
                            { label: "Avg discount", val: fmt(avgAmt, true) },
                            { label: "Avg %", val: avgPct > 0 ? `${avgPct}%` : "—" },
                            { label: "Flat discounts", val: stats.flatCount },
                            { label: "% discounts", val: stats.pctCount },
                          ].map(({ label, val }) => (
                            <div key={label} style={{ background: "#F8F5F0", borderRadius: 8, padding: "6px 10px", flex: "1 1 auto", minWidth: 70 }}>
                              <div style={{ fontSize: 10, color: "#9A9088", marginBottom: 2 }}>{label}</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#2A2118" }}>{val}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Full discount transaction log */}
                <div className="card">
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#2A2118", marginBottom: 14 }}>Discount Log</div>
                  {discTxns.length === 0 && <div style={{ fontSize: 12, color: "#C4B9AB" }}>No discounted transactions in this range.</div>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {discTxns.slice(0, 50).map(t => (
                      <div key={t.slip} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#FDFAF6", borderRadius: 10, border: "1px solid #EDE6D8" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 13, color: "#2A2118" }}>{t.customerName || "Walk-in"}</span>
                            {t.discCourtesyBy && <span style={{ fontSize: 10, background: "#2A2118", color: "#FAF7F3", borderRadius: 4, padding: "1px 6px" }}>{t.discCourtesyBy}</span>}
                          </div>
                          <div style={{ fontSize: 11, color: "#9A9088" }}>{t.date} • {t.time} • #{t.slip}</div>
                          {t.discReason && <div style={{ fontSize: 11, color: "#B08040", marginTop: 2, fontStyle: "italic" }}>"{t.discReason}"</div>}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, color: "#A0303F" }}>−{fmt(t.discountAmt)}</div>
                          <div style={{ fontSize: 10, color: "#9A9088" }}>{t.discMode === "pct" ? `${t.discount}% off` : "Fixed"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )
      }

      {/* ══ HISTORY ═════════════════════════════════════════════════════════ */}
      {
        view === "history" && (
          <div style={{ padding: "20px 24px 80px", overflowY: "auto", height: "calc(100dvh - 62px)", paddingBottom: "env(safe-area-inset-bottom, 80px)" }} className="fade">

            {/* Header + sub-tabs */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color: "#2A2118" }}>
                {hTab === "transactions" ? "Transaction History" : "Client Directory"}
              </div>
              <div style={{ display: "flex", background: "#F5F0E8", padding: 4, borderRadius: 10, gap: 2 }}>
                {[["transactions", "📋 Transactions"], ...(ROLE_RANK[user.role] >= 3 ? [["clients", "👥 Clients"]] : [])].map(([t, l]) => (
                  <button key={t} className={`nav-tab ${hTab === t ? "on" : "off"}`}
                    onClick={() => { setHTab(t); setHNavFromClient(null); if (t === "clients") setHQ(""); }} style={{ padding: "6px 16px", fontSize: 12 }}>{l}</button>
                ))}
              </div>
            </div>

            {/* ── TRANSACTIONS sub-tab ── */}
            {hTab === "transactions" && (<div className="fade">

              {/* Active search breadcrumb — always shows when hQ is set */}
              {hQ.trim() && (() => {
                // Find matching client for display name
                const matchedClient = clients.find(c =>
                  c.phone === hQ.trim() ||
                  c.name.toLowerCase() === hQ.trim().toLowerCase() ||
                  (hNavFromClient && c.key === hNavFromClient.key)
                );
                const displayLabel = matchedClient?.name || hNavFromClient?.name || hQ.trim();
                const clientKey = matchedClient?.key || hNavFromClient?.key || null;
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 16px", background: "#FBF6EE", border: "1px solid #E8DECE", borderRadius: 10 }}>
                    <span style={{ fontSize: 18 }}>🔍</span>
                    <span style={{ fontSize: 13, color: "#6B5030", flex: 1 }}>
                      Showing transactions for <strong style={{ color: "#2A2118" }}>{displayLabel}</strong>
                    </span>
                    {ROLE_RANK[user.role] >= 3 && clientKey && (
                      <button onClick={() => {
                        setHTab("clients");
                        setHQ("");
                        setHNavFromClient(null);
                        setExpandedClient(clientKey);
                      }} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#2A2118", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#FFF", cursor: "pointer", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap" }}>
                        ← Client Profile
                      </button>
                    )}
                    <button onClick={() => { setHQ(""); setHNavFromClient(null); }}
                      style={{ background: "none", border: "1px solid #D4C4A8", borderRadius: 6, padding: "5px 10px", fontSize: 12, color: "#8A7060", cursor: "pointer", fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap" }}>
                      ✕ Clear
                    </button>
                  </div>
                );
              })()}

              {/* History filter bar */}
              <div style={{ background: "#FFFFFF", border: "1px solid #EDE6D8", borderRadius: 14, padding: "16px 18px", marginBottom: 18, boxShadow: "0 1px 6px rgba(44,33,24,.04)" }}>
                {/* Row 1 */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "flex-end", marginBottom: 14 }}>
                  <div>
                    <div className="filter-label">Period</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[["all", "All"], ["today", "Today"], ["7d", "7d"], ["30d", "30d"], ["90d", "90d"]].map(([r, l]) => (
                        <button key={r} className={`rbtn ${hRange === r && !hFrom ? "on" : ""}`}
                          onClick={() => { setHRange(r); setHFrom(""); setHTo(""); setHDate(""); }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="filter-label">Custom Range</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input type="date" className="inp" value={hFrom} onChange={e => { setHFrom(e.target.value); setHRange(""); }} onClick={e => { try { e.target.showPicker(); } catch (err) { } }} style={{ width: 128, padding: "5px 10px", fontSize: 11, cursor: "pointer" }} />
                      <span style={{ color: "#C4B9AB", fontSize: 12 }}>→</span>
                      <input type="date" className="inp" value={hTo} onChange={e => { setHTo(e.target.value); setHRange(""); }} onClick={e => { try { e.target.showPicker(); } catch (err) { } }} style={{ width: 128, padding: "5px 10px", fontSize: 11, cursor: "pointer" }} />
                    </div>
                  </div>
                  <div>
                    <div className="filter-label">Search</div>
                    <input className="inp" placeholder="🔍 Name, phone or slip…" value={hQ}
                      onChange={e => setHQ(e.target.value)} style={{ width: 200, padding: "5px 10px", fontSize: 12 }} />
                  </div>
                </div>
                {/* Row 2 */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "flex-end", paddingTop: 12, borderTop: "1px solid #F0EAE0" }}>
                  <div>
                    <div className="filter-label">Stylist</div>
                    <select className="inp" value={hSty} onChange={e => setHSty(e.target.value)} style={{ width: 136, padding: "5px 10px", fontSize: 12 }}>
                      <option value="">All Stylists</option>
                      {[...new Set([...dbStylists.map(s => s.name), ...transactions.flatMap(x => x.cart.map(c => c.stylist)).filter(Boolean)])].filter(n => n !== "Unassigned").sort().map(n => <option key={n} value={n}>{n}</option>)}
                      <option value="Unassigned">Unassigned</option>
                    </select>
                  </div>
                  <div>
                    <div className="filter-label">Category</div>
                    <select className="inp" value={hCat} onChange={e => setHCat(e.target.value)} style={{ width: 148, padding: "5px 10px", fontSize: 12 }}>
                      <option value="">All Categories</option>
                      {Object.keys(SERVICES).map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="filter-label">Payment</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[["", "All"], ["CASH", "Cash"], ["ONLINE", "Online"], ["CARD", "Card"], ["SPLIT", "Split"]].map(([v, l]) => (
                        <button key={l} className={`rbtn ${hPay === v ? "on" : ""}`} onClick={() => setHPay(v)}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ fontSize: 11, color: "#B8AFA5", whiteSpace: "nowrap", paddingBottom: 1 }}>
                      {histTxns.length} records · {fmt(histTxns.reduce((s, t) => s + t.total, 0), true)}
                    </div>
                    {(hQ || hDate || hSty || hCat || hPay || hFrom || (hRange && hRange !== "all")) && (
                      <button onClick={() => { setHQ(""); setHDate(""); setHSty(""); setHCat(""); setHPay(""); setHRange("all"); setHFrom(""); setHTo(""); }}
                        style={{
                          fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#9A9088", background: "transparent",
                          border: "1.5px solid #E8E0D4", borderRadius: 7, padding: "7px 13px", cursor: "pointer", height: 34
                        }}>
                        ↺ Reset
                      </button>
                    )}
                    {ROLE_RANK[user.role] >= 3 && (
                    <button onClick={exportHistCSV}
                      style={{
                        fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600,
                        color: "#FFFFFF", background: "#2A2118", border: "none", borderRadius: 7,
                        padding: "7px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, height: 34
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#4A3828"}
                      onMouseLeave={e => e.currentTarget.style.background = "#2A2118"}>
                      ⬇ Export CSV
                    </button>
                    )}
                  </div>
                </div>
              </div>

              {!histTxns.length
                ? <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>📋</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, color: "#C4B9AB" }}>No transactions found</div>
                </div>
                : histTxns.map(txn => {
                  const isAmended = Array.isArray(txn.amendments) && txn.amendments.length > 0;
                  // Deduplicate stylists for display
                  const uniqueStylists = [...new Set(
                    txn.cart.map(c => c.stylist).filter(Boolean).length > 0
                      ? txn.cart.map(c => c.stylist).filter(Boolean)
                      : (txn.stylist || "").split(',').map(s => s.trim()).filter(Boolean)
                  )];
                  const payColors = { CASH: { bg: "#ECFDF5", color: "#047857" }, ONLINE: { bg: "#EFF6FF", color: "#1D4ED8" }, CARD: { bg: "#F5F3FF", color: "#6D28D9" }, SPLIT: { bg: "#FFF7ED", color: "#C2410C" } };
                  const pc = payColors[txn.payMode] || payColors.CASH;
                  return (
                  <div key={txn.id} className="hrow card" style={{ marginBottom: 10, borderLeft: isAmended ? "3px solid #F59E0B" : "3px solid transparent", background: isAmended ? "#FFFDF7" : "#FFF" }}>
                    {/* Top row: name + actions */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#2A2118" }}>{txn.customerName}</span>
                          {txn.customerPhone && <span style={{ fontSize: 11, color: "#9A9088", background: "#F5F0E8", padding: "2px 8px", borderRadius: 100 }}>📞 {txn.customerPhone}</span>}
                          {isAmended && (
                            <button onClick={() => setViewingAmendment(txn)}
                              style={{ fontSize: 10, fontWeight: 600, background: "#FEF3C7", color: "#92400E", borderRadius: 6, padding: "2px 8px", border: "1px solid #FDE68A", cursor: "pointer" }}>
                              ✏️ {txn.amendments.length} edit{txn.amendments.length > 1 ? "s" : ""}
                            </button>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, color: "#B8AFA5" }}>#{txn.slip}</span>
                          <span style={{ fontSize: 11, color: "#B8AFA5" }}>·</span>
                          <span style={{ fontSize: 11, color: "#9A9088" }}>{txn.date}</span>
                          {txn.time && <><span style={{ fontSize: 11, color: "#B8AFA5" }}>·</span><span style={{ fontSize: 11, color: "#9A9088" }}>{txn.time}</span></>}
                          {uniqueStylists.length > 0 && <><span style={{ fontSize: 11, color: "#B8AFA5" }}>·</span>
                          <span style={{ fontSize: 11, color: "#9A9088" }}>✂️ {uniqueStylists.join(", ")}</span></>}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, background: pc.bg, color: pc.color, padding: "3px 10px", borderRadius: 100 }}>{txn.payMode}</span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: "#2A2118" }}>{fmt(txn.total)}</span>
                        <button onClick={() => printReceipt(txn, true)}
                          style={{ fontSize: 11, fontWeight: 600, color: "#6B5040", background: "#F5F0E8", border: "1.5px solid #E0D4C0", borderRadius: 8, padding: "5px 10px", cursor: "pointer", whiteSpace: "nowrap" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#EDE4D4"}
                          onMouseLeave={e => e.currentTarget.style.background = "#F5F0E8"}
                          title="Reprint receipt">
                          🖨️ Print
                        </button>
                        {ROLE_RANK[user.role] >= 1 && (
                          <button onClick={() => openEditBill(txn)}
                            style={{ fontSize: 11, fontWeight: 600, color: "#B08040", background: "#FEF9EE", border: "1.5px solid #F0D98A", borderRadius: 8, padding: "5px 10px", cursor: "pointer", whiteSpace: "nowrap" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#FDF0C0"}
                            onMouseLeave={e => e.currentTarget.style.background = "#FEF9EE"}>
                            ✏️ Edit
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Services */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {txn.cart.map((item, i) => {
                        const color = getCatColor(item.service);
                        const sty = item.stylist || "";
                        return (
                          <span key={i} style={{ background: `${color}12`, color, border: `1px solid ${color}25`, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 5 }}>
                            {SERVICES[item.category]?.icon} {item.service}{item.qty > 1 ? ` ×${item.qty}` : ""} <span style={{ color: "#9A9088", fontWeight: 400 }}>· {fmt(item.price * item.qty, true)}</span>
                            {sty && <span style={{ background: `${color}20`, borderRadius: 100, padding: "1px 6px", fontSize: 10, fontWeight: 700, color }}>✂️ {sty}</span>}
                          </span>
                        );
                      })}
                    </div>
                    {txn.discount > 0 && <div style={{ fontSize: 11, color: "#A0303F", marginTop: 8, background: "#FFF1F2", borderRadius: 6, padding: "4px 10px", display: "inline-block" }}>🏷️ {txn.discount}% discount · saved {fmt(txn.discountAmt)}</div>}
                  </div>
                  );
                })
              }
            </div>)}{/* end transactions tab */}

            {/* ── CLIENTS sub-tab ── */}
            {hTab === "clients" && (<div className="fade">

              {/* Search + summary */}
              <div style={{ display: "flex", gap: 9, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
                <input className="inp" placeholder="🔍  Name or phone number…" value={clientQ}
                  onChange={e => setClientQ(e.target.value)} style={{ flex: "1 1 200px" }} />
                <div style={{ fontSize: 11, color: "#C4B9AB", whiteSpace: "nowrap" }}>
                  {filteredClients.length} clients · {transactions.length} total visits
                </div>
              </div>

              {/* Tier summary bar */}
              {(() => {
                const counts = { Diamond: 0, Gold: 0, Silver: 0, New: 0 };
                clients.forEach(cl => { const t = cl.tier.split(" ")[1]; counts[t] = (counts[t] || 0) + 1; });
                const tiers = [["💎", "Diamond", "#0E7490"], ["🥇", "Gold", "#B08040"], ["🥈", "Silver", "#6B7280"], ["🌱", "New", "#1A6B4A"]];
                return (
                  <div className="grid-4-mobile-2" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
                    {tiers.map(([ic, t, col]) => {
                      const isActive = tierFilter === t;
                      return (
                        <div key={t} onClick={() => setTierFilter(isActive ? "" : t)}
                          style={{
                            background: isActive ? col : "#FFFFFF",
                            border: `1.5px solid ${isActive ? col : "#EDE6D8"}`, borderRadius: 10,
                            padding: "10px 12px", textAlign: "center", borderTop: `3px solid ${col}`,
                            cursor: "pointer", transition: "all .18s",
                            boxShadow: isActive ? `0 4px 14px ${col}40` : "none",
                            transform: isActive ? "translateY(-2px)" : "none"
                          }}>
                          <div style={{ fontSize: 18, marginBottom: 3 }}>{ic}</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: isActive ? "#FFF" : "#2A2118" }}>{counts[t] || 0}</div>
                          <div style={{
                            fontSize: 10, textTransform: "uppercase", letterSpacing: .8,
                            color: isActive ? "rgba(255,255,255,.75)" : "#B8AFA5"
                          }}>{t}</div>
                          {isActive && <div style={{ fontSize: 9, color: "rgba(255,255,255,.8)", marginTop: 3, fontWeight: 600 }}>✓ Filtered</div>}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Client cards */}
              {filteredClients.length === 0
                ? <div style={{ textAlign: "center", padding: "50px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>👥</div>
                  <div style={{ fontSize: 14, color: "#C4B9AB" }}>No clients found</div>
                </div>
                : filteredClients.map(cl => {
                  const isOpen = expandedClient === cl.key;
                  const daysSince = Math.floor((new Date() - new Date(cl.lastVisit)) / (864e5));
                  return (
                    <div key={cl.key} style={{
                      background: "#FFFFFF", border: "1px solid #EDE6D8",
                      borderRadius: 14, marginBottom: 8, overflow: "hidden",
                      boxShadow: isOpen ? "0 4px 20px rgba(44,33,24,.08)" : "none", transition: "box-shadow .2s"
                    }}>

                      {/* Row — always visible */}
                      <div onClick={() => setExpandedClient(isOpen ? null : cl.key)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", cursor: "pointer" }}>

                        {/* Avatar */}
                        <div style={{
                          width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                          background: "linear-gradient(135deg,#2A2118,#5A4030)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 17, fontWeight: 700, color: "#F5E6C8"
                        }}>
                          {cl.name[0].toUpperCase()}
                        </div>

                        {/* Name + tier */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#2A2118" }}>{cl.name}</span>
                            <span style={{
                              fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 100,
                              background: `${cl.tierColor}15`, color: cl.tierColor
                            }}>{cl.tier}</span>
                            {cl.phone && <span style={{ fontSize: 11, color: "#B8AFA5", background: "#F5F0E8", padding: "2px 8px", borderRadius: 100 }}>📞 {cl.phone}</span>}
                          </div>
                          <div style={{ fontSize: 11, color: "#B8AFA5", marginTop: 2 }}>
                            {daysSince === 0 ? "Last seen today" : daysSince === 1 ? "Last seen yesterday" : `Last seen ${daysSince}d ago`}
                            <span style={{ margin: "0 5px", color: "#DDD" }}>·</span>
                            {cl.topSvcs[0] && <span style={{ color: "#9A9088" }}>Loves {cl.topSvcs[0][0]}</span>}
                          </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#2A2118" }}>{cl.visits.length}</div>
                            <div style={{ fontSize: 9, color: "#B8AFA5", textTransform: "uppercase", letterSpacing: .5 }}>Visits</div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#B08040" }}>{fmt(cl.spend, true)}</div>
                            <div style={{ fontSize: 9, color: "#B8AFA5", textTransform: "uppercase", letterSpacing: .5 }}>Spent</div>
                          </div>
                          <div style={{ fontSize: 16, color: "#D4C4B0", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .2s" }}>›</div>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {isOpen && (
                        <div style={{ borderTop: "1px solid #F0EAE0", padding: "14px 16px", background: "#FDFAF6" }}>

                          {/* Stats row */}
                          <div className="grid-3-mobile-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                            {[
                              { label: "Total Visits", val: cl.visits.length, icon: "🔁" },
                              { label: "Avg / Visit", val: fmt(cl.avg, true), icon: "🎯" },
                              { label: "Total Spend", val: fmt(cl.spend, true), icon: "💰" },
                            ].map(s => (
                              <div key={s.label} style={{
                                background: "#FFFFFF", border: "1px solid #EDE6D8",
                                borderRadius: 10, padding: "10px", textAlign: "center"
                              }}>
                                <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#2A2118" }}>{s.val}</div>
                                <div style={{ fontSize: 9, color: "#B8AFA5", textTransform: "uppercase", letterSpacing: .6, marginTop: 2 }}>{s.label}</div>
                              </div>
                            ))}
                          </div>

                          {/* Fav services */}
                          {cl.topSvcs.length > 0 && (
                            <div style={{ marginBottom: 14 }}>
                              <div style={{
                                fontSize: 11, fontWeight: 600, color: "#9A9088",
                                textTransform: "uppercase", letterSpacing: .8, marginBottom: 8
                              }}>⭐ Favourite Services</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {cl.topSvcs.map(([svc, cnt]) => {
                                  const cat = Object.entries(SERVICES).find(([, s]) => s.items.includes(svc))?.[0];
                                  const col = SERVICES[cat]?.color || "#B08040";
                                  const ico = SERVICES[cat]?.icon || "";
                                  return (
                                    <span key={svc} style={{
                                      background: `${col}12`, color: col,
                                      border: `1px solid ${col}25`, borderRadius: 100,
                                      padding: "4px 11px", fontSize: 12, fontWeight: 600,
                                      display: "inline-flex", alignItems: "center", gap: 5
                                    }}>
                                      {ico} {svc} <span style={{ opacity: .55 }}>×{cnt}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Recent visits */}
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", letterSpacing: .8, marginBottom: 10 }}>📋 Recent Visits</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {cl.visits.slice(0, 6).map(t => {
                              const d = new Date(t.date);
                              const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
                              const uniqStys = [...new Set(t.cart.map(c => c.stylist).filter(Boolean))];
                              const styLabel = uniqStys.length ? uniqStys.join(", ") : t.stylist || "Unassigned";
                              return (
                                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#FFFFFF", border: "1px solid #EDE6D8", borderRadius: 10, padding: "10px 14px" }}>
                                  <div style={{ textAlign: "center", flexShrink: 0, width: 34, background: "#F5F0E8", borderRadius: 8, padding: "4px 0" }}>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: "#2A2118", lineHeight: 1 }}>{d.getDate()}</div>
                                    <div style={{ fontSize: 9, color: "#B8AFA5", textTransform: "uppercase", fontWeight: 600 }}>{mo}</div>
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, color: "#2A2118", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                      {t.cart.map(i => i.service).join(", ")}
                                    </div>
                                    <div style={{ fontSize: 10, color: "#B8AFA5", marginTop: 2 }}>✂️ {styLabel}</div>
                                  </div>
                                  <div style={{ fontSize: 13, fontWeight: 800, color: "#2A2118", flexShrink: 0 }}>{fmt(t.total, true)}</div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Jump to transactions */}
                          <button onClick={() => {
                            setView("history");
                            setHTab("transactions");
                            setHRange("all");
                            setHQ(cl.phone || cl.name);
                            setHNavFromClient({ name: cl.name, key: cl.key });
                            setExpandedClient(null);
                          }}
                            style={{
                              marginTop: 12, width: "100%", fontFamily: "'Outfit',sans-serif",
                              fontSize: 13, fontWeight: 700, color: "#FFF", background: "#2A2118",
                              border: "none", borderRadius: 10, padding: "11px", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                            }}>
                            📋 View all {cl.visits.length} transactions →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              }
            </div>)}{/* end clients tab */}

          </div>
        )
      }

      {/* ══ ADMINISTRATIVE HUB (DASHBOARD) ════════════════════════════════════════ */}
      {
        view === "settings" && hasNavAccess(user.role, 'settings') && (
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", height: "calc(100dvh - 62px)", background: "#FDFAF6" }} className="fade">

            {/* Sidebar / Tabs */}
            <div style={{
              width: isMobile ? "100%" : 240, background: "#FFFFFF", borderRight: isMobile ? "none" : "1px solid #EDE6D8",
              borderBottom: isMobile ? "1px solid #EDE6D8" : "none",
              display: "flex", flexDirection: "column", padding: isMobile ? "0" : "24px 0",
              flexShrink: 0
            }} className="catstrip">
              {!isMobile && (
                <div style={{ padding: "0 24px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", letterSpacing: 1.2 }}>Management</div>
                </div>
              )}

              {/* Tab buttons — horizontal scroll on mobile, vertical list on desktop */}
              <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", overflowX: isMobile ? "auto" : "visible", flex: isMobile ? "0 0 auto" : 1 }}>
              {[
                { id: "services", label: "Services Portfolio", icon: "✂️" },
                { id: "staff", label: "Staff Registry", icon: "👥" },
                { id: "courtesy", label: "Courtesy Staff", icon: "🎁" },
                { id: "profile", label: "Account Settings", icon: "👤" },
                ...(ROLE_RANK[user.role] >= 3 ? [{ id: "logs", label: "Activity Log", icon: "🗂️" }] : []),
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => { setAdminTab(item.id); setEditingSvc(null); setEditingStylist(null); setEditingUser(null); }}
                  style={{
                    padding: isMobile ? "14px 20px" : "12px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                    background: adminTab === item.id ? "#FBF6EE" : "transparent",
                    borderRight: (!isMobile && adminTab === item.id) ? "3px solid #B08040" : "none",
                    borderBottom: (isMobile && adminTab === item.id) ? "3px solid #B08040" : "none",
                    transition: "all .2s",
                    flexShrink: 0,
                    whiteSpace: "nowrap"
                  }}
                >
                  <span style={{ fontSize: 18, opacity: adminTab === item.id ? 1 : 0.6 }}>{item.icon}</span>
                  <span style={{
                    fontSize: 14, fontWeight: adminTab === item.id ? 700 : 500,
                    color: adminTab === item.id ? "#2A2118" : "#9A9088"
                  }}>{item.label}</span>
                </div>
              ))}
              </div>{/* end tab buttons row */}

              <div style={{ marginTop: "auto", padding: isMobile ? "10px 12px" : "20px 24px", borderTop: "1px solid #EDE6D8" }}>
                <div style={{
                  background: "#fdfaf6", borderRadius: 12, padding: isMobile ? "8px 10px" : 12, border: "1px solid #EDE6D8",
                  display: "flex", alignItems: "center", gap: 10
                }}>
                  <div style={{
                    width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, borderRadius: "50%", background: "#2A2118",
                    color: "#F5E6C8", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: isMobile ? 12 : 14, fontWeight: 700, flexShrink: 0
                  }}>{user.username[0].toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 700, color: "#2A2118", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{user.full_name || user.username}</div>
                    <div style={{ fontSize: 10, color: "#B8AFA5", textTransform: "uppercase" }}>{user.role}</div>
                  </div>
                  <button onClick={onLogout} title="Logout" style={{
                    background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, cursor: "pointer",
                    fontSize: 10, fontWeight: 700, color: "#991B1B", padding: isMobile ? "5px 8px" : "6px 10px", transition: "all .2s", flexShrink: 0
                  }}>LOGOUT</button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 14px 100px" : "32px 40px", height: "100%", paddingBottom: isMobile ? "env(safe-area-inset-bottom, 100px)" : 0 }}>

              {/* 1. Services Tab */}
              {adminTab === "services" && (
                <div className="fade">
                  <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 26, fontWeight: 800, color: "#2A2118" }}>Services & Pricing</h1>
                      <p style={{ fontSize: 14, color: "#9A9088", marginTop: 4 }}>Manage salon offerings and price lists.</p>
                    </div>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="btn-gold"
                      style={{ padding: "8px 16px", fontSize: 12, borderRadius: 8, width: "auto" }}
                    >+ Add Service</button>
                  </div>

                  <div className="stack-mobile" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr", gap: 24, marginBottom: 32 }}>

                    {/* Left Column: Services Registry */}
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                      <div style={{ padding: "12px 20px", borderBottom: "1px solid #EDE6D8", background: "#fdfaf6", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#5A4030", whiteSpace: "nowrap" }}>Services Registry</span>
                        <input
                          className="inp"
                          placeholder="🔍 Search services..."
                          value={svcSearch}
                          onChange={e => setSvcSearch(e.target.value)}
                          style={{ fontSize: 12, padding: "6px 12px", maxWidth: 200 }}
                        />
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead style={{ background: "#f8f5f0", borderBottom: "1px solid #EDE6D8" }}>
                            <tr>
                              <th style={{ textAlign: "left", padding: "12px 20px", fontSize: 10, color: "#9A9088", textTransform: "uppercase" }}>Service</th>
                              <th style={{ textAlign: "left", padding: "12px 20px", fontSize: 10, color: "#9A9088", textTransform: "uppercase" }}>Price</th>
                              <th style={{ textAlign: "right", padding: "12px 20px", fontSize: 10, color: "#9A9088", textTransform: "uppercase" }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dbServices.filter(s => !svcSearch || s.name.toLowerCase().includes(svcSearch.toLowerCase()) || s.category.toLowerCase().includes(svcSearch.toLowerCase())).map(s => (
                              <React.Fragment key={s.id}>
                                <tr style={{ borderBottom: "1px solid #f0eae0", background: editingSvc?.id === s.id ? "#FBF6EE" : "transparent" }}>
                                  <td style={{ padding: "12px 20px" }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#2A2118" }}>{s.name}</div>
                                    <div style={{ fontSize: 10, color: categories.some(c => c.name === s.category) || s.category === 'Deal' ? s.color : "#A0303F", fontWeight: 700 }}>
                                      {categories.some(c => c.name === s.category) || s.category === 'Deal' ? s.category : "⚠️ DELETED CATEGORY"}
                                    </div>
                                  </td>
                                  <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 800, color: "#B08040" }}>{fmt(s.price)}</td>
                                  <td style={{ padding: "12px 20px", textAlign: "right" }}>
                                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                                      <button onClick={() => {
                                        const isCatActive = categories.some(c => c.name === s.category) || s.category === 'Deal';
                                        setEditingSvc({ id: s.id, name: s.name, category: isCatActive ? s.category : '', price: s.price, included_services: s.included_services || [] });
                                      }} style={{ background: "none", border: "none", color: "#B08040", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>Edit</button>
                                      <button onClick={() => setDelSvcConfirmId(s.id)} style={{ background: "none", border: "none", color: "#A0303F", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>Delete</button>
                                    </div>
                                  </td>
                                </tr>
                                {editingSvc?.id === s.id && (
                                  <tr style={{ background: "#faf7f2", borderBottom: "1px solid #EDE6D8" }}>
                                    <td colSpan={3} style={{ padding: 16 }}>
                                      <div style={{ fontSize: 14, fontWeight: 700, color: "#2A2118", marginBottom: 12 }}>✏️ Edit — {editingSvc.name}</div>
                                      <div className="grid-3-mobile-1" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 10 }}>
                                        <div>
                                          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Name</label>
                                          <input className="inp" value={editingSvc.name} onChange={e => setEditingSvc(prev => ({ ...prev, name: e.target.value }))} />
                                        </div>
                                        <div>
                                          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Category</label>
                                          <select className="inp" value={editingSvc.category} onChange={e => setEditingSvc(prev => ({ ...prev, category: e.target.value }))}>
                                            <option value="" disabled>Select Category</option>
                                            <option value="Deal">Deal</option>
                                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                          </select>
                                        </div>
                                        <div>
                                          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Price (PKR)</label>
                                          <input className="inp" type="number" value={editingSvc.price} onChange={e => setEditingSvc(prev => ({ ...prev, price: Number(e.target.value) }))} />
                                        </div>
                                        {editingSvc.category === 'Deal' && (
                                          <div style={{ gridColumn: "1 / -1", marginTop: 6 }}>
                                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Included Services</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, maxHeight: 160, overflowY: 'auto', border: '1px solid #E8E0D4', borderRadius: 8, padding: 8, background: '#FDFAF6' }}>
                                              {dbServices.filter(svc => svc.category !== 'Deal').map(svc => {
                                                const isSelected = editingSvc.included_services?.includes(svc.name);
                                                return (
                                                  <div key={svc.id} onClick={() => {
                                                    const next = isSelected ? (editingSvc.included_services || []).filter(n => n !== svc.name) : [...(editingSvc.included_services || []), svc.name];
                                                    setEditingSvc(prev => ({ ...prev, included_services: next }));
                                                  }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: isSelected ? '#F5F0E8' : '#FFF', border: `1px solid ${isSelected ? '#C4A870' : '#E8E0D4'}`, borderRadius: 6, cursor: 'pointer', transition: 'all .1s' }}>
                                                    <div style={{ width: 14, height: 14, borderRadius: 3, border: `1px solid ${isSelected ? '#2A2118' : '#C4B9AB'}`, background: isSelected ? '#2A2118' : '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                      {isSelected && <svg width="8" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                      <span style={{ fontSize: 11, fontWeight: 600, color: '#2A2118', lineHeight: 1.2 }}>{svc.name}</span>
                                                      <span style={{ fontSize: 10, color: '#9A9088' }}>{fmt(svc.price)}</span>
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                                        <button
                                          onClick={async () => {
                                            if (!editingSvc.category) return showToast('Please select a valid category', 'error');
                                            await fetch(`/api/services/${editingSvc.id}`, {
                                              method: 'PUT',
                                              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                              body: JSON.stringify(editingSvc)
                                            });
                                            fetchServices();
                                            setEditingSvc(null);
                                          }}
                                          className="btn-gold" style={{ width: "auto", padding: "8px 20px", borderRadius: 8, fontSize: 12 }}
                                        >Save Changes</button>
                                        <button onClick={() => setEditingSvc(null)} className="btn-ghost" style={{ width: "auto", padding: "8px 16px", fontSize: 12 }}>Cancel</button>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right Column: Categories */}
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                      <div style={{ padding: "12px 20px", borderBottom: "1px solid #EDE6D8", background: "#fdfaf6", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#5A4030", whiteSpace: "nowrap" }}>Categories</span>
                        <input
                          className="inp"
                          placeholder="🔍 Filter..."
                          value={catSearch}
                          onChange={e => setCatSearch(e.target.value)}
                          style={{ fontSize: 12, padding: "6px 12px", flex: 1, maxWidth: 140 }}
                        />
                        <button onClick={() => setShowCatLabelModal(true)} style={{ background: "#2A2118", color: "#FFF", border: "none", borderRadius: 6, fontSize: 10, padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>+ New</button>
                      </div>
                      <div style={{ padding: "8px 0" }}>
                        {categories.filter(c => !catSearch || c.name.toLowerCase().includes(catSearch.toLowerCase())).map(c => (
                          <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid #f0eae0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <span style={{ fontSize: 18 }}>{c.icon}</span>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "#2A2118" }}>{c.name}</span>
                            </div>
                            <button onClick={() => setDelCatConfirmId(c.id)} style={{ background: "none", border: "none", color: "#A0303F", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Staff Tab */}
              {adminTab === "staff" && (
                <div className="fade">
                  {/* ── Page header ── */}
                  <div style={{ marginBottom: isMobile ? 20 : 28 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 22 : 26, fontWeight: 800, color: "#2A2118", marginBottom: 4 }}>Staff Registry</h1>
                        <p style={{ fontSize: 13, color: "#9A9088" }}>Manage your salon team and system access in one place.</p>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <div style={{ background: "#FEF3C7", borderRadius: 10, padding: "8px 14px", textAlign: "center", minWidth: 60 }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: "#92400E" }}>{dbStylists.length}</div>
                          <div style={{ fontSize: 10, color: "#B45309", fontWeight: 600, textTransform: "uppercase" }}>Team</div>
                        </div>
                        <div style={{ background: "#DBEAFE", borderRadius: 10, padding: "8px 14px", textAlign: "center", minWidth: 60 }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: "#1D4ED8" }}>{dbUsers.length}</div>
                          <div style={{ fontSize: 10, color: "#2563EB", fontWeight: 600, textTransform: "uppercase" }}>Logins</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Unified Staff Table ── */}
                  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDE6D8", marginBottom: 20, overflow: "hidden" }}>

                    {/* Section header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: addingUnified ? "1px solid #EDE6D8" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#FEF3C7,#FDE68A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "#2A2118" }}>Team Members</div>
                          <div style={{ fontSize: 11, color: "#9A9088" }}>Staff profiles and login access in one place</div>
                        </div>
                      </div>
                      <button
                        onClick={() => { setAddingUnified({ full_name: '', position: '', phone: '', email: '', address: '', username: '', password: '', role: creatableRoles(user.role)[0]?.[0] || 'staff', hasLogin: false }); setEditingUser(null); setEditingStylist(null); }}
                        style={{ padding: "8px 18px", fontSize: 12, borderRadius: 8, background: "#2A2118", color: "#fff", border: "none", fontFamily: "'Outfit',sans-serif", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                      >+ Add Staff Member</button>
                    </div>

                    {/* ── Unified Add Form ── */}
                    {addingUnified && (
                      <div style={{ padding: "20px", borderBottom: "1px solid #EDE6D8", background: "#fdfaf8" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#2A2118", marginBottom: 16 }}>New Staff Member</div>
                        <input style={{ display: 'none' }} type="text" name="fakeusernameremembered" />
                        <input style={{ display: 'none' }} type="password" name="fakepasswordremembered" />

                        {/* Profile fields */}
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>Profile</div>
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 16 }}>
                          <div>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 6 }}>Full Name *</label>
                            <input className="inp" autoComplete="off" value={addingUnified.full_name} onChange={e => setAddingUnified(p => ({ ...p, full_name: e.target.value }))} placeholder="e.g. Sana Ahmed" />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 6 }}>Position</label>
                            <select className="inp" value={addingUnified.position} onChange={e => setAddingUnified(p => ({ ...p, position: e.target.value }))}>
                              <option value="">— Select position —</option>
                              {staffPositions.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 6 }}>Phone</label>
                            <input className="inp" autoComplete="off" value={addingUnified.phone} onChange={e => setAddingUnified(p => ({ ...p, phone: e.target.value }))} placeholder="+92 3XX XXXXXXX" />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 6 }}>Email</label>
                            <input className="inp" type="email" autoComplete="off" value={addingUnified.email} onChange={e => setAddingUnified(p => ({ ...p, email: e.target.value }))} placeholder="staff@example.com" />
                          </div>
                          <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 6 }}>Address</label>
                            <input className="inp" autoComplete="off" value={addingUnified.address} onChange={e => setAddingUnified(p => ({ ...p, address: e.target.value }))} placeholder="Residential address" />
                          </div>
                        </div>

                        {/* Login access toggle */}
                        <div style={{ borderTop: "1px solid #EDE6D8", paddingTop: 14, marginBottom: addingUnified.hasLogin ? 14 : 0 }}>
                          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
                            <div
                              onClick={() => setAddingUnified(p => ({ ...p, hasLogin: !p.hasLogin }))}
                              style={{ width: 38, height: 22, borderRadius: 11, background: addingUnified.hasLogin ? "#2A2118" : "#E8DECE", position: "relative", transition: "background .2s", cursor: "pointer", flexShrink: 0 }}
                            >
                              <div style={{ position: "absolute", top: 3, left: addingUnified.hasLogin ? 19 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#2A2118" }}>Enable System Login</div>
                              <div style={{ fontSize: 11, color: "#9A9088" }}>Allow this person to log into the POS</div>
                            </div>
                          </label>
                        </div>

                        {addingUnified.hasLogin && (
                          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginTop: 14, padding: "14px 16px", background: "#F5F0E8", borderRadius: 10 }}>
                            <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B5030", textTransform: "uppercase", letterSpacing: .5 }}>Login Credentials</div>
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 6 }}>Username *</label>
                              <input className="inp" autoComplete="off" value={addingUnified.username} onChange={e => setAddingUnified(p => ({ ...p, username: e.target.value.toLowerCase().replace(/\s/g, '') }))} placeholder="No spaces" />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 6 }}>Role *</label>
                              <select className="inp" value={addingUnified.role} onChange={e => setAddingUnified(p => ({ ...p, role: e.target.value }))}>
                                {creatableRoles(user.role).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                              </select>
                            </div>
                            <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
                              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 6 }}>Password * (min 8 characters)</label>
                              <input className="inp" type="password" autoComplete="new-password" value={addingUnified.password} onChange={e => setAddingUnified(p => ({ ...p, password: e.target.value }))} placeholder="Enter password" />
                            </div>
                          </div>
                        )}

                        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                          <button
                            onClick={async () => {
                              try {
                                if (!addingUnified.full_name.trim()) return showToast('Full name is required', 'error');
                                if (addingUnified.hasLogin && (!addingUnified.username || !addingUnified.password)) return showToast('Username and password are required for login', 'error');
                                const body = {
                                  full_name: addingUnified.full_name,
                                  position: addingUnified.position,
                                  phone: addingUnified.phone,
                                  email: addingUnified.email,
                                  address: addingUnified.address,
                                };
                                if (addingUnified.hasLogin) {
                                  body.username = addingUnified.username;
                                  body.password = addingUnified.password;
                                  body.role = addingUnified.role;
                                }
                                const res = await fetch('/api/staff/create', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                  body: JSON.stringify(body),
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.message || 'Error creating staff member');
                                if (data.stylist) setDbStylists(prev => [...prev, data.stylist]);
                                if (data.user) setDbUsers(prev => [...prev, data.user]);
                                setAddingUnified(null);
                                showToast('Staff member added successfully!');
                              } catch (err) {
                                showToast(err.message, 'error');
                              }
                            }}
                            style={{ padding: "10px 24px", borderRadius: 8, background: "#2A2118", color: "#fff", border: "none", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                          >Create Staff Member</button>
                          <button onClick={() => setAddingUnified(null)} className="btn-ghost" style={{ width: "auto", padding: "10px 20px", fontSize: 13 }}>Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* Search */}
                    <div style={{ padding: "10px 16px", borderBottom: "1px solid #EDE6D8", background: "#fdfaf6" }}>
                      <input
                        className="inp"
                        placeholder="🔍 Search by name, position, role, phone…"
                        value={staffUnifiedSearch}
                        onChange={e => setStaffUnifiedSearch(e.target.value)}
                        style={{ fontSize: 12, padding: "6px 12px", width: "100%", boxSizing: "border-box" }}
                      />
                    </div>

                    {/* Unified Table */}
                    {(() => {
                      // Build merged rows: stylists as primary, then unlinked users
                      const matchedUserIds = new Set();
                      const rows = [];
                      dbStylists.forEach(s => {
                        const linkedUser = dbUsers.find(u => u.full_name === s.name);
                        if (linkedUser) matchedUserIds.add(linkedUser.id);
                        rows.push({ key: `s${s.id}`, stylist: s, user: linkedUser || null, name: s.name });
                      });
                      dbUsers.forEach(u => {
                        if (!matchedUserIds.has(u.id)) {
                          rows.push({ key: `u${u.id}`, stylist: null, user: u, name: u.full_name || u.username });
                        }
                      });

                      const q = staffUnifiedSearch.toLowerCase();
                      const filtered = q ? rows.filter(r =>
                        r.name.toLowerCase().includes(q) ||
                        (r.stylist?.position || '').toLowerCase().includes(q) ||
                        (r.user?.role || '').toLowerCase().includes(q) ||
                        (r.user?.username || '').toLowerCase().includes(q) ||
                        (r.stylist?.phone || '').includes(q) ||
                        (r.stylist?.email || r.user?.email || '').toLowerCase().includes(q)
                      ) : rows;

                      return (
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 600 : "auto" }}>
                            <thead style={{ background: "#f8f5f0", borderBottom: "1px solid #EDE6D8" }}>
                              <tr>
                                <th style={{ textAlign: "left", padding: isMobile ? "10px 10px" : "12px 20px", fontSize: 11, color: "#9A9088", textTransform: "uppercase", fontWeight: 700 }}>Member</th>
                                <th style={{ textAlign: "left", padding: isMobile ? "10px 10px" : "12px 20px", fontSize: 11, color: "#9A9088", textTransform: "uppercase", fontWeight: 700 }}>Position</th>
                                <th style={{ textAlign: "left", padding: isMobile ? "10px 10px" : "12px 20px", fontSize: 11, color: "#9A9088", textTransform: "uppercase", fontWeight: 700 }}>Access</th>
                                <th style={{ textAlign: "left", padding: isMobile ? "10px 10px" : "12px 20px", fontSize: 11, color: "#9A9088", textTransform: "uppercase", fontWeight: 700 }}>Contact</th>
                                <th style={{ textAlign: "right", padding: isMobile ? "10px 10px" : "12px 20px", fontSize: 11, color: "#9A9088", textTransform: "uppercase", fontWeight: 700 }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filtered.length === 0 && (
                                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#9A9088", fontSize: 13 }}>
                                  {staffUnifiedSearch ? 'No results found.' : 'No staff members yet. Click "+ Add Staff Member" to get started.'}
                                </td></tr>
                              )}
                              {filtered.map(row => (
                                <React.Fragment key={row.key}>
                                  <tr style={{ borderBottom: "1px solid #f0eae0", background: (editingStylist?.id === row.stylist?.id || editingUser?.id === row.user?.id) ? "#FBF6EE" : "transparent" }}>
                                    {/* Member */}
                                    <td style={{ padding: isMobile ? "10px 10px" : "14px 20px" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: row.stylist?.color || "#F5F0E8", color: row.stylist?.color ? "#FFF" : "#2A2118", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                                          {row.name[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                          <div style={{ fontWeight: 700, fontSize: isMobile ? 12 : 14, color: "#2A2118" }}>{row.name}</div>
                                          {row.user?.username && <div style={{ fontSize: 10, color: "#9A9088" }}>@{row.user.username}</div>}
                                        </div>
                                      </div>
                                    </td>
                                    {/* Position */}
                                    <td style={{ padding: isMobile ? "10px 10px" : "14px 20px" }}>
                                      {row.stylist?.position ? (
                                        <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: "#FEF3C7", color: "#92400E" }}>{row.stylist.position}</span>
                                      ) : <span style={{ fontSize: 11, color: "#C4B9AB" }}>—</span>}
                                    </td>
                                    {/* Access / Role */}
                                    <td style={{ padding: isMobile ? "10px 10px" : "14px 20px" }}>
                                      {row.user ? (
                                        <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 800, letterSpacing: .5, textTransform: "uppercase", ...roleBadgeStyle(row.user.role) }}>{row.user.role}</span>
                                      ) : (
                                        <span style={{ fontSize: 11, color: "#C4B9AB", fontStyle: "italic" }}>No login</span>
                                      )}
                                    </td>
                                    {/* Contact */}
                                    <td style={{ padding: isMobile ? "10px 10px" : "14px 20px" }}>
                                      <div style={{ fontSize: 12, color: "#2A2118" }}>{row.stylist?.phone || row.user?.email || '—'}</div>
                                      {row.stylist?.email && <div style={{ fontSize: 11, color: "#9A9088" }}>{row.stylist.email}</div>}
                                    </td>
                                    {/* Actions */}
                                    <td style={{ padding: isMobile ? "10px 10px" : "14px 20px", textAlign: "right" }}>
                                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                        {row.user?.role === 'staff' && (ROLE_RANK[user.role] || 0) >= 2 && (
                                          <button
                                            onClick={() => setViewingStaffSummary({ userId: row.user.id, name: row.user.full_name || row.user.username, date: new Date().toISOString().slice(0, 10), range: 'today', loading: true, data: null, error: null })}
                                            style={{ background: "#F3E8FF", border: "1px solid #E9D5FF", color: "#6B21A8", fontWeight: 700, fontSize: 11, cursor: "pointer", borderRadius: 6, padding: "4px 10px", whiteSpace: "nowrap" }}
                                          >📊 Dashboard</button>
                                        )}
                                        {row.stylist && (
                                          <button
                                            onClick={() => { setEditingStylist({ id: row.stylist.id, name: row.stylist.name, phone: row.stylist.phone || '', address: row.stylist.address || '', email: row.stylist.email || '', position: row.stylist.position || '' }); setEditingUser(null); }}
                                            style={{ background: "none", border: "none", color: "#B08040", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                                          >Edit Profile</button>
                                        )}
                                        {row.user && (user.role === 'superadmin' || (ROLE_RANK[row.user.role] || 0) < (ROLE_RANK[user.role] || 0)) && (
                                          <button
                                            onClick={() => { setEditingUser({ id: row.user.id, username: row.user.username, full_name: row.user.full_name || '', role: row.user.role, password: '' }); setEditingStylist(null); }}
                                            style={{ background: "none", border: "none", color: "#4A7CB8", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                                          >Edit Login</button>
                                        )}
                                        {row.stylist && (
                                          <button
                                            onClick={() => setDelStylistConfirmId(row.stylist.id)}
                                            style={{ background: "none", border: "none", color: "#A0303F", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                                          >Remove</button>
                                        )}
                                        {row.user && !row.stylist && user.username !== row.user.username && canDeleteUser(user.role, row.user.role) && (
                                          <button
                                            onClick={() => setDelUserConfirmId(row.user.id)}
                                            style={{ background: "none", border: "none", color: "#A0303F", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                                          >Remove</button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>

                                  {/* Inline edit — profile */}
                                  {editingStylist && editingStylist.id === row.stylist?.id && editingStylist.id !== 'new' && (
                                    <tr style={{ background: "#faf7f2", borderBottom: "1px solid #EDE6D8" }}>
                                      <td colSpan={5} style={{ padding: 16 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#2A2118", marginBottom: 12 }}>✏️ Edit Profile — {editingStylist.name}</div>
                                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 6 : 10 }}>
                                          <div>
                                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Full Name</label>
                                            <input className="inp" value={editingStylist.name} onChange={e => setEditingStylist(prev => ({ ...prev, name: e.target.value }))} />
                                          </div>
                                          <div>
                                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Position</label>
                                            <select className="inp" value={editingStylist.position || ''} onChange={e => setEditingStylist(prev => ({ ...prev, position: e.target.value }))}>
                                              <option value="">— Select position —</option>
                                              {staffPositions.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                            </select>
                                          </div>
                                          <div>
                                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Phone</label>
                                            <input className="inp" value={editingStylist.phone} onChange={e => setEditingStylist(prev => ({ ...prev, phone: e.target.value }))} />
                                          </div>
                                          <div>
                                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Email</label>
                                            <input className="inp" type="email" value={editingStylist.email || ''} onChange={e => setEditingStylist(prev => ({ ...prev, email: e.target.value }))} />
                                          </div>
                                          <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
                                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Address</label>
                                            <input className="inp" value={editingStylist.address} onChange={e => setEditingStylist(prev => ({ ...prev, address: e.target.value }))} />
                                          </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                                          <button
                                            onClick={async () => {
                                              if (!editingStylist.name) return showToast('Name is required', 'error');
                                              await fetch(`/api/stylists/${editingStylist.id}`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                                body: JSON.stringify({ name: editingStylist.name, phone: editingStylist.phone, address: editingStylist.address, email: editingStylist.email, position: editingStylist.position })
                                              });
                                              fetchStylists();
                                              setEditingStylist(null);
                                              showToast('Profile updated!');
                                            }}
                                            style={{ padding: "8px 20px", borderRadius: 8, background: "#2A2118", color: "#fff", border: "none", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                                          >Save Changes</button>
                                          <button onClick={() => setEditingStylist(null)} className="btn-ghost" style={{ width: "auto", padding: "8px 16px", fontSize: 12 }}>Cancel</button>
                                        </div>
                                      </td>
                                    </tr>
                                  )}

                                  {/* Inline edit — login */}
                                  {editingUser && editingUser.id === row.user?.id && editingUser.id !== 'new' && (
                                    <tr style={{ background: "#faf7f2", borderBottom: "1px solid #EDE6D8" }}>
                                      <td colSpan={5} style={{ padding: 16 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#2A2118", marginBottom: 12 }}>✏️ Edit Login — {editingUser.full_name || editingUser.username}</div>
                                        <input style={{ display: 'none' }} type="text" name="fakeusernameremembered" />
                                        <input style={{ display: 'none' }} type="password" name="fakepasswordremembered" />
                                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 6 : 10 }}>
                                          <div>
                                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Full Name</label>
                                            <input className="inp" autoComplete="off" value={editingUser.full_name || ''} onChange={e => setEditingUser(prev => ({ ...prev, full_name: e.target.value }))} />
                                          </div>
                                          <div>
                                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Username</label>
                                            <input className="inp" autoComplete="off" value={editingUser.username} onChange={e => setEditingUser(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/\s/g, '') }))} />
                                          </div>
                                          {(() => {
                                            const targetUser = dbUsers.find(u => u.id === editingUser.id);
                                            return (ROLE_RANK[targetUser?.role] || 0) < (ROLE_RANK[user.role] || 0) ? (
                                              <div>
                                                <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Role</label>
                                                <select className="inp" value={editingUser.role} onChange={e => setEditingUser(prev => ({ ...prev, role: e.target.value }))}>
                                                  {creatableRoles(user.role).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                                                </select>
                                              </div>
                                            ) : (
                                              <div>
                                                <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Role</label>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, height: 42 }}>
                                                  <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 800, letterSpacing: .5, textTransform: "uppercase", ...roleBadgeStyle(targetUser?.role) }}>{targetUser?.role}</span>
                                                  <span style={{ fontSize: 11, color: "#9A9088" }}>cannot change own role</span>
                                                </div>
                                              </div>
                                            );
                                          })()}
                                          <div>
                                            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>New Password (optional)</label>
                                            <input className="inp" type="password" autoComplete="new-password" value={editingUser.password || ''} onChange={e => setEditingUser(prev => ({ ...prev, password: e.target.value }))} placeholder="Leave blank to keep" />
                                          </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                                          <button
                                            onClick={async () => {
                                              try {
                                                const targetUser = dbUsers.find(u => u.id === editingUser.id);
                                                const body = { username: editingUser.username, full_name: editingUser.full_name || '' };
                                                if ((ROLE_RANK[targetUser?.role] || 0) < (ROLE_RANK[user.role] || 0)) body.role = editingUser.role;
                                                if (editingUser.password) body.password = editingUser.password;
                                                const res = await fetch(`/api/users/${editingUser.id}`, {
                                                  method: 'PUT',
                                                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                                  body: JSON.stringify(body)
                                                });
                                                const data = await res.json();
                                                if (!res.ok) throw new Error(data.message || 'Error updating login');
                                                setDbUsers(prev => prev.map(x => x.id === editingUser.id ? { ...x, username: data.username || editingUser.username, full_name: data.full_name ?? editingUser.full_name, role: data.role || x.role } : x));
                                                setEditingUser(null);
                                                showToast('Login updated!');
                                              } catch (err) {
                                                showToast(err.message, 'error');
                                              }
                                            }}
                                            style={{ padding: "8px 20px", borderRadius: 8, background: "#2A2118", color: "#fff", border: "none", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                                          >Save Changes</button>
                                          <button onClick={() => setEditingUser(null)} className="btn-ghost" style={{ width: "auto", padding: "8px 16px", fontSize: 12 }}>Cancel</button>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>

                  {/* ── Manage Positions ── */}
                  {(() => {
                    const autoEmoji = (name) => {
                      const n = name.toLowerCase();
                      if (n.includes("barber") || n.includes("hair cut")) return "💈";
                      if (n.includes("color") || n.includes("colour")) return "🎨";
                      if (n.includes("hair")) return "✂️";
                      if (n.includes("makeup") || n.includes("make up")) return "💄";
                      if (n.includes("nail")) return "💅";
                      if (n.includes("massage") || n.includes("therapist")) return "💆";
                      if (n.includes("esthet") || n.includes("facial") || n.includes("skin")) return "✨";
                      if (n.includes("recept") || n.includes("front")) return "📋";
                      if (n.includes("manager") || n.includes("manage")) return "👔";
                      if (n.includes("lash") || n.includes("brow")) return "👁️";
                      if (n.includes("wax")) return "🌸";
                      if (n.includes("stylist")) return "💇";
                      return null;
                    };
                    const addPosition = async () => {
                      if (!newPositionName.trim()) return;
                      const emoji = newPositionEmoji || autoEmoji(newPositionName) || "👤";
                      const res = await fetch('/api/staff-positions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ name: newPositionName.trim(), emoji }) });
                      if (res.ok) { fetchStaffPositions(); setNewPositionName(""); setNewPositionEmoji("👤"); setShowEmojiPicker(false); showToast('Position added!'); }
                      else { const d = await res.json(); showToast(d.message || 'Error adding position', 'error'); }
                    };
                    return (
                      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EDE6D8", padding: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#FEF3C7,#FDE68A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🪪</div>
                          <div>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: "#2A2118" }}>Manage Positions</div>
                            <div style={{ fontSize: 11, color: "#9A9088" }}>Job titles shown on staff profiles</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 16, marginBottom: 20, alignItems: "center" }}>
                          <EmojiPickerDropdown value={newPositionEmoji} onChange={v => setNewPositionEmoji(v)} defaultEmoji="👤" />
                          <input
                            className="inp"
                            placeholder="Position name (e.g. Hair Stylist)…"
                            value={newPositionName}
                            style={{ flex: 1 }}
                            onChange={e => {
                              setNewPositionName(e.target.value);
                              const auto = autoEmoji(e.target.value);
                              if (auto) setNewPositionEmoji(auto);
                            }}
                            onKeyDown={e => { if (e.key === 'Enter') addPosition(); }}
                          />
                          <button
                            style={{ padding: "10px 18px", borderRadius: 8, background: "#2A2118", color: "#fff", border: "none", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                            disabled={!newPositionName.trim()}
                            onClick={addPosition}
                          >+ Add</button>
                        </div>
                        {staffPositions.length === 0
                          ? <div style={{ textAlign: "center", padding: "24px 0", color: "#C4B9AB", fontSize: 13 }}>No positions yet — add one above</div>
                          : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
                            {staffPositions.map(p => (
                              <div key={p.id} style={{ background: "#FDFBF7", border: "1.5px solid #EDE6D8", borderRadius: 14, padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative", transition: "box-shadow .15s" }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(44,33,24,.1)"}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#FEF9EE,#FEF3C7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{p.emoji || "👤"}</div>
                                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: "#2A2118", textAlign: "center", lineHeight: 1.3 }}>{p.name}</div>
                                <button
                                  onClick={async () => {
                                    if (!confirm(`Remove "${p.name}"?`)) return;
                                    const res = await fetch(`/api/staff-positions/${p.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                                    if (res.ok) { fetchStaffPositions(); showToast('Position removed'); }
                                  }}
                                  style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", color: "#C4B9AB", fontSize: 15, lineHeight: 1, padding: "2px 4px", borderRadius: 6, transition: "color .15s, background .15s" }}
                                  onMouseEnter={e => { e.currentTarget.style.color = "#E53E3E"; e.currentTarget.style.background = "#FFF0F0"; }}
                                  onMouseLeave={e => { e.currentTarget.style.color = "#C4B9AB"; e.currentTarget.style.background = "none"; }}
                                >×</button>
                              </div>
                            ))}
                          </div>
                        }
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* 3. Profile Tab */}
              {adminTab === "courtesy" && (
                <div className="fade" style={{ maxWidth: 600, width: "100%" }}>
                  <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 20 : 26, fontWeight: 800, color: "#2A2118", marginBottom: 6 }}>Courtesy Staff</h1>
                  <p style={{ fontSize: 13, color: "#9A9088", marginBottom: 24 }}>These names appear in the discount "Courtesy by" dropdown when giving discounts. Add or remove people to keep the list accurate.</p>

                  {/* Add new person */}
                  <div className="card" style={{ marginBottom: 20 }}>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: "#2A2118", marginBottom: 14 }}>Add Person</div>
                    <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                      <input
                        className="inp"
                        placeholder="Enter name..."
                        value={newCourtesyName}
                        onChange={e => setNewCourtesyName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && newCourtesyName.trim() && !courtesyPersons.includes(newCourtesyName.trim())) {
                            setCourtesyPersons([...courtesyPersons, newCourtesyName.trim()]);
                            setNewCourtesyName("");
                          }
                        }}
                        style={{ flex: 1, minWidth: 0, fontSize: 14, width: "auto", boxSizing: "border-box" }}
                      />
                      <button
                        className="btn-gold"
                        style={{ padding: "12px 24px", fontSize: 13, width: "auto", flexShrink: 0, whiteSpace: "nowrap", opacity: (!newCourtesyName.trim() || allCourtesyPersons.includes(newCourtesyName.trim())) ? 0.5 : 1 }}
                        disabled={!newCourtesyName.trim() || allCourtesyPersons.includes(newCourtesyName.trim())}
                        onClick={() => {
                          const n = newCourtesyName.trim();
                          if (n && !allCourtesyPersons.includes(n)) {
                            setCourtesyPersons([...courtesyPersons, n]);
                            setNewCourtesyName("");
                          }
                        }}
                      >+ Add</button>
                    </div>
                    {newCourtesyName.trim() && allCourtesyPersons.includes(newCourtesyName.trim()) && (
                      <div style={{ fontSize: 11, color: "#A0303F", marginTop: 6 }}>⚠ This name already exists in the list.</div>
                    )}
                  </div>

                  {/* Current list */}
                  <div className="card">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: "#2A2118" }}>Current List</div>
                      <div style={{ fontSize: 12, color: "#9A9088" }}>{allCourtesyPersons.length} {allCourtesyPersons.length === 1 ? "person" : "people"}</div>
                    </div>
                    <input
                      className="inp"
                      placeholder="🔍 Search list..."
                      value={courtesySearch}
                      onChange={e => setCourtesySearch(e.target.value)}
                      style={{ fontSize: 12, padding: "7px 12px", width: "100%", boxSizing: "border-box", marginBottom: 12 }}
                    />

                    {/* Auto-synced section */}
                    {autoCourtesyNames.length > 0 && (
                      <>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8, marginTop: 4 }}>
                          🔄 Auto-synced from Staff & Users
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                          {autoCourtesyNames.filter(p => !courtesySearch || p.toLowerCase().includes(courtesySearch.toLowerCase())).map(person => (
                            <div key={`auto-${person}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #BBF7D0" }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#065F46", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#FFF", fontWeight: 700, flexShrink: 0 }}>
                                {person.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ flex: 1, fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 14, color: "#2A2118" }}>{person}</div>
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#065F46", background: "#DCFCE7", borderRadius: 6, padding: "2px 8px", letterSpacing: .4 }}>AUTO</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Manually added */}
                    {courtesyPersons.filter(p => !autoCourtesyNames.includes(p)).length > 0 && (
                      <>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>
                          ✍️ Manually Added
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {courtesyPersons.filter(p => !autoCourtesyNames.includes(p) && (!courtesySearch || p.toLowerCase().includes(courtesySearch.toLowerCase()))).map((person) => (
                            <div key={`manual-${person}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", background: "#FDFAF6", borderRadius: 10, border: "1px solid #EDE6D8" }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2A2118", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#FAF7F3", fontWeight: 700, flexShrink: 0 }}>
                                {person.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ flex: 1, fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 14, color: "#2A2118" }}>{person}</div>
                              <button
                                onClick={() => setCourtesyPersons(courtesyPersons.filter(p2 => p2 !== person))}
                                style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#A0303F", cursor: "pointer", flexShrink: 0 }}
                              >Remove</button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {allCourtesyPersons.length === 0 && (
                      <div style={{ fontSize: 13, color: "#C4B9AB", padding: "16px 0", textAlign: "center" }}>No courtesy staff yet. Add staff members to get started.</div>
                    )}
                  </div>
                </div>
              )}

              {adminTab === "profile" && (
                <div className="fade" style={{ maxWidth: 1200 }}>
                  <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 20 : 26, fontWeight: 800, color: "#2A2118", marginBottom: 24 }}>Account Settings</h1>

                  <div className="grid-3-mobile-1" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 24, alignItems: "flex-start" }}>

                    {/* ── Left Column: Password Reset ── */}
                    <div className="card">
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700, color: "#2A2118", marginBottom: 16 }}>Password Reset</div>
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 8 }}>Username</label>
                        <input className="inp" value={user.username} disabled />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 8 }}>Role</label>
                        <input className="inp" value={user.role} disabled style={{ textTransform: "capitalize" }} />
                      </div>
                      <div className="divhr" />
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 8 }}>New Password</label>
                        <input className="inp" type="password" autoComplete="new-password" value={profilePw} onChange={e => setProfilePw(e.target.value)} placeholder="Enter new password" />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 8 }}>Confirm Password</label>
                        <input className="inp" type="password" autoComplete="new-password" value={profilePwConfirm} onChange={e => setProfilePwConfirm(e.target.value)} placeholder="Re-enter password" />
                        {profilePwConfirm && profilePw !== profilePwConfirm && (
                          <div style={{ fontSize: 11, color: "#A0303F", marginTop: 6 }}>⚠ Passwords do not match</div>
                        )}
                      </div>
                      <button
                        onClick={async () => {
                          if (!profilePw) return showToast('Please enter a new password', 'error');
                          if (profilePw !== profilePwConfirm) return showToast('Passwords do not match', 'error');

                          try {
                            const res = await fetch('/api/users/profile', {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({ password: profilePw })
                            });

                            const data = await res.json();

                            if (!res.ok) {
                              if (res.status === 404) {
                                throw new Error("User session might be stale. Please Logout and Login again to refresh your account.");
                              }
                              throw new Error(data.message || data.error || `Error ${res.status}: Failed to update password`);
                            }

                            showToast('Password updated successfully!');
                            setProfilePw('');
                            setProfilePwConfirm('');
                          } catch (err) {
                            showToast(err.message, 'error');
                          }
                        }}
                        className="btn-gold"
                        style={{
                          width: "100%",
                          padding: 12,
                          marginBottom: 16,
                          opacity: (!profilePw || profilePw !== profilePwConfirm) ? 0.7 : 1
                        }}
                      >Update Password</button>
                    </div>

                    {/* ── Middle Column: Branding Settings (superadmin only) ── */}
                    {user.role === 'superadmin' && <div className="card">
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700, color: "#2A2118", marginBottom: 16 }}>Branding</div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 8 }}>Salon Name</label>
                        <input
                          className="inp"
                          value={salonName}
                          onChange={e => setSalonName(e.target.value)}
                          placeholder="e.g. Noorkada POS"
                        />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 8 }}>Salon Address</label>
                        <input className="inp" value={salonAddress} onChange={e => setSalonAddress(e.target.value)} placeholder="e.g. 14-A Pir Khursheed Colony Rd, Multan" />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 8 }}>Logo Style</label>
                        <select
                          className="inp"
                          value={salonLogo === 'default' ? 'default' : 'custom'}
                          onChange={e => {
                            if (e.target.value === 'default') {
                              setSalonLogo('default');
                            } else {
                              // If they pick custom but it was default, we set a temporary empty string or 'custom' placeholder 
                              // so the upload inputs show up.
                              if (salonLogo === 'default') setSalonLogo('');
                            }
                          }}
                        >
                          <option value="default">Default Letter Icon</option>
                          <option value="custom">Custom Image</option>
                        </select>
                      </div>

                      {salonLogo !== 'default' && (
                        <div className="fade" style={{ marginBottom: 16 }}>
                          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 6 }}>Upload Logo</label>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ fontSize: 11, marginBottom: 10 }}
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setSalonLogo(reader.result);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <div style={{ fontSize: 10, color: "#9A9088", marginBottom: 4 }}>OR Paste Image URL</div>
                          <input
                            className="inp"
                            style={{ fontSize: 12 }}
                            value={salonLogo.startsWith('data:') ? '' : salonLogo}
                            onChange={e => setSalonLogo(e.target.value)}
                            placeholder="https://example.com/logo.png"
                          />
                        </div>
                      )}

                      <div style={{ marginTop: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 10, background: "#f8f5f0", padding: "12px", borderRadius: 8 }}>
                        <input type="checkbox" id="show-salon-name-prof" checked={showSalonName} onChange={e => setShowSalonName(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#B08040", cursor: "pointer", flexShrink: 0 }} />
                        <div>
                          <label htmlFor="show-salon-name-prof" style={{ fontSize: 12, color: "#3D3028", cursor: "pointer", fontWeight: 600, display: "block" }}>
                            Show Brand Name on Slips & Receipts
                          </label>
                          <div style={{ fontSize: 10, color: "#9A9088", marginTop: 2 }}>
                            Prints the salon name above the logo.
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#fdfaf6", borderRadius: 8, border: "1px solid #EDE6D8" }}>
                        <div style={{ width: "auto", maxWidth: 100, height: 32, borderRadius: "6px", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          <img src={NOORKADA_LOGO} style={{ width: "auto", height: "100%", maxWidth: "100%", objectFit: "contain" }} alt="Noorkada Logo" />
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#2A2118" }}>Preview</div>
                      </div>
                    </div>}


                  </div>
                </div>
              )}

              {adminTab === "logs" && ROLE_RANK[user.role] >= 3 && (
                <div className="fade" style={{ maxWidth: 1200 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 20 : 26, fontWeight: 800, color: "#2A2118", margin: 0 }}>Activity Log</h1>
                      <p style={{ fontSize: 13, color: "#9A9088", marginTop: 4 }}>All staff actions are recorded here. Only admins and superadmins can view this log.</p>
                    </div>
                    <button onClick={fetchLogs} className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13, width: "auto" }}>↻ Refresh</button>
                  </div>

                  {/* Filters */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                    <input className="inp" style={{ flex: 2, minWidth: 180 }} placeholder="🔍 Search by user, action, or details..." value={logSearch} onChange={e => setLogSearch(e.target.value)} />
                    <select className="inp" style={{ flex: 1, minWidth: 140 }} value={logActionFilter} onChange={e => setLogActionFilter(e.target.value)}>
                      <option value="">All Actions</option>
                      <option value="LOGIN">Login</option>
                      <option value="LOGIN_FAILED">Failed Login</option>
                      <option value="CREATE_TRANSACTION">Transaction</option>
                      <option value="CREATE_USER">Create User</option>
                      <option value="UPDATE_USER">Update User</option>
                      <option value="DELETE_USER">Delete User</option>
                      <option value="UPDATE_OWN_PROFILE">Profile Update</option>
                      <option value="CHANGE_PASSWORD">Password Change</option>
                      <option value="CREATE_SERVICE">Create Service</option>
                      <option value="UPDATE_SERVICE">Update Service</option>
                      <option value="DELETE_SERVICE">Delete Service</option>
                      <option value="CREATE_STYLIST">Create Stylist</option>
                      <option value="UPDATE_STYLIST">Update Stylist</option>
                      <option value="DELETE_STYLIST">Delete Stylist</option>
                      <option value="CREATE_CATEGORY">Create Category</option>
                      <option value="DELETE_CATEGORY">Delete Category</option>
                      <option value="UPDATE_SMTP_SETTINGS">SMTP Settings</option>
                    </select>
                    <select className="inp" style={{ flex: 1, minWidth: 140 }} value={logUserFilter} onChange={e => setLogUserFilter(e.target.value)}>
                      <option value="">All Users</option>
                      {[...new Map(activityLogs.map(l => [l.username, l])).values()].filter(l => l.username).sort((a,b) => (a.full_name||a.username).localeCompare(b.full_name||b.username)).map(l => (
                        <option key={l.username} value={l.username}>{l.full_name ? `${l.full_name} (@${l.username})` : l.username}</option>
                      ))}
                    </select>
                  </div>

                  {logsLoading ? (
                    <div style={{ textAlign: "center", padding: "48px 0", color: "#9A9088", fontSize: 14 }}>Loading logs...</div>
                  ) : (() => {
                    const q = logSearch.toLowerCase();
                    const filtered = activityLogs.filter(l =>
                      (!logActionFilter || l.action === logActionFilter) &&
                      (!logUserFilter || l.username === logUserFilter) &&
                      (!q || l.username?.toLowerCase().includes(q) || l.full_name?.toLowerCase().includes(q) || l.action?.toLowerCase().includes(q) || l.entity?.toLowerCase().includes(q) || JSON.stringify(l.details || {}).toLowerCase().includes(q))
                    );
                    if (filtered.length === 0) return (
                      <div style={{ textAlign: "center", padding: "48px 0", color: "#9A9088" }}>
                        <div style={{ fontSize: 32, marginBottom: 12 }}>🗂️</div>
                        <div style={{ fontSize: 14 }}>No activity logs found</div>
                      </div>
                    );
                    const actionColors = {
                      LOGIN: ["#D1FAE5","#065F46"], LOGIN_FAILED: ["#FEE2E2","#991B1B"],
                      CREATE_TRANSACTION: ["#DBEAFE","#1E40AF"], CREATE_USER: ["#D1FAE5","#065F46"],
                      UPDATE_USER: ["#FEF3C7","#92400E"], DELETE_USER: ["#FEE2E2","#991B1B"],
                      UPDATE_OWN_PROFILE: ["#FEF3C7","#92400E"], CHANGE_PASSWORD: ["#FEF3C7","#92400E"],
                      CREATE_SERVICE: ["#D1FAE5","#065F46"], UPDATE_SERVICE: ["#FEF3C7","#92400E"],
                      DELETE_SERVICE: ["#FEE2E2","#991B1B"], CREATE_STYLIST: ["#D1FAE5","#065F46"],
                      UPDATE_STYLIST: ["#FEF3C7","#92400E"], DELETE_STYLIST: ["#FEE2E2","#991B1B"],
                      CREATE_CATEGORY: ["#D1FAE5","#065F46"], DELETE_CATEGORY: ["#FEE2E2","#991B1B"],
                      UPDATE_SMTP_SETTINGS: ["#F3E8FF","#6B21A8"],
                    };
                    return (
                      <div style={{ background: "#FFF", borderRadius: 12, border: "1px solid #EDE6D8", overflow: "hidden" }}>
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                            <thead>
                              <tr style={{ background: "#FAF7F3", borderBottom: "1px solid #EDE6D8" }}>
                                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", letterSpacing: .5, whiteSpace: "nowrap" }}>Time</th>
                                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", letterSpacing: .5 }}>User</th>
                                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", letterSpacing: .5 }}>Action</th>
                                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", letterSpacing: .5 }}>Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filtered.map((l, i) => {
                                const [bg, col] = actionColors[l.action] || ["#F3F4F6","#374151"];
                                const dt = l.created_at ? new Date(l.created_at) : null;
                                const dateStr = dt ? dt.toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";
                                const timeStr = dt ? dt.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
                                const d = l.details || {};
                                const fmtAmt = (v) => v != null ? `PKR ${Number(v).toLocaleString()}` : null;
                                const humanDetails = (() => {
                                  switch (l.action) {
                                    case 'LOGIN': return { icon: "🔐", text: "Signed in successfully" };
                                    case 'LOGIN_FAILED': return { icon: "🚫", text: `Failed login attempt${d.attempted_username ? ` for @${d.attempted_username}` : ""}` };
                                    case 'LOGOUT': return { icon: "👋", text: "Signed out" };
                                    case 'CREATE_TRANSACTION': {
                                      const parts = [];
                                      if (d.cust_name && d.cust_name !== 'Walk-in') parts.push(`Client: ${d.cust_name}`);
                                      if (d.total) parts.push(`Total: ${fmtAmt(d.total)}`);
                                      if (d.pay_mode) parts.push(`Paid via ${d.pay_mode}`);
                                      if (d.staff_name && d.staff_name !== 'Unassigned') parts.push(`Staff: ${d.staff_name}`);
                                      if (d.items) parts.push(`${d.items} service${d.items > 1 ? 's' : ''}`);
                                      return { icon: "🧾", text: parts.join(" · ") || "New transaction created" };
                                    }
                                    case 'EDIT_TRANSACTION': {
                                      const parts = [];
                                      if (d.cust_name) parts.push(`Client: ${d.cust_name}`);
                                      if (d.old_total != null && d.new_total != null) {
                                        const diff = Number(d.new_total) - Number(d.old_total);
                                        parts.push(`${fmtAmt(d.old_total)} → ${fmtAmt(d.new_total)}${diff !== 0 ? ` (${diff > 0 ? "+" : ""}${fmtAmt(diff)})` : " (no change)"}`);
                                      }
                                      if (d.edit_note) parts.push(`Note: "${d.edit_note}"`);
                                      return { icon: "✏️", text: parts.join(" · ") || "Bill edited" };
                                    }
                                    case 'CREATE_USER': {
                                      const name = d.full_name || d.username;
                                      return { icon: "👤", text: `Added user ${name}${d.full_name ? ` (@${d.username})` : ""}${d.role ? ` as ${d.role}` : ""}` };
                                    }
                                    case 'UPDATE_USER': {
                                      const changes = [];
                                      if (d.username) changes.push(`username → ${d.username}`);
                                      if (d.full_name !== undefined) changes.push(`name → ${d.full_name || "(cleared)"}`);
                                      if (d.role) changes.push(`role → ${d.role}`);
                                      if (d.password_changed) changes.push("password changed");
                                      return { icon: "🔄", text: changes.length ? `Updated: ${changes.join(", ")}` : "User profile updated" };
                                    }
                                    case 'UPDATE_OWN_PROFILE': return { icon: "🔄", text: "Updated own profile" };
                                    case 'CHANGE_PASSWORD': return { icon: "🔑", text: "Changed own password" };
                                    case 'DELETE_USER': return { icon: "🗑️", text: `Removed user ${d.deleted_username || ""}${d.deleted_role ? ` (${d.deleted_role})` : ""}` };
                                    case 'CREATE_STYLIST':
                                    case 'CREATE_STAFF': {
                                      const parts = [`Added ${d.name || "staff member"}`];
                                      if (d.position) parts.push(d.position);
                                      if (d.phone) parts.push(`📞 ${d.phone}`);
                                      if (d.email) parts.push(d.email);
                                      return { icon: "✂️", text: parts.join(" · ") };
                                    }
                                    case 'UPDATE_STYLIST': return { icon: "✏️", text: `Updated ${d.name || "staff"}'s profile${d.position ? ` · Position: ${d.position}` : ""}` };
                                    case 'DELETE_STYLIST': return { icon: "🗑️", text: `Removed staff member ${d.name || ""}` };
                                    case 'CREATE_SERVICE': return { icon: "➕", text: `Added service "${d.name || ""}"${d.category ? ` in ${d.category}` : ""}${d.price ? ` · ${fmtAmt(d.price)}` : ""}` };
                                    case 'UPDATE_SERVICE': return { icon: "✏️", text: `Updated service "${d.name || d.old_name || ""}"` };
                                    case 'DELETE_SERVICE': return { icon: "🗑️", text: `Removed service "${d.name || ""}"` };
                                    case 'CREATE_CATEGORY': return { icon: "📂", text: `Created category "${d.name || ""}"` };
                                    case 'DELETE_CATEGORY': return { icon: "🗑️", text: `Removed category "${d.name || ""}"` };
                                    case 'CREATE_STAFF_POSITION': return { icon: "🪪", text: `Added position: ${d.emoji || ""} ${d.name || ""}` };
                                    case 'DELETE_STAFF_POSITION': return { icon: "🗑️", text: `Removed position: ${d.name || ""}` };
                                    case 'UPDATE_SMTP_SETTINGS': return { icon: "📧", text: "Email (SMTP) settings updated" };
                                    case 'UPDATE_BRANDING': return { icon: "🎨", text: "Branding settings updated" };
                                    case 'SETUP_COMPLETE': return { icon: "🚀", text: `Initial setup completed${d.salonName ? ` for "${d.salonName}"` : ""}` };
                                    default: {
                                      const raw = Object.entries(d).filter(([,v]) => v != null && v !== '').map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(" · ");
                                      return { icon: "📋", text: raw || null };
                                    }
                                  }
                                })();
                                return (
                                  <tr key={l.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F0EBE3" : "none", background: i % 2 === 0 ? "#FFF" : "#FDFAF6" }}>
                                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                                      <div style={{ fontWeight: 600, color: "#2A2118" }}>{dateStr}</div>
                                      <div style={{ fontSize: 11, color: "#9A9088" }}>{timeStr}</div>
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                      <div style={{ fontWeight: 600, color: "#2A2118" }}>{l.full_name || l.username}</div>
                                      {l.full_name && <div style={{ fontSize: 10, color: "#9A9088", marginBottom: 2 }}>@{l.username}</div>}
                                      <div style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, display: "inline-block", ...roleBadgeStyle(l.role) }}>{l.role}</div>
                                    </td>
                                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                                      <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, background: bg, color: col, letterSpacing: .3 }}>
                                        {l.action.replace(/_/g, " ")}
                                      </span>
                                      {l.entity && <div style={{ fontSize: 10, color: "#9A9088", marginTop: 3 }}>{l.entity}{l.entity_id ? ` #${l.entity_id}` : ""}</div>}
                                    </td>
                                    <td style={{ padding: "12px 16px", color: "#5A4D41", maxWidth: 320 }}>
                                      {humanDetails.text
                                        ? <div style={{ fontSize: 12 }}>
                                            <span style={{ marginRight: 6 }}>{humanDetails.icon}</span>
                                            {humanDetails.text}
                                          </div>
                                        : <span style={{ color: "#C4B9AB", fontSize: 11 }}>—</span>
                                      }
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div style={{ padding: "10px 16px", borderTop: "1px solid #EDE6D8", fontSize: 11, color: "#9A9088", textAlign: "right" }}>
                          Showing {filtered.length} of {activityLogs.length} entries (last 200)
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>
          </div>
        )
      }

      {/* Modals placed outside main layouts */}
      {
        showCatLabelModal && (
          <div className="ovl" onClick={() => setShowCatLabelModal(false)}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: 16, padding: 24, width: "90%", maxWidth: 360, boxShadow: "0 24px 64px rgba(42,33,24,.2)", position: "relative" }}>
              <button onClick={() => setShowCatLabelModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", fontSize: 18, color: "#B8AFA5", cursor: "pointer", lineHeight: 1, padding: 4 }}>✕</button>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>New Category</h2>
              <p style={{ fontSize: 13, color: "#9A9088", marginBottom: 20 }}>Enter details for the new category.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Name</label>
                  <input
                    autoFocus
                    className="inp"
                    placeholder="e.g. Massages"
                    value={newCatLabel}
                    onChange={e => setNewCatLabel(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9A9088", textTransform: "uppercase", marginBottom: 4 }}>Icon</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <EmojiPickerDropdown value={newCatIcon} onChange={v => setNewCatIcon(v)} defaultEmoji="✨" />
                    <span style={{ fontSize: 11, color: "#9A9088" }}>Click to pick or type/paste any emoji</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button className="btn-ghost" style={{ flex: 1, padding: "10px 0" }} onClick={() => setShowCatLabelModal(false)}>Cancel</button>
                <button className="btn-gold" style={{ flex: 1, padding: "10px 0" }} onClick={() => {
                  if (newCatLabel.trim()) {
                    addCategory({ name: newCatLabel.trim(), icon: newCatIcon.trim() || "✨", color: "#B08040" });
                    setNewCatLabel("");
                    setNewCatIcon("✨");
                    setShowCatLabelModal(false);
                  }
                }}>Add</button>
              </div>
            </div>
          </div>
        )
      }

      {
        delCatConfirmId && (
          <div className="ovl" onClick={() => setDelCatConfirmId(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: 16, padding: 24, width: "90%", maxWidth: 380, boxShadow: "0 24px 64px rgba(42,33,24,.2)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FEF2F2", color: "#991B1B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>⚠</div>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Delete Category?</h2>
              <p style={{ fontSize: 13, color: "#9A9088", marginBottom: 24, lineHeight: 1.5 }}>Are you sure you want to delete this category? Services currently in this category will become un-categorized.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" style={{ flex: 1, padding: "8px 0" }} onClick={() => setDelCatConfirmId(null)}>Cancel</button>
                <button className="btn-gold" style={{ flex: 1, padding: "8px 0", background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }} onClick={() => deleteCategory(delCatConfirmId)}>Delete</button>
              </div>
            </div>
          </div>
        )
      }

      {
        delSvcConfirmId && (
          <div className="ovl" onClick={() => setDelSvcConfirmId(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: 16, padding: 24, width: "90%", maxWidth: 380, boxShadow: "0 24px 64px rgba(42,33,24,.2)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FEF2F2", color: "#991B1B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>⚠</div>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Delete Service?</h2>
              <p style={{ fontSize: 13, color: "#9A9088", marginBottom: 24, lineHeight: 1.5 }}>Are you sure you want to delete this service? This action cannot be undone.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" style={{ flex: 1, padding: "8px 0" }} onClick={() => setDelSvcConfirmId(null)}>Cancel</button>
                <button className="btn-gold" style={{ flex: 1, padding: "8px 0", background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }} onClick={() => deleteService(delSvcConfirmId)}>Delete</button>
              </div>
            </div>
          </div>
        )
      }

      {
        delStylistConfirmId && (
          <div className="ovl" onClick={() => setDelStylistConfirmId(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: 16, padding: 24, width: "90%", maxWidth: 380, boxShadow: "0 24px 64px rgba(42,33,24,.2)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FEF2F2", color: "#991B1B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>⚠</div>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Remove Stylist?</h2>
              <p style={{ fontSize: 13, color: "#9A9088", marginBottom: 24, lineHeight: 1.5 }}>Are you sure you want to remove this stylist? This action cannot be undone.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" style={{ flex: 1, padding: "8px 0" }} onClick={() => setDelStylistConfirmId(null)}>Cancel</button>
                <button className="btn-gold" style={{ flex: 1, padding: "8px 0", background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }} onClick={() => deleteStylist(delStylistConfirmId)}>Remove</button>
              </div>
            </div>
          </div>
        )
      }

      {
        delUserConfirmId && (
          <div className="ovl" onClick={() => setDelUserConfirmId(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: 16, padding: 24, width: "90%", maxWidth: 380, boxShadow: "0 24px 64px rgba(42,33,24,.2)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FEF2F2", color: "#991B1B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>⚠</div>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Delete User?</h2>
              <p style={{ fontSize: 13, color: "#9A9088", marginBottom: 24, lineHeight: 1.5 }}>Are you sure you want to delete this system user? Access will be revoked immediately.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" style={{ flex: 1, padding: "8px 0" }} onClick={() => setDelUserConfirmId(null)}>Cancel</button>
                <button className="btn-gold" style={{ flex: 1, padding: "8px 0", background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }} onClick={() => deleteUser(delUserConfirmId)}>Delete</button>
              </div>
            </div>
          </div>
        )
      }

      {
        stylistWarningOpen && (
          <div className="ovl" onClick={() => setStylistWarningOpen(false)}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: 16, padding: 24, width: "90%", maxWidth: 380, boxShadow: "0 24px 64px rgba(42,33,24,.2)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FFFBEB", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>✂️</div>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Missing Stylist</h2>
              <p style={{ fontSize: 13, color: "#9A9088", marginBottom: 24, lineHeight: 1.5 }}>Some services are missing a stylist (see red highlights in the bill).<br /><br />Would you like to assign them now or continue without stylists?</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" style={{ flex: 1, padding: "8px 0" }} onClick={() => {
                  setStylistWarningOpen(false);
                  // Scroll cart into view so user can assign stylist to highlighted items
                  setTimeout(() => {
                    const el = document.querySelector('[data-missing-stylist="true"]') || document.querySelector('.cart-panel');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 100);
                }}>← Back to Cart</button>
                <button className="btn-gold" style={{ flex: 1, padding: "8px 0" }} onClick={() => {
                  setStylistWarningOpen(false);
                  checkout(true);
                }}>Continue Anyway</button>
              </div>
            </div>
          </div>
        )
      }

      {/* ══ ADD SERVICE MODAL ════════════════════════════════════════════════ */}
      {
        showAddModal && (
          <div className="ovl" onClick={() => setShowAddModal(false)}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: 20, padding: 32, width: "90%", maxWidth: 460, boxShadow: "0 24px 64px rgba(42,33,24,.2)", position: "relative" }}>
              <button onClick={() => setShowAddModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", fontSize: 18, color: "#B8AFA5", cursor: "pointer", lineHeight: 1, padding: 4 }}>✕</button>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Add New Service</h2>
              <p style={{ fontSize: 13, color: "#9A9088", marginBottom: 24 }}>Enter service details to add it to the menu.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "#9A9088", textTransform: "uppercase", fontWeight: 700, letterSpacing: .5, marginBottom: 6 }}>Service Name</label>
                  <input className="inp" placeholder="e.g. Deluxe Hydra Facial" value={newSvc.name} onChange={e => setNewSvc({ ...newSvc, name: e.target.value })} />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 11, color: "#9A9088", textTransform: "uppercase", fontWeight: 700, letterSpacing: .5, marginBottom: 6 }}>Category</label>
                    <select className="inp" value={newSvc.category} onChange={e => setNewSvc({ ...newSvc, category: e.target.value })}>
                      <option value="" disabled>Select Category</option>
                      <option value="Deal">Deal</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 11, color: "#9A9088", textTransform: "uppercase", fontWeight: 700, letterSpacing: .5, marginBottom: 6 }}>Price (PKR)</label>
                    <input type="number" className="inp" placeholder="2500" value={newSvc.price} onChange={e => setNewSvc({ ...newSvc, price: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 11, color: "#9A9088", textTransform: "uppercase", fontWeight: 700, letterSpacing: .5, marginBottom: 6 }}>Icon</label>
                    <EmojiPickerDropdown value={newSvc.icon} onChange={v => setNewSvc({ ...newSvc, icon: v })} defaultEmoji="✨" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 11, color: "#9A9088", textTransform: "uppercase", fontWeight: 700, letterSpacing: .5, marginBottom: 6 }}>Theme Color</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input type="color" value={newSvc.color} onChange={e => setNewSvc({ ...newSvc, color: e.target.value })} style={{ width: 42, height: 38, border: "none", padding: 0, background: "none", cursor: "pointer" }} />
                      <span style={{ fontSize: 12, color: "#5A4030", fontWeight: 500 }}>{newSvc.color}</span>
                    </div>
                  </div>
                </div>
                {newSvc.category === 'Deal' && (
                  <div style={{ marginTop: 6 }}>
                    <label style={{ display: "block", fontSize: 11, color: "#9A9088", textTransform: "uppercase", fontWeight: 700, letterSpacing: .5, marginBottom: 6 }}>Included Services</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, maxHeight: 160, overflowY: 'auto', border: '1px solid #E8E0D4', borderRadius: 8, padding: 8, background: '#FDFAF6' }}>
                      {dbServices.filter(s => s.category !== 'Deal').map(s => {
                        const isSelected = newSvc.included_services?.includes(s.name);
                        return (
                          <div key={s.id} onClick={() => {
                            const next = isSelected ? (newSvc.included_services || []).filter(n => n !== s.name) : [...(newSvc.included_services || []), s.name];
                            setNewSvc({ ...newSvc, included_services: next });
                          }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: isSelected ? '#F5F0E8' : '#FFF', border: `1px solid ${isSelected ? '#C4A870' : '#E8E0D4'}`, borderRadius: 6, cursor: 'pointer', transition: 'all .1s' }}>
                            <div style={{ width: 14, height: 14, borderRadius: 3, border: `1px solid ${isSelected ? '#2A2118' : '#C4B9AB'}`, background: isSelected ? '#2A2118' : '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {isSelected && <svg width="8" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#2A2118', lineHeight: 1.2 }}>{s.name}</span>
                              <span style={{ fontSize: 10, color: '#9A9088' }}>{fmt(s.price)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {newSvc.included_services?.length > 0 && (
                      <div style={{ marginTop: 6, fontSize: 11, color: "#B08040", fontWeight: 700 }}>
                        Real Value: {fmt(newSvc.included_services.reduce((sum, name) => {
                          const svc = dbServices.find(s => s.name === name);
                          return sum + (svc ? svc.price : 0);
                        }, 0))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn-gold" style={{ flex: 2 }} onClick={addService}>Save Service</button>
              </div>
            </div>
          </div>
        )
      }
      {/* ══ AMENDMENT HISTORY MODAL ══════════════════════════════════════════ */}
      {viewingAmendment && (() => {
        const txn = viewingAmendment;
        const originalSnapshot = txn.amendments[0]?.snapshot;
        return (
          <div className="ovl" onClick={() => setViewingAmendment(null)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: "#FDFBF7", borderRadius: 18, padding: 0,
              maxWidth: 620, width: "96%", maxHeight: "90vh", overflowY: "auto",
              boxShadow: "0 24px 72px rgba(42,33,24,.24)", display: "flex", flexDirection: "column"
            }}>
              {/* Header */}
              <div style={{ padding: "20px 24px 16px", borderBottom: "1.5px solid #EDE6D8", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#FDFBF7", zIndex: 10, borderRadius: "18px 18px 0 0" }}>
                <div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: "#2A2118" }}>📋 Edit History</div>
                  <div style={{ fontSize: 11, color: "#B8AFA5", marginTop: 2 }}>#{txn.slip} · {txn.customerName} · {txn.date}</div>
                </div>
                <button onClick={() => setViewingAmendment(null)} style={{ background: "#F5F0E8", border: "none", borderRadius: 10, padding: "7px 14px", cursor: "pointer", fontSize: 13, color: "#6B5540", fontWeight: 600 }}>✕ Close</button>
              </div>

              <div style={{ padding: "20px 24px 24px" }}>
                {/* Original vs Current comparison */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {/* Original */}
                  <div style={{ background: "#F5F0E8", borderRadius: 12, padding: "14px 16px", border: "1.5px solid #D4C4A8" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8B7355", textTransform: "uppercase", letterSpacing: .6, marginBottom: 10 }}>🕐 Original Bill</div>
                    {(originalSnapshot?.cart || []).map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#5A4D41", marginBottom: 5 }}>
                        <span>{item.service}{item.qty > 1 ? ` ×${item.qty}` : ""}</span>
                        <span style={{ fontWeight: 600 }}>{fmt((item.price || 0) * (item.qty || 1), true)}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #D4C4A8", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13, color: "#2A2118" }}>
                      <span>Total</span><span>{fmt(originalSnapshot?.total || 0, true)}</span>
                    </div>
                  </div>
                  {/* Current */}
                  <div style={{ background: "#D1FAE5", borderRadius: 12, padding: "14px 16px", border: "1.5px solid #6EE7B7" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#065F46", textTransform: "uppercase", letterSpacing: .6, marginBottom: 10 }}>✅ Current Bill</div>
                    {(txn.cart || []).map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#065F46", marginBottom: 5 }}>
                        <span>{item.service}{item.qty > 1 ? ` ×${item.qty}` : ""}</span>
                        <span style={{ fontWeight: 600 }}>{fmt((item.price || 0) * (item.qty || 1), true)}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #6EE7B7", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13, color: "#065F46" }}>
                      <span>Total</span><span>{fmt(txn.total, true)}</span>
                    </div>
                  </div>
                </div>

                {/* Difference */}
                {originalSnapshot && originalSnapshot.total !== txn.total && (
                  <div style={{ textAlign: "center", marginBottom: 20, fontSize: 13, fontWeight: 700, color: txn.total > (originalSnapshot?.total || 0) ? "#065F46" : "#A0303F" }}>
                    {txn.total > (originalSnapshot?.total || 0) ? "▲" : "▼"} {fmt(Math.abs(txn.total - (originalSnapshot?.total || 0)), true)} difference from original
                  </div>
                )}

                {/* Edit timeline */}
                {txn.amendments.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#2A2118", marginBottom: 10 }}>Edit Timeline</div>
                    {txn.amendments.map((amend, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FEF3C7", border: "2px solid #F59E0B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#92400E" }}>{i + 1}</div>
                          {i < txn.amendments.length - 1 && <div style={{ width: 2, flex: 1, background: "#FDE68A", marginTop: 4 }} />}
                        </div>
                        <div style={{ flex: 1, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 12px", marginBottom: 2 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#92400E" }}>Edit #{i + 1}</span>
                            <span style={{ fontSize: 10, color: "#B8AFA5" }}>
                              {amend.edited_by} · {amend.edited_at ? new Date(amend.edited_at).toLocaleString("en-PK", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                            </span>
                          </div>
                          {amend.edit_note && <div style={{ fontSize: 11, color: "#B45309", fontStyle: "italic", marginBottom: 6 }}>"{amend.edit_note}"</div>}
                          <div style={{ fontSize: 11, color: "#8B7355" }}>
                            <span>Before: <b style={{ color: "#92400E" }}>{fmt(amend.snapshot?.total || 0, true)}</b></span>
                            <span style={{ margin: "0 8px" }}>→</span>
                            <span>After: <b style={{ color: "#2A2118" }}>{fmt(i < txn.amendments.length - 1 ? (txn.amendments[i + 1]?.snapshot?.total || txn.total) : txn.total, true)}</b></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Print button */}
                <button onClick={() => {
                  const s = txn;
                  const subtotal = (s.cart || []).reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);
                  printHTML(`<!DOCTYPE html><html><head>
                  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
                  <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Outfit',sans-serif;padding:6px;color:#000;background:#fff;font-size:13px;line-height:1.5;width:75mm;}.center{text-align:center;}.logo{font-family:'Playfair Display',serif;font-size:26px;font-weight:400;margin-bottom:4px;color:#000;}.sub{font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;font-weight:400;}.divider{border:none;border-top:1.5px solid #000;margin:10px 0;}.tbl-head{display:flex;justify-content:space-between;font-weight:400;margin-bottom:8px;font-size:12px;border-bottom:1.5px solid #000;padding-bottom:6px;}.svc-row{display:flex;justify-content:space-between;margin-bottom:10px;font-size:12px;align-items:flex-start;}.svc-info{flex:1;padding-right:8px;}.svc-name{font-weight:400;color:#000;}.svc-staff{font-size:11px;font-weight:400;color:#000;margin-top:2px;}.svc-amt{width:75px;text-align:right;font-weight:400;color:#000;}.sum-row{display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px;font-weight:400;color:#000;}.total-row{display:flex;justify-content:space-between;font-size:15px;font-weight:400;margin-top:10px;padding-top:10px;border-top:2px solid #000;color:#000;}.footer{text-align:center;font-size:11px;color:#000;margin-top:18px;border-top:1px dashed #000;padding-top:12px;font-weight:400;}.stars{font-size:14px;letter-spacing:4px;}@page{size:79mm auto;margin:2mm;}@media print{body{padding:4px;width:75mm;}}</style></head><body>
                  <div class="center"><img src="${NOORKADA_LOGO}" style="max-height:60px;max-width:150px;margin:0 auto 8px;display:block;object-fit:contain;" /><div class="sub">Noor Kada</div>
                  <div style="font-size:12px;color:#000;margin-bottom:14px;font-weight:700;">
                    <div>Receipt #: ${esc(s.slip)}</div>
                    <div>Date: ${esc(s.date)} | Time: ${esc(s.time)}</div>
                    <div style="font-weight:400;text-transform:uppercase;">Customer: ${esc(s.customerName || 'Walk-in')}</div>
                    <div style="font-size:11px;font-weight:400;border:1.5px solid #000;display:inline-block;padding:2px 8px;margin-top:6px;">** AMENDED BILL — ${txn.amendments.length} EDIT${txn.amendments.length > 1 ? 'S' : ''} **</div>
                  </div></div>
                  <div class="divider"></div>
                  <div class="tbl-head"><div style="flex:1;">Service / Staff</div><div style="width:75px;text-align:right;">Amount</div></div>
                  ${(s.cart || []).map(item => `<div class="svc-row"><div class="svc-info"><div class="svc-name">${esc(item.service)}</div><div class="svc-staff">Staff: ${esc(item.stylist || 'Unassigned')}</div></div><div class="svc-amt">PKR ${((item.price || 0) * (item.qty || 1)).toLocaleString('en-PK')}</div></div>`).join('')}
                  <div class="divider"></div>
                  <div style="padding:0 2px;margin-bottom:14px;"><div class="sum-row"><span>Subtotal</span><span>PKR ${subtotal.toLocaleString('en-PK')}</span></div>${(s.discountAmt || 0) > 0 ? `<div class="sum-row"><span>Discount ${(() => { const pct = s.discPct || s.discount || 0; const parts = []; if (s.discReason) parts.push(s.discReason); if (s.discMode === 'pct' && pct > 0) parts.push(pct + '%'); return parts.length ? '(' + parts.join(' · ') + ')' : ''; })()}</span><span>-PKR ${(s.discountAmt || 0).toLocaleString('en-PK')}</span></div>${s.discCourtesyBy ? `<div class="sum-row" style="font-size:11px;font-style:italic;margin-top:-4px;"><span>Courtesy by: ${esc(s.discCourtesyBy)}</span><span></span></div>` : ''}` : ''}<div class="total-row"><span>Total Amount</span><span>PKR ${(s.total || 0).toLocaleString('en-PK')}</span></div></div>
                  <div style="text-align:center;font-size:11px;font-weight:700;border:1px solid #000;padding:6px;margin-bottom:14px;">Amended Receipt · Original: PKR ${(originalSnapshot?.total || 0).toLocaleString('en-PK')}</div>
                  <div class="footer">Thank you for choosing Noorkada!<br/>We look forward to seeing you again.<br/><span class="stars">★ ★ ★ ★ ★</span></div></body></html>`);
                }} style={{ width: "100%", fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, background: "#2A2118", color: "#FFF", border: "none", borderRadius: 10, padding: "13px", cursor: "pointer", marginTop: 4 }}>
                  🖨️ Print Updated Slip
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ EDIT BILL MODAL ═══════════════════════════════════════════════════ */}
      {editingBill && (
        <div className="ovl" onClick={closeEditBill}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#FDFBF7", borderRadius: 18, padding: 0,
            maxWidth: 680, width: "96%", maxHeight: "92vh",
            overflowY: "auto", boxShadow: "0 24px 72px rgba(42,33,24,.24)",
            position: "relative", display: "flex", flexDirection: "column"
          }}>

            {/* Header */}
            <div style={{ padding: "22px 26px 18px", borderBottom: "1.5px solid #EDE6D8", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#FDFBF7", zIndex: 10, borderRadius: "18px 18px 0 0" }}>
              <div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: "#2A2118" }}>✏️ Edit Bill</div>
                <div style={{ fontSize: 11, color: "#B8AFA5", marginTop: 2 }}>#{editingBill.slip} · {editingBill.date}</div>
              </div>
              <button onClick={closeEditBill} style={{ background: "#F5F0E8", border: "none", borderRadius: 10, padding: "7px 14px", cursor: "pointer", fontSize: 13, color: "#6B5540", fontWeight: 600 }}>✕ Close</button>
            </div>

            {/* ── Post-save success screen ── */}
            {editSavedTxn ? (
              <div style={{ padding: "32px 26px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✅</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color: "#2A2118", marginBottom: 6 }}>Bill Updated!</div>
                  <div style={{ fontSize: 13, color: "#8B7355" }}>#{editSavedTxn.slip} · {editSavedTxn.customerName}</div>
                </div>

                {/* Summary comparison */}
                <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "#F5F0E8", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8B7355", textTransform: "uppercase", letterSpacing: .6, marginBottom: 8 }}>Original Bill</div>
                    {(editingBill.cart || []).map((item, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#5A4D41", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                        <span>{item.service}{item.qty > 1 ? ` ×${item.qty}` : ""}</span>
                        <span style={{ color: "#8B7355" }}>{fmt(item.price * (item.qty || 1), true)}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #D4C4A8", marginTop: 8, paddingTop: 8, fontWeight: 700, fontSize: 13, color: "#2A2118", display: "flex", justifyContent: "space-between" }}>
                      <span>Total</span><span>{fmt(editingBill.total, true)}</span>
                    </div>
                  </div>
                  <div style={{ background: "#D1FAE5", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#065F46", textTransform: "uppercase", letterSpacing: .6, marginBottom: 8 }}>Updated Bill</div>
                    {(editSavedTxn.cart || []).map((item, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#065F46", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                        <span>{item.service}{item.qty > 1 ? ` ×${item.qty}` : ""}</span>
                        <span>{fmt(item.price * (item.qty || 1), true)}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #6EE7B7", marginTop: 8, paddingTop: 8, fontWeight: 700, fontSize: 13, color: "#065F46", display: "flex", justifyContent: "space-between" }}>
                      <span>Total</span><span>{fmt(editSavedTxn.total, true)}</span>
                    </div>
                  </div>
                </div>

                {editSavedTxn.total !== editingBill.total && (
                  <div style={{ fontSize: 13, fontWeight: 600, color: editSavedTxn.total > editingBill.total ? "#065F46" : "#A0303F" }}>
                    {editSavedTxn.total > editingBill.total ? "▲" : "▼"} {fmt(Math.abs(editSavedTxn.total - editingBill.total), true)} difference
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, width: "100%", flexWrap: "wrap" }}>
                  <button onClick={closeEditBill}
                    style={{ flex: 1, fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, background: "#F5F0E8", color: "#6B5540", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer" }}>
                    ✕ Close
                  </button>
                  <button onClick={() => { closeEditBill(); setView("history"); setHTab("transactions"); setHRange("all"); setHQ(editSavedTxn?.slip || ""); }}
                    style={{ flex: 1, fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, background: "#EDE6D8", color: "#2A2118", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer", whiteSpace: "nowrap" }}>
                    📋 View in History
                  </button>
                  <button onClick={() => {
                    const s = editSavedTxn;
                    const subtotal = s.subtotal || (s.cart || []).reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);
                    printHTML(`<!DOCTYPE html><html><head>
                    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                    <style>
                      *{margin:0;padding:0;box-sizing:border-box;}
                      body{font-family:'Outfit',sans-serif;padding:6px;color:#000;background:#fff;font-size:13px;line-height:1.5;width:75mm;}
                      .center{text-align:center;}
                      .logo{font-family:'Playfair Display',serif;font-size:26px;font-weight:400;letter-spacing:0.5px;margin-bottom:4px;color:#000;}
                      .sub{font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;font-weight:400;color:#000;}
                      .header-info{font-size:12px;color:#000;margin-bottom:14px;text-align:center;}
                      .header-line{margin-bottom:3px;font-weight:400;color:#000;}
                      .cust-name{font-weight:400;text-transform:uppercase;letter-spacing:0.5px;}
                      .amended{font-size:11px;font-weight:400;border:1.5px solid #000;padding:2px 7px;display:inline-block;margin-top:6px;}
                      .divider{border:none;border-top:1.5px solid #000;margin:10px 0;}
                      .tbl-head{display:flex;justify-content:space-between;font-weight:400;margin-bottom:8px;font-size:12px;border-bottom:1.5px solid #000;padding-bottom:6px;}
                      .svc-row{display:flex;justify-content:space-between;margin-bottom:10px;align-items:flex-start;font-size:12px;}
                      .svc-info{flex:1;padding-right:8px;}
                      .svc-name{font-weight:400;color:#000;}
                      .svc-stylist{font-size:11px;color:#000;margin-top:2px;font-weight:400;}
                      .svc-qty{width:30px;text-align:center;font-weight:400;color:#000;}
                      .svc-amt{width:75px;text-align:right;font-weight:400;color:#000;}
                      .summary{padding:0 2px;margin-bottom:16px;}
                      .sum-row{display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px;font-weight:400;color:#000;}
                      .total-row{display:flex;justify-content:space-between;font-size:15px;font-weight:400;margin-top:10px;padding-top:10px;border-top:2px solid #000;align-items:center;color:#000;}
                      .footer{text-align:center;font-size:11px;color:#000;margin-top:18px;border-top:1px dashed #000;padding-top:12px;font-weight:400;}
                      .stars{font-size:14px;letter-spacing:4px;}
                      @page{size:79mm auto;margin:2mm;}
                      @media print{body{padding:4px;width:75mm;}}
                    </style></head><body>
                    <div class="center">
                      <img src="${NOORKADA_LOGO}" style="max-height:60px;max-width:150px;margin:0 auto 8px;display:block;object-fit:contain;" />
                      <div class="sub">Noor Kada</div>
                      <div class="header-info">
                        <div class="header-line">Receipt #: ${esc(s.slip)}</div>
                        <div class="header-line">Date: ${esc(s.date)} | Time: ${esc(s.time)}</div>
                        <div class="header-line">Customer: <span class="cust-name">${esc(s.customerName || 'Walk-in')}</span></div>
                        <div class="amended">** AMENDED BILL **</div>
                      </div>
                    </div>
                    <div class="divider"></div>
                    <div class="tbl-head"><div style="flex:1;">Service / Staff</div><div style="width:30px;text-align:center;">Qty</div><div style="width:75px;text-align:right;">Amount</div></div>
                    ${(s.cart || []).map(item => `<div class="svc-row"><div class="svc-info"><div class="svc-name">${esc(item.service)}</div><div class="svc-stylist">Staff: ${esc(item.stylist || 'Unassigned')}</div></div><div class="svc-qty">${item.qty || 1}</div><div class="svc-amt">PKR ${((item.price || 0) * (item.qty || 1)).toLocaleString('en-PK')}</div></div>`).join('')}
                    <div class="divider"></div>
                    <div class="summary">
                      <div class="sum-row"><span>Subtotal</span><span>PKR ${subtotal.toLocaleString('en-PK')}</span></div>
                      ${(s.discountAmt || 0) > 0 ? `<div class="sum-row"><span>Discount ${(() => { const pct = s.discPct || s.discount || 0; const parts = []; if (s.discReason) parts.push(s.discReason); if (s.discMode === 'pct' && pct > 0) parts.push(pct + '%'); return parts.length ? '(' + parts.join(' · ') + ')' : ''; })()}</span><span>-PKR ${(s.discountAmt || 0).toLocaleString('en-PK')}</span></div>${s.discCourtesyBy ? `<div class="sum-row" style="font-size:11px;font-style:italic;margin-top:-4px;"><span>Courtesy by: ${esc(s.discCourtesyBy)}</span><span></span></div>` : ''}` : ''}
                      <div class="total-row"><span>Total Amount</span><span>PKR ${(s.total || 0).toLocaleString('en-PK')}</span></div>
                    </div>
                    <div style="text-align:center;font-size:11px;font-weight:700;border:1px solid #000;padding:6px;margin-bottom:14px;color:#000;">Amended Receipt · Original: PKR ${(editingBill.total || 0).toLocaleString('en-PK')}</div>
                    <div class="footer">Thank you for choosing Noorkada!<br/>We look forward to seeing you again.<br/><span class="stars">★ ★ ★ ★ ★</span></div>
                    </body></html>`);
                  }}
                    style={{ flex: 2, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, background: "#2A2118", color: "#FFF", border: "none", borderRadius: 10, padding: "12px", cursor: "pointer" }}>
                    🖨️ Print Updated Slip
                  </button>
                </div>
              </div>
            ) : (

            <div style={{ padding: "20px 26px 26px", flex: 1 }}>

              {/* Customer row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }} className="stack-mobile">
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#8B7355", marginBottom: 5, textTransform: "uppercase", letterSpacing: .6 }}>Customer Name</div>
                  <input className="inp" value={editCustName} onChange={e => setEditCustName(e.target.value)} placeholder="Walk-in" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#8B7355", marginBottom: 5, textTransform: "uppercase", letterSpacing: .6 }}>Phone</div>
                  <input className="inp" value={editCustPhone} onChange={e => setEditCustPhone(e.target.value)} placeholder="Optional" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>

              {/* Cart editor */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2A2118", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  🛒 Services
                  <span style={{ fontSize: 11, fontWeight: 400, color: "#B8AFA5" }}>{editCart.length} item{editCart.length !== 1 ? "s" : ""}</span>
                  <button onClick={() => setEditShowOriginal(v => !v)}
                    style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: editShowOriginal ? "#065F46" : "#B08040", background: editShowOriginal ? "#D1FAE5" : "#FEF9EE", border: `1.5px solid ${editShowOriginal ? "#6EE7B7" : "#F0D98A"}`, borderRadius: 7, padding: "4px 10px", cursor: "pointer" }}>
                    {editShowOriginal ? "✕ Hide Original" : "📋 Compare Original"}
                  </button>
                </div>

                {/* Original bill snapshot */}
                {editShowOriginal && (
                  <div style={{ background: "#F5F0E8", border: "1px solid #D4C4A8", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8B7355", textTransform: "uppercase", letterSpacing: .6, marginBottom: 8 }}>Original Bill — {fmt(editingBill.total, true)}</div>
                    {(editingBill.cart || []).map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < (editingBill.cart.length - 1) ? "1px solid #EDE6D8" : "none" }}>
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#2A2118" }}>{item.service}</span>
                          {item.qty > 1 && <span style={{ fontSize: 11, color: "#B8AFA5" }}> ×{item.qty}</span>}
                          {item.stylist && <div style={{ fontSize: 10, color: "#B08040" }}>✂️ {item.stylist}</div>}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#5A4D41" }}>{fmt((item.price || 0) * (item.qty || 1), true)}</span>
                      </div>
                    ))}
                    {editingBill.discMode && editingBill.discMode !== "none" && (
                      <div style={{ fontSize: 11, color: "#A0303F", marginTop: 6 }}>
                        Discount: {editingBill.discMode === "pct" ? `${editingBill.discPct}%` : `PKR ${editingBill.discFlat}`}
                        {editingBill.discReason ? ` — ${editingBill.discReason}` : ""}
                      </div>
                    )}
                  </div>
                )}

                {editCart.length === 0 && (
                  <div style={{ textAlign: "center", padding: "24px 0", color: "#C4B9AB", fontSize: 13 }}>No items — add a service below</div>
                )}
                {editCart.map((item, idx) => {
                  const color = getCatColor(item.service, item.category) || "#B08040";
                  return (
                    <div key={item._eid ?? idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#FFFFFF", border: "1px solid #EDE6D8", borderRadius: 10, marginBottom: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#2A2118", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.service}</div>
                        <div style={{ fontSize: 11, color: "#B8AFA5" }}>{item.category} · {fmt(item.price)}</div>
                      </div>
                      {/* Staff picker */}
                      <select value={item.stylist || ""} onChange={e => setEditCart(prev => prev.map((c, i) => i === idx ? { ...c, stylist: e.target.value } : c))}
                        style={{ fontSize: 11, border: "1px solid #EDE6D8", borderRadius: 7, padding: "4px 6px", color: "#5A4D41", background: "#FDFAF6", maxWidth: 100 }}>
                        <option value="">No Staff</option>
                        {dbStylists.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      </select>
                      {/* Qty controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button onClick={() => setEditCart(prev => prev.map((c, i) => i === idx ? { ...c, qty: Math.max(1, (c.qty || 1) - 1) } : c))}
                          style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #EDE6D8", background: "#F5F0E8", cursor: "pointer", fontSize: 14, color: "#6B5540", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#2A2118", minWidth: 20, textAlign: "center" }}>{item.qty || 1}</span>
                        <button onClick={() => setEditCart(prev => prev.map((c, i) => i === idx ? { ...c, qty: (c.qty || 1) + 1 } : c))}
                          style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #EDE6D8", background: "#F5F0E8", cursor: "pointer", fontSize: 14, color: "#6B5540", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#2A2118", minWidth: 64, textAlign: "right" }}>{fmt((item.price || 0) * (item.qty || 1), true)}</div>
                      <button onClick={() => setEditCart(prev => prev.filter((_, i) => i !== idx))}
                        style={{ width: 28, height: 28, borderRadius: 7, border: "none", background: "#FEE2E2", color: "#A0303F", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
                    </div>
                  );
                })}

                {/* Add service — unified search */}
                <div style={{ marginTop: 10, background: "#F9F6F0", border: "1.5px dashed #D4C4A8", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#C4B9AB", pointerEvents: "none" }}>🔍</span>
                    <input
                      value={editSvcSearch}
                      onChange={e => setEditSvcSearch(e.target.value)}
                      placeholder="Search any service to add…"
                      style={{ width: "100%", boxSizing: "border-box", fontSize: 12, border: "1px solid #EDE6D8", borderRadius: 8, padding: "9px 32px 9px 30px", background: "#FFF", color: "#2A2118", outline: "none", fontFamily: "'Outfit',sans-serif" }}
                    />
                    {editSvcSearch && (
                      <button onClick={() => setEditSvcSearch("")}
                        style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#C4B9AB", fontSize: 16, cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>
                    )}
                  </div>
                  {editSvcSearch.trim().length >= 1 && (() => {
                    const q = editSvcSearch.trim().toLowerCase();
                    const results = dbServices.filter(s => s.name.toLowerCase().includes(q)).slice(0, 20);
                    return (
                      <div style={{ marginTop: 8, maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
                        {results.length === 0
                          ? <div style={{ fontSize: 12, color: "#C4B9AB", textAlign: "center", padding: "14px 0" }}>No services match "{editSvcSearch}"</div>
                          : results.map(svc => (
                            <button key={`${svc.id}-${svc.name}`} onClick={() => {
                              setEditCart(prev => [...prev, {
                                _eid: Date.now(),
                                service: svc.name,
                                category: svc.category,
                                price: svc.price || 0,
                                qty: 1,
                                stylist: editStaff || "",
                                icon: svc.icon || "",
                              }]);
                              setEditSvcSearch("");
                            }}
                              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#FFF", border: "1px solid #EDE6D8", borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "background .12s" }}
                              onMouseEnter={e => e.currentTarget.style.background = "#F5F0E8"}
                              onMouseLeave={e => e.currentTarget.style.background = "#FFF"}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#2A2118" }}>{svc.name}</div>
                                <div style={{ fontSize: 10, color: "#B8AFA5", marginTop: 1 }}>{svc.category}</div>
                              </div>
                              <span style={{ color: "#B08040", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{fmt(svc.price, true)}</span>
                            </button>
                          ))
                        }
                      </div>
                    );
                  })()}
                  {!editSvcSearch && (
                    <div style={{ fontSize: 11, color: "#C4B9AB", textAlign: "center", marginTop: 8 }}>Type to search across all services</div>
                  )}
                </div>
              </div>

              {/* Payment mode */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2A2118", marginBottom: 10 }}>💳 Payment Mode</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["CASH", "ONLINE", "CARD", "SPLIT"].map(m => (
                    <button key={m} onClick={() => setEditPayMode(m)}
                      style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1.5px solid", transition: "all .15s",
                        background: editPayMode === m ? "#2A2118" : "#FFF",
                        borderColor: editPayMode === m ? "#2A2118" : "#EDE6D8",
                        color: editPayMode === m ? "#FFF" : "#5A4D41" }}>
                      {m}
                    </button>
                  ))}
                </div>
                {editPayMode === "SPLIT" && (
                  <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 130px" }}>
                      <div style={{ fontSize: 11, color: "#8B7355", marginBottom: 4 }}>Cash Amount</div>
                      <input type="number" className="inp" value={editSplitCash} onChange={e => setEditSplitCash(Number(e.target.value))} min="0" style={{ width: "100%", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ flex: "1 1 100px" }}>
                      <div style={{ fontSize: 11, color: "#8B7355", marginBottom: 4 }}>Other Mode</div>
                      <select className="inp" value={editSplitOtherMode} onChange={e => setEditSplitOtherMode(e.target.value)} style={{ width: "100%", boxSizing: "border-box" }}>
                        <option>ONLINE</option><option>CARD</option>
                      </select>
                    </div>
                    <div style={{ flex: "1 1 130px" }}>
                      <div style={{ fontSize: 11, color: "#8B7355", marginBottom: 4 }}>Other Amount</div>
                      <input type="number" className="inp" value={editSplitOtherAmt} onChange={e => setEditSplitOtherAmt(Number(e.target.value))} min="0" style={{ width: "100%", boxSizing: "border-box" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Discount */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2A2118", marginBottom: 10 }}>🏷️ Discount</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {[["none", "No Discount"], ["pct", "% Percentage"], ["flat", "PKR Flat"]].map(([v, l]) => (
                    <button key={v} onClick={() => setEditDiscMode(v)}
                      style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1.5px solid", transition: "all .15s",
                        background: editDiscMode === v ? "#B08040" : "#FFF",
                        borderColor: editDiscMode === v ? "#B08040" : "#EDE6D8",
                        color: editDiscMode === v ? "#FFF" : "#5A4D41" }}>
                      {l}
                    </button>
                  ))}
                </div>
                {editDiscMode === "pct" && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input type="number" className="inp" value={editDiscPct} onChange={e => setEditDiscPct(Math.min(100, Math.max(0, Number(e.target.value))))} min="0" max="100" style={{ width: 90 }} />
                    <span style={{ fontSize: 12, color: "#8B7355" }}>%</span>
                    <input className="inp" value={editDiscReason} onChange={e => setEditDiscReason(e.target.value)} placeholder="Reason (optional)" style={{ flex: 1 }} />
                  </div>
                )}
                {editDiscMode === "flat" && (
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#8B7355" }}>PKR</span>
                    <input type="number" className="inp" value={editDiscFlat} onChange={e => setEditDiscFlat(Math.max(0, Number(e.target.value)))} min="0" style={{ width: 110 }} />
                    <input className="inp" value={editDiscReason} onChange={e => setEditDiscReason(e.target.value)} placeholder="Reason (optional)" style={{ flex: 1 }} />
                  </div>
                )}
              </div>

              {/* Edit reason */}
              <div style={{ marginBottom: 22, background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 7 }}>⚠️ Reason for Edit <span style={{ fontWeight: 400, color: "#B45309" }}>(recommended)</span></div>
                <input className="inp" value={editNoteReason} onChange={e => setEditNoteReason(e.target.value)} placeholder="e.g. Client added extra service, removed haircut…" style={{ width: "100%", boxSizing: "border-box", background: "#FFFEF5" }} />
              </div>

              {/* Amendment history */}
              {Array.isArray(editingBill.amendments) && editingBill.amendments.length > 0 && (
                <div style={{ marginBottom: 22 }}>
                  <button onClick={() => setEditShowAmendments(v => !v)}
                    style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: "#6B5540", background: "none", border: "1.5px solid #EDE6D8", borderRadius: 8, padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
                    📋 {editShowAmendments ? "Hide" : "Show"} Edit History ({editingBill.amendments.length})
                  </button>
                  {editShowAmendments && (
                    <div style={{ marginTop: 10 }}>
                      {[...editingBill.amendments].reverse().map((amend, i) => (
                        <div key={i} style={{ border: "1px solid #EDE6D8", borderRadius: 10, padding: "12px 14px", marginBottom: 8, background: "#FDFAF6" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#2A2118" }}>
                              Before edit #{editingBill.amendments.length - i}
                            </div>
                            <div style={{ fontSize: 11, color: "#B8AFA5" }}>
                              {amend.edited_by} · {amend.edited_at ? new Date(amend.edited_at).toLocaleString("en-PK", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                            </div>
                          </div>
                          {amend.edit_note && <div style={{ fontSize: 11, color: "#92400E", background: "#FFFBEB", borderRadius: 6, padding: "4px 8px", marginBottom: 6 }}>"{amend.edit_note}"</div>}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {(amend.snapshot?.cart || []).map((item, j) => (
                              <span key={j} style={{ fontSize: 11, background: "#F0EAE0", color: "#5A4D41", borderRadius: 100, padding: "2px 8px" }}>
                                {item.service}{item.qty > 1 ? ` ×${item.qty}` : ""} · {fmt(item.price * (item.qty || 1), true)}
                              </span>
                            ))}
                          </div>
                          <div style={{ marginTop: 6, fontSize: 11, color: "#8B7355", display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <span>Total: <b>{fmt(amend.snapshot?.total || 0, true)}</b></span>
                            <span>Pay: <b>{amend.snapshot?.pay_mode || "—"}</b></span>
                            {amend.snapshot?.disc_mode && amend.snapshot.disc_mode !== "none" && (
                              <span>Discount: <b>{amend.snapshot.disc_mode === "pct" ? `${amend.snapshot.disc_pct}%` : `PKR ${amend.snapshot.disc_flat}`}</b></span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Total + Save */}
              <div style={{ background: "#F5F0E8", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#8B7355", marginBottom: 2 }}>New Total</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 700, color: "#2A2118" }}>{fmt(editBillTotal)}</div>
                  {editingBill.total !== editBillTotal && (
                    <div style={{ fontSize: 11, color: "#B8AFA5", marginTop: 1 }}>
                      was {fmt(editingBill.total, true)} · {editBillTotal > editingBill.total ? "▲" : "▼"} {fmt(Math.abs(editBillTotal - editingBill.total), true)}
                    </div>
                  )}
                </div>
                <button onClick={saveEditBill} disabled={editSaving || !editCart.length}
                  style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, background: editSaving || !editCart.length ? "#D4C4A8" : "#2A2118", color: "#FFF", border: "none", borderRadius: 10, padding: "12px 28px", cursor: editSaving || !editCart.length ? "not-allowed" : "pointer", transition: "background .15s" }}
                  onMouseEnter={e => { if (!editSaving && editCart.length) e.currentTarget.style.background = "#4A3828"; }}
                  onMouseLeave={e => { if (!editSaving && editCart.length) e.currentTarget.style.background = "#2A2118"; }}>
                  {editSaving ? "Saving…" : "💾 Save Changes"}
                </button>
              </div>

            </div>
            )}
          </div>
        </div>
      )}

      {/* ══ STAFF SLIP PREVIEW MODAL ══════════════════════════════════════════ */}
      {staffSlipPreview && (
        <div className="ovl" onClick={() => setStaffSlipPreview(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#FDFBF7", borderRadius: 16, padding: "40px 32px 32px", maxWidth: 420, width: "92%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(42,33,24,.22)", position: "relative" }}>

            {/* Close */}
            <button onClick={() => setStaffSlipPreview(null)} style={{ position: "absolute", top: 16, right: 16, background: "#F5F0E8", border: "none", borderRadius: 8, padding: "6px 14px", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#6B5540", cursor: "pointer", fontWeight: 600 }}>Close</button>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <img src={NOORKADA_LOGO} style={{ maxHeight: 60, maxWidth: 140, margin: "0 auto 10px", display: "block", objectFit: "contain" }} />
              <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, color: "#6B5540", marginBottom: 10 }}>Noor Kada</div>
              <div style={{ display: "inline-block", background: "#2A2118", color: "#FFF", padding: "4px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>Staff Service Slip</div>
              <div style={{ fontSize: 13, color: "#2A2118", fontWeight: 700, marginBottom: 2 }}>Order #: {staffSlipPreview.slip}</div>
              <div style={{ fontSize: 13, color: "#2A2118", fontWeight: 700, marginBottom: 2 }}>Date: {staffSlipPreview.date} | Time: {staffSlipPreview.time}</div>
              <div style={{ fontSize: 13, color: "#2A2118", fontWeight: 700 }}>Customer: <span style={{ fontWeight: 800 }}>{staffSlipPreview.customerName}</span></div>
            </div>

            {/* Services */}
            <div style={{ borderTop: "1.5px solid #E8E0D4", borderBottom: "1.5px solid #E8E0D4", padding: "14px 0", marginBottom: 16 }}>
              {staffSlipPreview.cart.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, paddingBottom: 10, borderBottom: i < staffSlipPreview.cart.length - 1 ? "1px solid #F5F0E8" : "none" }}>
                  <div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, color: "#2A2118" }}>{item.service}{item.qty > 1 ? ` (×${item.qty})` : ""}</div>
                    {item.stylist
                      ? <div style={{ fontSize: 12, color: "#2A2118", fontWeight: 700, marginTop: 3 }}>Stylist: {item.stylist}</div>
                      : <div style={{ fontSize: 12, color: "#2A2118", fontWeight: 700, marginTop: 3 }}>No Staff Assigned</div>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Note */}
            {staffSlipPreview.note && (
              <div style={{ background: "#FEF9EC", border: "1px solid #EDE6D8", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#6B5030", marginBottom: 16 }}>
                <strong>Note:</strong> {staffSlipPreview.note}
              </div>
            )}

            <div style={{ fontSize: 11, color: "#B8AFA5", textAlign: "center", fontStyle: "italic", marginBottom: 16 }}>
              Please complete transaction at front desk after service.
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", borderTop: "1px dashed #C4B9AB", paddingTop: 14, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#2A2118", marginBottom: 2 }}>Thank you for choosing Noorkada!</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#2A2118", marginBottom: 8 }}>We look forward to seeing you again.</div>
              <div style={{ fontSize: 18, letterSpacing: 6, color: "#2A2118" }}>★ ★ ★ ★ ★</div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStaffSlipPreview(null)}
                style={{ flex: 1, padding: "14px", fontSize: 14, fontFamily: "'Outfit',sans-serif", fontWeight: 700, background: "#F5F0E8", color: "#6B5540", border: "none", borderRadius: 12, cursor: "pointer" }}>
                ✕ Close
              </button>
              <button onClick={() => { printStaffSlip(); setStaffSlipPreview(null); }}
                style={{ flex: 2, padding: "14px", fontSize: 14, fontFamily: "'Outfit',sans-serif", fontWeight: 700, background: "#5A4030", color: "#F5E6C8", border: "none", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                🖨️ Print Staff Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {
        doneSlip && (
          <div className="ovl" onClick={() => setDoneSlip(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#FDFBF7", borderRadius: 16, padding: "40px 32px 32px", maxWidth: 420, width: "92%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(42,33,24,.22)", position: "relative" }}>

              {/* Top right close */}
              <button
                onClick={() => setDoneSlip(null)}
                style={{ position: "absolute", top: 16, right: 16, background: "#FFF", border: "1px solid #E8E0D4", borderRadius: 8, padding: "6px 12px", fontSize: 13, color: "#B08040", fontWeight: 500, cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}
              >
                Close
              </button>

              <div style={{ textAlign: "center", marginBottom: 24, color: "#2A2118" }}>
                <img src={NOORKADA_LOGO} style={{ maxHeight: 70, maxWidth: 160, margin: "0 auto 12px", display: "block", objectFit: "contain" }} alt="Noorkada Logo" />
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, color: "#6B5540", marginBottom: 16 }}>Noor Kada</div>

                <div style={{ fontSize: 13, color: "#2A2118", marginBottom: 2, fontWeight: 700 }}>Receipt #: {doneSlip.slip}</div>
                <div style={{ fontSize: 13, color: "#2A2118", fontWeight: 700, marginBottom: 2 }}>Date: {doneSlip.date} | Time: {doneSlip.time}</div>
                <div style={{ fontSize: 13, color: "#2A2118", fontWeight: 700 }}>Customer Name: <span style={{ fontWeight: 800, textTransform: "uppercase" }}>{doneSlip.customerName || 'Walk-in'}</span></div>
              </div>

              <div style={{ borderTop: "1.5px solid #2A2118", borderBottom: "1.5px solid #2A2118", padding: "16px 0", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800, color: "#2A2118", marginBottom: 12, borderBottom: "1px solid #D4C4A8", paddingBottom: 8 }}>
                  <div style={{ flex: 1 }}>Service / Stylist</div>
                  <div style={{ width: 40, textAlign: "center" }}>Qty</div>
                  <div style={{ width: 80, textAlign: "right" }}>Amount</div>
                </div>

                {doneSlip.cart.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#2A2118", marginBottom: 12, alignItems: "flex-start" }}>
                    <div style={{ flex: 1, paddingRight: 8 }}>
                      <div style={{ fontWeight: 800, color: "#2A2118" }}>{item.service}</div>
                      <div style={{ fontSize: 12, color: "#2A2118", marginTop: 2, fontWeight: 700 }}>Stylist: {item.stylist || "Unassigned"}</div>
                      {item.category === 'Deal' && item.included_services?.length > 0 && (
                        <div style={{ fontSize: 11, color: "#5A4D41", marginTop: 2, fontWeight: 600 }}>
                          {item.included_services.join(', ')}
                        </div>
                      )}
                    </div>
                    <div style={{ width: 40, textAlign: "center", fontWeight: 700, paddingTop: 1, color: "#2A2118" }}>{item.qty}</div>
                    <div style={{ width: 80, textAlign: "right", fontWeight: 700, paddingTop: 1, color: "#2A2118" }}>
                      {fmt(item.price * item.qty)}
                      {item.discountValue > 0 && (
                        <div style={{ fontSize: 11, color: "#2A2118", fontWeight: 700, marginTop: 2 }}>
                          −{item.discountMode === 'pct' ? `${item.discountValue}%` : fmt(item.discountValue)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: "0 4px", marginBottom: 24, fontSize: 13, color: "#2A2118" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontWeight: 700 }}>
                  <span>Subtotal</span>
                  <span>{fmt(doneSlip.subtotal)}</span>
                </div>
                {doneSlip.discountAmt > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                      <span>Discount {(() => { const pct = doneSlip.discPct || doneSlip.discount || 0; const parts = []; if (doneSlip.discReason) parts.push(doneSlip.discReason); if (doneSlip.discMode === 'pct' && pct > 0) parts.push(`${pct}%`); return parts.length ? `(${parts.join(' · ')})` : ''; })()}</span>
                      <span>−{fmt(doneSlip.discountAmt)}</span>
                    </div>
                    {doneSlip.discCourtesyBy && (
                      <div style={{ fontSize: 11, color: "#8A7060", marginTop: 3, fontStyle: "italic" }}>
                        Courtesy by: {doneSlip.discCourtesyBy}
                      </div>
                    )}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, marginTop: 12, paddingTop: 12, borderTop: "2px solid #2A2118", alignItems: "center", color: "#2A2118" }}>
                  <span>Total Amount</span>
                  <span style={{ fontSize: 18 }}>{fmt(doneSlip.total)}</span>
                </div>
              </div>

              {/* Footer */}
              <div style={{ textAlign: "center", borderTop: "1px dashed #C4B9AB", paddingTop: 14, marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#2A2118", marginBottom: 2 }}>Thank you for choosing Noorkada!</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#2A2118", marginBottom: 8 }}>We look forward to seeing you again.</div>
                <div style={{ fontSize: 18, letterSpacing: 6, color: "#2A2118" }}>★ ★ ★ ★ ★</div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={{ flex: "1 1 auto", fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, background: "#F5F0E8", color: "#6B5540", border: "none", borderRadius: 10, padding: "12px 10px", cursor: "pointer" }}
                  onClick={() => { setDoneSlip(null); setView("history"); setHTab("transactions"); setHRange("all"); setHQ(doneSlip.slip || ""); }}>
                  📋 View in History
                </button>
                <button className="btn-gold" style={{ flex: "2 1 auto", padding: "12px 14px", fontSize: 14 }} onClick={() => { setDoneSlip(null); if (tabs.length === 0) addTab(); }}>New Transaction →</button>
                <button className="btn-ghost" onClick={() => printReceipt(doneSlip, false)} style={{
                  flex: 1, padding: "14px", fontSize: 14, background: "#FFF", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: 6, flexShrink: 0
                }}>
                  🖨️ Print
                </button>
              </div>
              <div style={{ textAlign: "center", fontSize: 11, color: "#C4B9AB", fontFamily: "'Outfit',sans-serif" }}>{esc(salonName) || 'Noorkada'}{salonAddress ? ` · ${esc(salonAddress)}` : ''}</div>
            </div >
          </div >
        )
      }

      {/* Undo Toast */}
      {
        undoTab && (
          <div style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
            background: "#2A2118", color: "#FDFAF6", padding: "12px 20px", borderRadius: 12,
            display: "flex", alignItems: "center", gap: 16, fontFamily: "'Outfit',sans-serif",
            boxShadow: "0 8px 32px rgba(42,33,24,.35)", animation: "fi .25s"
          }}>
            <span style={{ fontSize: 13 }}>🗑️ <strong>{undoTab.tab.custName || undoTab.tab.label}</strong> removed</span>
            <button onClick={restoreTab} style={{
              background: "#B08040", color: "#FFF", border: "none", borderRadius: 6,
              padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}>Undo</button>
            <button onClick={() => { clearTimeout(undoTab.timer); setUndoTab(null); }} style={{
              background: "none", border: "none", color: "#9A9088", fontSize: 16, cursor: "pointer", padding: 0, lineHeight: 1
            }}>×</button>
          </div>
        )
      }

      {/* Confirm Close Modal */}
      {
        confirmClose && tabs[confirmClose.idx] && (
          <div className="modal-overlay" style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: "rgba(42,33,24,.45)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fi .2s"
          }} onClick={() => setConfirmClose(null)}>
            <div onClick={e => e.stopPropagation()} className="modal-content" style={{
              background: "#FDFAF6", borderRadius: 16, padding: "28px 32px", width: 380,
              boxShadow: "0 16px 48px rgba(42,33,24,.25)", fontFamily: "'Outfit',sans-serif"
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#2A2118", marginBottom: 8 }}>⚠️ Close Client?</div>
              <p style={{ fontSize: 13, color: "#7A7068", lineHeight: 1.6, margin: "0 0 20px" }}>
                <strong>{tabs[confirmClose.idx].custName || tabs[confirmClose.idx].label}</strong> ka bill pending hai
                ({tabs[confirmClose.idx].cart.length} item{tabs[confirmClose.idx].cart.length !== 1 ? 's' : ''}).
                Kya aap sure hain ke close karna chahte hain?
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setConfirmClose(null)} className="btn-ghost" style={{ width: "auto", padding: "10px 20px", fontSize: 13, borderRadius: 10 }}>Cancel</button>
                <button onClick={() => doCloseTab(confirmClose.idx)} style={{
                  background: "#A0303F", color: "#FFF", border: "none", borderRadius: 10,
                  padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif"
                }}>Close Tab</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Toast Notification */}
      {
        toast && (
          <div style={{
            position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10001,
            background: toast.type === 'error' ? '#A0303F' : '#2A2118',
            color: "#FDFAF6", padding: "12px 24px", borderRadius: 12,
            display: "flex", alignItems: "center", gap: 12, fontFamily: "'Outfit',sans-serif",
            boxShadow: "0 12px 40px rgba(42,33,24,.3)", animation: "fi .3s cubic-bezier(0.18, 0.89, 0.32, 1.28)"
          }}>
            <span style={{ fontSize: 18 }}>{toast.type === 'error' ? '❌' : '✅'}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{toast.msg}</span>
          </div>
        )
      }

      {/* ── Admin: View Staff Member Dashboard Modal ───────────────────── */}
      {viewingStaffSummary && (
        <div className="modal-overlay" style={{ position:"fixed",inset:0,zIndex:9500,background:"rgba(42,33,24,.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"20px 16px" }}
          onClick={() => setViewingStaffSummary(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#FAF7F3",borderRadius:20,width:"100%",maxWidth:560,boxShadow:"0 20px 60px rgba(42,33,24,.3)",fontFamily:"'Outfit',sans-serif",overflow:"hidden",marginTop:20 }}>
            {/* Modal header */}
            <div style={{ background:"#2A2118",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:11,color:"#C4A882",fontWeight:600,letterSpacing:.5 }}>STAFF DASHBOARD</div>
                <div style={{ fontSize:15,fontWeight:800,color:"#fff",marginTop:2 }}>{viewingStaffSummary.name}</div>
              </div>
              <button onClick={() => setViewingStaffSummary(null)} style={{ background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"6px 14px",color:"#FAF7F3",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif" }}>✕ Close</button>
            </div>
            <div style={{ padding:"16px" }}>
              {/* Range / date selector */}
              <div style={{ display:"flex",gap:6,marginBottom:10,flexWrap:"wrap" }}>
                {[['today','Today'],['week','Week'],['month','Month']].map(([v,l]) => (
                  <button key={v} onClick={() => setViewingStaffSummary(prev => ({ ...prev, range:v, date:new Date().toISOString().slice(0,10), loading:true, data:null, error:null }))}
                    style={{ flex:1,padding:"7px 10px",borderRadius:10,fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",
                      background: viewingStaffSummary.range===v ? '#2A2118' : '#fff',
                      color: viewingStaffSummary.range===v ? '#fff' : '#6B5030',
                      border: viewingStaffSummary.range===v ? '1.5px solid #2A2118' : '1.5px solid #E8DECE' }}>
                    {l}
                  </button>
                ))}
                <input type="date" max={new Date().toISOString().slice(0,10)}
                  value={viewingStaffSummary.date}
                  onChange={e => setViewingStaffSummary(prev => ({ ...prev, range:'custom', date:e.target.value, loading:true, data:null, error:null }))}
                  style={{ padding:"7px 10px",borderRadius:10,border:"1.5px solid #E8DECE",fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#2A2118",background:"#fff",outline:"none",cursor:"pointer" }} />
              </div>
              {/* Loading */}
              {viewingStaffSummary.loading && (
                <div style={{ display:"flex",gap:10,marginBottom:14 }}>
                  {[1,2,3].map(i => <div key={i} style={{ flex:1,height:80,borderRadius:12,background:"linear-gradient(90deg,#f0ebe3 25%,#e8e0d4 50%,#f0ebe3 75%)",backgroundSize:"200% 100%",animation:"sk-pulse 1.4s ease-in-out infinite" }} />)}
                </div>
              )}
              {/* Error */}
              {viewingStaffSummary.error && !viewingStaffSummary.loading && (
                <div style={{ background:"#FFF1F2",border:"1px solid #FECDD3",borderRadius:10,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
                  <span>⚠️</span>
                  <div style={{ flex:1,fontSize:12,color:"#991B1B" }}>{viewingStaffSummary.error}</div>
                  <button onClick={() => setViewingStaffSummary(prev => ({ ...prev, loading:true, error:null }))} style={{ background:"#2A2118",color:"#fff",border:"none",borderRadius:6,padding:"4px 12px",fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:700,cursor:"pointer" }}>↺ Retry</button>
                </div>
              )}
              {/* Summary cards */}
              {!viewingStaffSummary.loading && viewingStaffSummary.data && (() => {
                const d = viewingStaffSummary.data;
                return (
                  <>
                    <div style={{ display:"flex",gap:8,marginBottom:14 }}>
                      {[['✂️','Services',d.total_services,''],['👤','Clients',d.total_clients_served,''],['💰','Revenue','PKR '+(d.total_revenue_generated||0).toLocaleString('en-PK'),'']].map(([icon,label,val]) => (
                        <div key={label} style={{ flex:1,background:"#fff",borderRadius:12,padding:"12px 14px",border:"1px solid #EDE6D8",textAlign:"center" }}>
                          <div style={{ fontSize:18,marginBottom:4 }}>{icon}</div>
                          <div style={{ fontSize:9,color:"#9A9088",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:2 }}>{label}</div>
                          <div style={{ fontSize:16,fontWeight:800,color:"#2A2118" }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    {/* Services breakdown */}
                    {d.services_breakdown?.length > 0 && (
                      <div style={{ background:"#fff",borderRadius:12,border:"1px solid #EDE6D8",overflow:"hidden",marginBottom:10 }}>
                        <div style={{ padding:"10px 14px",borderBottom:"1px solid #f5f0e8",fontSize:12,fontWeight:700,color:"#2A2118" }}>Services Breakdown</div>
                        <div style={{ maxHeight:220,overflowY:"auto" }}>
                          {d.services_breakdown.map((svc, i) => (
                            <div key={i} style={{ display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,padding:"9px 14px",borderBottom:"1px solid #f9f5f0",background:i%2===0?"#fff":"#fdfaf7",alignItems:"center" }}>
                              <div style={{ fontSize:12,fontWeight:600,color:"#2A2118",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{svc.service_name}</div>
                              <div style={{ fontSize:11,color:"#9A9088",textAlign:"center",minWidth:36 }}>×{svc.count}</div>
                              <div style={{ fontSize:12,fontWeight:700,color:"#065F46",textAlign:"right",minWidth:76 }}>PKR {svc.revenue.toLocaleString('en-PK')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {d.total_services === 0 && (
                      <div style={{ textAlign:"center",padding:"24px 16px",color:"#9A9088",fontSize:13 }}>
                        <div style={{ fontSize:28,marginBottom:6 }}>✨</div>
                        No services logged for this period.
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

    </div >
  );
}
