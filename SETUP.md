# Backend Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Email account (Gmail recommended for testing)

## Installation Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update all the values in `.env` with your actual credentials

4. **MongoDB Setup:**
   
   **Option A: Local MongoDB**
   - Install MongoDB locally
   - Update `MONGODB_URI` in `.env` to: `mongodb://localhost:27017/aston-data-academy`
   
   **Option B: MongoDB Atlas (Cloud)**
   - Create a free account at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get your connection string
   - Update `MONGODB_URI` in `.env` with your Atlas connection string

5. **Email Configuration (Gmail Example):**
   - Go to your Google Account settings
   - Enable 2-Step Verification
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Use the app password in `EMAIL_PASSWORD` in `.env`

6. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will run on `http://localhost:5000` by default.

## Frontend Configuration

1. In your Next.js frontend, create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

2. Update this URL if your backend is hosted elsewhere.

## Testing the API

1. **Test registration:**
   ```bash
   curl -X POST http://localhost:5000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "phone": "+1234567890",
       "country": "UK",
       "amount": 10000,
       "currency": "gbp"
     }'
   ```

2. **Test admin endpoints (replace YOUR_ADMIN_PASSWORD):**
   ```bash
   curl -X GET http://localhost:5000/api/admin/users \
     -H "Authorization: Bearer YOUR_ADMIN_PASSWORD"
   ```

## Troubleshooting

- **MongoDB connection error:** Check your `MONGODB_URI` and ensure MongoDB is running
- **Email not sending:** Verify your email credentials and app password
- **CORS errors:** Update `FRONTEND_URL` in `.env` to match your frontend URL
- **Port already in use:** Change `PORT` in `.env` to a different port

