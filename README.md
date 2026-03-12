# Jharkhand Tourism - Safar Sathi

A full-stack web application for exploring Jharkhand's eco and cultural tourism destinations, with booking and reward systems.

## Project Structure

```
├── frontend/          # React + Vite frontend
│   ├── src/           # React source code
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── vite.config.ts # Vite configuration
│
├── backend/           # Express.js API server
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── index.js       # Server entry point
│   └── package.json   # Backend dependencies
│
└── package.json       # Root scripts (orchestrator)
```

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- React Query

**Backend:**
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer (OTP emails)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```sh
# Install all dependencies (frontend + backend)
npm run install:all
```

### Development

```sh
# Start frontend dev server (http://localhost:8080)
npm run dev:frontend

# Start backend API server (http://localhost:4000)
npm run dev:backend
```

### Build

```sh
# Build frontend for production
npm run build
```

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=Your App <your_email@gmail.com>
OTP_TTL_MINUTES=10
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```
