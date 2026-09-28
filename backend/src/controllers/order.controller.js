import * as orderService from '../services/order.service.js';
import { sendSuccess } from '../utils/response.js';

export const createOrder = async (req, res, next) => {
  try {
    const orderData = { ...req.body, buyerId: req.user._id };
    const order = await orderService.createOrder(orderData);
    return sendSuccess(res, 201, 'Order created successfully', order);
  } catch (error) {
    next(error);
  }
};

export const acceptOrder = async (req, res, next) => {
  try {
    const order = await orderService.acceptOrder(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Order accepted successfully', order);
  } catch (error) {
    next(error);
  }
};

export const rejectOrder = async (req, res, next) => {
  try {
    const order = await orderService.rejectOrder(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Order rejected successfully', order);
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Order cancelled successfully', order);
  } catch (error) {
    next(error);
  }
};

export const completeOrder = async (req, res, next) => {
  try {
    const order = await orderService.completeOrder(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Order completed successfully', order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user._id);
    return sendSuccess(res, 200, 'Orders fetched successfully', orders);
  } catch (error) {
    next(error);
  }
};

export const getReceivedOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getReceivedOrders(req.user._id);
    return sendSuccess(res, 200, 'Received orders fetched successfully', orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    return sendSuccess(res, 200, 'Order fetched successfully', order);
  } catch (error) {
    next(error);
  }
};
