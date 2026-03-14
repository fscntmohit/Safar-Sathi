const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    verified: { type: Boolean, default: false },
    passwordHash: { type: String },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    bio: { type: String, trim: true },
    preferences: {
      nature: { type: Boolean, default: false },
      culture: { type: Boolean, default: false },
      adventure: { type: Boolean, default: false },
      photography: { type: Boolean, default: false }
    },
    points: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  if (this.passwordHash) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

// Method to check password
userSchema.methods.checkPassword = async function(password) {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);



