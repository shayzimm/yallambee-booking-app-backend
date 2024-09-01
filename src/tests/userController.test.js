import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import cloudinary from '../config/cloudinaryConfig';
import upload from '../config/multerConfig.js';

// Mock middleware
jest.mock('../middleware/auth', () => {
  const mongoose = require('mongoose');
  return {
      protect: jest.fn((req, res, next) => {
          req.user = { id: new mongoose.Types.ObjectId(), isAdmin: true };
          next();
      }),
  };
});

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

describe('User Controller', () => {
    let user;

    beforeAll(async () => {
        await mongoose.connect(process.env.DB_URI);
        user = await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: await bcrypt.hash('password123', 10),
            firstName: 'Test',
            lastName: 'User',
            phone: '1234567890',
            dob: new Date('2000-01-01'),
            isAdmin: false,
        });
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    it('should create a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'newpassword',
                firstName: 'New',
                lastName: 'User',
                phone: '1234567890',
                dob: '2000-01-01',
            });

        console.log(response.body); // Log response body to debug

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
    });

    it('should return 400 for invalid user creation (missing required fields)', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                username: 'invaliduser',
                email: 'invaliduser@example.com',
                password: 'short',
                firstName: '',
                lastName: '',
                phone: 'invalidphone',
                dob: '2010-01-01',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should get all users', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer mocktoken`); // Use a mock token

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a user by ID', async () => {
        const response = await request(app)
            .get(`/users/${user._id}`)
            .set('Authorization', `Bearer mocktoken`); // Use a mock token

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('email', 'testuser@example.com');
    });

    it('should update a user', async () => {
        const updatedUserData = {
            firstName: 'Updated',
            lastName: 'User',
            email: 'updateduser@example.com',
            username: 'UpdatedUsername',
            password: 'newpassword123',
            phone: '1234567890',
            dob: '1995-01-01',
        };

        const response = await request(app)
            .put(`/users/${user._id}`)
            .send(updatedUserData)
            .set('Authorization', `Bearer mocktoken`); // Use a mock token

        expect(response.statusCode).toBe(200);
        expect(response.body.user).toHaveProperty('firstName', 'Updated');
        expect(response.body.user).toHaveProperty('email', 'updateduser@example.com');
    });

    it('should return 400 for invalid user update (invalid phone number)', async () => {
        const response = await request(app)
            .put(`/users/${user._id}`)
            .send({
                phone: 'invalidphone',
            })
            .set('Authorization', `Bearer mocktoken`); // Use a mock token

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should delete a user', async () => {
        const response = await request(app)
            .delete(`/users/${user._id}`)
            .set('Authorization', `Bearer mocktoken`); // Use a mock token

        expect(response.statusCode).toBe(204);
    });

    it('should login a user and return a JWT token', async () => {
        const loginData = {
            email: 'testuser@example.com',
            password: 'password123',
        };

        const response = await request(app)
            .post('/login')
            .send(loginData);

        console.log(response.body); // Log response body for debugging

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should return 404 for invalid login (user not found)', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'nonexistentuser@example.com',
                password: 'password123',
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 400 for invalid login (incorrect password)', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword',
            });

        console.log(response.body); // Log response body for debugging

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
});
