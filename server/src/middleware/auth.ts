import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'No token provided, authorization denied' });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };

        // Add user ID to request
        req.userId = decoded.userId;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
        } else if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token expired' });
        } else {
            res.status(500).json({ message: 'Server error during authentication' });
        }
    }
};
