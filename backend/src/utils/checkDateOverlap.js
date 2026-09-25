import { Rental } from '../models/Rental.js';

export const checkDateOverlap = async (listingId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const overlappingRentals = await Rental.find({
    listingId,
    status: { $in: ['CONFIRMED', 'ACTIVE'] },
    $or: [
      { startDate: { $lte: end }, endDate: { $gte: start } }
    ]
  });
  
  return overlappingRentals.length > 0;
};
