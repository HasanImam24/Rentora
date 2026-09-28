import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
  renterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  securityDeposit: { type: Number, default: 0 },
  phoneNumber: { type: String, required: true },
  paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'PENDING' }
}, { timestamps: true });

export const Rental = mongoose.model('Rental', rentalSchema);
