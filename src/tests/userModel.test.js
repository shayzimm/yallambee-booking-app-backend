import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Increase the timeout limit for Jest (default is 5000ms)
jest.setTimeout(30000);

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to the MongoDB Atlas cluster using the DB_URI environment variable
    await mongoose.connect(process.env.DB_URI);
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany();
  });

  afterAll(async () => {
    // Disconnect from MongoDB after all tests are done
    await mongoose.connection.close();
  });

  it('should create a user with valid data', async () => {
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      dob: new Date('1996-05-15'),
      password: 'password123',
    };

    const user = await User.create(userData);

    expect(user).toHaveProperty('_id');
    expect(user.username).toBe(userData.username);
  });

  it('should not create a user with an invalid email', async () => {
    const userData = {
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should require a unique email', async () => {
    const userData = {
      username: 'TestUser1',
      email: 'testuser1@example.com',
      password: 'password123',
    };

    await User.create(userData);

    await expect(
      User.create({
        username: 'TestUser2',
        email: 'testuser1@example.com',
        password: 'password456',
      })
    ).rejects.toThrow();
  });

  it('should hash the password before saving the user', async () => {
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);

    expect(user.password).not.toBe(userData.password); // Password should be hashed
    expect(await bcrypt.compare('password123', user.password)).toBe(true); // Compare using bcrypt
  });

  it('should not allow users under 18', async () => {
    const userData = {
      username: 'younguser',
      email: 'younguser@example.com',
      dob: new Date('2010-01-01'), // Under 18
      password: 'password123',
    };

    await expect(User.create(userData)).rejects.toThrow('User must be 18 or older');
  });

  it('should set isAdmin to false by default', async () => {
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);

    expect(user.isAdmin).toBe(false);
  });

  it('should not allow invalid phone numbers', async () => {
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      phone: 'invalid-phone', // Invalid phone number
      password: 'password123',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should correctly validate the user password', async () => {
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);
    const isValid = await bcrypt.compare('password123', user.password);

    expect(isValid).toBe(true);
  });
});
