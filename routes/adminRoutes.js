import express from "express";
import User from "../models/User.js";
import { authenticateAdmin } from "../middleware/auth.js";
import { sendPaymentSuccessfulEmail } from "../services/emailService.js";

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Get all users with optional filters
router.get("/users", async (req, res) => {
  try {
    const { status, page = 1, limit = 50, search } = req.query;

    // Build query
    const query = {};
    if (status && ["pending", "paid", "verified"].includes(status)) {
      query.paymentStatus = status;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users with pagination
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).select("-__v"),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get single user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-__v");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update user payment status
router.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    // Validate payment status
    const validStatuses = ["pending", "paid", "verified"];
    if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        error: "Invalid payment status",
        validStatuses,
      });
    }

    const user = await User.findById(id).select("-__v");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const previousPaymentStatus = user.paymentStatus;
    const shouldSendResourcesEmail =
      previousPaymentStatus === "pending" && ["paid", "verified"].includes(paymentStatus);

    user.paymentStatus = paymentStatus;
    await user.save();

    let paymentEmailSent = false;
    let paymentEmailError = null;

    if (shouldSendResourcesEmail) {
      try {
        await sendPaymentSuccessfulEmail(user);
        paymentEmailSent = true;
      } catch (emailError) {
        paymentEmailError = "Payment status was updated, but the resources email could not be sent.";
        console.error("Failed to send payment successful email:", emailError);
      }
    }

    res.json({
      success: true,
      message: paymentEmailError || "Payment status updated successfully",
      paymentEmailSent,
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Get statistics
router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, pendingUsers, paidUsers, verifiedUsers, ukUsers, nigeriaUsers] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ paymentStatus: "pending" }),
        User.countDocuments({ paymentStatus: "paid" }),
        User.countDocuments({ paymentStatus: "verified" }),
        User.countDocuments({ country: "UK" }),
        User.countDocuments({ country: "Outside Uk" }),
      ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        pendingUsers,
        paidUsers,
        verifiedUsers,
        ukUsers,
        nigeriaUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

export default router;
