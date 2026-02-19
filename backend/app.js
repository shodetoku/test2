/**
 * PARMS Backend Application
 * Patient Appointment and Record Management System
 * 
 * This is the main Express application file that configures middleware,
 * routes, error handling, and starts the server.
 * 
 * @module app
 */

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import net from 'net';
import appConfig from './config/index.js';
import connectToDatabase from './database/mongodb.js';
import errorHandler, { notFoundHandler } from './middleware/error.middleware..js';
import { auditLog } from './middleware/auditLog.middleware.js';

const app = express();

/**
 * Security Middleware
 * Applied before all other middleware for maximum protection
 */

// Helmet: Secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS: Configure cross-origin resource sharing
app.use(cors(appConfig.cors));

// Rate Limiting: Prevent abuse and DDoS attacks
const limiter = rateLimit({
  windowMs: appConfig.rateLimit.windowMs,
  max: appConfig.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for trusted IPs (optional)
  skip: (req) => {
    // Add trusted IP ranges here if needed
    return false;
  },
});

app.use('/api', limiter);

/**
 * Body Parser Middleware
 * Parse incoming request bodies
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Logging Middleware
 * HTTP request logging for debugging and monitoring
 */
if (appConfig.isDevelopment) {
  // Detailed logging in development
  app.use(morgan('dev'));
} else {
  // Concise logging in production
  app.use(morgan('combined'));
}

/**
 * Trust Proxy
 * Enable if behind a reverse proxy (nginx, load balancer)
 */
app.set('trust proxy', 1);

/**
 * Static Files
 * Serve frontend static assets
 */
app.use(express.static('public'));

/**
 * Health Check Endpoint
 * Used by load balancers and monitoring tools
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PARMS API is running',
    timestamp: new Date().toISOString(),
    environment: appConfig.env,
    uptime: process.uptime(),
  });
});

/**
 * API Routes
 * All API routes are prefixed with /api
 */

// Import route modules
import authRoutes from './routes/auth.route.js';
import prescriptionRoutes from './routes/prescription.route.js';
import userRoutes from './routes/user.route.js';

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to PARMS API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      prescriptions: '/api/prescriptions',
      users: '/api/users',
      patients: '/api/patients',
      doctors: '/api/doctors',
      appointments: '/api/appointments',
    },
  });
});

// Auth routes (with audit logging)
app.use('/api/auth', auditLog(), authRoutes);
// Prescription routes
app.use('/api/prescriptions', auditLog(), prescriptionRoutes);
// User routes
app.use('/api/users', auditLog(), userRoutes);

// TODO: Add more route modules here
// import patientRoutes from './routes/patients.js';
// import doctorRoutes from './routes/doctors.js';
// import appointmentRoutes from './routes/appointments.js';
// 
// app.use('/api/patients', authenticateJWT, auditLog(), patientRoutes);
// app.use('/api/doctors', authenticateJWT, auditLog(), doctorRoutes);
// app.use('/api/appointments', authenticateJWT, auditLog(), appointmentRoutes);

/**
 * Error Handling
 * Must be defined after all routes
 */

// Handle 404 - Route not found
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

/**
 * Check if a port is available
 * 
 * @param {number} port - Port to check
 * @returns {Promise<boolean>} True if port is available
 */
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
};

/**
 * Find an available port starting from the preferred port
 * 
 * @param {number} startPort - Preferred port to start checking from
 * @param {number} maxAttempts - Maximum number of ports to try
 * @returns {Promise<number>} Available port number
 */
const findAvailablePort = async (startPort, maxAttempts = 10) => {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found in range ${startPort}-${startPort + maxAttempts - 1}`);
};

/**
 * Start Server
 * Connect to database and start listening
 * Automatically finds an available port if the configured port is in use
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Check if configured port is available
    const preferredPort = appConfig.port;
    let actualPort = preferredPort;
    
    const portAvailable = await isPortAvailable(preferredPort);
    
    if (!portAvailable) {
      console.log(`Port ${preferredPort} is already in use. Finding alternative...`);
      actualPort = await findAvailablePort(preferredPort);
      console.log(`Found available port: ${actualPort}`);
    }
    
    // Start Express server on available port
    app.listen(actualPort, () => {
      console.log('=================================');
      console.log(`PARMS Backend Server Started`);
      console.log(`Environment: ${appConfig.env}`);
      console.log(`Port: ${actualPort}${actualPort !== preferredPort ? ` (configured: ${preferredPort})` : ''}`);
      console.log(`Database: Connected`);
      console.log(`Security: Enabled`);
      console.log(`Logging: ${appConfig.isDevelopment ? 'Development' : 'Production'} mode`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  if (appConfig.isProduction) {
    // In production, exit the process and let the process manager restart it
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();

export default app;