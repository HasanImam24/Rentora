import express from 'express';
import * as complaintController from '../controllers/complaint.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', complaintController.createComplaint);
router.get('/', complaintController.getUserComplaints);
router.get('/:id', complaintController.getComplaintById);
router.delete('/:id', complaintController.deleteComplaint);

export default router;
