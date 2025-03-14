import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import societyRoutes from './routes/society.js';
import residentRoutes from './routes/society.js'
// import SocietyDetails from '../src/components/SocietyDetails/SocietyDetails.jsx';
// import { createAdminUser } from './migrations/create_admin_user.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Create admin user after successful connection
    // await createAdminUser();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/societies/create', societyRoutes);
app.use('/api/societies', residentRoutes); // Mount resident-related routes

// app.use('/api/societies/details', SocietyDetails);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
