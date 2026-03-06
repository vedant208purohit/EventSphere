import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Event from '../models/Event';
import { AuthRequest } from '../middlewares/auth';

export const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            search,
            category,
            location,
            minPrice,
            maxPrice,
            startDate,
            endDate,
            page = '1',
            limit = '12',
            featured,
        } = req.query;

        const query: any = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }

        if (category) query.category = category;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (featured === 'true') query.isFeatured = true;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate as string);
            if (endDate) query.date.$lte = new Date(endDate as string);
        }

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const total = await Event.countDocuments(query);
        const events = await Event.find(query)
            .sort({ date: 1 })
            .skip(skip)
            .limit(limitNum);

        res.json({
            events,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const eventData = {
            ...req.body,
            availableSeats: req.body.totalSeats,
        };

        const event = await Event.create(eventData);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
