import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Society from '../models/Society.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('Login attempt with email:', email);
    console.log('Login attempt with role:', role);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Password match');

    if (user.role !== role) {
      console.log('Role mismatch');
      return res.status(403).json({ message: 'Role mismatch' });
    }

    console.log('Role match');

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Token generated:', token);

    let societyId = null;
    if (role === 'manager') {
      const society = await Society.findOne({ manager: user._id });
      societyId = society ? society._id : null;
    }

    console.log('Society ID:', societyId);

    res.json({
      token,
      role: user.role,
      societyId,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
