import express from 'express';
import * as listingController from '../controllers/listing.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadImages } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', listingController.getAllListings);
router.get('/user/me', authenticate, listingController.getMyListings);
router.get('/:id', listingController.getListingById);

router.post('/', authenticate, uploadImages, listingController.createListing);
router.put('/:id', authenticate, listingController.updateListing);
router.delete('/:id', authenticate, listingController.deleteListing);

export default router;
