import { Router } from 'express';
import { createOrder, verifyPayment, handleWebhook } from '../controllers/paymentController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', handleWebhook);

export default router;
