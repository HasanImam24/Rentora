import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, required: true },
  transactionType: { type: String, enum: ['RENT', 'SALE', 'RENT_AND_SALE'], required: true },
  rentalPrice: { 
    amount: { type: Number },
    unit: { type: String, enum: ['DAY', 'WEEK', 'MONTH'], default: 'DAY' } 
  },
  salePrice: { type: Number },
  securityDeposit: { type: Number, default: 0 },
  images: [{ url: String, publicId: String }],
  condition: { type: String, enum: ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'], default: 'GOOD' },
  location: { type: String, default: '' },
  status: { type: String, enum: ['ACTIVE', 'PAUSED', 'SOLD', 'SUSPENDED'], default: 'ACTIVE' }
}, { timestamps: true });

listingSchema.index({ category: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ transactionType: 1 });

export const Listing = mongoose.model('Listing', listingSchema);
