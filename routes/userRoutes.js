import express from 'express';
import User from '../models/User.js';
import { sendBankDetailsEmail } from '../services/emailService.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, country, amount, currency } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !country) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'email', 'phone', 'country']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Determine amount and currency if not provided
    let finalAmount = amount;
    let finalCurrency = currency;

    if (!finalAmount || !finalCurrency) {
      if (country === 'Outside Uk') {
        finalAmount = finalAmount || 10000;
        finalCurrency = finalCurrency || 'usd';
      } else {
        finalAmount = finalAmount || 10000; // £100 in pence
        finalCurrency = finalCurrency || 'gbp';
      }
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      country,
      amount: finalAmount,
      currency: finalCurrency,
      paymentStatus: 'pending'
    });

    // Send bank details email
    try {
      await sendBankDetailsEmail(user);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for payment instructions.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        country: user.country,
        amount: user.amount,
        currency: user.currency,
        paymentStatus: user.paymentStatus,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      error: 'Failed to register user',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user by email (for checking status)
router.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
        country: user.country
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;

