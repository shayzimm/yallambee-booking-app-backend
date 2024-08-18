import express from 'express';
import { getProperties } from '../controllers/propertyController.js';

const router = express.Router();

// Get properties route
router.get('/', getProperties);

export default router;
