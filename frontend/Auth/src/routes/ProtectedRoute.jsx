import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ Wait for auth check to finish
  if (loading) {
    return <div>Loading...</div>;
  }

  // ❌ Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated
  return children;
}
