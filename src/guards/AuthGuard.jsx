import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthGuard({ children, staffOnly = false, nonStaffOnly = false }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (staffOnly && user.role !== "staff") return <Navigate to="/pos" replace />;
  if (nonStaffOnly && user.role === "staff") return <Navigate to="/staff" replace />;

  return children;
}
