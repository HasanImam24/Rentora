import express from 'express';
import * as rentalController from '../controllers/rental.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', rentalController.createRental);
router.get('/', rentalController.getUserRentals);
router.get('/:id', rentalController.getRentalById);
router.patch('/:id/status', rentalController.updateRentalStatus);

export default router;
