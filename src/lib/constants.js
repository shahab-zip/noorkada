// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Noorkada brand logo — baked in, device-independent
export const NOORKADA_LOGO = "data:image/jpeg;base64,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";

export const MOCK_CATEGORIES = [
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

export const _c = (cat) => (MOCK_CATEGORIES.find(c => c.name === cat) || {}).color || "#B08040";

export const MOCK_SERVICES = [
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
  { id: 207, name: "Nose & Ear Hair Remover",              category: "Beard Grooming", price: 449,  icon: "🪒", color: _c("Beard Grooming") },
  // ── Hair Treatments (Men) ─────────────────────────────────────────────────
  { id: 301, name: "Keratin A (Gk Company)",               category: "Hair Treatments (Men)", price: 15999, icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 302, name: "Keratin B (Brazilian Company)",        category: "Hair Treatments (Men)", price: 12999, icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 303, name: "Anti Dandruff Treatment",              category: "Hair Treatments (Men)", price: 3999,  icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 304, name: "Protein Treatment",                    category: "Hair Treatments (Men)", price: 3999,  icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 305, name: "Dry & Damage Treatment",               category: "Hair Treatments (Men)", price: 3999,  icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 306, name: "Basic Protein Treatment",              category: "Hair Treatments (Men)", price: 2999,  icon: "💆", color: _c("Hair Treatments (Men)") },
  { id: 307, name: "Keratin Mask",                         category: "Hair Treatments (Men)", price: 1499,  icon: "💆", color: _c("Hair Treatments (Men)") },
  // ── Hair Chemicals (Men) ──────────────────────────────────────────────────
  { id: 401, name: "One Dye",                              category: "Hair Chemicals (Men)", price: 6499,  icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 402, name: "Highlights",                           category: "Hair Chemicals (Men)", price: 11499, icon: "🎨", color: _c("Hair Chemicals (Men)") },
  { id: 403, name: "Roots Touch Up",                       category: "Hair Chemicals (Men)", price: 3499,  icon: "🎨", color: _c("Hair Chemicals (Men)") },
  // ── Facial Treatment ──────────────────────────────────────────────────────
  { id: 501, name: "Janssen Hydra Facial",                 category: "Facial Treatment", price: 5899,  icon: "✨", color: _c("Facial Treatment") },
  { id: 502, name: "Thalgo Sea Spa Facial",                category: "Facial Treatment", price: 4899,  icon: "✨", color: _c("Facial Treatment") },
  { id: 503, name: "Thalgo Lifting Facial",                category: "Facial Treatment", price: 4899,  icon: "✨", color: _c("Facial Treatment") },
  { id: 504, name: "Guinot Hydra Derm Facial",             category: "Facial Treatment", price: 4899,  icon: "✨", color: _c("Facial Treatment") },
  { id: 505, name: "Guinot Hydra Finish Facial",           category: "Facial Treatment", price: 4899,  icon: "✨", color: _c("Facial Treatment") },
  { id: 506, name: "Deep Cleansing Facial",                category: "Facial Treatment", price: 2999,  icon: "✨", color: _c("Facial Treatment") },
  { id: 507, name: "Brightening Facial",                   category: "Facial Treatment", price: 2999,  icon: "✨", color: _c("Facial Treatment") },
  { id: 508, name: "Anti-Ageing Facial",                   category: "Facial Treatment", price: 2999,  icon: "✨", color: _c("Facial Treatment") },
  { id: 509, name: "Hydrating Facial",                     category: "Facial Treatment", price: 2999,  icon: "✨", color: _c("Facial Treatment") },
  { id: 510, name: "Classic Facial",                       category: "Facial Treatment", price: 1999,  icon: "✨", color: _c("Facial Treatment") },
  // ── Aesthetic Treatment ───────────────────────────────────────────────────
  { id: 601, name: "Micro Needling",                       category: "Aesthetic Treatment", price: 5899,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 602, name: "Mesotherapy",                          category: "Aesthetic Treatment", price: 7499,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 603, name: "Chemical Peel",                        category: "Aesthetic Treatment", price: 3499,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 604, name: "Dermaplaning",                         category: "Aesthetic Treatment", price: 3499,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 605, name: "Botox (Per Unit)",                     category: "Aesthetic Treatment", price: 999,   icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 606, name: "Filler (Per Syringe)",                 category: "Aesthetic Treatment", price: 25000, icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 607, name: "Skin Booster",                         category: "Aesthetic Treatment", price: 12999, icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 608, name: "PRP Therapy",                          category: "Aesthetic Treatment", price: 9999,  icon: "💎", color: _c("Aesthetic Treatment") },
  { id: 609, name: "Carbon Peel",                          category: "Aesthetic Treatment", price: 5899,  icon: "💎", color: _c("Aesthetic Treatment") },
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
];

export const DEFAULT_COURTESY_PERSONS = ["Owner", "Manager", "Ahmed", "Ayesha", "Sara", "Usman", "Fatima", "Ali"];

export const SALON_EMOJIS = [
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
