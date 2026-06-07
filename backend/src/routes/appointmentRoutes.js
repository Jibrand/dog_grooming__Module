import express from 'express';
import { body } from 'express-validator';
import { 
  bookAppointment, 
  lookupAppointment, 
  cancelAppointment, 
  rescheduleAppointment, 
  getAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableSlots
} from '../controllers/appointmentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const validateBooking = [
  body('userName').notEmpty().withMessage('userName is required'),
  body('userPhone').notEmpty().withMessage('userPhone is required'),
  body('petName').notEmpty().withMessage('petName is required'),
  body('species').notEmpty().withMessage('species is required'),
  body('reason').notEmpty().withMessage('reason is required'),
  body('appointmentDate').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('appointmentDate must be in YYYY-MM-DD format'),
  body('appointmentTime').matches(/^\d{2}:\d{2}$/).withMessage('appointmentTime must be in HH:MM format'),
];

const validateReschedule = [
  body('newDate').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('newDate must be in YYYY-MM-DD format'),
  body('newTime').matches(/^\d{2}:\d{2}$/).withMessage('newTime must be in HH:MM format'),
];

// Public Routes (used by VAPI)
router.post('/book', validateBooking, bookAppointment);
router.get('/available-slots', getAvailableSlots);
router.get('/lookup', lookupAppointment); 
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/reschedule', validateReschedule, rescheduleAppointment);
router.get('/:id', getAppointment);

// Protected Routes (used by Dashboard)
router.get('/', requireAuth, getAllAppointments);
router.patch('/:id', requireAuth, updateAppointmentStatus);
router.delete('/:id', requireAuth, deleteAppointment);

export default router;
