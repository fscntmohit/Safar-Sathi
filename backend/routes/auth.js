import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import Booking from '../models/Booking.js';
import Reward from '../models/Reward.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const OTP_TTL_MINUTES = parseInt(process.env.OTP_TTL_MINUTES || '10', 10);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user is accessing their own data
const authorizeUser = (req, res, next) => {
  const { userId } = req.params;
  if (req.user.uid !== userId) {
    return res.status(403).json({ error: 'Access denied. You can only access your own data.' });
  }
  next();
};

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createTransport() {
  if (process.env.SMTP_URL) {
    return nodemailer.createTransport(process.env.SMTP_URL);
  }
  
  // Check if we have valid Gmail credentials
  if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_PASS !== 'your-gmail-app-password-here') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  
  // Return null if no valid email configuration
  return null;
}

router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    
    // Store in MongoDB
    await Otp.create({ email: email.toLowerCase(), code, expiresAt });
    
    // Try to send email, but don't fail if email service is down
    const transporter = createTransport();
    if (transporter) {
      try {
        const from = process.env.MAIL_FROM || 'noreply@safarsathi.app';
        await transporter.sendMail({
          from,
          to: email,
          subject: 'Your Safar Sathi verification code',
          text: `Your verification code is ${code}. It expires in ${OTP_TTL_MINUTES} minutes.`,
          html: `<p>Your verification code is <b>${code}</b>.</p><p>It expires in ${OTP_TTL_MINUTES} minutes.</p>`,
        });
        console.log(`✅ Email sent to ${email} with code: ${code}`);
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError.message);
        
        // In development mode, log the OTP to console for testing
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔧 DEVELOPMENT MODE: OTP for ${email} is: ${code}`);
          console.log(`🔧 You can use this code to test the authentication flow`);
        }
        
        // Don't fail the request, just log the error
        console.log('⚠️  Continuing without email notification...');
      }
    } else {
      console.log('⚠️  No email service configured. OTP will be logged to console only.');
      
      // In development mode, log the OTP to console for testing
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔧 DEVELOPMENT MODE: OTP for ${email} is: ${code}`);
        console.log(`🔧 You can use this code to test the authentication flow`);
      }
    }

    res.json({ 
      ok: true, 
      message: process.env.NODE_ENV === 'development' 
        ? `OTP generated. Check console for code: ${code}` 
        : 'OTP sent to your email'
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to generate OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const record = await Otp.findOne({ email: email.toLowerCase(), code }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ error: 'Invalid code' });
    if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ error: 'Code expired' });

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Lazy create user on first verify
      user = await User.create({ email: email.toLowerCase(), name: email.split('@')[0], verified: true });
    } else if (!user.verified) {
      user.verified = true;
      await user.save();
    }

    const token = jwt.sign({ uid: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });
    
    const record = await Otp.findOne({ email: email.toLowerCase(), code }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ error: 'Invalid code' });
    if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ error: 'Code expired' });

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      if (name && user.name !== name) {
        user.name = name;
        user.verified = true;
        await user.save();
      }
    } else {
      user = await User.create({ name: name || email.split('@')[0], email: email.toLowerCase(), verified: true });
    }
    const token = jwt.sign({ uid: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// Check if user exists
router.get('/check-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email.toLowerCase() });
    res.json({ 
      exists: !!user,
      user: user ? { id: user._id, name: user.name, email: user.email } : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check user' });
  }
});

// Password-based sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Please set a password first. Use OTP verification to set up your account.' });
    }

    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ uid: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Set password for existing users (after OTP verification)
router.post('/set-password', async (req, res) => {
  try {
    const { email, code, password } = req.body;
    if (!email || !code || !password) {
      return res.status(400).json({ error: 'Email, code, and password are required' });
    }

    // Verify OTP first
    const record = await Otp.findOne({ email: email.toLowerCase(), code }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ error: 'Invalid code' });
    if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ error: 'Code expired' });

    // Update user with password
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.passwordHash = password;
    user.verified = true;
    await user.save();

    const token = jwt.sign({ uid: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to set password' });
  }
});

