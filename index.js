import express from 'express'
import mongoose from 'mongoose'
import { body, validationResult } from 'express-validator'
import { UserSchema, User } from './db.js'



// Placeholder for properties listings
const properties = ['Yallambee', 'Coming Soon']

// Initializes Express app and sets up middleware to handle JSON requests
const app = express()
app.use(express.json())


// Routes

// Root route
app.get('/', (req, res) => res.send("<h1>Yallambee Tiny Homes</h1>"))

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Error retrieving users');
    }
});

// Get a single user by id
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err) {
        res.status(500).send('Error retrieving user');
    }
});

// Get properties
app.get('/properties', (req, res) => res.send(properties))

// Create a new user
// TO DO: 
// DONE: input validation for "username" "email" (express-validator)
// DONE: duplicate email check
// NEEDS: more error handling
app.post('/users',
    [
    // Validation requirements for input (user)
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
],
async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, username } = req.body

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).send('Email is already registered')
        }

        // Create a new user (.create - mongoose constructer)
        const newUser = await User.create({ email, username })
        // Responding to the client with the new entry and 201 code 
        res.status(201).send(newUser)
    } catch (err) {
        // Catch errors
        res.status(400).send({error: err.message})
    }
}
)

// delete a user by id
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
});

// Server - listening
app.listen(4001, err => {
    if (err) {
        console.error(err)
    } else {
        console.log('Server is listening on port 4001')
    }
})
