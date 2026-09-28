import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/my', orderController.getMyOrders);
router.get('/received', orderController.getReceivedOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/accept', orderController.acceptOrder);
router.patch('/:id/reject', orderController.rejectOrder);
router.patch('/:id/cancel', orderController.cancelOrder);
router.patch('/:id/complete', orderController.completeOrder);

export default router;
