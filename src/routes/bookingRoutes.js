import express from 'express';
import {
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { authoriseUser } from '../middleware/role.js';
import { check } from 'express-validator';

const router = express.Router();

// Validation rules for creating and updating a booking
const validateBooking = [
    check('property', 'Property ID is required').not().isEmpty(),
    check('startDate', 'Start date is required').isDate(),
    check('endDate', 'End date is required').isDate(),
    check('status', 'Booking status is required').isIn(['Pending', 'Confirmed', 'Cancelled'])
];

// Routes

// Get all bookings
// added protect middleware to auth logged in user
// added authoriseUser middleware to determine admin role
router.get('/booking', protect, authoriseUser('admin'), getBookings);

// Get a booking by ID
// added protect middleware to auth logged in user
router.get('/booking/:id', protect, getBookingById);

// Create a new booking
// added protect middleware to auth logged in user
router.post('/booking', protect, validateBooking, createBooking);

// Update a booking
// added protect middleware to auth logged in user
router.put('/booking/:id', protect, validateBooking, updateBooking);

// Delete a booking
// added protect middleware to auth logged in user
// added authoriseUser middleware to determine admin role
router.delete('/booking/:id', protect, authoriseUser('admin'), deleteBooking);

export default router;
