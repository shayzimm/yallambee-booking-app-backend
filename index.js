import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

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

mongoose.connect(process.env.DB_URI)
    .then(m => console.log(m.connection.readyState == 1 ? 'Mongoose connected' : 'Mongoose failed to connect'))
    .catch(err => console.error(err))

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
app.post('/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).send(newUser)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

app.listen(4001, err => {
    if (err) {
        console.error(err)
    } else {
        console.log('Server is listening on port 4001')
    }
})
