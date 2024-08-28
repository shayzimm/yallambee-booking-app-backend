// Importing Booking from index.js
import { Booking } from '../models/index.js';
import { validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js'; // Assuming you have JWT authentication middleware
import sendEmail from '../services/sendEmail.js'

// CRUD operations for Booking
// DONE: getBookings/getBookingById - READ
// DONE: createBooking - CREATE
// DONE: updateBooking - UPDATE
// DONE: deleteBooking - DELETE
// TO DO: Better error handling, integrate validation and JWT for user/admin auth. 

// Get all bookings
export const getBookings = async (req, res) => {
    try {
        // Populate references to User and Property
        const bookings = await Booking.find().populate('user').populate('property');
        // Send the bookings as JSON
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Unable to retrieve bookings' });
    }
};

// Get a booking by ID
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('user').populate('property');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Unable to retrieve the booking' });
    }
};

// Create a new booking
export const createBooking = [
    protect, // JWT authentication
    async (req, res) => {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Associate the booking with the logged-in user
            const newBooking = new Booking({
                ...req.body,
                user: req.user.id, // Associate with the authenticated user
            });
            await newBooking.save();

            // Extract start and end dates from the booking
            const { startDate, endDate } = newBooking;

            // Send "Booking Received" email to the user
            await sendEmail(req.user.email, 'bookingReceived', {
                // Variables needed for the template
                name: req.user.firstName, 
                bookingId: newBooking._id,
                // Should convert the dates to a readable format
                startDate: startDate.toLocaleDateString(), 
                endDate: endDate.toLocaleDateString(),
            });

            res.status(201).json(newBooking);
        } catch (error) {
            console.error('Error during booking creation:', error);
            res.status(400).json({ message: `Error: Unable to create booking. ${error.message}` });
        }
    }
];


// Update a booking
export const updateBooking = [
    protect, // JWT authentication
    async (req, res) => {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array()); // Debug validation errors
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            console.log('Updating booking with data:', req.body); // Debug request data
            const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });

            console.log('Booking updated:', updatedBooking); // Debug updated booking
            res.status(200).json(updatedBooking);


        } catch (error) {
            console.error('Error updating booking:', error); // Debug the error
            res.status(400).json({ message: 'Error: Unable to update booking' });
        }
    }
];

// Delete a booking
export const deleteBooking = [
    protect, // JWT authentication
    async (req, res) => {
        try {
            const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
            if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
            res.status(200).json({ message: 'Booking deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error: Unable to delete booking' });
        }
    }
];
