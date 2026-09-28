import { Listing } from '../models/Listing.js';
import { uploadToCloudinary } from '../middleware/upload.middleware.js';
import cloudinary from '../config/cloudinary.js';

export const createListing = async (data, files) => {
  let images = [];
  if (files && files.length > 0) {
    const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, 'rentbuy/listings'));
    images = await Promise.all(uploadPromises);
  }

  const listing = await Listing.create({
    ...data,
    images
  });

  return listing;
};

export const getAllListings = async (query) => {
  const { category, transactionType, status, search, page = 1, limit = 10, sort = '-createdAt' } = query;
  
  let filter = {};
  if (category) filter.category = category;
  if (transactionType) {
    const type = transactionType.toUpperCase();
    if (type === 'RENT') {
      filter.transactionType = { $in: ['RENT', 'RENT_AND_SALE'] };
    } else if (type === 'SALE') {
      filter.transactionType = { $in: ['SALE', 'RENT_AND_SALE'] };
    } else {
      filter.transactionType = type;
    }
  }
  if (status) {
    filter.status = status;
  } else {
    filter.status = 'ACTIVE';
  }
  if (search) filter.title = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;
  const listings = await Listing.find(filter)
    .populate('ownerId', 'name email phone')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Listing.countDocuments(filter);

  return { listings, total, page: Number(page), pages: Math.ceil(total / limit) };
};

export const getListingById = async (id) => {
  const listing = await Listing.findById(id).populate('ownerId', 'name email phone');
  if (!listing) throw { statusCode: 404, message: 'Listing not found' };
  return listing;
};

export const updateListing = async (id, userId, data) => {
  const listing = await Listing.findById(id);
  if (!listing) throw { statusCode: 404, message: 'Listing not found' };
  if (listing.ownerId.toString() !== userId.toString()) throw { statusCode: 403, message: 'Not authorized to update this listing' };

  Object.assign(listing, data);
  await listing.save();
  return listing;
};

export const deleteListing = async (id, userId) => {
  const listing = await Listing.findById(id);
  if (!listing) throw { statusCode: 404, message: 'Listing not found' };
  if (listing.ownerId.toString() !== userId.toString()) throw { statusCode: 403, message: 'Not authorized to delete this listing' };

  if (listing.images && listing.images.length > 0) {
    for (const image of listing.images) {
      if (image.publicId) await cloudinary.uploader.destroy(image.publicId);
    }
  }

  await Listing.findByIdAndDelete(id);
  return { success: true };
};

export const getUserListings = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const listings = await Listing.find({ ownerId: userId })
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit));

  const total = await Listing.countDocuments({ ownerId: userId });

  return { listings, total, page: Number(page), pages: Math.ceil(total / limit) };
};
