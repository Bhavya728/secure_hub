import express from "express";
import bcrypt from "bcryptjs";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { authorizePermissions } from "../middleware/permission.middleware.js";
import { logAudit } from "../utils/auditLogger.js";
import User from "../models/user.model.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

/* ================================
   ADMIN DASHBOARD (ROLE BASED)
================================ */
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin 👑" });
  }
);

/* ================================
   CREATE USER (PERMISSION BASED)
================================ */
router.post(
  "/user",
  protect,
  authorizePermissions(PERMISSIONS.CREATE_USER),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
      }

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
        permissions:
          role === "admin"
            ? Object.values(PERMISSIONS)
            : [PERMISSIONS.VIEW_USER]
      });

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "User creation failed" });
    }
  }
);

/* ================================
   UPDATE USER (PERMISSION BASED)
================================ */
router.put(
  "/user/:id",
  protect,
  authorizePermissions(PERMISSIONS.EDIT_USER),
  async (req, res) => {
    try {
      const { name, role, permissions } = req.body;

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) user.name = name;
      if (role) user.role = role;
      if (permissions) user.permissions = permissions;

      await user.save();

      res.json({
        message: "User updated successfully",
        user: {
          id: user._id,
          role: user.role,
          permissions: user.permissions
        }
      });
    } catch (err) {
      res.status(500).json({ message: "User update failed" });
    }
  }
);

/* ================================
   DELETE USER (PERMISSION BASED)
================================ */
router.delete(
  "/user/:id",
  protect,
  authorizePermissions(PERMISSIONS.DELETE_USER),
  async (req, res) => {
    try {
      // Prevent admin deleting himself
      if (req.user._id.toString() === req.params.id) {
        return res
          .status(400)
          .json({ message: "Admin cannot delete himself" });
      }

      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await logAudit({
  action: "USER_DELETED",
  actor: req.user._id,
  target: user._id,
  req
});

      res.json({
        message: "User deleted successfully",
        deletedUserId: user._id
      });
    } catch (err) {
      res.status(500).json({ message: "User deletion failed" });
    }
  }
);

/* ================================
   UNLOCK USER ACCOUNT (PERMISSION)
================================ */
router.post(
  "/user/:id/unlock",
  protect,
  authorizePermissions(PERMISSIONS.MANAGE_USERS),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          failedLoginAttempts: 0,
          lockUntil: null
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User account unlocked",
        userId: user._id
      });
      await logAudit({
  action: "ACCOUNT_UNLOCKED",
  actor: req.user._id,      // admin
  target: req.params.id,   // user unlocked
  req
});

    } catch (err) {
      res.status(500).json({ message: "Failed to unlock user" });
    }
  }
);

export default router;
