import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();

// Connect to the MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/', homeRoutes);
app.use('/', userRoutes); // Tested user routes locally 
app.use('/', propertyRoutes);
app.use('/', bookingRoutes);

export default app;


// Initialises the app, configures middleware, and sets up routes
