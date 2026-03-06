import { body } from 'express-validator';

export const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name must be at most 50 characters'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

export const eventValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be at least 1'),
];

export const bookingValidation = [
    body('eventId').notEmpty().withMessage('Event ID is required'),
    body('numberOfTickets').isInt({ min: 1, max: 10 }).withMessage('Number of tickets must be between 1 and 10'),
];
