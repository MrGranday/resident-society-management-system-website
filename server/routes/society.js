
import express from 'express';

import Society from '../models/Society.js';
import Resident from '../models/Resident.js';
import User from '../models/User.js';
import { auth, isAdmin } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();


// Create a new society
router.post('/create', async (req, res) => {
  let newManager, newSociety;

  try {
    const { name, address, managerName, managerEmail, managerPassword, uniqueIdCode } = req.body;

    // Validate input
    if (!name || !address || !managerName || !managerEmail || !managerPassword || !uniqueIdCode) {
      throw new Error('All fields are required.');
    }

    // Check if the manager email already exists
    const existingUser = await User.findOne({ email: managerEmail });
    if (existingUser) {
      throw new Error('Manager email already exists.');
    }

    // Hash the manager password
    const hashedPassword = await bcrypt.hash(managerPassword, 10);

    // Create the manager user
    newManager = new User({
      name: managerName,
      email: managerEmail,
      password: hashedPassword,
      role: 'manager',
    });

    await newManager.save(); // Save user

    // Create the society
    newSociety = new Society({
      name,
      address,
      managerName,
      managerEmail,
      uniqueIdCode,
      manager: newManager._id,
    });

    await newSociety.save(); // Save society

    // Update manager with society reference
    newManager.society = newSociety._id;
    await newManager.save();

    res.status(201).json(newSociety);
  } catch (error) {
    console.error('Error creating society:', error.message);

    // Manual Rollback Logic
    if (newSociety && newSociety._id) {
      await Society.deleteOne({ _id: newSociety._id }).catch(err => {
        console.error('Failed to clean up society:', err.message);
      });
    }

    if (newManager && newManager._id) {
      await User.deleteOne({ _id: newManager._id }).catch(err => {
        console.error('Failed to clean up manager:', err.message);
      });
    }

    res.status(400).json({ message: error.message });
  }
});

// Get all societies (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const societies = await Society.find().populate('manager', 'email');
    res.json(societies);
  } catch (error) {
    console.error('Error fetching societies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id.replace('create', ''); 
    console.log('Cleaned society ID:', id); 

    const society = await Society.findById(id).populate('manager', 'email');
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }
    res.json(society);
  } catch (error) {
    console.error('Error fetching society:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.patch('/:societyId/resident-request/:requestId', auth, async (req, res) => {
  const { societyId, requestId } = req.params;
  const { action } = req.body;

  try {
    // Find the society
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    // Find the resident request in the society's residentRequests array
    const requestIndex = society.residentRequests.findIndex(req => req._id.toString() === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Resident request not found' });
    }

    // Get the resident request
    const residentRequest = society.residentRequests[requestIndex];

    if (action === 'approve') {
      // Approve the request
      // Remove the request from the residentRequests array
      society.residentRequests.splice(requestIndex, 1);

      // Update the resident status to 'Approved' in the Residents collection
      await Resident.findByIdAndUpdate(residentRequest.residentId, { status: 'Approved' });

      // Save the updated society
      await society.save();

      res.status(200).json({ message: 'Resident request approved' });
    } else if (action === 'reject') {
      // Reject the request
      // Remove the request from the residentRequests array
      society.residentRequests.splice(requestIndex, 1);

      // Find the resident in the Residents collection
      const resident = await Resident.findById(residentRequest.residentId);
      if (resident) {
        // Delete the user from the User collection
        await User.deleteOne({ _id: resident.user, role: 'resident' });

        // Delete the resident from the Residents collection
        await Resident.deleteOne({ _id: residentRequest.residentId });
      }

      // Save the updated society
      await society.save();

      res.status(200).json({ message: 'Resident request rejected' });
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error processing resident request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;

