import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PERMISSIONS } from "../constants/permissions.js";
import { logAudit } from "../utils/auditLogger.js";

/* ------------------ Helpers ------------------ */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

/* ------------------ Register ------------------ */
export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    email = email.toLowerCase().trim();

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: "user",
      permissions: [PERMISSIONS.VIEW_USER] // Default permission
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

const MAX_FAILED_ATTEMPTS = 10;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

/* ------------------ Login ------------------ */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    /* ================================
       ACCOUNT LOCK CHECK
    ================================ */
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        message: "Account locked. Try again later."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    /* ================================
       WRONG PASSWORD
    ================================ */
    if (!isMatch) {
      user.failedLoginAttempts += 1;

      // 🔐 LOCK ACCOUNT
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
        user.failedLoginAttempts = 0;

        await user.save();

        // 📜 AUDIT: ACCOUNT LOCKED
        await logAudit({
          action: "ACCOUNT_LOCKED",
          actor: user._id,
          req,
          metadata: { lockUntil: user.lockUntil }
        });

        return res.status(403).json({
          message: "Account locked. Try again later."
        });
      }

      await user.save();

      // 📜 AUDIT: LOGIN FAILED
      await logAudit({
        action: "LOGIN_FAILED",
        actor: user._id,
        req
      });

      return res.status(400).json({ message: "Invalid credentials" });
    }

    /* ================================
       SUCCESSFUL LOGIN
    ================================ */
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;

    await user.save();

    // 🍪 SET HTTP-ONLY COOKIES
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 10 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 📜 AUDIT: LOGIN SUCCESS
    await logAudit({
      action: "LOGIN_SUCCESS",
      actor: user._id,
      req
    });

    // 📦 RESPONSE
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};



/* ------------------ Refresh Token ------------------ */
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // 🔁 Rotate refresh token
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save();

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch {
    res.status(403).json({ message: "Refresh token expired" });
  }
};

/* ------------------ Logout ------------------ */
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      );
    }

    // 🔥 Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};

/* ------------------ Me ------------------ */
export const me = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      permissions: req.user.permissions
    }
  });
};

