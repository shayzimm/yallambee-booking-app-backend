import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js'; 
import Property from '../models/Property.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import cloudinary from '../config/cloudinaryConfig';
import upload from '../config/multerConfig.js';

dotenv.config();

const { DB_URI } = process.env;

// Create a mock ObjectId
const mockUserId = new mongoose.Types.ObjectId();

jest.mock('../middleware/auth', () => ({
    protect: jest.fn((req, res, next) => {
        req.user = { id: mockUserId, isAdmin: true }; // Use the generated ObjectId for the user
        next();
    }),
}));

// Mocking cloudinary and nodemailer
jest.mock('cloudinary', () => ({
    v2: {
      config: jest.fn(),
      uploader: {
        upload: jest.fn().mockResolvedValue({}),
      },
    },
  }));
  
  jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
      verify: jest.fn().mockResolvedValue(true),
    }),
}));
  
  // Mocking multerConfig.js
  jest.mock('../config/multerConfig.js', () => ({
    single: jest.fn(),
}));

jest.mock('../middleware/role', () => ({
    authoriseUser: jest.fn((role) => (req, res, next) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden' });
    }),
}));

beforeAll(async () => {
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await Property.deleteMany();
    await User.deleteMany();
    await mongoose.connection.close();
});

beforeEach(async () => {
    await Property.deleteMany();

    // Creating a mock property
    property = await Property.create({
        name: 'Test Property',
        description: 'A lovely test property.',
        price: 100,
        size: 25,
        maxPerson: 4,
        availability: [new Date('2024-10-01'), new Date('2024-10-02')],
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        location: { city: 'TestCity', state: 'TS' },
    });
});

describe('Property Controller', () => {
    it('should create a new property', async () => {
        const newProperty = {
            name: 'Another Property',
            description: 'Another lovely property.',
            price: 150,
            maxPerson: 4,
            size: 30,
            availability: [new Date('2024-11-01'), new Date('2024-11-02')],
            images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
            location: { city: 'AnotherCity', state: 'AC' },
        };

        const response = await request(app)
            .post('/properties')
            .send(newProperty)
            .set('Authorization', `Bearer token`); // Mock token or valid token

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('name', 'Another Property');
    });

    it('should get all properties', async () => {
        const response = await request(app)
            .get('/properties')
            .set('Authorization', `Bearer token`); // Mock token or valid token

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a property by ID', async () => {
        const response = await request(app)
            .get(`/properties/${property._id}`)
            .set('Authorization', `Bearer token`); // Mock token or valid token

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', property._id.toString());
        expect(response.body).toHaveProperty('name', 'Test Property');
    });

    it('should update a property', async () => {
        const updatedPropertyData = {
            name: 'Updated Property',
            description: 'An updated test property.',
            price: 200,
        };

        const response = await request(app)
            .put(`/properties/${property._id}`)
            .send(updatedPropertyData)
            .set('Authorization', `Bearer token`); // Mock token or valid token

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('name', 'Updated Property');
        expect(response.body).toHaveProperty('price', 200);
    });

    it('should delete a property', async () => {
        const response = await request(app)
            .delete(`/properties/${property._id}`)
            .set('Authorization', `Bearer token`); // Mock token or valid token

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Property deleted successfully');

        const findProperty = await Property.findById(property._id);
        expect(findProperty).toBeNull();
    });
});