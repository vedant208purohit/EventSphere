import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middlewares/auth';
import { registerValidation, loginValidation } from '../middlewares/validate';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.get('/me', protect, getMe);

export default router;
