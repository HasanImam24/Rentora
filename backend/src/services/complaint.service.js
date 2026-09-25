import { Complaint } from '../models/Complaint.js';
import { User } from '../models/User.js';
import { sendComplaintNotification } from './email.service.js';

export const createComplaint = async ({ userId, subject, description, priority }) => {
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  const ticketId = `TKT-${randomChars}`;

  const complaint = await Complaint.create({
    ticketId,
    userId,
    subject,
    description,
    priority
  });

  const user = await User.findById(userId);
  if (user) {
    await sendComplaintNotification({
      ticketId,
      userName: user.name,
      userEmail: user.email,
      subject,
      description,
      priority: complaint.priority
    });
  }

  return complaint;
};

export const getUserComplaints = async (userId) => {
  return await Complaint.find({ userId }).sort('-createdAt');
};

export const getAllComplaints = async (query) => {
  const { status, priority, page = 1, limit = 10 } = query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (page - 1) * limit;
  const complaints = await Complaint.find(filter)
    .populate('userId', 'name email phone')
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await Complaint.countDocuments(filter);
  return { complaints, total, page: Number(page), pages: Math.ceil(total / limit) };
};

export const respondToComplaint = async (complaintId, adminResponse, status) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) throw { statusCode: 404, message: 'Complaint not found' };

  complaint.adminResponse = adminResponse;
  if (status) complaint.status = status;
  await complaint.save();

  return complaint;
};
