import * as orderService from '../services/order.service.js';
import { sendSuccess } from '../utils/response.js';

export const createOrder = async (req, res, next) => {
  try {
    const data = { ...req.body, buyerId: req.user._id };
    const order = await orderService.createOrder(data);
    sendSuccess(res, 201, 'Order created successfully', { order });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const role = req.query.role || 'buyer';
    const orders = await orderService.getUserOrders(req.user._id, role);
    sendSuccess(res, 200, 'Orders retrieved successfully', { orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    sendSuccess(res, 200, 'Order retrieved successfully', { order });
  } catch (error) {
    next(error);
  }
};
