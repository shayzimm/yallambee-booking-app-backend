import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
} from '../controllers/userController.js'

const router = express.Router();

// Route to get all users
router.get('/users', getAllUsers);

// Route to get a single user by ID
router.get('/users/:id', getUserById);

// Route to create a new user
router.post('/users', createUser);

// Route to update a user by ID
router.put('/users/:id', updateUser);

// Route to delete a user by ID
router.delete('/users/:id', deleteUser);

// Route to login a user
router.post('/login', loginUser);

export default router
