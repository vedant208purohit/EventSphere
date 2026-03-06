import { Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { AuthRequest } from '../middlewares/auth';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(String(user._id)),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        if (user.isBlocked) {
            res.status(403).json({ message: 'Account has been blocked' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            token: generateToken(String(user._id)),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
