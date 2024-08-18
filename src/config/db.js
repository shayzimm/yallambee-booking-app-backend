import mongoose from 'mongoose';
import dotenv from 'dotenv';

// environment variables
dotenv.config();

// Establishing Mongoose Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

// Exporting
export default connectDB;
