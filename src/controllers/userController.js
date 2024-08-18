import User from '../models/User.js';
import { body, validationResult } from 'express-validator';

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Error retrieving users');
    }
};

// Get a single user by id
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err) {
        res.status(500).send('Error retrieving user');
    }
};

// Create a new user
export const createUser = [
    // Validation requirements for input (user)
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, username } = req.body;

        try {
            // Check if the email is already registered
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).send('Email is already registered');
            }

            // Create a new user (.create - mongoose constructor)
            const newUser = await User.create({ email, username });
            // Responding to the client with the new entry and 201 code
            res.status(201).send(newUser);
        } catch (err) {
            // Catch errors
            res.status(400).send({ error: err.message });
        }
    }
];

// Delete a user by id
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
};
