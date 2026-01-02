import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const createAdmin = async () => {
  try {
    // Get admin details from command line arguments or use defaults
    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || process.env.ADMIN_EMAIL || 'admin@astondataacademy.com';
    const password = process.argv[4] || process.env.ADMIN_PASSWORD || 'admin123';
    const role = process.argv[5] || 'superadmin';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (existingAdmin) {
      console.log('Admin already exists with this email or username');
      process.exit(1);
    }

    // Create admin
    const admin = await Admin.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role
    });

    console.log('✅ Admin created successfully!');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('\n⚠️  Please change the default password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

// Run the script
createAdmin();

