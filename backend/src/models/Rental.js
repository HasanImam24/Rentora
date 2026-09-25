import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  renterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  securityDeposit: { type: Number, default: 0 },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'CONFIRMED' }
}, { timestamps: true });

export const Rental = mongoose.model('Rental', rentalSchema);
