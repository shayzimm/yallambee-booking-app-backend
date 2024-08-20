import mongoose from 'mongoose';
import { User, Property, Booking } from './src/models/index.js';
import connectDB from './src/config/db.js';

const users = [
    {
        username: 'johndoe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        dob: new Date('1996-05-15'),
    },
    {
        username: 'janesmith',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '9876543210',
        dob: new Date('1985-10-25'),
    },
];

const properties = [
    {
        name: 'Cozy Tiny Home',
        description: 'A charming and cozy tiny home perfect for a tranquil getaway.',
        price: 150,
        availability: [new Date('2024-09-01'), new Date('2024-09-02')],
        location: {
            city: 'Yallambee',
            state: 'NSW',
        },
        ageRestriction: 18, // Minimum age required to book
    },
];

const bookings = [
    {
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-09-02'),
        status: 'Confirmed'
    },
    {
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-10-03'),
        status: 'Pending'
    },
    {
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-11-20'),
        status: 'Cancelled'
    }
];

// Async function to seed the database
async function seedDatabase() {
    try {
        await connectDB(); // Ensure database is connected

        // Delete existing users, properties, and bookings
        await User.deleteMany();
        console.log('Deleted Users');

        const createdUsers = await User.insertMany(users);
        console.log('Added Users');

        await Property.deleteMany();
        console.log('Deleted Properties');

        const createdProperties = await Property.insertMany(properties);
        console.log('Added Properties');

        await Booking.deleteMany();
        console.log('Deleted Bookings');

        // Assign bookings to users and properties
        const bookingData = bookings.map((booking, index) => ({
            ...booking,
            user: createdUsers[index % createdUsers.length]._id, // Rotate through the created users
            property: createdProperties[index % createdProperties.length]._id // Rotate through the created properties
        }));

        await Booking.insertMany(bookingData);
        console.log('Added Bookings');

    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        // Close the database connection
        mongoose.disconnect();
    }
}

// Call the async function
seedDatabase();
