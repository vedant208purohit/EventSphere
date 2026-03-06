import { Router } from 'express';
import { getAnalytics, getUsers, toggleBlockUser, getUserBookingHistory } from '../controllers/adminController';
import { protect, isAdmin } from '../middlewares/auth';

const router = Router();

router.use(protect, isAdmin);

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/toggle-block', toggleBlockUser);
router.get('/users/:id/bookings', getUserBookingHistory);

export default router;
