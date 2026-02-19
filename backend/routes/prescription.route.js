/**
 * Prescription Routes
 * 
 * Handles prescription management endpoints:
 * - Create prescriptions (doctors/admins only)
 * - View prescriptions (with authorization)
 * - Update prescription status
 * - Cancel prescriptions
 * - Process refills
 * 
 * Authorization:
 * - Doctors can create and manage prescriptions
 * - Patients can only view their own prescriptions
 * - Front desk can process refills
 * - Admins have full access
 * 
 * @module routes/prescription
 */

import express from 'express';
import {
  createPrescription,
  getPatientPrescriptions,
  getProviderPrescriptions,
  getPrescription,
  updatePrescriptionStatus,
  cancelPrescription,
  processRefill,
  getExpiringPrescriptions,
} from '../controllers/prescription.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import {
  requireRole,
  requireDoctor,
  requireFrontDesk,
  checkPatientAccess,
} from '../middleware/rbac.middleware.js';
import { validate, prescriptionSchemas } from '../middleware/validation.middleware.js';
import { auditLog } from '../middleware/auditLog.middleware.js';

const router = express.Router();

/**
 * All routes require authentication
 */
router.use(authenticateJWT);

/**
 * @route   POST /api/prescriptions
 * @desc    Create a new prescription
 * @access  Private (Doctor, Admin)
 */
router.post(
  '/',
  requireDoctor,
  validate(prescriptionSchemas.create),
  auditLog(),
  createPrescription
);

/**
 * @route   GET /api/prescriptions/patient/:patientId
 * @desc    Get all prescriptions for a patient
 * @access  Private (Patient can view own, Doctor/Admin can view all)
 */
router.get(
  '/patient/:patientId',
  checkPatientAccess('patientId'),
  validate(prescriptionSchemas.patientQuery, 'query'),
  getPatientPrescriptions
);

/**
 * @route   GET /api/prescriptions/patient/:patientId/expiring
 * @desc    Get expiring prescriptions for a patient
 * @access  Private (Patient can view own, Doctor/Admin can view all)
 */
router.get(
  '/patient/:patientId/expiring',
  checkPatientAccess('patientId'),
  validate(prescriptionSchemas.expiringQuery, 'query'),
  getExpiringPrescriptions
);

/**
 * @route   GET /api/prescriptions/provider/:providerId
 * @desc    Get all prescriptions created by a provider
 * @access  Private (Doctor can view own, Admin can view all)
 */
router.get(
  '/provider/:providerId',
  requireDoctor,
  validate(prescriptionSchemas.providerQuery, 'query'),
  getProviderPrescriptions
);

/**
 * @route   GET /api/prescriptions/:id
 * @desc    Get a single prescription by ID
 * @access  Private
 */
router.get(
  '/:id',
  getPrescription
);

/**
 * @route   PATCH /api/prescriptions/:id/status
 * @desc    Update prescription status
 * @access  Private (Doctor, Admin)
 */
router.patch(
  '/:id/status',
  requireDoctor,
  validate(prescriptionSchemas.updateStatus),
  auditLog(),
  updatePrescriptionStatus
);

/**
 * @route   POST /api/prescriptions/:id/refill
 * @desc    Process a prescription refill
 * @access  Private (Front Desk, Doctor, Admin)
 */
router.post(
  '/:id/refill',
  requireFrontDesk,
  auditLog(),
  processRefill
);

/**
 * @route   DELETE /api/prescriptions/:id
 * @desc    Cancel a prescription
 * @access  Private (Doctor, Admin)
 */
router.delete(
  '/:id',
  requireDoctor,
  auditLog(),
  cancelPrescription
);

export default router;