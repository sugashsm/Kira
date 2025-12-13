import { Response } from 'express';
import { validationResult } from 'express-validator';
import Password from '../models/Password';
import { AuthRequest } from '../middleware/auth';

// Get all passwords for user
export const getPasswords = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const passwords = await Password.find({ userId: req.userId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: passwords.length,
            passwords,
        });
    } catch (error) {
        console.error('Get passwords error:', error);
        res.status(500).json({ message: 'Server error while fetching passwords' });
    }
};

// Get single password
export const getPassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const password = await Password.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!password) {
            res.status(404).json({ message: 'Password not found' });
            return;
        }

        res.json({
            success: true,
            password,
        });
    } catch (error) {
        console.error('Get password error:', error);
        res.status(500).json({ message: 'Server error while fetching password' });
    }
};

// Create new password
export const createPassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { encryptedData, iv, category, favorite } = req.body;

        const password = await Password.create({
            userId: req.userId,
            encryptedData,
            iv,
            category,
            favorite: favorite || false,
        });

        res.status(201).json({
            success: true,
            message: 'Password created successfully',
            password,
        });
    } catch (error) {
        console.error('Create password error:', error);
        res.status(500).json({ message: 'Server error while creating password' });
    }
};

// Update password
export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { encryptedData, iv, category, favorite } = req.body;

        const password = await Password.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { encryptedData, iv, category, favorite },
            { new: true, runValidators: true }
        );

        if (!password) {
            res.status(404).json({ message: 'Password not found' });
            return;
        }

        res.json({
            success: true,
            message: 'Password updated successfully',
            password,
        });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ message: 'Server error while updating password' });
    }
};

// Delete password
export const deletePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const password = await Password.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!password) {
            res.status(404).json({ message: 'Password not found' });
            return;
        }

        res.json({
            success: true,
            message: 'Password deleted successfully',
        });
    } catch (error) {
        console.error('Delete password error:', error);
        res.status(500).json({ message: 'Server error while deleting password' });
    }
};
