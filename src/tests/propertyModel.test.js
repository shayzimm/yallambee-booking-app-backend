import mongoose from 'mongoose';
import Property from '../models/Property';
import dotenv from 'dotenv';

dotenv.config();

const { DB_URI } = process.env;

beforeAll(async () => {
    await mongoose.connect(DB_URI);
});

afterEach(async () => {
    await Property.deleteMany();
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
            availability: [new Date('2024-09-01'), new Date('2024-09-02')],
            images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
            location: {
                city: 'Yallambee',
                state: 'NSW',
            },
            ageRestriction: 18,
        };

        const property = await Property.create(propertyData);

        expect(property).toHaveProperty('_id');
        expect(property.name).toBe(propertyData.name);
        expect(property.description).toBe(propertyData.description);
        expect(property.price).toBe(propertyData.price);
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

        await expect(Property.create(propertyData)).rejects.toThrow();
    });

    it('should not create a property with invalid availability dates', async () => {
        const propertyData = {
            name: 'Cozy Tiny Home',
            description: 'A charming and cozy tiny home perfect for a tranquil getaway.',
            price: 150,
            availability: ['invalid-date', new Date('2024-09-02')],
            images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
            location: {
                city: 'Yallambee',
                state: 'NSW',
            },
        };

        // Adjusted the expectation to catch the CastError instead
        await expect(Property.create(propertyData)).rejects.toThrow('Cast to [date] failed for value');
    });

    it('should not create a property with invalid image URLs', async () => {
        const propertyData = {
            name: 'Cozy Tiny Home',
            description: 'A charming and cozy tiny home perfect for a tranquil getaway.',
            price: 150,
            availability: [new Date('2024-09-01'), new Date('2024-09-02')],
            images: ['invalid-url', 'https://example.com/image2.jpg'],
            location: {
                city: 'Yallambee',
                state: 'NSW',
            },
        };

        await expect(Property.create(propertyData)).rejects.toThrow('Please provide valid image URLs');
    });

    it('should default ageRestriction to 18 if not provided', async () => {
        const propertyData = {
            name: 'Cozy Tiny Home',
            description: 'A charming and cozy tiny home perfect for a tranquil getaway.',
            price: 150,
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
