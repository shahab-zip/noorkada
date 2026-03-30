import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import StaffDashboard from './components/StaffDashboard'
import NoorKadaPOS from './noorkada_pos'

function AppRoutes() {
  const { user, token, login, logout } = useAuth();

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to={user.role === 'staff' ? '/staff' : '/pos'} replace />
            : <Login onLogin={login} />
        }
      />

      {/* Staff-only dashboard */}
      <Route
        path="/staff/*"
        element={
          !user
            ? <Navigate to="/login" replace />
            : user.role !== 'staff'
            ? <Navigate to="/pos" replace />
            : <StaffDashboard user={user} token={token} onLogout={logout} />
        }
      />

      {/* POS app — all non-staff routes share one mounted instance */}
      <Route
        path="/pos"
        element={
          !user
            ? <Navigate to="/login" replace />
            : user.role === 'staff'
            ? <Navigate to="/staff" replace />
            : <NoorKadaPOS user={user} onLogout={logout} />
        }
      />
      <Route
        path="/analytics/*"
        element={
          !user
            ? <Navigate to="/login" replace />
            : user.role === 'staff'
            ? <Navigate to="/staff" replace />
            : <NoorKadaPOS user={user} onLogout={logout} />
        }
      />
      <Route
        path="/history/*"
        element={
          !user
            ? <Navigate to="/login" replace />
            : user.role === 'staff'
            ? <Navigate to="/staff" replace />
            : <NoorKadaPOS user={user} onLogout={logout} />
        }
      />
      <Route
        path="/dashboard/*"
        element={
          !user
            ? <Navigate to="/login" replace />
            : user.role === 'staff'
            ? <Navigate to="/staff" replace />
            : <NoorKadaPOS user={user} onLogout={logout} />
        }
      />

      {/* Catch-all redirect */}
      <Route
        path="*"
        element={
          <Navigate
            to={!user ? '/login' : user.role === 'staff' ? '/staff' : '/pos'}
            replace
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
