/**
 * Centralized Configuration Manager
 * 
 * This module consolidates all environment variables and provides validation
 * to ensure the application has all required configuration before starting.
 * 
 * Security Features:
 * - Validates required environment variables
 * - Provides default values for optional configurations
 * - Validates data types and formats
 * - Prevents application startup with invalid configuration
 * 
 * @module config
 */

import { config } from 'dotenv';
import Joi from 'joi';

// Load environment-specific .env file
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

/**
 * Configuration Schema Definition
 * Uses Joi for validation to ensure all required values are present and valid
 */
const configSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number()
    .default(3000)
    .description('Server port number'),

  // Database Configuration
  MONGODB_URI: Joi.string()
    .required()
    .description('MongoDB connection string'),
  DB_URI: Joi.string()
    .optional()
    .description('Alias for MONGODB_URI (legacy support)'),

  // JWT Configuration
  JWT_SECRET: Joi.string()
    .required()
    .min(32)
    .description('Secret key for JWT access tokens'),
  JWT_REFRESH_SECRET: Joi.string()
    .required()
    .min(32)
    .description('Secret key for JWT refresh tokens'),
  JWT_ACCESS_EXPIRY: Joi.string()
    .default('15m')
    .description('Access token expiry time'),
  JWT_REFRESH_EXPIRY: Joi.string()
    .default('7d')
    .description('Refresh token expiry time'),

  // Security Configuration
  BCRYPT_ROUNDS: Joi.number()
    .integer()
    .min(10)
    .max(15)
    .default(12)
    .description('Bcrypt hashing rounds'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number()
    .integer()
    .default(15 * 60 * 1000) // 15 minutes
    .description('Rate limit time window in milliseconds'),
  RATE_LIMIT_MAX_REQUESTS: Joi.number()
    .integer()
    .default(100)
    .description('Maximum requests per time window'),

  // CORS Configuration
  CORS_ORIGIN: Joi.string()
    .default('http://localhost:5173')
    .description('Allowed CORS origin'),
}).unknown(); // Allow other environment variables

/**
 * Validate configuration against schema
 */
const { error, value: envVars } = configSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

/**
 * Validated and typed configuration object
 * @constant {Object} config
 */
const appConfig = {
  // Server
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  isProduction: envVars.NODE_ENV === 'production',
  isDevelopment: envVars.NODE_ENV === 'development',
  isTest: envVars.NODE_ENV === 'test',

  // Database
  db: {
    uri: envVars.MONGODB_URI || envVars.DB_URI,
    options: {
      // Mongoose connection options
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4, // Use IPv4, skip trying IPv6
    },
  },

  // JWT
  jwt: {
    secret: envVars.JWT_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    accessExpiry: envVars.JWT_ACCESS_EXPIRY,
    refreshExpiry: envVars.JWT_REFRESH_EXPIRY,
  },

  // Security
  security: {
    bcryptRounds: envVars.BCRYPT_ROUNDS,
    saltRounds: envVars.BCRYPT_ROUNDS, // Alias for bcryptRounds
  },

  // Rate Limiting
  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    max: envVars.RATE_LIMIT_MAX_REQUESTS,
  },

  // CORS
  cors: {
    origin: envVars.CORS_ORIGIN,
    credentials: true,
  },
};

/**
 * Log configuration status (sanitized - no secrets)
 */
if (!appConfig.isProduction) {
  console.log('📋 Configuration loaded:', {
    env: appConfig.env,
    port: appConfig.port,
    dbUri: appConfig.db.uri.replace(/\/\/.*:.*@/, '//***:***@'), // Hide credentials
    jwtConfigured: !!appConfig.jwt.secret,
    corsOrigin: appConfig.cors.origin,
  });
}

export default appConfig;

// Export individual configs for backward compatibility
export const {
  env,
  port,
  db,
  jwt,
  security,
  rateLimit,
  cors,
  isProduction,
  isDevelopment,
  isTest,
} = appConfig;
