import mongoose from 'mongoose';

// Mongoose Booking Schema
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
        validate: {
            validator: function (value) {
                // Ensuring endDate is a valid date and is after startDate
                return value > this.startDate && (value - this.startDate) >= 24 * 60 * 60 * 1000; // 1 day in milliseconds
            },
            message: 'End date for booking must be at least one day after the start date.'
        }
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending',
    },
}, { timestamps: true }); // Adding timestamps to booking schema

// Pre-save hook to implement additional logic before saving
BookingSchema.pre('save', async function (next) {
    // Example: Check if the booking dates overlap with existing bookings for the same property
    const existingBookings = await mongoose.model('Booking').find({
        property: this.property,
        $or: [
            { startDate: { $lt: this.endDate, $gte: this.startDate } },
            { endDate: { $gt: this.startDate, $lte: this.endDate } },
        ]
    });

    if (existingBookings.length > 0) {
        return next(new Error('The property is already booked for the selected dates.'));
    }

    // Example logic to calculate the total price based on duration (optional)
    const daysBooked = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
    this.totalPrice = this.price * daysBooked;

    next();
});

// Setting up mongoose schema and model
const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
