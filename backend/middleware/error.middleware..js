/**
 * Centralized Error Handling Middleware
 * 
 * This middleware provides comprehensive error handling for the PARMS application.
 * 
 * Security Considerations:
 * - Prevents PHI (Protected Health Information) exposure in error messages
 * - Sanitizes error responses in production
 * - Logs detailed errors server-side while sending safe messages to clients
 * - Handles various error types (validation, database, authentication, etc.)
 * 
 * HIPAA Compliance:
 * - Does not expose patient data in error messages
 * - Logs include user ID but not sensitive data
 * - Stack traces only sent in development mode
 * 
 * @module middleware/errorHandler
 */

import appConfig from '../config/index.js';

/**
 * Custom Application Error class
 * Extends Error to include HTTP status code and additional context
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * HTTP Status Codes
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Sanitize error message to prevent PHI exposure
 * Replaces potential sensitive information with generic messages
 * 
 * @param {string} message - Original error message
 * @returns {string} Sanitized message
 */
const sanitizeErrorMessage = (message) => {
  // Remove potential email addresses
  message = message.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email]');
  
  // Remove potential phone numbers
  message = message.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[phone]');
  
  // Remove potential SSN patterns
  message = message.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[ssn]');
  
  // Remove MongoDB ObjectIds
  message = message.replace(/\b[a-f0-9]{24}\b/gi, '[id]');
  
  return message;
};

/**
 * Log error details server-side
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 */
const logError = (err, req) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: err.message,
    statusCode: err.statusCode || 500,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: req.user?.id || 'unauthenticated',
    userAgent: req.get('user-agent'),
  };

  if (!appConfig.isProduction) {
    errorLog.stack = err.stack;
    errorLog.body = req.body;
    errorLog.query = req.query;
  }

  console.error('🚨 Error:', JSON.stringify(errorLog, null, 2));
};

/**
 * Handle Mongoose Validation Errors
 * 
 * @param {Error} err - Mongoose validation error
 * @returns {Object} Formatted error response
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((error) => ({
    field: error.path,
    message: error.message,
    value: error.value,
  }));

  return {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Validation failed',
    errors,
  };
};

/**
 * Handle Mongoose Duplicate Key Error
 * 
 * @param {Error} err - Mongoose duplicate key error
 * @returns {Object} Formatted error response
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  return {
    statusCode: HttpStatus.CONFLICT,
    message: `${field} already exists`,
    field,
  };
};

/**
 * Handle Mongoose Cast Error (Invalid ObjectId)
 * 
 * @param {Error} err - Mongoose cast error
 * @returns {Object} Formatted error response
 */
const handleCastError = (err) => {
  return {
    statusCode: HttpStatus.BAD_REQUEST,
    message: `Invalid ${err.path}: ${err.value}`,
    field: err.path,
  };
};

/**
 * Handle JWT Errors
 * 
 * @param {Error} err - JWT error
 * @returns {Object} Formatted error response
 */
const handleJWTError = (err) => {
  const messages = {
    JsonWebTokenError: 'Invalid authentication token',
    TokenExpiredError: 'Authentication token expired',
    NotBeforeError: 'Token not yet valid',
  };

  return {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: messages[err.name] || 'Authentication failed',
  };
};

/**
 * Main Error Handler Middleware
 * 
 * Handles all errors passed to next(error) in the application
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log error details server-side
  logError(err, req);

  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    const validationError = handleValidationError(err);
    error = { ...error, ...validationError };
  }

  if (err.code === 11000) {
    const duplicateError = handleDuplicateKeyError(err);
    error = { ...error, ...duplicateError };
  }

  if (err.name === 'CastError') {
    const castError = handleCastError(err);
    error = { ...error, ...castError };
  }

  if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(err.name)) {
    const jwtError = handleJWTError(err);
    error = { ...error, ...jwtError };
  }

  // Build response object
  const response = {
    success: false,
    statusCode: error.statusCode,
    message: appConfig.isProduction 
      ? sanitizeErrorMessage(error.message) 
      : error.message,
    timestamp: new Date().toISOString(),
  };

  // Add additional details in development
  if (!appConfig.isProduction) {
    response.stack = err.stack;
    response.details = error.details;
    response.errors = error.errors;
  }

  // Send response
  res.status(error.statusCode).json(response);
};

/**
 * Handle 404 - Not Found Errors
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route not found: ${req.method} ${req.originalUrl}`,
    HttpStatus.NOT_FOUND
  );
  next(error);
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors and pass to error middleware
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(users);
 * }));
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default errorHandler;
