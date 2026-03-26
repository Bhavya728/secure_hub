import { useState } from "react";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", form);

      // ✅ PASS EMAIL TO OTP PAGE
      navigate("/verify-email", {
        state: { email: form.email },
      });

    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-center text-gray-800">
      Create Account
    </h2>

    {error && <Alert severity="error">{error}</Alert>}

    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      <TextField
        label="Name"
        fullWidth
        required
        variant="outlined"
        sx={{ borderRadius: "12px" }}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        variant="outlined"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        required
        variant="outlined"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <Button
        variant="contained"
        size="large"
        type="submit"
        disabled={loading}
        sx={{
          py: 1.5,
          borderRadius: "12px",
          background: "linear-gradient(45deg, #6366f1, #9333ea)",
        }}
      >
        {loading ? <CircularProgress size={24} /> : "Register"}
      </Button>
    </form>

    <p className="text-sm text-center text-gray-600">
      Already have an account?{" "}
      <span
        className="text-indigo-600 font-semibold cursor-pointer hover:underline"
        onClick={() => navigate("/login")}
      >
        Login
      </span>
    </p>
  </div>
</AuthLayout>
  );
}