import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { config } from './config/environment.js';
import { errorHandler } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import rentalRoutes from './routes/rental.routes.js';
import orderRoutes from './routes/order.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use('/api', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;
