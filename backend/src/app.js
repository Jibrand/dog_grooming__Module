import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import appointmentRoutes from './routes/appointmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import twilioRoutes from './routes/twilioRoutes.js';
import clinicRoutes from './routes/clinicRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { getProfile } from './controllers/authController.js';
import { requireAuth } from './middleware/auth.js';

const app = express();

// Trust the proxy (required for express-rate-limit when using Ngrok/VAPI)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());

// CORS Configuration - allow all for frontend integration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to all API routes
// app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.get('/api/profile', requireAuth, getProfile);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/twilio', twilioRoutes);
app.use('/api/clinic', clinicRoutes);
app.use('/api/upload', uploadRoutes);

// Vapi Tool Server routes
app.use('/tool', toolRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    data: null,
    errorCode: "NOT_FOUND"
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
