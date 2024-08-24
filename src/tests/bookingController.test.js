import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js'; // Adjust this path according to your setup
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Property from '../models/Property.js';

// Create a mock ObjectId
const mockUserId = new mongoose.Types.ObjectId();

jest.mock('../middleware/auth', () => ({
    protect: jest.fn((req, res, next) => {
        req.user = { id: mockUserId, isAdmin: true }; // Use the generated ObjectId for the user
        next();
    }),
}));

describe('Booking Controller', () => {
    let user;
    let property;

    beforeAll(async () => {
        // Create a mock user
        user = await User.create({
            _id: mockUserId, // Use the pre-generated ObjectId
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        // Create a mock property
        property = await Property.create({
            name: 'Test Property',
            description: 'A lovely test property.',
            price: 100,
            availability: ['2024-10-01', '2024-10-02'],
            location: { city: 'TestCity', state: 'TS' },
        });
    });

    afterAll(async () => {
        await Booking.deleteMany();
        await User.deleteMany();
        await Property.deleteMany();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Booking.deleteMany();
    });

    it('should create a new booking', async () => {
        const response = await request(app)
            .post('/booking')
            .send({
                property: property._id,
                startDate: '2024-12-01',
                endDate: '2024-12-05',
                status: 'Pending',
            })
            .set('Authorization', `Bearer token`);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('status', 'Pending');
        expect(response.body.user).toBe(mockUserId.toString()); // Ensure the user ID matches
    });

    it('should get all bookings', async () => {
        const response = await request(app)
            .get('/booking')
            .set('Authorization', `Bearer token`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a booking by ID', async () => {
        const booking = await Booking.create({
            user: user._id,
            property: property._id,
            startDate: '2024-12-01',
            endDate: '2024-12-05',
            status: 'Confirmed',
        });

        const response = await request(app)
            .get(`/booking/${booking._id}`)
            .set('Authorization', `Bearer token`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('status', 'Confirmed');
    });

    it('should update a booking', async () => {
      const booking = await Booking.create({
          user: user._id,
          property: property._id,
          startDate: '2024-12-01',
          endDate: '2024-12-05',
          status: 'Pending',
      });
  
      const bookingData = {
          property: booking.property,  // Use the existing property's ID
          startDate: '2024-12-01',
          endDate: '2024-12-06',  // Changing the end date
          status: 'Confirmed',
      };
  
      const response = await request(app)
          .put(`/booking/${booking._id}`)
          .send(bookingData)  // Ensure all required fields are sent
          .set('Authorization', `Bearer token`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('status', 'Confirmed');
      
      // Convert the response endDate to a simple date string for comparison
      const responseEndDate = new Date(response.body.endDate).toISOString().split('T')[0];
      expect(responseEndDate).toBe(bookingData.endDate);
  });    

    it('should delete a booking', async () => {
        const booking = await Booking.create({
            user: user._id,
            property: property._id,
            startDate: '2024-12-01',
            endDate: '2024-12-05',
            status: 'Pending',
        });

        const response = await request(app)
            .delete(`/booking/${booking._id}`)
            .set('Authorization', `Bearer token`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Booking deleted');
    });
});
