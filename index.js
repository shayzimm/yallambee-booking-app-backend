import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { body, validationResult } from 'express-validator'

// env config
dotenv.config()
     

const users = [
    {
        id: 1,
        username: 'johndoe',
        email: 'john.doe@example.com'
    },
    {
        id: 2,
        username: 'jane.smith',
        email: 'jane.smith@example.com'
    }
]

const properties = ['Yallambee', 'Coming Soon']

// Mongoose Connection
mongoose.connect(process.env.DB_URI)
    .then(m => console.log(m.connection.readyState == 1 ? 'Mongoose connected' : 'Mongoose failed to connect'))
    .catch(err => console.error(err))

// Mongoose Schema
// TO DO: age validation for user 18+
const User = mongoose.model('User', {
    username: {type: String, required: true},
    email: {type: String, required: true}
})

const app = express()

// Middleware
app.use(express.json())

app.get('/', (req, res) => res.send("<h1>Yallambee Tiny Homes</h1>"))

app.get('/users', (req, res) => res.send(users))

app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id))
    if (!user) {
        return res.status(404).send('User not found')
    }
    res.send(user)
})

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
    body('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
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
        // Catch all Errors
        res.status(500).send('Server error')
    }
}
)

app.listen(4001, err => {
    if (err) {
        console.error(err)
    } else {
        console.log('Server is listening on port 4001')
    }
})
