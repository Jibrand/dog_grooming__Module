import express from 'express';
import { handleTwilioWebhook } from '../controllers/twilioController.js';

const router = express.Router();

router.post('/webhook', handleTwilioWebhook);

export default router;
