import dns from 'dns';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { User } from '../src/models/User.js';
import { config } from '../src/config/environment.js';
import dotenv from 'dotenv';
dotenv.config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.mongodbUri || process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    const adminEmail = config.adminEmail || 'admin@rentbuy.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      const salt = await bcryptjs.genSalt(12);
      const passwordHash = await bcryptjs.hash('Admin@123', salt);

      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        isActive: true
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
};

seedAdmin();
