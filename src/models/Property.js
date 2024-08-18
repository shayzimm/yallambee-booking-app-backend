import mongoose from 'mongoose'

// Mongoose Property Schema
// DONE: name
// DONE: description
// DONE: price per night
// WORKING ON: Images, availability
const PropertySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    availability: {
        // TO DO: Array of dates when the property is available
        type: [Date],
        required: true,
    },
    images: {
        // TO DO: Array of image URLs
        type: [String],
        required: true,
    },
    location: {
        // Details about the property location
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        }
    },
    ageRestriction: {
        // Minimum age required to book this property
        type: Number,
        default: 18,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// setting up mongoose schema and model
const Property = mongoose.model('Property', PropertySchema);

export default Property;
