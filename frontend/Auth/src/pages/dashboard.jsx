import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  
  const { user, logout ,loading} = useAuth();
  const navigate = useNavigate();
if (loading) return <div>Loading...</div>;
if (!user) return null;
 const [adminMessage, setAdminMessage] = useState("");

  const handleLogout = () => {
    logout();
    navigate('/login');
  }
 
    useEffect(() => {
       if (!user) return;
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
  <div className="min-h-screen flex bg-gray-100">

    {/* SIDEBAR */}
    <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col p-5">
      <h2 className="text-2xl font-bold text-indigo-600 mb-8">
        MyApp 🚀
      </h2>

      <nav className="flex flex-col gap-4 text-gray-600">
        <button className="text-left hover:text-indigo-600">Dashboard</button>
        <button className="text-left hover:text-indigo-600">Profile</button>
        <button className="text-left hover:text-indigo-600">Settings</button>

        {user?.role === "admin" && (
          <button className="text-left hover:text-indigo-600">
            Admin Panel
          </button>
        )}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg mt-6"
        >
          Logout
        </button>
      </div>
    </aside>

    {/* MAIN CONTENT */}
    <div className="flex-1 p-6 space-y-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <h1 className="text-xl font-semibold">
          Welcome, {user?.name}
        </h1>

        <div className="text-sm text-gray-500">
          Role: {user?.role}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Profile</h3>
          <p className="text-lg font-semibold mt-1">Active</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Permissions</h3>
          <p className="text-lg font-semibold mt-1">
            {user?.permissions?.length || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Status</h3>
          <p className="text-lg font-semibold mt-1 text-green-500">
            Online
          </p>
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="bg-white p-6 rounded-xl shadow">
        {user?.role === "user" && (
          <>
            <h2 className="text-lg font-semibold mb-3">
              User Dashboard
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl hover:bg-gray-50">
                View Profile
              </div>
              <div className="p-4 border rounded-xl hover:bg-gray-50">
                Edit Settings
              </div>
              <div className="p-4 border rounded-xl hover:bg-gray-50">
                Access Resources
              </div>
            </div>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <h2 className="text-lg font-semibold mb-3">
              Admin Dashboard
            </h2>

            <p className="text-gray-600 mb-4">{adminMessage}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl hover:bg-gray-50">
                Manage Users
              </div>
              <div className="p-4 border rounded-xl hover:bg-gray-50">
                View Reports
              </div>
              <div className="p-4 border rounded-xl hover:bg-gray-50">
                System Settings
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  </div>
);
}