// Direct sign in for existing users (skip OTP)
router.post('/direct-signin', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }

    const token = jwt.sign({ uid: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Get user profile
router.get('/profile/:userId', authenticateToken, authorizeUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ 
      id: user._id, 
      name: user.name, 
      email: user.email,
      phone: user.phone || '',
      location: user.location || '',
      bio: user.bio || '',
      preferences: user.preferences || {},
      points: user.points || 0,
      discountPercent: user.discountPercent || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile/:userId', authenticateToken, authorizeUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, location, bio, preferences } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (preferences) user.preferences = preferences;

    await user.save();
    res.json({ 
      id: user._id, 
      name: user.name, 
      email: user.email,
      phone: user.phone || '',
      location: user.location || '',
      bio: user.bio || '',
      preferences: user.preferences || {},
      points: user.points || 0,
      discountPercent: user.discountPercent || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user bookings
router.get('/bookings/:userId', authenticateToken, authorizeUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

// Create new booking
router.post('/bookings', authenticateToken, async (req, res) => {
  try {
    const {
      userId,
      destination,
      location,
      date,
      duration,
      price,
      travelers,
      guide,
      description,
      image,
      includes,
      pickupTime,
      pickupLocation,
      specialRequests
    } = req.body;

    if (!userId || !destination || !location || !date || !duration || !price || !travelers) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const booking = await Booking.create({
      user: userId,
      destination,
      location,
      date: new Date(date),
      duration,
      price,
      travelers,
      guide: guide || {
        name: 'Local Guide',
        phone: '+91 98765 43210',
        email: 'guide@jharkhandtourism.com',
        rating: 4.5
      },
      description: description || 'Experience the beauty of Jharkhand',
      image: image || '/placeholder.svg',
      includes: includes || ['Transportation', 'Guide', 'Entry Fees'],
      pickupTime: pickupTime || '08:00 AM',
      pickupLocation: pickupLocation || 'Hotel/Railway Station',
      specialRequests
    });

    // Award points and apply discounts
    const user = await User.findById(userId);
    if (user) {
      let pointsEarned = Math.floor(price / 100); // 1 point per ₹100
      let volumeDiscountApplied = 0;
      
      // Apply volume discounts and bonus points
      if (price > 2000) {
        volumeDiscountApplied = price * 0.10; // 10% discount
        pointsEarned += 100; // Bonus points
        user.discountPercent = Math.min(user.discountPercent + 1, 15); // Max 15% discount
      } else if (price > 1000) {
        volumeDiscountApplied = price * 0.05; // 5% discount
        pointsEarned += 50; // Bonus points
        user.discountPercent = Math.min(user.discountPercent + 1, 10); // Max 10% discount
      }
      
      user.points += pointsEarned;
      await user.save();

      // Create reward record
      await Reward.create({
        user: userId,
        title: 'Booking Reward',
        description: `Earned ${pointsEarned} points for booking ${destination}${volumeDiscountApplied > 0 ? ` (${volumeDiscountApplied === price * 0.10 ? '10%' : '5%'} volume discount applied)` : ''}. Your total discount percentage is now ${user.discountPercent}%.`,
        points: pointsEarned,
        status: 'Earned',
        category: 'Booking',
        earnedAt: new Date(),
        bookingReference: booking.bookingReference
      });
    }

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status
router.put('/bookings/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Cancel booking
router.delete('/bookings/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Get user rewards
router.get('/rewards/:userId', authenticateToken, authorizeUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const rewards = await Reward.find({ user: userId })
      .sort({ createdAt: -1 });
    
    res.json(rewards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get rewards' });
  }
});

// Create reward
router.post('/rewards', authenticateToken, async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      points,
      category,
      conditions
    } = req.body;

    if (!userId || !title || !description || !points) {
      return res.status(400).json({ error: 'Missing required reward fields' });
    }

    const reward = await Reward.create({
      user: userId,
      title,
      description,
      points,
      category: category || 'Special',
      conditions: conditions || {}
    });

    res.status(201).json(reward);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create reward' });
  }
});

// Redeem points for discount
router.post('/rewards/redeem', authenticateToken, async (req, res) => {
  try {
    const { pointsToRedeem } = req.body;
    const userId = req.user.uid;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.points < pointsToRedeem) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    // Convert points to discount percentage (100 points = 1% discount, max 5% per redemption)
    const discountIncrease = Math.min(Math.floor(pointsToRedeem / 100), 5);
    const pointsUsed = discountIncrease * 100;

    user.points -= pointsUsed;
    user.discountPercent = Math.min(user.discountPercent + discountIncrease, 20); // Max 20% total discount
    await user.save();

    // Create redemption record
    const reward = await Reward.create({
      user: userId,
      title: 'Points Redemption',
      description: `Redeemed ${pointsUsed} points for ${discountIncrease}% additional discount. Your total discount is now ${user.discountPercent}%.`,
      points: -pointsUsed,
      status: 'Redeemed',
      category: 'Redemption',
      earnedAt: new Date()
    });

    res.json({
      message: 'Points redeemed successfully',
      pointsUsed,
      discountIncrease,
      newDiscountPercent: user.discountPercent,
      remainingPoints: user.points,
      reward
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to redeem points' });
  }
});

// Development endpoint to get current OTP for testing
if (process.env.NODE_ENV === 'development') {
  router.get('/dev-otp/:email', async (req, res) => {
    try {
      const { email } = req.params;
      const record = await Otp.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });
      if (!record) {
        return res.json({ error: 'No OTP found for this email' });
      }
      if (record.expiresAt.getTime() < Date.now()) {
        return res.json({ error: 'OTP expired' });
      }
      res.json({ 
        email: record.email, 
        code: record.code, 
        expiresAt: record.expiresAt,
        timeLeft: Math.round((record.expiresAt.getTime() - Date.now()) / 1000 / 60) + ' minutes'
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to get OTP' });
    }
  });
}

export default router;


