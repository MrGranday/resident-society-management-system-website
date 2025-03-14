import express from 'express';
import Listing from '../models/Listing.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('society', 'name')
      .populate('owner', 'email');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new listing
router.post('/', auth, async (req, res) => {
  try {
    const listing = new Listing({
      ...req.body,
      owner: req.user.userId
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('society', 'name')
      .populate('owner', 'email');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;