import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'


// environment variables
dotenv.config()


// Establishing Mongoose Connection
mongoose.connect(process.env.DB_URI)
    .then(m => console.log(m.connection.readyState == 1 ? 'Mongoose connected' : 'Mongoose failed to connect'))
    .catch(err => console.error(err))

// Mongoose User Schema
// DONE: age validation for user 18+
// DONE: implement length validation for username and email
// DONE: add phonenumber, firstname and lastname fields
// DONE: ensure email is unique to each user
// DONE: timestamp 'createdAt' 'updatedAt' to track user updates/creation
// WORKING ON: Set most field requirements to False for development purposes, need to ensure this is changed later on.
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // Min length for username
        minlength: 3,
        // Max length for username
        maxlength: 50,
        // Mongoose trim removes whitespace from beginning and end of string
        trim: true
    },
    email: {
        type: String,
        required: true,
        // Ensure the email is unique
        unique: true,
        // Mongoose match for regular expression
        // \S+@\S+\.\S+ matchcase for a typical email address format
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
        // Min length for email
        minlength: 5,
        // Max length for email
        maxlength: 100 
    },
    firstName: {
        type: String,
        required: false,
        trim: true
    },
    lastName: {
        type: String,
        required: false,
        trim: true
    },
    phone: {
        type: String,
        required: false,
        // Basic phone number validation setting 10-15 digits
        match: [/^\d{10,15}$/, 'Please provide a valid phone number'] 
    },
    dob: {
        type: Date,
        required: false,
        // Age validation so user must be 18+
        validate: {
            validator: function(value) {
                const today = new Date();
                const age = today.getFullYear() - value.getFullYear();
                return age >= 18;
            },
            message: 'User must be 18 or older'
        }
    }
}, {
    // Automatically adds time stamps createdAt and updatedAt for tracking
    timestamps: true 
});

// Added a pre save hook to hash passwords using bcrypt before saving the user to the database.
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// setting up mongoose schema and model
const User = mongoose.model('User', UserSchema);


// Property Schema
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

// booking schema
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


// Exporting
export {UserSchema, User, PropertySchema, Property, BookingSchema, Booking}