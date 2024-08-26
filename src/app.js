import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import testJwtRoute from './routes/jwtTestingRoute.js';

const app = express();

// Connect to the MongoDB
connectDB();

// Enable CORS
const corsOptions = {
  origin: '*', // CHANGE TO FRONTEND DOMAIN
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/', homeRoutes);
app.use('/', userRoutes); 
app.use('/', propertyRoutes);
app.use('/', bookingRoutes);

// Route to test the JWT is decoding properly
app.use('/', testJwtRoute)

export default app;
