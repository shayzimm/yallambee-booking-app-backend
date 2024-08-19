// Importing Booking from index.js
import { Booking } from '../models/index.js'

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
        // Basic error handling
        res.status(500).json({ message: error.message });
    }
};

// Get a booking by ID
export const getBookingById = async (req, res) => {
    try {
        // Find and populate the booking
        const booking = await Booking.findById(req.params.id).populate('user').populate('property');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        // Send the booking as JSON
        res.status(200).json(booking);
    } catch (error) {
        // Basic error handling
        res.status(500).json({ message: error.message });
    }
};

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        // Create a new booking instance
        const newBooking = new Booking(req.body);
        // Save the new booking to the database
        await newBooking.save();
        // Send the created booking as JSON
        res.status(201).json(newBooking);
    } catch (error) {
        // Basic error handling
        res.status(400).json({ message: error.message });
    }
};

// Update a booking
export const updateBooking = async (req, res) => {
    try {
        // Update the booking
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
        // Send the updated booking as JSON
        res.status(200).json(updatedBooking); 
    } catch (error) {
        // Basic error handling
        res.status(400).json({ message: error.message });
    }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
    try {
        // Delete the booking
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
        // Confirm deletion of booking
        res.status(200).json({ message: 'Booking deleted' });
    } catch (error) {
        // Basic error handling
        res.status(500).json({ message: error.message });
    }
};
