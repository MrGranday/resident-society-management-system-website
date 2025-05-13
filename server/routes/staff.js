// import express from 'express';
// import bcrypt from 'bcryptjs';
// import Staff from '../models/Staff.js';
// import Society from '../models/Society.js';
// import User from '../models/User.js';
// import { auth } from '../middleware/auth.js';

// const router = express.Router();

// // Create a new staff member
// router.post('/:societyId/staff', auth, async (req, res) => {
//   try {
//     const { fullName, phoneNumber, email, password, role, startDate } = req.body;
//     const { societyId } = req.params;

//     // Server-side validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const nameRegex = /^[a-zA-Z\s'-]{2,100}$/;
//     const phoneRegex = /^\d{1,11}$/;
//     const passwordRegex = /^.{6,}$/;
//     const today = new Date().toISOString().split('T')[0];

//     if (!fullName || !nameRegex.test(fullName)) {
//       return res.status(400).json({ message: 'Full name must be 2-100 characters, letters, spaces, hyphens, or apostrophes only' });
//     }

//     if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
//       return res.status(400).json({ message: 'Phone number must be 1-11 digits' });
//     }

//     if (email && !emailRegex.test(email)) {
//       return res.status(400).json({ message: 'Invalid email format' });
//     }

//     if (!password || !passwordRegex.test(password)) {
//       return res.status(400).json({ message: 'Password must be at least 6 characters' });
//     }

//     if (!role || !['Cleaner', 'Gardener', 'Event Manager', 'Security', 'Maintenance'].includes(role)) {
//       return res.status(400).json({ message: 'Invalid role selected' });
//     }

//     if (!startDate || startDate < today) {
//       return res.status(400).json({ message: 'Start date is required and cannot be in the past' });
//     }

//     // Verify society exists
//     const society = await Society.findById(societyId);
//     if (!society) {
//       return res.status(404).json({ message: 'Society not found' });
//     }

//     // Verify user is the manager
//     if (society.manager.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Unauthorized: User is not the manager of this society' });
//     }

//     // Check if phone number is used
//     const existingStaff = await Staff.findOne({ phoneNumber });
//     if (existingStaff) {
//       return res.status(400).json({ message: 'Phone number already in use' });
//     }

//     const existingUser = await User.findOne({ phoneNumber });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Phone number already in use' });
//     }

//     // Check if email is used (if provided)
//     if (email) {
//       const existingUser = await User.findOne({ email: email.toLowerCase() });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Email already in use' });
//       }
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const userData = {
//       name: fullName,
//       phoneNumber,
//       password: hashedPassword,
//       role: 'staff',
//       society: societyId
//     };
//     if (email) userData.email = email.toLowerCase(); // Only set email if provided
//     const user = new User(userData);
//     await user.save();

//     // Create staff
//     const staff = new Staff({
//       fullName,
//       phoneNumber,
//       email: email ? email.toLowerCase() : null,
//       role,
//       startDate,
//       society: societyId,
//       user: user._id,
//       manager: req.user._id
//     });

//     await staff.save();
//     res.status(201).json({ message: 'Staff member created successfully', staff });
//   } catch (error) {
//     console.error('Error creating staff:', error);
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ message: 'Validation error: ' + error.message });
//     }
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Phone number or email already in use' });
//     }
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// });

// // Update a staff member
// router.patch('/:societyId/staff/:staffId', auth, async (req, res) => {
//   try {
//     const { fullName, phoneNumber, email, password, role, startDate } = req.body;
//     const { societyId, staffId } = req.params;

