import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  status: { type: String, enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  adminResponse: { type: String }
}, { timestamps: true });

export const Complaint = mongoose.model('Complaint', complaintSchema);
