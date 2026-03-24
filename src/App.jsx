import React from 'react'
import NoorKadaPOS from './noorkada_pos'

const DEFAULT_USER = { username: 'admin', role: 'admin' };
localStorage.setItem('noorkada_token', 'local-dev');

function App() {
  return <NoorKadaPOS user={DEFAULT_USER} onLogout={() => {}} />;
}

export default App
