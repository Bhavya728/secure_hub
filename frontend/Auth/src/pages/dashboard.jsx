import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

 const [adminMessage, setAdminMessage] = useState("");

  const handleLogout = () => {
    logout();
    navigate('/login');
  }
 
    useEffect(() => {
        const fetchAdminMessage = async () => {
            try { 
                const res = await api.get("/admin/dashboard");
                setAdminMessage(res.data.message);
            } catch (err) {
                console.error("Error fetching admin message:", err);
            }
        };

        if (user?.role === "admin") {
            fetchAdminMessage();
        }
    }, [user]);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {user?.role}</p>
      

      {/* USER DASHQBOARD CONTENT */}
      {user?.role === "user" && (
        <div>
          <h2>User Dashboard</h2>
          <p>This is the user dashboard content.</p>
          <ul>
            <li>View Profile</li>
            <li>Edit Settings</li>
            <li>Access User Resources</li>
          </ul>
        </div>
      )}
      
      {/* ADMIN DASHBOARD CONTENT */}
      {user?.role === "admin" && (
        <div>
          <h2>Admin Dashboard</h2>
          <p>{adminMessage}</p>
          <ul>
            <li>Manage Users</li>
            <li>View Reports</li>
            <li>System Settings</li>
          </ul>
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
