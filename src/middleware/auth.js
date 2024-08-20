import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // Check if auth header exists and starts with "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token from the auth header
            token = req.headers.authorization.split(' ')[1];

            // Log token for debugging purposes
            console.log('Token:', token);

            // Verify token using secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Log decoded payload for debugging purposes
            console.log('Decoded payload:', decoded);

            // Find user based on decoded id
            req.user = await User.findById(decoded.id).select('-password'); // Exclude the password

            // Check if user exists
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            console.error('Token verification failed:', err.message);
            res.status(401).json({ message: 'Token is not valid' });
        }
    } else {
        // If no token is found or the auth header is not present, return an error
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
