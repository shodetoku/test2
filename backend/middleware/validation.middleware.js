/**
 * Request Validation Middleware
 * 
 * Provides Joi-based validation middleware for request body, query, and params.
 * 
 * Features:
 * - Validates request data against Joi schemas
 * - Sanitizes input data
 * - Provides clear validation error messages
 * - Strips unknown fields for security
 * 
 * Security:
 * - Prevents injection attacks through input validation
 * - Strips unknown fields to prevent mass assignment
 * - Validates data types to prevent type confusion attacks
 * 
 * @module middleware/validation
 */

import Joi from 'joi';
import { AppError, HttpStatus } from './error.middleware..js';

/**
 * Common Joi validation schemas
 * Reusable validation rules for common fields
 */
export const commonSchemas = {
  // MongoDB ObjectId validation
  objectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid ID format'),

  // Email validation
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .max(255)
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),

  // Password validation (strong password requirements)
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),

  // Phone number validation (US format)
  phone: Joi.string()
    .pattern(/^\+?1?\d{10}$/)
    .message('Please provide a valid phone number'),

  // Date validation
  date: Joi.date()
    .iso()
    .messages({
      'date.format': 'Date must be in ISO format',
    }),

  // Pagination
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  },
};

/**
 * Validation middleware factory
 * Creates a middleware function that validates request data against a Joi schema
 * 
 * @param {Object} schema - Joi validation schema
 * @param {string} source - Source of data to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 * 
 * @example
 * import { validate, commonSchemas } from './middleware/validation.js';
 * 
 * const loginSchema = Joi.object({
 *   email: commonSchemas.email,
 *   password: Joi.string().required(),
 * });
 * 
 * router.post('/login', validate(loginSchema), authController.login);
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    // Validate the specified source
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
      errors: {
        wrap: {
          label: '', // Don't wrap field names in quotes
        },
      },
    });

    if (error) {
      // Format validation errors
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type,
      }));

      return next(
        new AppError(
          'Validation failed',
          HttpStatus.BAD_REQUEST,
          true,
          errors
        )
      );
    }

    // Replace request data with validated and sanitized value
    req[source] = value;
    next();
  };
};

/**
 * Validate multiple sources (body, query, params)
 * 
 * @param {Object} schemas - Object with schemas for different sources
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.get('/users/:id', 
 *   validateMultiple({
 *     params: Joi.object({ id: commonSchemas.objectId }),
 *     query: Joi.object(commonSchemas.pagination),
 *   }),
 *   userController.getUser
 * );
 */
export const validateMultiple = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    // Validate each source
    ['body', 'query', 'params'].forEach((source) => {
      if (schemas[source]) {
        const { error, value } = schemas[source].validate(req[source], {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          errors.push(
            ...error.details.map((detail) => ({
              source,
              field: detail.path.join('.'),
              message: detail.message,
              type: detail.type,
            }))
          );
        } else {
          req[source] = value;
        }
      }
    });

    if (errors.length > 0) {
      return next(
        new AppError(
          'Validation failed',
          HttpStatus.BAD_REQUEST,
          true,
          errors
        )
      );
    }

    next();
  };
};

/**
 * Sanitize input to prevent XSS and injection attacks
 * 
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim();
};

/**
 * Common validation schemas for healthcare data
 */
export const healthcareSchemas = {
  // Patient name validation
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .pattern(/^[a-zA-Z\s'-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes',
    }),

  // Medical Record Number (MRN)
  mrn: Joi.string()
    .pattern(/^[A-Z0-9]{6,12}$/)
    .uppercase()
    .trim()
    .messages({
      'string.pattern.base': 'Medical Record Number must be 6-12 alphanumeric characters',
    }),

  // Insurance Policy Number
  insurancePolicy: Joi.string()
    .pattern(/^[A-Z0-9-]{8,20}$/)
    .uppercase()
    .trim(),

  // Date of Birth
  dateOfBirth: Joi.date()
    .max('now')
    .min('1900-01-01')
    .required()
    .messages({
      'date.max': 'Date of birth cannot be in the future',
      'date.min': 'Please provide a valid date of birth',
    }),

  // Gender
  gender: Joi.string()
    .valid('male', 'female', 'other', 'prefer-not-to-say')
    .required(),

  // Blood Type
  bloodType: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'),

  // Address
  address: Joi.object({
    street: Joi.string().max(255).trim().required(),
    city: Joi.string().max(100).trim().required(),
    state: Joi.string().length(2).uppercase().required(),
    zipCode: Joi.string()
      .pattern(/^\d{5}(-\d{4})?$/)
      .required()
      .messages({
        'string.pattern.base': 'ZIP code must be in format 12345 or 12345-6789',
      }),
  }),
};

/**
 * Prescription Validation Schemas
 */
export const prescriptionSchemas = {
  // Create prescription
  create: Joi.object({
    patientId: commonSchemas.objectId.required(),
    providerId: commonSchemas.objectId,  // Optional for doctors (auto-filled)
    medication: Joi.string()
      .trim()
      .min(2)
      .max(200)
      .required()
      .messages({
        'string.min': 'Medication name must be at least 2 characters',
        'any.required': 'Medication name is required',
      }),
    dosage: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'any.required': 'Dosage is required',
      }),
    frequency: Joi.string()
      .trim()
      .min(2)
      .max(200)
      .required()
      .messages({
        'any.required': 'Frequency is required',
      }),
    startDate: Joi.date()
      .iso()
      .required()
      .messages({
        'any.required': 'Start date is required',
      }),
    endDate: Joi.date()
      .iso()
      .greater(Joi.ref('startDate'))
      .required()
      .messages({
        'date.greater': 'End date must be after start date',
        'any.required': 'End date is required',
      }),
    instructions: Joi.string()
      .trim()
      .max(500)
      .allow(''),
    refillsAllowed: Joi.number()
      .integer()
      .min(0)
      .max(12)
      .default(0),
  }),

  // Update status
  updateStatus: Joi.object({
    status: Joi.string()
      .valid('active', 'completed', 'cancelled')
      .required()
      .messages({
        'any.only': 'Status must be active, completed, or cancelled',
        'any.required': 'Status is required',
      }),
  }),

  // Query parameters for listing
  patientQuery: Joi.object({
    status: Joi.string().valid('active', 'completed', 'cancelled'),
    active: Joi.string().valid('true', 'false'),
  }),

  providerQuery: Joi.object({
    status: Joi.string().valid('active', 'completed', 'cancelled'),
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
  }),

  expiringQuery: Joi.object({
    days: Joi.number().integer().min(1).max(90).default(7),
  }),
};

/**
 * Export validation middleware
 */
export default validate;
