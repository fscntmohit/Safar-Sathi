// Minimal Express server with MongoDB Atlas and Email OTP auth
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';

// Load environment variables from .env file
dotenv.config();

// Fallback to hardcoded values if .env is not available
if (!process.env.MONGO_URI) {
  process.env.PORT = '4000';
  process.env.MONGO_URI = 'mongodb+srv://shubham:Abc123@cluster0.pu3u65g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  process.env.JWT_SECRET = 'f5beba96c78213b19aa98bf6e6a6e43f77df4b1fa23bc7d52d8e46e8228a7766';
  // Using Gmail SMTP for better reliability
  process.env.SMTP_HOST = 'smtp.gmail.com';
  process.env.SMTP_PORT = '587';
  process.env.SMTP_USER = 'shubhamsinghrajput12005@gmail.com';
  // Gmail App Password
  process.env.SMTP_PASS = 'osvl lrog zbbq mitu';
  process.env.MAIL_FROM = 'Safar Sathi <shubhamsinghrajput12005@gmail.com>';
  process.env.OTP_TTL_MINUTES = '10';
  process.env.NODE_ENV = 'development';
  process.env.CORS_ORIGIN = 'http://localhost:8080';
}

console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8080';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);

async function start() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is not set');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
  
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});


