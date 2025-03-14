import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'osman@gmail.com' });
    if (existingAdmin) {
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: 'osman@gmail.com',
      password: await bcrypt.hash('12345', 10),
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
