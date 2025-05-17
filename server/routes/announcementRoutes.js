import express from 'express';
import Announcement from '../models/Announcement.js';
import { auth, isManager } from '../middleware/auth.js';
import Society from '../models/Society.js';

const router = express.Router();

// Get all announcements for a specific society
router.get('/:societyId/announcements', auth, isManager, async (req, res) => {
  try {
    const { societyId } = req.params;
    console.log('Fetching announcements for society:', societyId, 'by user:', req.user._id.toString());
    const announcements = await Announcement.find({ society: societyId }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Failed to fetch announcements', error: error.message });
  }
});

// Create a new announcement
router.post('/:societyId/announcements', auth, isManager, async (req, res) => {
  try {
    const { societyId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Verify society exists and user is the manager
    const society = await Society.findOne({ _id: societyId, manager: req.user._id });
    if (!society) {
      return res.status(403).json({ 
        message: 'Unauthorized: User is not the manager of this society',
        userId: req.user._id.toString(),
        societyId
      });
    }

    const announcement = new Announcement({
      title,
      content,
      society: societyId,
      manager: req.user._id
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
});

// Update an announcement
router.put('/:societyId/announcements/:id', auth, isManager, async (req, res) => {
  try {
    const { societyId, id } = req.params;
    const { title, content } = req.body;

    // Verify society exists and user is the manager
    const society = await Society.findOne({ _id: societyId, manager: req.user._id });
    if (!society) {
      return res.status(403).json({ 
        message: 'Unauthorized: User is not the manager of this society',
        userId: req.user._id.toString(),
        societyId
      });
    }

    const announcement = await Announcement.findOne({ _id: id, society: societyId });
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found or unauthorized' });
    }

    announcement.title = title || announcement.title;
    announcement.content = content || announcement.content;
    announcement.updatedAt = Date.now();
    await announcement.save();
    res.json(announcement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ message: 'Error updating announcement', error: error.message });
  }
});

// Delete an announcement
router.delete('/:societyId/announcements/:id', auth, isManager, async (req, res) => {
  try {
    const { societyId, id } = req.params;

    // Verify society exists and user is the manager
    const society = await Society.findOne({ _id: societyId, manager: req.user._id });
    if (!society) {
      return res.status(403).json({ 
        message: 'Unauthorized: User is not the manager of this society',
        userId: req.user._id.toString(),
        societyId
      });
    }

    const announcement = await Announcement.findOneAndDelete({ _id: id, society: societyId });
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found or unauthorized' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
});

export default router;