import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'
import { authoriseUser } from '../middleware/role.js';

const router = express.Router();

// Route to get all users
// Added protect middlware from auth.js to ensure auth of user
// added authroseUser middelware to determine admin role
// Tested with new middleware and all working as expected
router.get('/users', protect, authoriseUser('admin'), getAllUsers); 

// Route to get a single user by ID
// Added protect middlware from auth.js to ensure auth of user
// Tested with new middleware and all working as expected
router.get('/users/:id', protect, getUserById);

// Route to create a new user
router.post('/users', createUser);

// Route to update a user by ID
// Added protect middlware from auth.js to ensure auth of user
// Tested with new middleware and all working as expected
router.put('/users/:id', protect, updateUser);

// Route to delete a user by ID
// Added protect middlware from auth.js to ensure auth of user
// Tested with new middleware and all working as expected
router.delete('/users/:id', protect, deleteUser);

// Route to login a user
router.post('/login', loginUser);

export default router
