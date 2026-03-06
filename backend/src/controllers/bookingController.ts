import { Response } from 'express';
import { validationResult } from 'express-validator';
import Booking from '../models/Booking';
import Event from '../models/Event';
import { AuthRequest } from '../middlewares/auth';
import { generateQRCode } from '../utils/generateQR';

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { eventId, numberOfTickets } = req.body;
        const userId = req.user?._id;

        const event = await Event.findById(eventId);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        if (new Date(event.date) < new Date()) {
            res.status(400).json({ message: 'Event has already passed' });
            return;
        }

        if (event.availableSeats < numberOfTickets) {
            res.status(400).json({ message: `Only ${event.availableSeats} seats available` });
            return;
        }

        // Check duplicate pending booking
        const existingBooking = await Booking.findOne({
            userId,
            eventId,
            paymentStatus: 'pending',
        });
        if (existingBooking) {
            res.status(400).json({ message: 'You already have a pending booking for this event' });
            return;
        }

        const totalPrice = event.price * numberOfTickets;

        const qrData = JSON.stringify({
            eventId,
            userId,
            numberOfTickets,
            eventTitle: event.title,
            date: event.date,
        });
        const ticketQRCode = await generateQRCode(qrData);

        const booking = await Booking.create({
            userId,
            eventId,
            numberOfTickets,
            totalPrice,
            ticketQRCode,
        });

        // Reserve seats
        event.availableSeats -= numberOfTickets;
        await event.save();

        const populatedBooking = await Booking.findById(booking._id).populate('eventId');

        res.status(201).json(populatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserBookings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const bookings = await Booking.find({ userId: req.user?._id })
            .populate('eventId')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllBookings = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('eventId', 'title date location')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const booking = await Booking.findById(req.params.id).populate('eventId');
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        // Only allow cancellation if user owns it or is admin
        const isOwner = booking.userId.toString() === req.user?._id?.toString();
        const isAdminUser = req.user?.role === 'admin';
        if (!isOwner && !isAdminUser) {
            res.status(403).json({ message: 'Not authorized to cancel this booking' });
            return;
        }

        const event = await Event.findById(booking.eventId);
        if (event && new Date(event.date) < new Date()) {
            res.status(400).json({ message: 'Cannot cancel booking for past events' });
            return;
        }

        // Restore seats
        if (event) {
            event.availableSeats += booking.numberOfTickets;
            await event.save();
        }

        booking.paymentStatus = 'refunded';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
