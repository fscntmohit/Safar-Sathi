const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true, 
      trim: true 
    },
    points: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    status: { 
      type: String, 
      required: true, 
      enum: ['Available', 'Earned', 'Redeemed', 'Expired'],
      default: 'Available'
    },
    category: { 
      type: String, 
      required: true,
      enum: ['Booking', 'Loyalty', 'Referral', 'Special', 'Seasonal'],
      default: 'Booking'
    },
    earnedAt: { 
      type: Date 
    },
    expiresAt: { 
      type: Date 
    },
    bookingReference: { 
      type: String 
    },
    conditions: {
      minBookings: { type: Number, default: 0 },
      advanceBookingDays: { type: Number, default: 0 },
      minAmount: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Reward || mongoose.model('Reward', rewardSchema);



