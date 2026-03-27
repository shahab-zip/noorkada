import React, { useState } from 'react'
import NoorKadaPOS from './noorkada_pos'
import Login from './components/Login'
import StaffDashboard from './components/StaffDashboard'

// Decode JWT payload without verifying signature (verification happens server-side)
const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch { return null; }
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('noorkada_user');
      const token = localStorage.getItem('noorkada_token');
      if (!stored || !token) return null;
      // Clear session if token is already expired
      const expiry = getTokenExpiry(token);
      if (expiry && Date.now() > expiry) {
        localStorage.removeItem('noorkada_token');
        localStorage.removeItem('noorkada_user');
        return null;
      }
      return JSON.parse(stored);
    } catch {}
    return null;
  });

  const handleLogin = (data) => {
    // data = { token, username, full_name, role, floor }
    localStorage.setItem('noorkada_token', data.token);
    localStorage.setItem('noorkada_user', JSON.stringify({ username: data.username, full_name: data.full_name || '', role: data.role, floor: data.floor || null }));
    setUser({ username: data.username, full_name: data.full_name || '', role: data.role, floor: data.floor || null });
  };

  const handleLogout = () => {
    localStorage.removeItem('noorkada_token');
    localStorage.removeItem('noorkada_user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Staff members get their own read-only dashboard — no access to POS
  if (user.role === 'staff') {
    return (
      <StaffDashboard
        user={user}
        token={localStorage.getItem('noorkada_token')}
        onLogout={handleLogout}
      />
    );
  }

  return <NoorKadaPOS user={user} onLogout={handleLogout} />;
}

export default App
