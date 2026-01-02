# Aston Data Academy Backend API

Express.js backend API for Aston Data Academy course registration system.

## Features

- User registration with email verification
- Automatic bank details email sending
- Admin dashboard for managing users
- Payment status tracking
- MongoDB database integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
   - MongoDB connection string
   - Email service credentials
   - Admin password
   - Bank details

4. Start the development server:
```bash
npm run dev
```

Or start in production mode:
```bash
npm start
```

## API Endpoints

### User Routes (`/api/users`)

- `POST /api/users/register` - Register a new user
- `GET /api/users/status/:email` - Get user status by email

### Admin Routes (`/api/admin`)

All admin routes require authentication via `Authorization: Bearer <ADMIN_PASSWORD>` header.

- `GET /api/admin/users` - Get all users (with pagination and filters)
- `GET /api/admin/users/:id` - Get single user by ID
- `PATCH /api/admin/users/:id` - Update user payment status
- `GET /api/admin/stats` - Get statistics

## Environment Variables

See `.env.example` for all required environment variables.

## Database

Uses MongoDB with Mongoose ODM. The User model includes:
- Personal information (name, email, phone, country)
- Payment information (amount, currency, payment status)
- Timestamps (createdAt, updatedAt)

## Email Service

Uses Nodemailer to send bank transfer details to registered users. Configure your email service in the `.env` file.

