// Middleware for implementing admin only access for routes

export const authoriseUser = (requiredRole) => {
    return (req, res, next) => {
        // Ensuring that the required role is 'admin' and the user is not an admin
        if (requiredRole === 'admin' && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. You do not have permission.' });
        }
        next();
    };
};