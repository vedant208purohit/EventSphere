import { Router } from 'express';
import { createBooking, getUserBookings, getAllBookings, cancelBooking } from '../controllers/bookingController';
import { protect, isAdmin } from '../middlewares/auth';
import { bookingValidation } from '../middlewares/validate';

const router = Router();

router.post('/', protect, bookingValidation, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/admin', protect, isAdmin, getAllBookings);
router.delete('/:id', protect, cancelBooking);

export default router;
