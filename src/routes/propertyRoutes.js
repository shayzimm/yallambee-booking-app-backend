import express from 'express';
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';
import { authoriseUser } from '../middleware/role.js';

const router = express.Router();

// Routes

// Get all Properties
// Tested locally
router.get('/properties', getProperties);

// Get property by ID
// Tested locally
router.get('/properties/:id', getPropertyById);

// Create a new property
// added authroseUser middelware to determine admin role
// added protect middelware to auth logged in user
// Tested locally
router.post('/properties', protect, authoriseUser('admin'), createProperty); 

// Update proerty by ID
// added authroseUser middelware to determine admin role
// added protect middelware to auth logged in user
// Have been able to test them locally with added User related data 
// Tested locally
router.put('/properties/:id', protect, authoriseUser('admin'), updateProperty); 

// Delete property by ID
// added authroseUser middelware to determine admin role
// added protect middelware to auth logged in user
// Tested locally
router.delete('/properties/:id', deleteProperty);

export default router;
