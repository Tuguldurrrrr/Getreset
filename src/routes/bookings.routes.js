import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { listBookings, createBooking, updateBookingStatus, cancelBooking } from '../controllers/bookings.controller.js';

const router = Router();

router.get('/', authenticate, authorizeRoles('admin', 'manager', 'driver'), listBookings);
router.post('/', authenticate, authorizeRoles('customer', 'admin', 'manager'), createBooking);
router.patch('/:id/status', authenticate, authorizeRoles('admin', 'manager', 'driver'), updateBookingStatus);
router.post('/:id/cancel', authenticate, authorizeRoles('customer', 'admin'), cancelBooking);

export default router;
