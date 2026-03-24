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
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <div>
          <h1 className="text-xl font-bold">
            Welcome, {user?.name}
          </h1>
          <p className="text-sm text-gray-500">
            Role: {user?.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow">
        {user?.role === "user" && (
          <>
            <h2 className="text-lg font-semibold mb-2">
              User Dashboard
            </h2>
            <ul className="list-disc pl-5">
              <li>View Profile</li>
              <li>Edit Settings</li>
              <li>Access Resources</li>
            </ul>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <h2 className="text-lg font-semibold mb-2">
              Admin Dashboard
            </h2>
            <p>{adminMessage}</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Manage Users</li>
              <li>View Reports</li>
              <li>System Settings</li>
            </ul>
          </>
        )}
      </div>
    </div>
  </div>
);
}
