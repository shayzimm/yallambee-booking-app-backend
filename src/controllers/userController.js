// Importing User from index.js
import { User } from '../models/index.js'
import Booking from '../models/Booking.js'
import { body, validationResult } from 'express-validator'
import sendEmail from '../services/sendEmail.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// CRUD operations for User
// DONE: getAllUsers/getUserByID - READ
// DONE: createUser - CREATE
// DONE: deleteUser - DELETE
// DOING: loginUser - for better functionality
// DOING: Better error handling, integrate validation and JWT for user/admin auth. 

// Middleware for validating user input
const validateUser = [
    // Checks if the email is valid
    body('email').isEmail().withMessage('Please provide a valid email'),
    // Ensures the username is a minimun of 3 characters
    // body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('firstName').isLength({ min: 3 }).withMessage('Must be at least 3 characters long'),
    // Ensures the last name is a minimun of 3 characters
    body('lastName').isLength({ min: 3 }).withMessage('Must be at least 3 characters long'),
    // Checks if the phone number is valid
    body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number'),
    // Ensures the password is a minimum of 6 characters
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    // Extra validation for date of birth
    body('dob').optional().isISO8601().toDate().withMessage('Please provide a valid date of birth')
];


// Create a new user
export const createUser = [
    // Validation of input - instance of fail will respond with a 400 status and validation errors
    ...validateUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, username, password, firstName, lastName, phone, dob, isAdmin } = req.body;

        try {
            // Checking if the email is already registered
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already registered' });
            }

            // Create a new user instance
            const newUser = new User({
                email,
                username,
                password, // Password hashing is done in userSchema (user model pre-save hook)
                firstName,
                lastName,
                phone,
                dob,
                isAdmin
            });

            // Save the user to the database
            await newUser.save();

            // Generate a JWT token for the new user, with expiry set to 1 hour
            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Send a welcome email to the new user
            await sendEmail(
                newUser.email, 
                'welcome', // Template key name from emailTemplates.js
                {
                    name: newUser.firstName // Passing the user’s first name to the template
                }
            );

            // Returning the new JWT token and user information for frontend to store in 'localStorage' or 'sessionStorage'
            res.status(201).json({
                message: 'User created successfully',
                token,
                user: newUser
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];

// Get all users
// Retrieves and returns all users from the database
export const getAllUsers =
    async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving users' });
        }
};

// Get a single user by ID
// Added protext middleware from auth
export const getUserById =
   async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (err) {
        res.status(500).json({ message: 'Error retrieving user' });
        }
};

// Get all bookings for a user by their ID
export const getBookingsByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        // Find all bookings associated with the user ID and populate the property details
        const bookings = await Booking.find({ user: id }).populate('property', 'name location');

        // If no bookings are found, return a 404 status with a message
        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }

        // Return the bookings with a 200 status
        res.status(200).json(bookings);
    } catch (error) {
        // Handle any errors during the database operation
        res.status(500).json({ message: error.message });
    }
};

// Update a user by ID
export const updateUser = [
    //Validation of input - instance of fail will respond with a 400 status and validation errors
    ...validateUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { email, username, password, firstName, lastName, phone, dob, isAdmin } = req.body;

        try {
            // If a new password is provided, it hashes it before updating
            const updateData = { email, username, firstName, lastName, phone, dob, isAdmin };
            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }
            //Updates the user by ID and returns the updated user
            const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!user) {
                // If user is not found 404 status is returned
                return res.status(404).json({ message: 'User not found' });
            }
            // Returns a 200 status with a confirmation message and the updated user
            res.status(200).json({ message: 'User updated successfully', user });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];

// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        // If user is not founf 404 status is returned
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

// User login
export const loginUser = [
    // validataion for email and password 
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        // If validation fails, 400 status is responded with validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Bcrypt is used to compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // if pass/hash valid, JWT is generated with user ID and admin status and expiry is set to 1hr.
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }
            );

            // 200 status is responded with success message and JWT token
            res.status(200).json({ message: 'Login successful', token });
        
        // Catch for invalid auth or an error, returns message with corresponding status code.
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
];

// Send email test function
export const testEmail = async (req, res) => {
    const testRecipient = req.body.email;

    try {
        await sendEmail(
            testRecipient, 
            'bookingConfirmation', // Template key name from emailTemplates.js
            {
                subject: 'Test Email from Yallambee',
                text: 'This is a test email to verify the email configuration.',
                html: '<p>This is a <strong>test email</strong> to verify the email configuration.</p>'
            }
        );
        res.status(200).send('Test email sent successfully');
    } catch (error) {
        console.error('Error sending test email:', error); // Logs error message
        res.status(500).send(`Failed to send test email: ${error.message}`);
    }
};

