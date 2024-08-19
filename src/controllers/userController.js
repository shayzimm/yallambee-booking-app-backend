// Importing User from index.js
import { User } from '../models/index.js'
import { body, validationResult } from 'express-validator'
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
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
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

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new User({
                email,
                username,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                dob,
                isAdmin
            });

            await newUser.save();
            res.status(201).json({ message: 'User created successfully', user: newUser });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];

// Get all users
// Retrieves and returns all users from the database
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving users' });
    }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
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
                process.env.JWT_SECRET,  // Ensure this is set and not undefined
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