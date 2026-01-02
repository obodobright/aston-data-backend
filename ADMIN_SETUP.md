# Admin User Setup Guide

## Quick Start

### 1. Install Dependencies

Make sure you have installed all dependencies including the new `jsonwebtoken`:

```bash
cd backend
npm install
```

### 2. Set Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Create Your First Admin

**Option A: Using the Script (Easiest)**

```bash
npm run create-admin
```

This will create an admin with:

- Username: `admin`
- Email: From `ADMIN_EMAIL` env var or `admin@astondataacademy.com`
- Password: From `ADMIN_PASSWORD` env var or `admin123`
- Role: `superadmin`

**Option B: Custom Admin via Script**

```bash
npm run create-admin <username> <email> <password> <role>
```

Example:

```bash
npm run create-admin myadmin admin@example.com MySecurePass123 superadmin
```

**Option C: Via API (First Admin Only)**

If no admins exist, you can create the first one via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@astondataacademy.com",
    "password": "YourSecurePassword123",
    "role": "superadmin"
  }'
```

### 4. Login to Admin System

**Via API:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@astondataacademy.com",
    "password": "YourPassword"
  }'
```

**Via Frontend:**

1. Navigate to `http://localhost:3001/admin`
2. Enter your email and password
3. Click "Login"
4. Token will be stored in localStorage

### 5. Using Admin Endpoints

All admin endpoints now require JWT authentication:

```bash
# Get all users
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update payment status
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentStatus": "paid"}'

# Get statistics
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Create new admin (first admin doesn't need auth)
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current admin profile (requires auth)
- `POST /api/auth/change-password` - Change password (requires auth)

### Admin Routes (`/api/admin`)

All require JWT authentication via `Authorization: Bearer <token>` header:

- `GET /api/admin/users` - Get all users (with filters)
- `GET /api/admin/users/:id` - Get single user
- `PATCH /api/admin/users/:id` - Update user payment status
- `GET /api/admin/stats` - Get statistics

## Security Features

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens expire after 7 days
- ✅ Only active admins can login
- ✅ First admin can be created without authentication
- ✅ Subsequent admins require existing admin authentication
- ✅ Token-based authentication for all admin endpoints

## Frontend Integration

The admin page at `/admin` automatically:

- Shows login form when not authenticated
- Stores JWT token in localStorage
- Includes token in all API requests
- Handles token expiration
- Provides logout functionality

## Troubleshooting

**"Unauthorized - Invalid token"**

- Token may have expired (7 days)
- Token may be invalid
- Solution: Login again to get a new token

**"Admin with this email or username already exists"**

- Admin already exists in database
- Solution: Use existing credentials or delete old admin

**"Unauthorized - Authentication required"**

- Trying to create admin but not first admin
- Solution: Login first, then create new admin with token

## Next Steps

1. Change default password after first login
2. Create additional admin users as needed
3. Set a strong JWT_SECRET in production
4. Consider implementing role-based permissions (future enhancement)
