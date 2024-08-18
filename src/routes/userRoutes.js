import express from 'express';
import { getAllUsers, getUserById, createUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// Get all users
router.get('/users', getAllUsers);

// Get a single user by id
router.get('/users/:id', getUserById);

// Create a new user
router.post('/users', createUser);

// Delete a user by id
router.delete('/users/:id', deleteUser);

export default router;
