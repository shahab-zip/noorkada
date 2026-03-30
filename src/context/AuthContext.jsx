import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("noorkada_user");
      const token = localStorage.getItem("noorkada_token");
      if (!stored || !token) return null;
      const expiry = getTokenExpiry(token);
      if (expiry && Date.now() > expiry) {
        localStorage.removeItem("noorkada_token");
        localStorage.removeItem("noorkada_user");
        return null;
      }
      return JSON.parse(stored);
    } catch {}
    return null;
  });

  const login = (data) => {
    localStorage.setItem("noorkada_token", data.token);
    localStorage.setItem(
      "noorkada_user",
      JSON.stringify({
        username: data.username,
        full_name: data.full_name || "",
        role: data.role,
        floor: data.floor || null,
      })
    );
    setUser({
      username: data.username,
      full_name: data.full_name || "",
      role: data.role,
      floor: data.floor || null,
    });
  };

  const logout = () => {
    localStorage.removeItem("noorkada_token");
    localStorage.removeItem("noorkada_user");
    setUser(null);
  };

  const token = localStorage.getItem("noorkada_token");

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
