import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
  
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff'],
    required: true
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    console.log("Password Match:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error during password comparison:", error);
    throw error;
  }
};

export default mongoose.model('User', userSchema);