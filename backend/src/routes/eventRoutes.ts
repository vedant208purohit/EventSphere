import { Router } from 'express';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { protect, isAdmin } from '../middlewares/auth';
import { eventValidation } from '../middlewares/validate';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, isAdmin, eventValidation, createEvent);
router.put('/:id', protect, isAdmin, updateEvent);
router.delete('/:id', protect, isAdmin, deleteEvent);

export default router;
