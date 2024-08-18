import mongoose from "mongoose"

// Mongoose Booking Schema
// DONE: user
// DONE: property
// WORKING ON: status
const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property', // Reference to the Property model
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        // enum (mongoose property) restricting status field to these 3 values
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending',
    },
});

// setting up mongoose schema and model
const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
