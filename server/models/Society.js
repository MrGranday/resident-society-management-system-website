


import mongoose from 'mongoose';

const societySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  address: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  image: {
    type: String, // Store base64 string
    required: true
  },
  managerEmail: { 
    type: String, 
    required: true, 
    trim: true, 
    lowercase: true 
  },
  managerName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  uniqueIdCode: { 
    type: String, 
    required: true, 
    trim: true, 
    unique: true 
  },
  manager: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  dateOfCreation: { 
    type: Date, 
    required: true // Enforce required
  },
  residents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  residentRequests: [{
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    phoneNumber: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      trim: true, 
      lowercase: true 
    },
    address: { 
      type: String, 
      required: true, 
      trim: true 
    },
    houseNumber: { 
      type: String, 
      required: true, 
      trim: true 
    },
    status: { 
      type: String, 
      enum: ['Pending', 'Approved', 'Rejected'], 
      default: 'Pending' 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
});

// Validate image size (max 5MB)
societySchema.pre('save', function(next) {
  if (this.image) {
    const imgSize = Buffer.byteLength(this.image, 'base64') / (1024 * 1024); // Convert to MB
    if (imgSize > 5) {
      return next(new Error('Image size must not exceed 5MB'));
    }
  }
  next();
});

export default mongoose.model('Society', societySchema);