# Karju Platform Setup Guide

This guide will help you set up and run the Karju platform on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v18 or higher) - [Download](https://www.postgresql.org/download/)
3. **npm** or **yarn** package manager

## Step 1: Install Dependencies

Run the following command in the root directory to install all dependencies:

```bash
npm run install-all
```

This will install dependencies for:
- Root package (concurrently for running both servers)
- Backend (Express.js server)
- Frontend (Next.js application)

## Step 2: Set Up PostgreSQL Database

1. Make sure PostgreSQL is running on your machine
2. Create a database (or use the default `postgres` database for the setup script)

## Step 3: Configure Environment Variables

### Backend Configuration

Copy the example environment file and update it with your database credentials:

```bash
cp backend/env.example backend/.env
```

Edit `backend/.env` and update:
- `DB_HOST` - PostgreSQL host (usually `localhost`)
- `DB_PORT` - PostgreSQL port (usually `5432`)
- `DB_NAME` - Database name (default: `karju_db`)
- `DB_USER` - Your PostgreSQL username
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - A secure random string for JWT token signing

### Frontend Configuration

```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local` and ensure:
- `NEXT_PUBLIC_API_URL` points to your backend URL (default: `http://localhost:5000/api`)

## Step 4: Set Up Database Schema

Run the database setup script to create all tables and seed initial data:

```bash
npm run setup-db
```

This script will:
- Create the `karju_db` database (if it doesn't exist)
- Create all required tables with proper relationships
- Insert sample data for testing

## Step 5: Start the Development Servers

Run both frontend and backend servers simultaneously:

```bash
npm run dev
```

This will start:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

## Step 6: Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You can register as either:
   - **Worker/Freelancer**: Browse and apply to shifts
   - **Business**: Post shifts and manage applications

## Test Accounts

After running the database setup, you can use these test accounts:

### Worker Account
- Email: `worker1@karju.ir`
- Password: `password123`

### Business Account
- Email: `business1@karju.ir`
- Password: `password123`

## Project Structure

```
karju-platform/
├── backend/                 # Express.js API
│   ├── config/             # Database configuration
│   ├── database/           # SQL schema and seeds
│   ├── middleware/         # Auth middleware
│   ├── routes/             # API routes
│   ├── scripts/            # Database setup script
│   └── server.js           # Entry point
├── frontend/                # Next.js application
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   ├── lib/                # API client and utilities
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Shifts
- `GET /api/shifts` - Get all shifts (with filters)
- `GET /api/shifts/:id` - Get shift details
- `POST /api/shifts` - Create shift (business only)
- `PUT /api/shifts/:id` - Update shift (business only)

### Applications
- `POST /api/applications` - Apply to shift (worker only)
- `GET /api/applications/shift/:shiftId` - Get applications for shift (business only)
- `GET /api/applications/worker/my-applications` - Get worker's applications
- `PATCH /api/applications/:id` - Accept/reject application (business only)

### Dashboard
- `GET /api/dashboard/worker` - Worker dashboard data
- `GET /api/dashboard/business` - Business dashboard data

### Profile
- `GET /api/profile/worker/:userId` - Get worker profile
- `PUT /api/profile/worker` - Update worker profile
- `PUT /api/profile/business` - Update business profile

### Ratings
- `POST /api/ratings` - Create rating
- `GET /api/ratings/user/:userId` - Get user ratings

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

## Features Implemented

### For Workers
- ✅ User registration and authentication
- ✅ Browse shifts with filters (industry, city, wage, date)
- ✅ Apply to shifts with custom application text
- ✅ Dashboard with upcoming shifts and pending applications
- ✅ Income tracking and completed shifts history
- ✅ Profile management with skills and availability
- ✅ View shift details and business ratings

### For Businesses
- ✅ Business registration and verification flow
- ✅ Create and manage shift postings
- ✅ View and manage applications
- ✅ Accept/reject applications
- ✅ Dashboard with analytics
- ✅ View worker profiles and ratings

### Core Features
- ✅ JWT-based authentication
- ✅ Role-based access control (worker/business)
- ✅ Rating and review system
- ✅ Notification system
- ✅ Database with proper relationships
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Platform fee calculation (200,000 IRR/hour)

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: Check Windows services for `postgresql-x64-18` or use `Get-Service "*postgresql*"` in PowerShell
- Verify database credentials in `backend/.env`
- Make sure the database exists or the setup script can create it
- For PostgreSQL 18, the service name is typically `postgresql-x64-18`

### Port Already in Use
- Change the port in `backend/.env` (PORT) or `frontend/.env.local` (NEXT_PUBLIC_PORT)
- Kill the process using the port: `lsof -ti:5000 | xargs kill` (Linux/Mac)

### Module Not Found Errors
- Run `npm run install-all` again
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in environment variables
2. Use a secure `JWT_SECRET` (generate with: `openssl rand -base64 32`)
3. Set up proper database backups
4. Configure CORS for your domain
5. Use HTTPS for all connections
6. Set up proper logging and monitoring
7. Configure payment gateway integration (Zarinpal, IDPay)

## Support

For issues or questions, please refer to the main README.md or contact the development team.

