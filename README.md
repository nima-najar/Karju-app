# Karju Platform

Karju is the first Iranian online marketplace for shifts and temporary jobs. This platform connects businesses in need of short-term workforce with freelancers looking for flexible work opportunities.

## Features

### For Workers/Freelancers
- Browse available shifts with filtering (industry, date, wage, location)
- Apply to shifts with custom application text
- Manage dashboard with upcoming shifts and applications
- Track income and completed shifts
- Set availability calendar for automatic notifications
- Profile management with ratings and reviews

### For Businesses
- Post shifts with detailed job descriptions
- View and select from applicant profiles
- Manage workforce with analytics dashboard
- Rate and review workers after shift completion
- Manage multiple branches/locations

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL 18
- **Authentication**: JWT-based authentication
- **Payment**: Ready for Iranian payment gateways (Zarinpal, IDPay)

## Installation

1. Install dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env.local`
   - Fill in your database credentials and JWT secret

3. Set up database:
```bash
npm run setup-db
```

4. Run the development servers:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`
The backend API will be available at `http://localhost:5000`

## Project Structure

```
karju-platform/
├── backend/          # Express.js API server
├── frontend/         # Next.js frontend application
├── database/         # Database schema and migrations
└── README.md
```

## Platform Fee

Karju charges a transparent platform fee of 200,000 IRR per working hour.

## License

MIT

