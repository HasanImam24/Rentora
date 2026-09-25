import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = express.Router();

router.use(authenticate, adminMiddleware);

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);

router.get('/listings', adminController.getAllListings);
router.patch('/listings/:id/status', adminController.updateListingStatus);

router.get('/complaints', adminController.getAllComplaints);
router.patch('/complaints/:id/respond', adminController.respondToComplaint);

export default router;
