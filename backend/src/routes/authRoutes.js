import express from 'express';
import { login, register, getProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
// The frontend calls /api/profile directly, but we can mount it here or in app.js
router.get('/profile', requireAuth, getProfile);

export default router;
