import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Listing } from '../models/Listing.js';

export const createOrder = async ({ listingId, buyerId, phoneNumber, deliveryAddress }) => {
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

  if (!['SALE', 'RENT_AND_SALE'].includes(listing.transactionType)) {
    throw { statusCode: 400, message: 'This listing is not for sale' };
  }

  if (listing.ownerId.toString() === buyerId.toString()) {
    throw { statusCode: 400, message: 'You cannot purchase your own listing' };
  }

  const order = new Order({
    listingId,
    buyerId,
    sellerId: listing.ownerId,
    totalAmount: listing.salePrice,
    phoneNumber,
    deliveryAddress,
    status: 'PENDING'
  });

  await order.save();
  return order;
};

export const acceptOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw { statusCode: 404, message: 'Order not found' };
  }

  if (order.sellerId.toString() !== userId.toString()) {
    throw { statusCode: 403, message: 'Only the listing owner can accept the order' };
  }

  if (order.status !== 'PENDING') {
    throw { statusCode: 400, message: 'Order has already been processed' };
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: order.listingId, status: 'ACTIVE' },
      { status: 'SOLD' },
      { new: true, session }
    );

    if (!listing) {
      throw { statusCode: 400, message: 'Listing is no longer available' };
    }

    order.status = 'ACCEPTED';
    await order.save({ session });

    await Order.updateMany(
      { listingId: order.listingId, _id: { $ne: orderId }, status: 'PENDING' },
      { status: 'CANCELLED' },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return order;
};

export const rejectOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw { statusCode: 404, message: 'Order not found' };
  }

  if (order.sellerId.toString() !== userId.toString()) {
    throw { statusCode: 403, message: 'Only the listing owner can reject the order' };
  }

  if (order.status !== 'PENDING') {
    throw { statusCode: 400, message: 'Order has already been processed' };
  }

  order.status = 'REJECTED';
  await order.save();
  return order;
};

export const cancelOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw { statusCode: 404, message: 'Order not found' };
  }

  if (order.buyerId.toString() !== userId.toString()) {
    throw { statusCode: 403, message: 'Only the buyer can cancel the order' };
  }

  if (order.status !== 'PENDING') {
    throw { statusCode: 400, message: 'Only pending orders can be cancelled' };
  }

  order.status = 'CANCELLED';
  await order.save();
  return order;
};

export const completeOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw { statusCode: 404, message: 'Order not found' };
  }

  if (order.sellerId.toString() !== userId.toString()) {
    throw { statusCode: 403, message: 'Only the listing owner can complete the order' };
  }

  if (order.status !== 'ACCEPTED') {
    throw { statusCode: 400, message: 'Order must be accepted before it can be completed' };
  }

  order.status = 'COMPLETED';
  await order.save();
  return order;
};

export const getMyOrders = async (userId) => {
  const orders = await Order.find({ buyerId: userId })
    .populate('listingId', 'title images salePrice')
    .populate('sellerId', 'name email phone')
    .sort('-createdAt');
  return orders;
};

export const getReceivedOrders = async (userId) => {
  const orders = await Order.find({ sellerId: userId })
    .populate('listingId', 'title images salePrice')
    .populate('buyerId', 'name email phone')
    .sort('-createdAt');
  return orders;
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate('listingId')
    .populate('buyerId', 'name email phone')
    .populate('sellerId', 'name email phone');
  if (!order) {
    throw { statusCode: 404, message: 'Order not found' };
  }
  return order;
};
