import * as listingService from '../services/listing.service.js';
import { sendSuccess } from '../utils/response.js';

export const createListing = async (req, res, next) => {
  try {
    const data = { ...req.body, ownerId: req.user._id };
    const listing = await listingService.createListing(data, req.files);
    sendSuccess(res, 201, 'Listing created successfully', { listing });
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const result = await listingService.getAllListings(req.query);
    sendSuccess(res, 200, 'Listings retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const listing = await listingService.getListingById(req.params.id);
    sendSuccess(res, 200, 'Listing retrieved successfully', { listing });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await listingService.updateListing(req.params.id, req.user._id, req.body);
    sendSuccess(res, 200, 'Listing updated successfully', { listing });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    await listingService.deleteListing(req.params.id, req.user._id);
    sendSuccess(res, 200, 'Listing deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getMyListings = async (req, res, next) => {
  try {
    const result = await listingService.getUserListings(req.user._id, req.query);
    sendSuccess(res, 200, 'User listings retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};
