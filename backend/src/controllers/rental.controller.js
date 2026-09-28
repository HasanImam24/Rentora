import * as rentalService from '../services/rental.service.js';
import { sendSuccess } from '../utils/response.js';

export const createRental = async (req, res, next) => {
  try {
    const rentalData = { ...req.body, renterId: req.user._id };
    const rental = await rentalService.createRental(rentalData);
    return sendSuccess(res, 201, 'Rental created successfully', rental);
  } catch (error) {
    next(error);
  }
};

export const acceptRental = async (req, res, next) => {
  try {
    const rental = await rentalService.acceptRental(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Rental accepted successfully', rental);
  } catch (error) {
    next(error);
  }
};

export const rejectRental = async (req, res, next) => {
  try {
    const rental = await rentalService.rejectRental(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Rental rejected successfully', rental);
  } catch (error) {
    next(error);
  }
};

export const cancelRental = async (req, res, next) => {
  try {
    const rental = await rentalService.cancelRental(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Rental cancelled successfully', rental);
  } catch (error) {
    next(error);
  }
};

export const completeRental = async (req, res, next) => {
  try {
    const rental = await rentalService.completeRental(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Rental completed successfully', rental);
  } catch (error) {
    next(error);
  }
};

export const getMyRentals = async (req, res, next) => {
  try {
    const rentals = await rentalService.getMyRentals(req.user._id);
    return sendSuccess(res, 200, 'Rentals fetched successfully', rentals);
  } catch (error) {
    next(error);
  }
};

export const getReceivedRentals = async (req, res, next) => {
  try {
    const rentals = await rentalService.getReceivedRentals(req.user._id);
    return sendSuccess(res, 200, 'Received rentals fetched successfully', rentals);
  } catch (error) {
    next(error);
  }
};

export const getRentalById = async (req, res, next) => {
  try {
    const rental = await rentalService.getRentalById(req.params.id);
    return sendSuccess(res, 200, 'Rental fetched successfully', rental);
  } catch (error) {
    next(error);
  }
};

export const getBookedDates = async (req, res, next) => {
  try {
    const bookedDates = await rentalService.getBookedDates(req.params.listingId);
    return sendSuccess(res, 200, 'Booked dates fetched successfully', bookedDates);
  } catch (error) {
    next(error);
  }
};
