import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key-change-in-production", {
    expiresIn: "7d",
  });
};

// Admin registration
// First admin can be created without authentication, subsequent admins require authentication
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["username", "email", "password"],
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existingAdmin) {
      return res.status(400).json({ error: "Admin with this email or username already exists" });
    }

    // Check if this is the first admin
    const adminCount = await Admin.countDocuments();
    const isFirstAdmin = adminCount === 0;

    // If not first admin, require authentication
    if (!isFirstAdmin) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ error: "Unauthorized - Authentication required to create new admins" });
      }

      const token = authHeader.replace("Bearer ", "");
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your-secret-key-change-in-production"
        );
        const currentAdmin = await Admin.findById(decoded.id);
        if (!currentAdmin || !currentAdmin.isActive) {
          return res.status(401).json({ error: "Unauthorized - Invalid or inactive admin" });
        }
      } catch (authError) {
        return res.status(401).json({ error: "Unauthorized - Invalid token" });
      }
    }

    // Create admin (first admin gets superadmin role)
    const admin = await Admin.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role: isFirstAdmin ? "superadmin" : role || "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: Object.values(error.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      error: "Failed to create admin",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["email", "password"],
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ message: "Admin account is inactive" });
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      error: "Login failed",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get current admin profile
router.get("/me", authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");

    res.json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ error: "Failed to fetch admin profile" });
  }
});

// Change password
router.post("/change-password", authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["currentPassword", "newPassword"],
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const admin = await Admin.findById(req.admin._id);

    // Verify current password
    const isPasswordValid = await admin.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

export default router;
