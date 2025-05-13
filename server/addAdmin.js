import mongoose from 'mongoose';
import bcrypt  from 'bcryptjs';

async function addAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/rsms', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Define User schema
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      phoneNumber: String,
      password: String,
      role: String,
      society: mongoose.Schema.Types.ObjectId
    });
    const User = mongoose.model('User', userSchema);

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'osman@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const password = 'o12345';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new User({
      name: 'Osman',
      email: 'osman@gmail.com',
      password: hashedPassword,
      role: 'admin',
      society: null
    });

    await admin.save();
    console.log('Admin created successfully');

    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
  }
}

addAdmin();