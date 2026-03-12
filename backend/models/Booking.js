import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    destination: { 
      type: String, 
      required: true, 
      trim: true 
    },
    location: { 
      type: String, 
      required: true, 
      trim: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    duration: { 
      type: String, 
      required: true, 
      enum: ['Half Day', 'Full Day', '2-3 Days', 'Weekend', 'Custom']
    },
    status: { 
      type: String, 
      required: true, 
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    price: { 
      type: Number, 
      required: true 
    },
    travelers: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    guide: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      rating: { type: Number, default: 0 }
    },
    description: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    includes: [{ 
      type: String 
    }],
    pickupTime: { 
      type: String, 
      required: true 
    },
    pickupLocation: { 
      type: String, 
      required: true 
    },
    specialRequests: { 
      type: String, 
      trim: true 
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded', 'Failed'],
      default: 'Pending'
    },
    paymentId: { 
      type: String 
    },
    bookingReference: { 
      type: String, 
      unique: true 
    }
  },
  { timestamps: true }
);

// Generate booking reference before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.bookingReference = `JHE-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);



