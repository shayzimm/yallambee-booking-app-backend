import express from 'express';
import { getHome } from '../controllers/homeController.js';

const router = express.Router();

// Root route
router.get('/', getHome);

export default router;
