
import express from 'express';
import { auth, isManager } from '../middleware/auth.js'; // Import your auth middleware
import Issue from '../models/Issue.js';
import Society from '../models/Society.js';

const router = express.Router();

// GET issues by society and optional status
router.get('/issues/:societyId', auth, isManager, async (req, res) => {
  try {
    const { societyId } = req.params;
    const { status } = req.query;
    const query = { society: societyId };
    if (status) {
      query.status = status;
    }
    console.log('Fetching issues for society:', societyId, 'with status:', status, 'by user:', req.user._id.toString());
    const issues = await Issue.find(query).populate('assignedTo', 'fullName role');
    res.json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Failed to fetch issues', error });
  }
});

// UPDATE issue status
router.put('/issues/:id/status', auth, isManager, async (req, res) => {
  const { status } = req.body;
  try {
    if (!['Open', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status for manager' });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    console.log('Attempting to update issue:', issue._id.toString(), 'for user:', req.user._id.toString(), 'society:', issue.society.toString());

    const society = await Society.findOne({ _id: issue.society, manager: req.user._id });
    console.log('Society query result:', society);
    if (!society) {
      console.error('Authorization failed: No matching society found for user:', req.user._id.toString(), 'in society:', issue.society.toString());
      return res.status(403).json({ 
        message: 'Not authorized to update this issue',
        userId: req.user._id.toString(),
        societyId: issue.society.toString()
      });
    }

    issue.status = status;
    await issue.save();
    res.json({ message: 'Issue status updated', issue });
  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({ message: 'Failed to update issue status', error });
  }
});

export default router;