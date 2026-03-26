import { useState, useRef } from "react";
import { Button, Alert } from "@mui/material";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/authContext";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  // ✅ GET EMAIL FROM ROUTE STATE
  const email = location.state?.email;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const finalOtp = otp.join("");

    if (!email) {
      setError("Session expired. Please register again.");
      return;
    }

    try {
      const res = await api.post("/auth/verify-email", {
        email,
        otp: finalOtp,
      });

      // ✅ SAVE USER (now res.data has user)
      login(res.data);

      // ✅ Navigate to dashboard (not login)
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid or expired OTP"
      );
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-center mb-4">
        Verify OTP
      </h2>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="flex justify-between gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength="1"
              className="w-12 h-12 text-center border rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>

        <Button type="submit" variant="contained" fullWidth>
          Verify
        </Button>
      </form>
    </AuthLayout>
  );
}