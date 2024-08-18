import express from 'express';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js';
import homeRoutes from './src/routes/homeRoutes.js';

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/', homeRoutes);
app.use('/', userRoutes);

export default app;


// Initialises the app, configures middleware, and sets up routes
