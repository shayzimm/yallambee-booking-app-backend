import mongoose from 'mongoose';
import Booking from '../models/Booking';
import User from '../models/User';
import Property from '../models/Property';
import dotenv from 'dotenv';

dotenv.config();

const { DB_URI } = process.env;

beforeAll(async () => {
    await mongoose.connect(DB_URI);
});

afterEach(async () => {
    await Booking.deleteMany();
    await User.deleteMany();
    await Property.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Booking Model', () => {
    it('should create a booking with valid data', async () => {
        // Providing all required fields
        const user = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe'
        });

        const property = await Property.create({
            name: 'Test Property',
            description: 'Test Description',
            price: 100,
            location: { city: 'Test City', state: 'Test State' },
            maxPerson: 4, // Added maxPerson
            size: 50 // Added size
        });

        const booking = await Booking.create({
            user: user._id,
            property: property._id,
            startDate: new Date('2024-09-01'),
            endDate: new Date('2024-09-05'),
        });

        expect(booking).toHaveProperty('_id');
        expect(booking.status).toBe('Pending');
        expect(booking.startDate).toEqual(new Date('2024-09-01'));
        expect(booking.endDate).toEqual(new Date('2024-09-05'));
    });

    it('should not create a booking if the end date is before the start date', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe'
        });

        const property = await Property.create({
            name: 'Test Property',
            description: 'Test Description',
            price: 100,
            location: { city: 'Test City', state: 'Test State' },
            maxPerson: 4, // Added maxPerson
            size: 50 // Added size
        });

        await expect(Booking.create({
            user: user._id,
            property: property._id,
            startDate: new Date('2024-09-05'),
            endDate: new Date('2024-09-01'),
        })).rejects.toThrow('End date for booking must be at least one day after the start date.');
    });

    it('should not allow overlapping bookings for the same property', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe'
        });

        const property = await Property.create({
            name: 'Test Property',
            description: 'Test Description',
            price: 100,
            location: { city: 'Test City', state: 'Test State' },
            maxPerson: 4, // Added maxPerson
            size: 50 // Added size
        });

        await Booking.create({
            user: user._id,
            property: property._id,
            startDate: new Date('2024-09-01'),
            endDate: new Date('2024-09-05'),
        });

        await expect(Booking.create({
            user: user._id,
            property: property._id,
            startDate: new Date('2024-09-04'),
            endDate: new Date('2024-09-06'),
        })).rejects.toThrow('The property is already booked for the selected dates.');
    });

    it('should default the booking status to Pending', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe'
        });

        const property = await Property.create({
            name: 'Test Property',
            description: 'Test Description',
            price: 100,
            location: { city: 'Test City', state: 'Test State' },
            maxPerson: 4, // Added maxPerson
            size: 50 // Added size
        });

        const booking = await Booking.create({
            user: user._id,
            property: property._id,
            startDate: new Date('2024-09-01'),
            endDate: new Date('2024-09-05'),
        });

        expect(booking.status).toBe('Pending');
    });
});
