import mongoose from "mongoose";
import { 
  PARMS_DB_URI,
  IBMS_DB_URI,
  HRMS_DB_URI,
  NODE_ENV 
} from "../config/env.js";

// Connection options for better reliability
const connectionOptions = {
  serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
};

let parmsConnection = null;
let ibmsConnection = null;
let hrmsConnection = null;

/**
 * Connect to PARMS Database (Full Read/Write Access)
 * Patient Appointment and Record Management System
 * This is your own database where you can create, read, update, and delete records
 */
export const connectToDatabasePARMS = async () => {
  if (!PARMS_DB_URI) {
    throw new Error(
      `Please define the PARMS_DB_URI environment variable inside .env.${NODE_ENV}.local`
    );
  }

  if (!parmsConnection) {
    parmsConnection = mongoose.createConnection(
      PARMS_DB_URI,
      connectionOptions
    );
    await parmsConnection.asPromise();
    
    parmsConnection.on("connected", () => {
      console.log("✓ Connected to PARMS Database (Read/Write)");
    });
    
    parmsConnection.on("error", (err) => {
      console.error("✗ PARMS DB connection error", err);
    });
  }

  return parmsConnection;
};

/**
 * Connect to IBMS Database (Read-Only Access)
 * Inventory and Billing Management System
 * Use this to integrate billing and inventory data into patient views
 */
export const connectToDatabaseIBMS = async () => {
  if (!IBMS_DB_URI) {
    throw new Error(
      `Please define the IBMS_DB_URI environment variable inside .env.${NODE_ENV}.local`
    );
  }

  if (!ibmsConnection) {
    ibmsConnection = mongoose.createConnection(
      IBMS_DB_URI,
      connectionOptions
    );
    await ibmsConnection.asPromise();
    
    ibmsConnection.on("connected", () => {
      console.log("✓ Connected to IBMS Database (Read-Only)");
    });
    
    ibmsConnection.on("error", (err) => {
      console.error("✗ IBMS DB connection error", err);
    });
  }

  return ibmsConnection;
};

/**
 * Connect to HRMS Database (Read-Only Access)
 * Human Resource Management System
 * Use this to integrate staff and personnel data for appointments and records
 */
export const connectToDatabaseHRMS = async () => {
  if (!HRMS_DB_URI) {
    throw new Error(
      `Please define the HRMS_DB_URI environment variable inside .env.${NODE_ENV}.local`
    );
  }

  if (!hrmsConnection) {
    hrmsConnection = mongoose.createConnection(
      HRMS_DB_URI,
      connectionOptions
    );
    await hrmsConnection.asPromise();
    
    hrmsConnection.on("connected", () => {
      console.log("✓ Connected to HRMS Database (Read-Only)");
    });
    
    hrmsConnection.on("error", (err) => {
      console.error("✗ HRMS DB connection error", err);
    });
  }

  return hrmsConnection;
};

/**
 * Initialize all database connections
 * Call this on app startup to establish all connections
 */
export const connectAllDatabases = async () => {
  console.log("Initializing database connections...");
  
  await connectToDatabasePARMS();
  await connectToDatabaseIBMS();
  await connectToDatabaseHRMS();
  
  console.log("✓ All database connections established");
};

/**
 * Get your own database connection (Full Access)
 * Use this for all patient and appointment data operations
 */
export const getOwnDatabase = () => {
  if (!parmsConnection) {
    throw new Error("PARMS database not initialized. Call connectToDatabasePARMS() first.");
  }
  return parmsConnection;
};

/**
 * Get read-only database connections for data integration
 * Use these to fetch billing, inventory, and staff data
 */
export const getReadOnlyDatabases = () => {
  return {
    ibms: ibmsConnection,
    hrms: hrmsConnection,
  };
};

/**
 * Close all database connections
 */
export const closeAllDatabases = async () => {
  const connections = [
    parmsConnection,
    ibmsConnection,
    hrmsConnection,
  ];

  await Promise.all(
    connections.map((conn) => conn?.close())
  );

  console.log("✓ All database connections closed");
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await closeAllDatabases();
  process.exit(0);
});