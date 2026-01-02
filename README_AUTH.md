# Admin Authentication Setup

## Creating Your First Admin User

After setting up the backend, you need to create an admin user. There are two ways to do this:

### Method 1: Using the Script (Recommended)

Run the create admin script:

```bash
npm run create-admin
```

Or with custom details:

```bash
npm run create-admin <username> <email> <password> <role>
```

Example:
```bash
npm run create-admin admin admin@astondataacademy.com MySecurePassword123 superadmin
```

### Method 2: Using the API (After First Admin is Created)

Once you have at least one admin, you can create additional admins via the API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "newadmin",
    "email": "newadmin@example.com",
    "password": "SecurePassword123",
    "role": "admin"
  }'
```

## Admin Login

Login to get a JWT token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@astondataacademy.com",
    "password": "YourPassword"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "username": "admin",
    "email": "admin@astondataacademy.com",
    "role": "superadmin"
  }
}
```

## Using the Token

Include the token in the Authorization header for all admin endpoints:

```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables

Make sure to set a secure JWT secret in your `.env` file:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Frontend Integration

The frontend admin page at `/admin` will automatically:
1. Show login form if not authenticated
2. Store JWT token in localStorage after successful login
3. Include token in Authorization header for all API calls
4. Handle token expiration and logout

## Security Notes

- Change default passwords immediately
- Use strong JWT secrets in production
- Tokens expire after 7 days (configurable in `authRoutes.js`)
- Passwords are hashed using bcrypt before storage
- Only active admins can login

