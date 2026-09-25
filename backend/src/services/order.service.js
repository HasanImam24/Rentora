import { Order } from '../models/Order.js';
import { Listing } from '../models/Listing.js';

export const createOrder = async ({ listingId, buyerId }) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw { statusCode: 404, message: 'Listing not found' };
  if (listing.status !== 'ACTIVE') throw { statusCode: 400, message: 'Listing is not active' };
  if (!['SALE', 'RENT_AND_SALE'].includes(listing.transactionType)) throw { statusCode: 400, message: 'Listing is not available for sale' };
  if (listing.ownerId.toString() === buyerId.toString()) throw { statusCode: 400, message: 'You cannot buy your own listing' };

  const price = listing.salePrice;
  const platformFee = 0; // Implement logic if needed
  const total = price + platformFee;

  const order = await Order.create({
    listingId,
    buyerId,
    sellerId: listing.ownerId,
    price,
    platformFee,
    total,
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED'
  });

  listing.status = 'SOLD';
  await listing.save();

  return order;
};

export const getUserOrders = async (userId, roleType = 'buyer') => {
  const filter = roleType === 'seller' ? { sellerId: userId } : { buyerId: userId };
  return await Order.find(filter)
    .populate('listingId', 'title images')
    .populate(roleType === 'seller' ? 'buyerId' : 'sellerId', 'name email phone')
    .sort('-createdAt');
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate('listingId')
    .populate('buyerId', 'name email phone')
    .populate('sellerId', 'name email phone');
  if (!order) throw { statusCode: 404, message: 'Order not found' };
  return order;
};
