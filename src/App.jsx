import React, { useState } from 'react'
import NoorKadaPOS from './noorkada_pos'
import Login from './components/Login'

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('noorkada_user');
      const token = localStorage.getItem('noorkada_token');
      if (stored && token) return JSON.parse(stored);
    } catch {}
    return null;
  });

  const handleLogin = (data) => {
    // data = { token, username, role }
    localStorage.setItem('noorkada_token', data.token);
    localStorage.setItem('noorkada_user', JSON.stringify({ username: data.username, role: data.role }));
    setUser({ username: data.username, role: data.role });
  };

  const handleLogout = () => {
    localStorage.removeItem('noorkada_token');
    localStorage.removeItem('noorkada_user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return <NoorKadaPOS user={user} onLogout={handleLogout} />;
}

export default App
