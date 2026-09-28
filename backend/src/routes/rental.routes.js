import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as rentalController from '../controllers/rental.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/', rentalController.createRental);
router.get('/my', rentalController.getMyRentals);
router.get('/received', rentalController.getReceivedRentals);
router.get('/booked-dates/:listingId', rentalController.getBookedDates);
router.get('/:id', rentalController.getRentalById);
router.patch('/:id/accept', rentalController.acceptRental);
router.patch('/:id/reject', rentalController.rejectRental);
router.patch('/:id/cancel', rentalController.cancelRental);
router.patch('/:id/complete', rentalController.completeRental);

export default router;
