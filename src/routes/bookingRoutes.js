import express from 'express';
import {
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
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
router.get('/booking', getBookings);

// Get a booking by ID
router.get('/booking/:id', getBookingById);

// Create a new booking
router.post('/booking', protect, validateBooking, createBooking);

// Update a booking
router.put('/booking/:id', protect, validateBooking, updateBooking);

// Delete a booking
router.delete('/booking/:id', protect, deleteBooking);

export default router;
