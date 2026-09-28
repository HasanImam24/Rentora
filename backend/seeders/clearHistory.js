import mongoose from 'mongoose';
import dns from 'dns';
import { config } from '../src/config/environment.js';
import { Order } from '../src/models/Order.js';
import { Rental } from '../src/models/Rental.js';
import { Listing } from '../src/models/Listing.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('DNS setServers skipped:', e.message);
}

const clearHistory = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB.');

    console.log('Clearing all orders (purchases)...');
    const orderResult = await Order.deleteMany({});
    console.log(`Deleted ${orderResult.deletedCount} order(s).`);

    console.log('Clearing all rentals...');
    const rentalResult = await Rental.deleteMany({});
    console.log(`Deleted ${rentalResult.deletedCount} rental(s).`);

    console.log('Resetting all listing statuses to ACTIVE...');
    const listingResult = await Listing.updateMany({}, { status: 'ACTIVE' });
    console.log(`Updated ${listingResult.modifiedCount} listing(s) to ACTIVE.`);

    console.log('Successfully cleared all purchase and rental history!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing history:', error);
    process.exit(1);
  }
};

clearHistory();
