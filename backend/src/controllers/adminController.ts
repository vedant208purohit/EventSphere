import { Response } from 'express';
import User from '../models/User';
import Event from '../models/Event';
import Booking from '../models/Booking';
import Payment from '../models/Payment';
import { AuthRequest } from '../middlewares/auth';

export const getAnalytics = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalEvents = await Event.countDocuments();
        const totalBookings = await Booking.countDocuments();

        const revenueResult = await Booking.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Revenue over time (last 12 months)
        const revenueOverTime = await Booking.aggregate([
            { $match: { paymentStatus: 'completed' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    revenue: { $sum: '$totalPrice' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 },
        ]);

        // Bookings per event (top 10)
        const bookingsPerEvent = await Booking.aggregate([
            {
                $group: {
                    _id: '$eventId',
                    totalBookings: { $sum: 1 },
                    totalTickets: { $sum: '$numberOfTickets' },
                    totalRevenue: { $sum: '$totalPrice' },
                },
            },
            { $sort: { totalBookings: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'events',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'event',
                },
            },
            { $unwind: '$event' },
            {
                $project: {
                    eventTitle: '$event.title',
                    totalBookings: 1,
                    totalTickets: 1,
                    totalRevenue: 1,
                },
            },
        ]);

        // User growth (last 6 months)
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 6 },
        ]);

        // Daily booking stats (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyBookings = await Booking.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({
            totalUsers,
            totalEvents,
            totalBookings,
            totalRevenue,
            revenueOverTime,
            bookingsPerEvent,
            userGrowth,
            dailyBookings,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const toggleBlockUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.role === 'admin') {
            res.status(400).json({ message: 'Cannot block admin users' });
            return;
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserBookingHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const bookings = await Booking.find({ userId: req.params.id })
            .populate('eventId', 'title date location price')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
