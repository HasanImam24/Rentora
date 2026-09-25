import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { Rental } from '../models/Rental.js';
import { Order } from '../models/Order.js';
import { Complaint } from '../models/Complaint.js';
import * as complaintService from '../services/complaint.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalListings, totalRentals, totalOrders, totalComplaints] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Rental.countDocuments(),
      Order.countDocuments(),
      Complaint.countDocuments()
    ]);
    sendSuccess(res, 200, 'Stats retrieved successfully', {
      totalUsers, totalListings, totalRentals, totalOrders, totalComplaints
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    
    const skip = (page - 1) * limit;
    const users = await User.find(filter).select('-passwordHash').skip(skip).limit(Number(limit));
    const total = await User.countDocuments(filter);
    
    sendSuccess(res, 200, 'Users retrieved successfully', { users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');
    
    user.isActive = !user.isActive;
    await user.save();
    
    sendSuccess(res, 200, 'User status updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    
    const skip = (page - 1) * limit;
    const listings = await Listing.find(filter).populate('ownerId', 'name email').skip(skip).limit(Number(limit));
    const total = await Listing.countDocuments(filter);
    
    sendSuccess(res, 200, 'Listings retrieved successfully', { listings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

export const updateListingStatus = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return sendError(res, 404, 'Listing not found');
    
    listing.status = req.body.status;
    await listing.save();
    
    sendSuccess(res, 200, 'Listing status updated successfully', { listing });
  } catch (error) {
    next(error);
  }
};

export const getAllComplaints = async (req, res, next) => {
  try {
    const result = await complaintService.getAllComplaints(req.query);
    sendSuccess(res, 200, 'Complaints retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const respondToComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.respondToComplaint(req.params.id, req.body.adminResponse, req.body.status);
    sendSuccess(res, 200, 'Complaint responded successfully', { complaint });
  } catch (error) {
    next(error);
  }
};
