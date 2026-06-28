import express from "express";
import User from "../models/User.js";
import { sendBankDetailsEmail } from "../services/emailService.js";

const router = express.Router();

const pricingByCountry = {
  UK: { amount: 15000, currency: "gbp" },
  Nigeria: { amount: 100000, currency: "ngn" },
  Ghana: { amount: 1000, currency: "ghs" },
  Other: { amount: 100, currency: "usd" },
  "Outside Uk": { amount: 100, currency: "usd" },
};

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, country } = req.body;

    if (!firstName || !lastName || !email || !phone || !country) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["firstName", "lastName", "email", "phone", "country"],
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const countryPricing = pricingByCountry[country];

    if (!countryPricing) {
      return res.status(400).json({
        error: "Invalid country",
        validCountries: Object.keys(pricingByCountry),
      });
    }

    const finalAmount = countryPricing.amount;
    const finalCurrency = countryPricing.currency;

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      country,
      amount: finalAmount,
      currency: finalCurrency,
      paymentStatus: "pending",
    });

    try {
      await sendBankDetailsEmail(user);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for payment instructions.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        country: user.country,
        amount: user.amount,
        currency: user.currency,
        paymentStatus: user.paymentStatus,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: Object.values(error.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      error: "Failed to register user",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get user by email for checking status
router.get("/status/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        paymentStatus: user.paymentStatus,
        amount: user.amount,
        currency: user.currency,
        country: user.country,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
