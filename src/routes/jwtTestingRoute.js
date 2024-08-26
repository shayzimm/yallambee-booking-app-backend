import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Secret key
const secretKey = process.env.JWT_SECRET

// JWT decode Testing Route
router.get('/test-jwt', (req, res) => {
    // Token required in the authorization header
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(400).json({ message: 'Token is missing' });
    }

    try {
        // Decode and verify the token
        const decodedToken = jwt.verify(token, secretKey);

        // Extracts user ID from the decoded token
        const userId = decodedToken.id;

        // Console logging the decoded token
        console.log('Decoded Token:', decodedToken);

        // Should respond with success message, user ID, and the decoded token
        res.json({ message: 'Token decoded successfully', userId, decodedToken });
    } catch (err) {
        // Error if unable to decode
        console.error('Token decoding error:', err);
        res.status(401).json({ message: 'Invalid token', error: err.message });
    }
});

export default router;