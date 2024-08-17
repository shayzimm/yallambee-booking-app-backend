import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { body, validationResult } from 'express-validator'

// environment variables
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

// Mongoose User Schema
// TO DO: age validation for user 18+
// DONE: implement length validation for username and email
// DONE: add phonenumber, firstname and lastname fields
// DONE: ensure email is unique to each user
// DONE: timestamp 'createdAt' 'updatedAt' to track user updates/creation
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // Min length for username
        minlength: 3,
        // Max length for username
        maxlength: 50,
        // Mongoose trim removes whitespace from beginning and end of string
        trim: true
    },
    email: {
        type: String,
        required: true,
        // Ensure the email is unique
        unique: true,
        // Mongoose match for regular expression
        // \S+@\S+\.\S+ matchcase for a typical email address format
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
        // Min length for email
        minlength: 5,
        // Max length for email
        maxlength: 100 
    },
    firstName: {
        type: String,
        required: false,
        trim: true
    },
    lastName: {
        type: String,
        required: false,
        trim: true
    },
    phone: {
        type: String,
        required: false,
        // Basic phone number validation setting 10-15 digits
        match: [/^\d{10,15}$/, 'Please provide a valid phone number'] 
    },
    dob: {
        type: Date,
        required: false,
        validate: {
            validator: function(value) {
                const today = new Date();
                const age = today.getFullYear() - value.getFullYear();
                // Age validation so user must be 18+
                return age >= 18;
            },
            message: 'User must be 18 or older'
        }
    }
}, {
    // Automatically adds time stamps createdAt and updatedAt for tracking
    timestamps: true 
});

const User = mongoose.model('User', UserSchema);

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

app.listen(4001, err => {
    if (err) {
        console.error(err)
    } else {
        console.log('Server is listening on port 4001')
    }
})
