

// import mongoose from 'mongoose';

// const societySchema = new mongoose.Schema({

//   name: { type: String, required: true },
//   address: { type: String, required: true },
//   managerEmail: { type: String, required: true },
//   managerName: { type: String, required: true },
//   uniqueIdCode: { type: String, required: true },
//   manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   dateOfCreation: { type: Date, default: Date.now },
//   residents: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }],
//   residentRequests: [{
//     name: String,
//     phoneNumber: String,
//     email: String,
//     address: String,
//     houseNumber: String,
//     status: {
//       type: String,
//       enum: ['Pending', 'Approved', 'Rejected'],
//       default: 'Pending'
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// });

// export default mongoose.model('Society', societySchema);

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
    default: Date.now 
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

export default mongoose.model('Society', societySchema);
