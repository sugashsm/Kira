import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Register new user
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, masterPasswordHash, salt } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists with this email' });
            return;
        }

        // Hash the master password hash (double hashing for security)
        const hashedPassword = await bcrypt.hash(masterPasswordHash, 12);

        // Create new user
        const user = await User.create({
            email,
            masterPasswordHash: hashedPassword,
            salt,
        });

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
        const token = jwt.sign({ userId: user._id.toString() }, jwtSecret, {
            expiresIn: process.env.JWT_EXPIRE || '24h',
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                salt: user.salt,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login user
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, masterPasswordHash } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Verify password
        const isMatch = await bcrypt.compare(masterPasswordHash, user.masterPasswordHash);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
        const token = jwt.sign({ userId: user._id.toString() }, jwtSecret, {
            expiresIn: process.env.JWT_EXPIRE || '24h',
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                salt: user.salt,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Get current user
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId).select('-masterPasswordHash');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                salt: user.salt,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
