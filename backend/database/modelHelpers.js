/**
 * Database Model Helpers
 * 
 * Utilities for creating models on the correct database connections.
 * Use these helpers to ensure models are registered on the right database.
 * 
 * @module database/modelHelpers
 */

import { connectToDatabasePARMS, connectToDatabaseIBMS, connectToDatabaseHRMS } from './mongodb.js';

/**
 * Create a model on the PARMS database (Full Read/Write Access)
 * Use this for: Users, Patients, Appointments, Medical Records
 * 
 * @param {string} modelName - Name of the model
 * @param {mongoose.Schema} schema - Mongoose schema
 * @returns {Promise<mongoose.Model>} Mongoose model on PARMS database
 */
export async function createPARMSModel(modelName, schema) {
  const connection = await connectToDatabasePARMS();
  return connection.model(modelName, schema);
}

/**
 * Get a model from the IBMS database (Read-Only Access)
 * Use this for: Billing, Invoices, Inventory
 * 
 * @param {string} modelName - Name of the model
 * @param {mongoose.Schema} schema - Mongoose schema (for type hints only)
 * @returns {Promise<mongoose.Model>} Mongoose model on IBMS database
 */
export async function getIBMSModel(modelName, schema) {
  const connection = await connectToDatabaseIBMS();
  return connection.model(modelName, schema);
}

/**
 * Get a model from the HRMS database (Read-Only Access)
 * Use this for: Staff, Doctors, Employees, Schedules
 * 
 * @param {string} modelName - Name of the model
 * @param {mongoose.Schema} schema - Mongoose schema (for type hints only)
 * @returns {Promise<mongoose.Model>} Mongoose model on HRMS database
 */
export async function getHRMSModel(modelName, schema) {
  const connection = await connectToDatabaseHRMS();
  return connection.model(modelName, schema);
}

/**
 * Get the PARMS database connection
 * Use this when you need direct access to the database
 * 
 * @returns {Promise<mongoose.Connection>} PARMS database connection
 */
export async function getPARMSConnection() {
  return await connectToDatabasePARMS();
}

/**
 * Get the IBMS database connection (Read-Only)
 * Use this when you need direct access to the database
 * 
 * @returns {Promise<mongoose.Connection>} IBMS database connection
 */
export async function getIBMSConnection() {
  return await connectToDatabaseIBMS();
}

/**
 * Get the HRMS database connection (Read-Only)
 * Use this when you need direct access to the database
 * 
 * @returns {Promise<mongoose.Connection>} HRMS database connection
 */
export async function getHRMSConnection() {
  return await connectToDatabaseHRMS();
}

export default {
  createPARMSModel,
  getIBMSModel,
  getHRMSModel,
  getPARMSConnection,
  getIBMSConnection,
  getHRMSConnection,
};
