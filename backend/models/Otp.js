import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

otpSchema.index({ email: 1, createdAt: -1 });

export default mongoose.models.Otp || mongoose.model('Otp', otpSchema);



