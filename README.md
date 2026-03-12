# Jharkhand Tourism — Safar Sathi

A full-stack web application to explore Jharkhand's eco, cultural, and adventure tourism destinations. Features include destination browsing with hover video previews, user authentication via Email OTP, booking management, and a rewards/points system.

---

## ✨ Features

- 🗺️ **Destination Explorer** — Browse places like Hundru Falls, Betla National Park, Netarhat, Patratu, and Deoghar with live video previews (Cloudinary-hosted)
- 🔐 **Email OTP Authentication** — Secure sign-up & sign-in using 6-digit OTP sent via Gmail SMTP
- 🎫 **Booking System** — Book tours with date, guests, and ticket generation
- 🏆 **Rewards & Points** — Earn points on bookings, track discounts and redemption history
- 👤 **User Profile** — Manage personal info, travel preferences, and view booking history
- 📱 **Responsive UI** — Mobile-first design with Tailwind CSS and shadcn/ui components

---

## 🗂️ Project Structure

```
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/              # Route-level pages
│   │   │   ├── JharkhandTourism.tsx   # Home / destination listing
│   │   │   ├── DestinationDetail.tsx  # Individual destination page
│   │   │   ├── BookingPage.tsx        # Booking flow
│   │   │   ├── Bookings.tsx           # User's booking history
│   │   │   ├── Rewards.tsx            # Rewards & points
│   │   │   ├── Profile.tsx            # User profile
│   │   │   ├── SignIn.tsx             # Login with OTP
│   │   │   └── SignUp.tsx             # Register with OTP
│   │   ├── components/         # Reusable UI components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── DestinationCard.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── QRCodeGenerator.tsx
│   │   │   └── ui/             # shadcn/ui primitives
│   │   ├── context/
│   │   │   └── AuthContext.tsx # Global auth state
│   │   ├── lib/
│   │   │   └── api.ts          # Axios API helpers
│   │   └── services/
│   │       └── ticketService.ts
│   ├── public/                 # Static assets (images)
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                    # Express.js REST API
│   ├── models/
│   │   ├── User.js             # User schema (bcrypt passwords, preferences, points)
│   │   ├── Otp.js              # OTP schema with TTL
│   │   ├── Booking.js          # Booking schema
│   │   └── Reward.js           # Reward/points schema
│   ├── routes/
│   │   └── auth.js             # Auth + booking + rewards routes
│   ├── index.js                # Server entry point
│   └── package.json
│
└── package.json                # Root orchestrator scripts
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (Radix UI primitives)
- React Router v6
- TanStack React Query
- Lucide React icons

**Backend:**
- Node.js + Express
- MongoDB Atlas (Mongoose ODM)
- JWT Authentication
- Nodemailer (Gmail SMTP for OTP emails)
- bcryptjs (password hashing)

**Media:**
- Cloudinary (video hosting for destination hover previews)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
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

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/send-otp` | Send OTP to email | No |
| POST | `/auth/verify-otp` | Verify OTP & get JWT | No |
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/signin` | Sign in with OTP | No |
| GET | `/auth/profile/:userId` | Get user profile | ✅ |
| PUT | `/auth/profile/:userId` | Update user profile | ✅ |
| GET | `/auth/bookings/:userId` | Get user bookings | ✅ |
| POST | `/auth/bookings` | Create a booking | ✅ |
| GET | `/auth/rewards/:userId` | Get rewards & points | ✅ |
| GET | `/health` | Health check | No |

---

## 🗺️ Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | JharkhandTourism | Home — destination cards with video hover |
| `/destination/:id` | DestinationDetail | Detailed destination view |
| `/booking` | BookingPage | Booking form |
| `/bookings` | Bookings | User's booking history |
| `/rewards` | Rewards | Points & rewards dashboard |
| `/profile` | Profile | User profile & preferences |
| `/signin` | SignIn | Sign in with email OTP |
| `/signup` | SignUp | Register with email OTP |

---

## 🌍 Destinations

| Name | Category | Location |
|------|----------|----------|
| Hundru Falls | Adventure | Ranchi |
| Betla National Park | Nature | Latehar |
| Tribal Heritage | Cultural | Across Jharkhand |
| Netarhat | Nature | Latehar |
| Patratu | Nature | Ramgarh |
| Deoghar | Cultural/Spiritual | Deoghar |

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
MAIL_FROM=Safar Sathi <your_email@gmail.com>
OTP_TTL_MINUTES=10
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

> **Note:** For Gmail SMTP, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular Gmail password.
