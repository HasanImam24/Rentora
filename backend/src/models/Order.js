import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  totalAmount: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  deliveryAddress: { type: String, default: '' },
  paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'], default: 'PENDING' }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
