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
        // Booking start date
        type: Date,
        required: true,
    },
    endDate: {
        // Booking end date
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                // Ensuring the endDate is at least 1 day after the startDate
                return value > this.startDate && (value - this.startDate) >= 24 * 60 * 60 * 1000; // 1 day in milliseconds
            },
            message: "End date for booking must be at least one day after the start date."
        }
    },
    status: {
        type: String,
        // enum (mongoose property) restricting status field to these 3 values
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending',
    },
}, { timestamps: true }); // Adding timestamps to booking schema

// setting up mongoose schema and model
const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