//     // Validations
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const nameRegex = /^[a-zA-Z\s'-]{2,100}$/;
//     const phoneRegex = /^\d{1,11}$/;
//     const passwordRegex = /^.{6,}$/;
//     const today = new Date().toISOString().split('T')[0];

//     if (fullName && !nameRegex.test(fullName)) {
//       return res.status(400).json({ message: 'Full name must be 2-100 characters, letters, spaces, hyphens, or apostrophes only' });
//     }

//     if (phoneNumber && !phoneRegex.test(phoneNumber)) {
//       return res.status(400).json({ message: 'Phone number must be 1-11 digits' });
//     }

//     if (email && !emailRegex.test(email)) {
//       return res.status(400).json({ message: 'Invalid email format' });
//     }

//     if (password && !passwordRegex.test(password)) {
//       return res.status(400).json({ message: 'Password must be at least 6 characters' });
//     }

//     if (role && !['Cleaner', 'Gardener', 'Event Manager', 'Security', 'Maintenance'].includes(role)) {
//       return res.status(400).json({ message: 'Invalid role selected' });
//     }

//     if (startDate && startDate < today) {
//       return res.status(400).json({ message: 'Start date cannot be in the past' });
//     }

//     // Verify society exists
//     const society = await Society.findById(societyId);
//     if (!society) {
//       return res.status(404).json({ message: 'Society not found' });
//     }

//     // Verify user is the manager
//     if (society.manager.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Unauthorized: User is not the manager of this society' });
//     }

//     // Find staff
//     const staff = await Staff.findById(staffId);
//     if (!staff) {
//       return res.status(404).json({ message: 'Staff not found' });
//     }

//     // Check phone number uniqueness if provided
//     if (phoneNumber) {
//       const existingStaff = await Staff.findOne({ phoneNumber, _id: { $ne: staffId } });
//       if (existingStaff) {
//         return res.status(400).json({ message: 'Phone number already in use' });
//       }
//       const existingUser = await User.findOne({ phoneNumber, _id: { $ne: staff.user } });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Phone number already in use' });
//       }
//     }

//     // Check email uniqueness if provided
//     if (email) {
//       const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: staff.user } });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Email already in use' });
//       }
//     }

//     // Update staff
//     if (fullName) staff.fullName = fullName;
//     if (phoneNumber) staff.phoneNumber = phoneNumber;
//     staff.email = email !== undefined ? (email ? email.toLowerCase() : null) : staff.email;
//     if (role) staff.role = role;
//     if (startDate) staff.startDate = startDate;

//     await staff.save();

//     // Update user
//     const user = await User.findById(staff.user);
//     if (!user) {
//       return res.status(404).json({ message: 'Associated user not found' });
//     }

//     if (fullName) user.name = fullName;
//     if (phoneNumber) user.phoneNumber = phoneNumber;
//     if (email !== undefined) {
//       if (email) {
//         user.email = email.toLowerCase();
//       } else {
//         user.email = undefined; // Unset email
//       }
//     }
//     if (password) user.password = await bcrypt.hash(password, 10);

//     await user.save();

//     res.json({ message: 'Staff updated successfully', staff });
//   } catch (error) {
//     console.error('Error updating staff:', error);
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ message: 'Validation error: ' + error.message });
//     }
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Phone number or email already in use' });
//     }
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// });

// // Delete a staff member
// router.delete('/:societyId/staff/:staffId', auth, async (req, res) => {
//   try {
//     const { societyId, staffId } = req.params;

//     // Verify society exists
//     const society = await Society.findById(societyId);
//     if (!society) {
//       return res.status(404).json({ message: 'Society not found' });
//     }

//     // Verify user is the manager
//     if (society.manager.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Unauthorized: User is not the manager of this society' });
//     }

//     // Find staff
//     const staff = await Staff.findById(staffId);
//     if (!staff) {
//       return res.status(404).json({ message: 'Staff not found' });
//     }

//     // Delete user
//     await User.deleteOne({ _id: staff.user });

//     // Delete staff
//     await Staff.deleteOne({ _id: staffId });

//     res.json({ message: 'Staff deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting staff:', error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// });

// // Get all staff members for a society
// router.get('/:societyId/staff', auth, async (req, res) => {
//   try {
//     const { societyId } = req.params;
//     const society = await Society.findById(societyId);
//     if (!society) {
//       return res.status(404).json({ message: 'Society not found' });
//     }
//     const staff = await Staff.find({ society: societyId }).populate('user', 'name email');
//     res.json(staff);
//   } catch (error) {
//     console.error('Error fetching staff:', error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// });

