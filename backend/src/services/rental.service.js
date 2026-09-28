import { Rental } from '../models/Rental.js';
import { Listing } from '../models/Listing.js';
import { checkDateOverlap } from '../utils/checkDateOverlap.js';
import { calculateRentalPrice } from '../utils/calculateRentalPrice.js';

export const createRental = async ({ listingId, renterId, startDate, endDate, phoneNumber }) => {
  if (!phoneNumber) {
    throw { statusCode: 400, message: 'Phone number is required' };
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw { statusCode: 404, message: 'Listing not found' };
  }

  if (listing.status !== 'ACTIVE') {
    throw { statusCode: 400, message: 'Listing is no longer available' };
  }

  if (!['RENT', 'RENT_AND_SALE'].includes(listing.transactionType)) {
    throw { statusCode: 400, message: 'This listing is not for rent' };
  }

  if (listing.ownerId.toString() === renterId.toString()) {
    throw { statusCode: 400, message: 'You cannot rent your own listing' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    throw { statusCode: 400, message: 'Start date cannot be in the past' };
  }
  if (start >= end) {
    throw { statusCode: 400, message: 'Start date must be before end date' };
  }

  const hasOverlap = await checkDateOverlap(listingId, start, end);
  
  if (hasOverlap) {
    throw { statusCode: 400, message: 'Selected dates are unavailable' };
  }

  let pricePerDay = listing.rentalPrice?.amount || 0;
  if (listing.rentalPrice?.unit === 'WEEK') {
    pricePerDay = pricePerDay / 7;
  } else if (listing.rentalPrice?.unit === 'MONTH') {
    pricePerDay = pricePerDay / 30;
  }

  const totalAmount = calculateRentalPrice(start, end, pricePerDay);

  const rental = new Rental({
    listingId,
    renterId,
    ownerId: listing.ownerId,
    startDate: start,
    endDate: end,
    totalAmount,
    securityDeposit: listing.securityDeposit || 0,
    phoneNumber,
    status: 'PENDING'
  });

  await rental.save();
  return rental;
};

export const acceptRental = async (rentalId, userId) => {
  const rental = await Rental.findById(rentalId);
  if (!rental) {
    throw { statusCode: 404, message: 'Rental request not found' };
  }

  if (rental.ownerId.toString() !== userId.toString()) {
    throw { statusCode: 403, message: 'Only the listing owner can accept the rental request' };
  }

  if (rental.status !== 'PENDING') {
    throw { statusCode: 400, message: 'Rental request has already been processed' };
  }

  const hasOverlap = await checkDateOverlap(rental.listingId, rental.startDate, rental.endDate);
  
  if (hasOverlap) {
    throw { statusCode: 400, message: 'Selected dates have become unavailable' };
  }

  const listing = await Listing.findById(rental.listingId);
  
  let pricePerDay = listing.rentalPrice?.amount || 0;
  if (listing.rentalPrice?.unit === 'WEEK') {
    pricePerDay = pricePerDay / 7;
  } else if (listing.rentalPrice?.unit === 'MONTH') {
    pricePerDay = pricePerDay / 30;
  }
  
  rental.totalAmount = calculateRentalPrice(rental.startDate, rental.endDate, pricePerDay);
  rental.status = 'CONFIRMED';
  
  listing.status = 'PAUSED';
  await listing.save();
  await rental.save();
  return rental;
};

export const rejectRental = async (rentalId, userId) => {
  const rental = await Rental.findById(rentalId);
  if (!rental) {
    throw { statusCode: 404, message: 'Rental request not found' };
  }

  if (rental.ownerId.toString() !== userId.toString()) {
    throw { statusCode: 403, message: 'Only the listing owner can reject the rental request' };
  }

  if (rental.status !== 'PENDING') {
    throw { statusCode: 400, message: 'Rental request has already been processed' };
  }

  rental.status = 'REJECTED';
  await rental.save();
  return rental;
};

export const cancelRental = async (rentalId, userId) => {
  const rental = await Rental.findById(rentalId);
  if (!rental) {
    throw { statusCode: 404, message: 'Rental request not found' };
  }

  if (rental.renterId.toString() !== userId.toString()) {
    throw { statusCode: 403, message: 'Only the renter can cancel the request' };
  }

  if (rental.status !== 'PENDING') {
    throw { statusCode: 400, message: 'Only pending requests can be cancelled' };
  }

  rental.status = 'CANCELLED';
  await rental.save();
  return rental;
};

export const completeRental = async (rentalId, userId) => {
  const rental = await Rental.findById(rentalId);
  if (!rental) {
    throw { statusCode: 404, message: 'Rental request not found' };
  }

  if (rental.ownerId.toString() !== userId.toString()) {
    throw { statusCode: 403, message: 'Only the listing owner can complete the rental' };
  }

  if (!['CONFIRMED', 'ACTIVE'].includes(rental.status)) {
    throw { statusCode: 400, message: 'Only confirmed or active rentals can be completed' };
  }

  rental.status = 'COMPLETED';
  await rental.save();
  return rental;
};

export const getMyRentals = async (userId) => {
  const rentals = await Rental.find({ renterId: userId })
    .populate('listingId', 'title images rentalPrice')
    .populate('ownerId', 'name email phone')
    .sort('-createdAt');
  return rentals;
};

export const getReceivedRentals = async (userId) => {
  const rentals = await Rental.find({ ownerId: userId })
    .populate('listingId', 'title images rentalPrice')
    .populate('renterId', 'name email phone')
    .sort('-createdAt');
  return rentals;
};

export const getRentalById = async (id) => {
  const rental = await Rental.findById(id)
    .populate('listingId')
    .populate('renterId', 'name email phone')
    .populate('ownerId', 'name email phone');
  if (!rental) {
    throw { statusCode: 404, message: 'Rental request not found' };
  }
  return rental;
};

export const getBookedDates = async (listingId) => {
  const rentals = await Rental.find({
    listingId,
    status: { $in: ['CONFIRMED', 'ACTIVE'] }
  }).select('startDate endDate');
  
  return rentals.map(r => ({ startDate: r.startDate, endDate: r.endDate }));
};
