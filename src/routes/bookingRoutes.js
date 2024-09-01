import express from 'express';
import {
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    getUnavailableDates,
    createBookingByPropertyId,
    patchBooking
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

// Validation rules for partial PATCH updates
const validatePartialUpdate = [
    check('property', 'Property ID optional').optional(),
    check('startDate', 'Start date must be a valid date').optional().isDate(),
    check('endDate', 'End date must be a valid date').optional().isDate(),
    check('status', 'Booking status must be one of the following: Pending, Confirmed, Cancelled')
        .optional().isIn(['Pending', 'Confirmed', 'Cancelled'])
];

// Routes

// Get all bookings
// added protect middleware to auth logged in user
// added authoriseUser middleware to determine admin role
router.get('/booking', protect, authoriseUser('admin'), getBookings);

// Get a booking by ID
// added protect middleware to auth logged in user
router.get('/booking/:id', protect, getBookingById);

// Create a new booking (admin only)
// added protect middleware to auth logged in user
// added authoriseUser middleware to determine admin role booking creation only
// Bookings can be creatd by admins with another user's ID 
router.post('/booking', protect, authoriseUser, validateBooking, createBooking);

// Update a booking
// added protect middleware to auth logged in user
router.put('/booking/:id', protect, validateBooking, updateBooking);

// Delete a booking
// added protect middleware to auth logged in user
// added authoriseUser middleware to determine admin role
router.delete('/booking/:id', protect, authoriseUser('admin'), deleteBooking);

// Get unavailable dates for a specific property
router.get('/booking/:propertyId/unavailable-dates', getUnavailableDates);

// New route to create a booking by property ID
router.post('/booking/:propertyId', protect, createBookingByPropertyId);

// New PATCH route for partially updating a booking
router.patch('/booking/:id', protect, validatePartialUpdate, patchBooking);

export default router;
