import * as rentalService from '../services/rental.service.js';
import { sendSuccess } from '../utils/response.js';

export const createRental = async (req, res, next) => {
  try {
    const data = { ...req.body, renterId: req.user._id };
    const rental = await rentalService.createRental(data);
    sendSuccess(res, 201, 'Rental created successfully', { rental });
  } catch (error) {
    next(error);
  }
};

export const getUserRentals = async (req, res, next) => {
  try {
    const role = req.query.role || 'renter';
    const rentals = await rentalService.getUserRentals(req.user._id, role);
    sendSuccess(res, 200, 'Rentals retrieved successfully', { rentals });
  } catch (error) {
    next(error);
  }
};

export const updateRentalStatus = async (req, res, next) => {
  try {
    const rental = await rentalService.updateRentalStatus(req.params.id, req.user._id, req.body.status);
    sendSuccess(res, 200, 'Rental status updated successfully', { rental });
  } catch (error) {
    next(error);
  }
};

export const getRentalById = async (req, res, next) => {
  try {
    const rental = await rentalService.getRentalById(req.params.id);
    sendSuccess(res, 200, 'Rental retrieved successfully', { rental });
  } catch (error) {
    next(error);
  }
};
