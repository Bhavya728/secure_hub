import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  setLoading(false);
}, []);

  const login = (data) => {
  setUser(data.user);
  localStorage.setItem("user", JSON.stringify(data.user));
};

  const logout = async () => {
  try {
    await api.post("/auth/logout"); // clear cookies from backend
  } catch (err) {
    console.log(err);
  }
  setUser(null);
  localStorage.removeItem("user");
};

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 THIS LINE IS CRITICAL
export const useAuth = () => useContext(AuthContext);