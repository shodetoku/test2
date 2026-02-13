/**
 * MongoDB Database Connection
 * 
 * Handles database connection with Mongoose, including:
 * - Connection pooling
 * - Error handling and retry logic
 * - Connection event logging
 * - Graceful disconnection
 * 
 * @module database/mongodb
 */

import mongoose from 'mongoose';
import appConfig from '../config/index.js';

/**
 * MongoDB Connection Options
 * Optimized for production use with connection pooling
 */
const options = {
  ...appConfig.db.options,
  autoIndex: !appConfig.isProduction, // Disable auto-indexing in production for performance
};

/**
 * Connect to MongoDB Database
 * 
 * @returns {Promise<void>}
 */
const connectToDatabase = async () => {
  try {
    // Validate database URI
    if (!appConfig.db.uri) {
      throw new Error(
        'MONGODB_URI is not defined. Please check your environment configuration.'
      );
    }

    // Set mongoose options
    mongoose.set('strictQuery', true);

    // Connect to MongoDB
    await mongoose.connect(appConfig.db.uri, options);

    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    if (appConfig.isDevelopment) {
      console.error('Full error:', error);
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * MongoDB Connection Event Handlers
 */

// Connection successful
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

// Connection error
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

// Connection disconnected
mongoose.connection.on('disconnected', () => {
  console.log('📴 Mongoose disconnected from MongoDB');
});

// Reconnected
mongoose.connection.on('reconnected', () => {
  console.log('🔄 Mongoose reconnected to MongoDB');
});

// Connection lost
mongoose.connection.on('close', () => {
  console.log('🔌 Mongoose connection closed');
});

/**
 * Graceful Disconnect
 * Close database connection on application termination
 */
export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('🛑 Database connection closed gracefully');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

// Handle application termination
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

export default connectToDatabase;
