export const authoriseUser = (requiredRole) => {
    return (req, res, next) => {
        // Check if req.user is defined
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, token failed or missing' });
        }

        // Ensuring that the required role is 'admin' and the user is not an admin
        if (requiredRole === 'admin' && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. You do not have permission.' });
        }

        next();
    };
};

