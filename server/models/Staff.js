import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Cleaner', 'Gardener', 'Event Manager', 'Security', 'Maintenance'],
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Staff', staffSchema);