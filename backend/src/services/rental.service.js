import { Rental } from '../models/Rental.js';
import { Listing } from '../models/Listing.js';
import { calculateRentalPrice } from '../utils/calculateRentalPrice.js';
import { checkDateOverlap } from '../utils/checkDateOverlap.js';

export const createRental = async ({ listingId, renterId, startDate, endDate }) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw { statusCode: 404, message: 'Listing not found' };
  if (listing.status !== 'ACTIVE') throw { statusCode: 400, message: 'Listing is not active' };
  if (!['RENT', 'RENT_AND_SALE'].includes(listing.transactionType)) throw { statusCode: 400, message: 'Listing is not available for rent' };
  if (listing.ownerId.toString() === renterId.toString()) throw { statusCode: 400, message: 'You cannot rent your own listing' };

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) throw { statusCode: 400, message: 'Start date cannot be in the past' };
  if (start >= end) throw { statusCode: 400, message: 'Start date must be before end date' };

  const overlap = await checkDateOverlap(listingId, startDate, endDate);
  if (overlap) throw { statusCode: 400, message: 'Listing is already rented for these dates' };

  let pricePerDay = listing.rentalPrice.amount;
  if (listing.rentalPrice.unit === 'WEEK') pricePerDay = pricePerDay / 7;
  if (listing.rentalPrice.unit === 'MONTH') pricePerDay = pricePerDay / 30;

  const totalAmount = calculateRentalPrice(startDate, endDate, pricePerDay);

  const rental = await Rental.create({
    listingId,
    renterId,
    ownerId: listing.ownerId,
    startDate,
    endDate,
    totalAmount,
    securityDeposit: listing.securityDeposit
  });

  return rental;
};

export const getUserRentals = async (userId, roleType = 'renter') => {
  const filter = roleType === 'owner' ? { ownerId: userId } : { renterId: userId };
  return await Rental.find(filter)
    .populate('listingId', 'title images')
    .populate(roleType === 'owner' ? 'renterId' : 'ownerId', 'name email phone')
    .sort('-createdAt');
};

export const updateRentalStatus = async (rentalId, userId, status) => {
  const rental = await Rental.findById(rentalId);
  if (!rental) throw { statusCode: 404, message: 'Rental not found' };
  if (rental.ownerId.toString() !== userId.toString()) throw { statusCode: 403, message: 'Not authorized to update this rental' };

  rental.status = status;
  await rental.save();
  return rental;
};

export const getRentalById = async (id) => {
  const rental = await Rental.findById(id)
    .populate('listingId')
    .populate('renterId', 'name email phone')
    .populate('ownerId', 'name email phone');
  if (!rental) throw { statusCode: 404, message: 'Rental not found' };
  return rental;
};
