import express from 'express';
import { getLeads, getLeadAppointments, deleteLead } from '../controllers/leadController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getLeads);
router.get('/:id/appointments', requireAuth, getLeadAppointments);
router.delete('/:id', requireAuth, deleteLead);

export default router;
