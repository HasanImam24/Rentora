import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID'], default: 'PAID' },
  orderStatus: { type: String, enum: ['PLACED', 'COMPLETED'], default: 'COMPLETED' }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
