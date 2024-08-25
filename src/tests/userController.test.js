import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

jest.mock('../middleware/auth', () => {
  const mongoose = require('mongoose'); // Move import inside mock function
  return {
      protect: jest.fn((req, res, next) => {
          req.user = { id: new mongoose.Types.ObjectId(), isAdmin: true };
          next();
      }),
  };
});

describe('User Controller', () => {
    let user;

    beforeAll(async () => {
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
                phone: '0987654321',
                dob: '2000-01-01',
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
    });

    it('should get all users', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer token`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a user by ID', async () => {
        const response = await request(app)
            .get(`/users/${user._id}`)
            .set('Authorization', `Bearer token`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('email', 'testuser@example.com');
    });

    it('should update a user', async () => {
      // Create a user to be updated
      const user = await User.create({
          username: 'TestUser',
          email: 'initialuser@example.com',  // Use an initial unique email
          password: 'password123'
      });
  
      // Define the updated user data
      const updatedUserData = {
          firstName: 'Updated',
          lastName: 'User',
          email: 'updateduser@example.com',  // Use a different email to avoid duplication
          username: 'UpdatedUsername',
          password: 'newpassword123'  // Ensure this meets the validation criteria
      };
  
      // Attempt to update the user
      const response = await request(app)
          .put(`/users/${user._id}`)
          .send(updatedUserData)
          .set('Authorization', `Bearer token`);
  
      // Assert the response
      expect(response.statusCode).toBe(200);  // Expecting a 200 OK response
      expect(response.body.user).toHaveProperty('firstName', 'Updated');
  });    

    it('should delete a user', async () => {
        const response = await request(app)
            .delete(`/users/${user._id}`)
            .set('Authorization', `Bearer token`);

        expect(response.statusCode).toBe(204);
    });

    it('should login a user and return a JWT token', async () => {
      const user = await User.create({
          username: 'TestUser',
          email: 'testuser@example.com',
          password: 'password123'  // This password should match the one used in the login request
      });
  
      const loginData = {
          email: 'testuser@example.com',  // Ensure this matches the created user's email
          password: 'password123'  // Ensure this matches the created user's password
      };
  
      const response = await request(app)
          .post('/login')
          .send(loginData);
  
      expect(response.statusCode).toBe(200);  // Expecting a 200 OK response
      expect(response.body).toHaveProperty('token');  // Expecting a token in the response
  });  
});
