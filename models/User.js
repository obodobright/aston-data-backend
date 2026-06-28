import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    enum: ['UK', 'Nigeria', 'Ghana', 'Other', 'Outside Uk'],
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['gbp', 'ngn', 'ghs', 'usd']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'verified'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for faster queries
// userSchema.index({ email: 1 });
userSchema.index({ paymentStatus: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

export default User;

