// ─── RBAC Helpers ─────────────────────────────────────────────────────────────
// staff(0) < receptionist(1) < manager(2) < admin(3) < superadmin(4)

export const ROLE_RANK = {
  staff: 0,
  receptionist: 1,
  manager: 2,
  admin: 3,
  superadmin: 4,
};

export const hasNavAccess = (role, v) => {
  if (role === "staff") return false;
  if (v === "pos") return true;
  if (v === "history") return true;
  if (v === "settings") return (ROLE_RANK[role] || 0) >= 2;
  return (ROLE_RANK[role] || 0) >= 3; // dashboard requires admin+
};

export const creatableRoles = (role) => {
  if (role === "superadmin")
    return [
      ["receptionist", "Receptionist"],
      ["staff", "Staff"],
      ["manager", "Manager"],
      ["admin", "Admin"],
    ];
  if (role === "admin")
    return [
      ["receptionist", "Receptionist"],
      ["staff", "Staff"],
      ["manager", "Manager"],
    ];
  if (role === "manager")
    return [
      ["receptionist", "Receptionist"],
      ["staff", "Staff"],
    ];
  return [];
};

export const canDeleteUser = (actorRole, targetRole) => {
  if (actorRole === "superadmin") return true;
  if (actorRole === "admin") return (ROLE_RANK[targetRole] || 0) < 3;
  if (actorRole === "manager") return targetRole === "staff";
  return false;
};

export const roleBadgeStyle = (role) => {
  const map = {
    superadmin: ["#FEE2E2", "#991B1B"],
    admin: ["#D1FAE5", "#065F46"],
    manager: ["#FEF3C7", "#92400E"],
    receptionist: ["#DBEAFE", "#1E40AF"],
    staff: ["#F3E8FF", "#6B21A8"],
  };
  const [bg, col] = map[role] || map.receptionist;
  return { background: bg, color: col };
};
