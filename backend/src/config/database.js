import dns from 'dns';
import mongoose from 'mongoose';
import { config } from './environment.js';

// Ensure DNS SRV records resolve on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // ignore if restricted
}

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
