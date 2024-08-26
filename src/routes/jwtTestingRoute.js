import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const secretKey = process.env.JWT_SECRET; // Secret key

// JWT decode Testing Route
router.get('/test-jwt', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Token in the Authorization header

    if (!token) {
        return res.status(400).json({ message: 'Token is missing' });
    }

    try {
        // Decode and verify the token
        const decodedToken = jwt.verify(token, secretKey);
        // Console logging the decoded token
        console.log('Decoded Token:', decodedToken); 
        res.json({ message: 'Token decoded successfully', decodedToken });
    } catch (err) {
        console.error('Token decoding error:', err);
        res.status(401).json({ message: 'Invalid token', error: err.message });
    }
});

export default router;