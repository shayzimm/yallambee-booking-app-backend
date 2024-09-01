import mongoose from 'mongoose';
import Property from '../models/Property';
import User from '../models/User'; // Import User model
import Booking from '../models/Booking'; // Import Booking model
import dotenv from 'dotenv';

dotenv.config();

const { DB_URI } = process.env;

beforeAll(async () => {
    await mongoose.connect(DB_URI);
});

afterEach(async () => {
    await Property.deleteMany();
    await User.deleteMany(); // Ensure User is cleaned up
    await Booking.deleteMany(); // Ensure Booking is cleaned up
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Property Model', () => {
    it('should create a property with valid data', async () => {
        const propertyData = {
            name: 'Cozy Tiny Home',
            description: 'A charming and cozy tiny home perfect for a tranquil getaway.',
            price: 150,
            size: 25,
            maxPerson: 4,
            availability: [new Date('2024-09-01'), new Date('2024-09-02')],
            images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
            location: {
                city: 'Yallambee',
                state: 'NSW',
            },
        };

        const property = await Property.create(propertyData);

        expect(property).toHaveProperty('_id');
        expect(property.name).toBe(propertyData.name);
        expect(property.description).toBe(propertyData.description);
        expect(property.price).toBe(propertyData.price);
        expect(property.size).toBe(propertyData.size);
        expect(property.maxPerson).toBe(propertyData.maxPerson);
        expect(property.availability).toHaveLength(2);
        expect(property.images).toHaveLength(2);
        expect(property.location.city).toBe(propertyData.location.city);
        expect(property.location.state).toBe(propertyData.location.state);
        expect(property.ageRestriction).toBe(18);
    });

    it('should not create a property without a required field', async () => {
        const propertyData = {
            description: 'A charming and cozy tiny home perfect for a tranquil getaway.',
            price: 150,
            availability: [new Date('2024-09-01'), new Date('2024-09-02')],
            images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
            location: {
                city: 'Yallambee',
                state: 'NSW',
            },
        };

        await expect(Property.create(propertyData)).rejects.toHaveProperty('errors.size');
        await expect(Property.create(propertyData)).rejects.toHaveProperty('errors.maxPerson');
    });

    it('should not create a property with invalid availability dates', async () => {
        const propertyData = {
            name: 'Cozy Tiny Home',
            description: 'A charming and cozy tiny home perfect for a tranquil getaway.',
            price: 150,
            size: 25,
            maxPerson: 4,
            availability: ['invalid-date', new Date('2024-09-02')],
            images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
            location: {
                city: 'Yallambee',
                state: 'NSW',
            },
        };

        await expect(Property.create(propertyData)).rejects.toHaveProperty('errors');
    });

    it('should not create a property with invalid image URLs', async () => {
        const propertyData = {
            name: 'Cozy Tiny Home',
            description: 'A charming and cozy tiny home perfect for a tranquil getaway.',
            price: 150,
            size: 25,
            maxPerson: 4,
            availability: [new Date('2024-09-01'), new Date('2024-09-02')],
            images: ['invalid-url', 'https://example.com/image2.jpg'],
            location: {
                city: 'Yallambee',
                state: 'NSW',
            },
        };

        await expect(Property.create(propertyData)).rejects.toHaveProperty('errors.images');
    });

    it('should default ageRestriction to 18 if not provided', async () => {
        const propertyData = {
            name: 'Cozy Tiny Home',
            description: 'A charming and cozy tiny home perfect for a tranquil getaway.',
            price: 150,
            size: 25,
            maxPerson: 4,
            availability: [new Date('2024-09-01'), new Date('2024-09-02')],
            images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
            location: {
                city: 'Yallambee',
                state: 'NSW',
            },
        };

        const property = await Property.create(propertyData);

        expect(property.ageRestriction).toBe(18);
    });

    it('should not create a property with a negative price', async () => {
        const propertyData = {
            name: 'Cozy Tiny Home',
            description: 'A charming and cozy tiny home perfect for a tranquil getaway.',
            price: -50,
            size: 25,
            maxPerson: 4,
            availability: [new Date('2024-09-01'), new Date('2024-09-02')],
            images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
            location: {
                city: 'Yallambee',
                state: 'NSW',
            },
        };

        await expect(Property.create(propertyData)).rejects.toThrow();
    });
});