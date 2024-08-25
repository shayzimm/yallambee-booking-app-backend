import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

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
        // Max length for emailcod
        maxlength: 100 
    },
    firstName: {
        type: String,
        required: false, // Temporarily set to false for development
        trim: true
    },
    lastName: {
        type: String,
        required: false, // Temporarily set to false for development
        trim: true
    },
    phone: {
        type: String,
        required: false, // Temporarily set to false for development
        // Basic phone number validation setting 10-15 digits
        match: [/^\d{10,15}$/, 'Please provide a valid phone number'] 
    },
    dob: {
        type: Date,
        required: false, // Temporarily set to false for development
        // Age validation so user must be 18+
        validate: {
            validator: function(value) {
                const today = new Date();
                const age = today.getFullYear() - value.getFullYear();
                return age >= 18;
            },
            message: 'User must be 18 or older'
        }
    },
    password: {
        type: String,
        required: false  // Temporarily set to false for development
    },
    isAdmin: {
        // Default to false for regular users
        type: Boolean,
        default: false
    }
}, {
    // Automatically adds createdAt and updatedAt fields
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

export default User;
