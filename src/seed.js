import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, Property, Booking } from './models/index.js';
import connectDB from './config/db.js';

const users = [
    {
        username: 'johndoe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        dob: new Date('1996-05-15'),
        password: 'password',
    },
    {
        username: 'janesmith',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '9876543210',
        dob: new Date('1985-10-25'),
        password: 'password',
    },
    {
        username: 'Admin',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '1234567890',
        dob: new Date('1996-05-15'),
        password: 'admin123',
        isAdmin: true
    },
];

const properties = [
    {
        name: 'Off-Grid Getaway',
        description: 'Peaceful off-grid tiny home set alongside the Bolong River and amongst the rolling hills of Golspie.',
        price: 250,
        size: 45,
        maxPerson: 2,
        availability: [new Date('2024-09-01'), new Date('2024-09-02')],
        location: {
            city: 'Yallambee',
            state: 'NSW',
        },
        ageRestriction: 18,
    },
    {
        name: 'House Upon the Sand',
        description: '1920s cabin with a front-row seat to the grandeur of the Hood Canal.',
        price: 350,
        size: 60,
        maxPerson: 4,
        availability: [new Date('2024-09-01'), new Date('2024-09-02')],
        location: {
            city: 'Golspie',
            state: 'NSW',
        },
        ageRestriction: 18,
    },
    {
        name: 'Up Among the Treetops',
        description: 'Located in the heart of the forest, the perfect spot for a one-of-a-kind-getaway.',
        price: 300,
        size: 50,
        maxPerson: 3,
        availability: [new Date('2024-09-01'), new Date('2024-09-02')],
        location: {
            city: 'Crookwell',
            state: 'NSW',
        },
        ageRestriction: 18,
    }
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

// Function to hash passwords before seeding
const hashPasswords = async (users) => {
    const hashedUsers = await Promise.all(users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
    }));
    return hashedUsers;
};

// Async function to seed the database
async function seedDatabase() {
    try {
        await connectDB(); // Ensure database is connected

        // Hash the passwords for the users
        const usersWithHashedPasswords = await hashPasswords(users);

        // Delete existing users, properties, and bookings
        await User.deleteMany();
        console.log('Deleted Users');

        const createdUsers = await User.insertMany(usersWithHashedPasswords);
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
