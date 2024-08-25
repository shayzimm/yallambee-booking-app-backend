import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Entry point to start the server
