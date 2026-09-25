import * as complaintService from '../services/complaint.service.js';
import { sendSuccess } from '../utils/response.js';

export const createComplaint = async (req, res, next) => {
  try {
    const data = { ...req.body, userId: req.user._id };
    const complaint = await complaintService.createComplaint(data);
    sendSuccess(res, 201, 'Complaint created successfully', { complaint });
  } catch (error) {
    next(error);
  }
};

export const getUserComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintService.getUserComplaints(req.user._id);
    sendSuccess(res, 200, 'Complaints retrieved successfully', { complaints });
  } catch (error) {
    next(error);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    // Basic fetch by id - not specifically handled in service, adding inline for completeness
    const { Complaint } = await import('../models/Complaint.js');
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
       return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    // Verify ownership or admin
    if (complaint.userId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    sendSuccess(res, 200, 'Complaint retrieved successfully', { complaint });
  } catch (error) {
    next(error);
  }
};
