import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getDashboardData);

export default router;