// export default router;
import express from 'express';
import bcrypt from 'bcryptjs';
import Staff from '../models/Staff.js';
import Society from '../models/Society.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create a new staff member
router.post('/:societyId/staff', auth, async (req, res) => {
  try {
    const { fullName, phoneNumber, password, role, startDate } = req.body;
    const { societyId } = req.params;

    // Server-side validation
    const nameRegex = /^[a-zA-Z\s'-]{2,100}$/;
    const phoneRegex = /^\d{1,11}$/;
    const passwordRegex = /^.{6,}$/;
    const today = new Date().toISOString().split('T')[0];

    if (!fullName || !nameRegex.test(fullName)) {
      return res.status(400).json({ message: 'Full name must be 2-100 characters, letters, spaces, hyphens, or apostrophes only' });
    }

    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: 'Phone number must be 1-11 digits' });
    }

    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (!role || !['Cleaner', 'Gardener', 'Event Manager', 'Security', 'Maintenance'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    if (!startDate || startDate < today) {
      return res.status(400).json({ message: 'Start date is required and cannot be in the past' });
    }

    // Verify society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    // Verify user is the manager
    if (society.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: User is not the manager of this society' });
    }

    // Check if phone number is used by staff
    const existingStaff = await Staff.findOne({ phoneNumber });
    if (existingStaff) {
      return res.status(400).json({ message: 'This phone number is already used by another staff member' });
    }

    const existingUser = await User.findOne({ phoneNumber, role: 'staff' });
    if (existingUser) {
      return res.status(400).json({ message: 'This phone number is already used by another staff member' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userData = {
      name: fullName,
      phoneNumber,
      password: hashedPassword,
      role: 'staff',
      society: societyId
    };
    const user = new User(userData);
    await user.save();

    // Create staff
    const staff = new Staff({
      fullName,
      phoneNumber,
      role,
      startDate,
      society: societyId,
      user: user._id,
      manager: req.user._id
    });

    await staff.save();
    res.status(201).json({ message: 'Staff member created successfully', staff });
  } catch (error) {
    console.error('Error creating staff:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Phone number already in use by another staff member' });
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Update a staff member
router.patch('/:societyId/staff/:staffId', auth, async (req, res) => {
  try {
    const { fullName, phoneNumber, password, role, startDate } = req.body;
    const { societyId, staffId } = req.params;

    // Validations
    const nameRegex = /^[a-zA-Z\s'-]{2,100}$/;
    const phoneRegex = /^\d{1,11}$/;
    const passwordRegex = /^.{6,}$/;
    const today = new Date().toISOString().split('T')[0];

    if (fullName && !nameRegex.test(fullName)) {
      return res.status(400).json({ message: 'Full name must be 2-100 characters, letters, spaces, hyphens, or apostrophes only' });
    }

    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: 'Phone number must be 1-11 digits' });
    }

    if (password && !passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (role && !['Cleaner', 'Gardener', 'Event Manager', 'Security', 'Maintenance'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    if (startDate && startDate < today) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    // Verify society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    // Verify user is the manager
    if (society.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: User is not the manager of this society' });
    }

    // Find staff
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Check phone number uniqueness if provided
    if (phoneNumber && phoneNumber !== staff.phoneNumber) {
      const existingStaff = await Staff.findOne({ phoneNumber, _id: { $ne: staffId } });
      if (existingStaff) {
        return res.status(400).json({ message: 'This phone number is already used by another staff member' });
      }
      const existingUser = await User.findOne({ phoneNumber, role: 'staff', _id: { $ne: staff.user } });
      if (existingUser) {
        return res.status(400).json({ message: 'This phone number is already used by another staff member' });
      }
    }

    // Update staff
    if (fullName) staff.fullName = fullName;
    if (phoneNumber) staff.phoneNumber = phoneNumber;
    if (role) staff.role = role;
    if (startDate) staff.startDate = startDate;

    await staff.save();

    // Update user
    const user = await User.findById(staff.user);
    if (!user) {
      return res.status(404).json({ message: 'Associated user not found' });
    }

    if (fullName) user.name = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({ message: 'Staff updated successfully', staff });
  } catch (error) {
    console.error('Error updating staff:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Phone number already in use by another staff member' });
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Delete a staff member
router.delete('/:societyId/staff/:staffId', auth, async (req, res) => {
  try {
    const { societyId, staffId } = req.params;

    // Verify society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    // Verify user is the manager
    if (society.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: User is not the manager of this society' });
    }

    // Find staff
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // Delete user
    await User.deleteOne({ _id: staff.user });

    // Delete staff
    await Staff.deleteOne({ _id: staffId });

    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get all staff members for a society
router.get('/:societyId/staff', auth, async (req, res) => {
  try {
    const { societyId } = req.params;
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }
    const staff = await Staff.find({ society: societyId }).populate('user', 'name phoneNumber');
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

export default router;