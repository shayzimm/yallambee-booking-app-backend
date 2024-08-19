import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    let token;

    // Check if the authorisation header exists and starts with "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token from the authorisation header
            token = req.headers.authorization.split(' ')[1];

            // Log the token for debugging purposes
            console.log('Token:', token);

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Log the decoded payload for debugging purposes
            console.log('Decoded payload:', decoded);

            // Attach the decoded user information to the request object
            req.user = decoded.user;

            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            console.error('Token verification failed:', err.message);
            res.status(401).json({ message: 'Token is not valid' });
        }
    } else {
        // If no token is found or the authorisation header is not present, return an error
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
