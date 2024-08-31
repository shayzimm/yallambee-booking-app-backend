import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, Property, Booking } from './models/index.js';
import connectDB from './config/db.js';
import cloudinary from './config/cloudinaryConfig.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the current directory of the module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        images: [
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_360,h_234,g_auto/v1725096171/5d5e5a09-04e7-4e8d-9d0a-9a44940fe4c4_bterhw.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725096172/832ed347-0009-4ea3-8683-4e8aab0276ec_qiv8ta.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725096178/635155a4-7d20-44bd-8691-935cd57b74ba_etpguw.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725096171/86b12c08-40b3-439b-bba0-cabb453fc1bd_suszcy.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095437/yallamby110a7317_qenhso.jpg',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095437/yallamby110a9142_ujnzpb.jpg',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095440/yallamby110a9462_yfvmy0.jpg',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095439/yallamby110a9578_t5obgz.jpg',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095439/yallamby110a9578_t5obgz.jpg',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725096171/5d5e5a09-04e7-4e8d-9d0a-9a44940fe4c4_bterhw.webp'
        ]
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
        images: [
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_360,h_230,g_auto/v1725095296/sandhouse1_lpzxam.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095297/sandhouse2_nddave.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095297/sandhouse6_qqlxmz.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095296/sandhouse3_x3umfj.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095296/sandhouse5_clpqr5.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095297/sandhouse2_nddave.webp'
        ]
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
        images: [
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_360,h_230,g_auto/v1725095318/treehouse3_f7hxzt.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095317/treehouse1_rbooi1.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095318/treehouse4_sba8yv.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095318/treehouse2_q5rvng.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095319/treehouse6_mfdy9j.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095318/treehouse3_f7hxzt.webp',
            'https://res.cloudinary.com/dvqfuaqon/image/upload/c_fill,w_1300,h_600,g_auto/v1725095319/treehouse5_zcofxj.webp'          
        ]
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

// Function to upload an image to Cloudinary and get the URL
const uploadImage = async (imagePath) => {
    try {
        console.log(`Uploading image from ${imagePath}`);
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'yallambee_images',
        });
        console.log(`Image uploaded successfully: ${result.secure_url}`);

        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};

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

        // Upload images and add properties
        const propertiesWithUrls = await Promise.all(properties.map(async (property) => {
            if (property.imagePath) {
                property.imageUrl = await uploadImage(property.imagePath);
            }
            return property;
        }));

        const createdProperties = await Property.insertMany(propertiesWithUrls);
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
