import express from 'express';
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Routes
router.get('/properties', getProperties);
router.get('/properties/:id', getPropertyById);
router.post('/properties', protect, createProperty); // `protect` secures the route so only authenticated users (admin, hopefully) can create, update, delete - to test without, just remove :)
router.put('/properties/:id', protect, updateProperty); // have not been able to test with protect as user needs authentication and I didn't want to mess around with anything user-related! 
router.delete('/properties/:id', protect, deleteProperty);

export default router;
