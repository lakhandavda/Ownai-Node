# Node.js User Management API

A simple Node.js REST API for user management with authentication, role-based access control, and user filtering capabilities. Built with Express.js and TypeORM.

## Features

- **User Registration** - Register new users with validation
- **User Login** - Authenticate users with JWT tokens
- **List Users** - Admin-only endpoint to view all registered users
- **Search Users** - Search users by name or email
- **Filter Users** - Filter users by country
- **User Details** - Retrieve user information with role-based access
- **Role-Based Access Control** - Admin and Staff roles with different permissions
- **Input Validation** - Email, password, and role validation
- **JWT Authentication** - Secure token-based authentication
- **Error Handling** - Meaningful error messages for API responses

---

## Prerequisites

- Node.js (v14 or higher)
- npm
- SQLite (default) or MySQL/PostgreSQL

---

## Setup Steps

### 1. Navigate to the project directory:
```bash
cd your-project-folder
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Create a `.env` file in the root directory (optional):
```
PORT=3000
JWT_SECRET=your_secret_key_here
```

If `.env` is not provided, defaults are used:
- `PORT=3000`
- `JWT_SECRET=change_this_secret_for_prod`

### 4. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

---

## Application Access

The server will run at:
```
http://localhost:3000
```

Use an API client (Postman, Thunder Client, Insomnia, or curl) to test the endpoints.

---

## API Endpoints

### Base URL: `http://localhost:3000`

### 1. Health Check
```
GET /health
```
**Response:**
```json
{ "status": "ok" }
```

---

### 2. User Registration
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Staff",
  "phone": "1234567890",
  "city": "New York",
  "country": "USA"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Staff",
  "phone": "1234567890",
  "city": "New York",
  "country": "USA",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

**Validation Rules:**
- `name` - Required, string
- `email` - Required, valid email format
- `password` - Required, minimum 6 characters
- `role` - Optional, must be "Admin" or "Staff" (default: "Staff")
- `phone`, `city`, `country` - Optional

---

### 3. User Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (400 Bad Request):**
```json
{
  "message": "Invalid credentials"
}
```

---

### 4. List Users (Admin Only)
```
GET /users/
Authorization: Bearer <token>
```

**Query Parameters:**
- `q` - Search by name or email (optional)
- `country` - Filter by country (optional)

**Examples:**
- List all users: `GET /users/`
- Search by name: `GET /users/?q=John`
- Filter by country: `GET /users/?country=USA`
- Search and filter: `GET /users/?q=John&country=USA`

**Response (200 OK):**
```json
[
  {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Staff",
    "phone": "1234567890",
    "city": "New York",
    "country": "USA",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
]
```

**Error (403 Forbidden):**
```json
{
  "message": "Forbidden"
}
```

---

### 5. Get User Details
```
GET /users/:id
Authorization: Bearer <token>
```

**Parameters:**
- `id` - User ID (UUID)

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Staff",
  "phone": "1234567890",
  "city": "New York",
  "country": "USA",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

**Error (404 Not Found):**
```json
{
  "message": "Not found"
}
```

**Error (403 Forbidden - User can only see own details, Admin can see any):**
```json
{
  "message": "Forbidden"
}
```

---

## Usage Examples

### Using cURL

#### 1. Register a User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Admin",
    "country": "USA"
  }'
```

#### 2. Login User
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### 3. List Users (with JWT token)
```bash
curl -X GET "http://localhost:3000/users/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Search Users by Name
```bash
curl -X GET "http://localhost:3000/users/?q=John" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5. Filter Users by Country
```bash
curl -X GET "http://localhost:3000/users/?country=USA" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 6. Get User Details
```bash
curl -X GET "http://localhost:3000/users/USER_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Project Structure

```
project-root/
├── src/
│   ├── config.js              # Configuration (JWT_SECRET, PORT)
│   ├── data-source.js         # TypeORM DataSource setup
│   ├── app.js                 # Express app setup
│   ├── index.js               # Server entry point
│   ├── validators.js          # Input validation functions
│   ├── entity/
│   │   └── User.js            # User entity schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes (register, login)
│   │   └── users.js           # User routes (list, details)
│   └── middleware/
│       └── auth.js            # JWT authentication middleware
├── package.json               # Dependencies and scripts
├── README.md                  # This file
└── database.sqlite            # SQLite database (auto-created)
```

---

## Database

**Database Type:** SQLite (default)
**Database File:** `database.sqlite`

The database schema is automatically created when the server starts (TypeORM `synchronize: true`).

### User Table Schema
```sql
CREATE TABLE user (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone VARCHAR,
  city VARCHAR,
  country VARCHAR,
  role VARCHAR DEFAULT 'Staff',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Authentication

### How JWT Works

1. User logs in via `/auth/login` endpoint
2. Server validates credentials and returns JWT token
3. User includes token in Authorization header for protected endpoints
4. Server validates token on each request

### JWT Token Format
```
Authorization: Bearer <token>
```

**Token Expiration:** 8 hours

---

## Role-Based Access Control

| Role  | List Users | View Own Details | View Any Details | Register |
|-------|-----------|-----------------|-----------------|----------|
| Admin | ✅         | ✅               | ✅              | ✅        |
| Staff | ❌         | ✅               | ❌              | ✅        |

---

## Error Handling

All errors return appropriate HTTP status codes with meaningful messages:

| Status | Meaning |
|--------|---------|
| 200    | Success |
| 201    | Created |
| 400    | Bad Request (validation error) |
| 401    | Unauthorized (missing/invalid token) |
| 403    | Forbidden (insufficient permissions) |
| 404    | Not Found |
| 500    | Internal Server Error |

**Error Response Format:**
```json
{
  "message": "Error description"
}
```

---

## Notes

- **JWT Token** is required for all protected endpoints (`/users/*`)
- **TypeORM** handles all database operations with automatic schema synchronization
- **Password Hashing** uses bcrypt for secure storage
- **No additional configuration** needed if using SQLite
- **Passwords** are never returned in API responses
- **Database file** is created automatically in the root directory

---

## Testing

Run the test suite:
```bash
npm test
```

---

## Environment Variables (Optional)

Create a `.env` file to override defaults:

```env
PORT=3000
JWT_SECRET=your_secret_key_here
```

---

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env file or use:
PORT=3001 npm start
```

### Database Locked
Delete `database.sqlite` and restart the server:
```bash
rm database.sqlite
npm start
```

### Module Not Found
```bash
# Reinstall dependencies
rm node_modules package-lock.json
npm install
npm start
```

---

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeORM** - ORM for database operations
- **SQLite** - Lightweight database
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Jest** - Testing framework

---

## License

This project is part of the ownAI Node.js Developer Assessment.

---

## Support

For issues or questions, please refer to the code comments and API documentation above.
