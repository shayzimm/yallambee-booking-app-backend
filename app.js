import express from 'express';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js';
import homeRoutes from './src/routes/homeRoutes.js';
import propertyRoutes from './src/routes/propertyRoutes.js';

const app = express();

// Connect to the MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/', homeRoutes);
app.use('/', userRoutes);
app.use('/', propertyRoutes);

export default app;


// Initialises the app, configures middleware, and sets up routes
