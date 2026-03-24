import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/authContext";
import VerifyOTP from "./pages/VerifyOTP";
import Success from "./pages/Success";
import Register from "./pages/register";

function App() {
  const { user, loading } = useAuth();

  // 🔥 STOP routing decisions until auth is resolved
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/verify-email" element={<VerifyOTP />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}
// function App() {
//   const { user, loading } = useAuth();

//   console.log("APP STATE:", { user, loading });

//   return (
//     <Routes>
//       <Route path="/" element={<div>ROOT</div>} />
//       <Route path="/login" element={<div>LOGIN</div>} />
//       <Route path="/dashboard" element={<div>DASHBOARD</div>} />
//     </Routes>
//   );
// }

export default App;
