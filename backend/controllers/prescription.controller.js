/**
 * Prescription Controller
 * 
 * Handles prescription management operations:
 * - Create new prescriptions (doctors only)
 * - Retrieve prescriptions (with authorization checks)
 * - Update prescription status
 * - Cancel prescriptions
 * - Process refills
 * 
 * @module controllers/prescription
 */

import Prescription from '../models/prescription.model.js';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import { AppError, HttpStatus } from '../middleware/error.middleware..js';
import { asyncHandler } from '../middleware/error.middleware..js';

/**
 * Create a new prescription
 * 
 * @access Private (Doctor, Admin)
 * @route POST /api/prescriptions
 */
export const createPrescription = asyncHandler(async (req, res) => {
  const {
    patientId,
    medication,
    dosage,
    frequency,
    startDate,
    endDate,
    instructions,
    refillsAllowed,
  } = req.body;

  // Verify patient exists
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new AppError('Patient not found', HttpStatus.NOT_FOUND);
  }

  // For doctors, use their doctor profile ID as providerId
  // For admins, they can specify providerId or use req.user.doctorId
  const providerId = req.user.role === 'doctor' 
    ? req.user.doctorId  // Assuming User model has doctorId field
    : req.body.providerId;

  if (!providerId) {
    throw new AppError('Provider ID is required', HttpStatus.BAD_REQUEST);
  }

  // Verify provider exists
  const provider = await Doctor.findById(providerId);
  if (!provider) {
    throw new AppError('Provider not found', HttpStatus.NOT_FOUND);
  }

  // Create prescription
  const prescription = await Prescription.create({
    patientId,
    providerId,
    medication,
    dosage,
    frequency,
    startDate,
    endDate,
    instructions,
    refillsAllowed: refillsAllowed || 0,
    refillsRemaining: refillsAllowed || 0,
    status: 'active',
  });

  // Populate references for response
  await prescription.populate([
    { path: 'patientId', select: 'firstName lastName dateOfBirth' },
    { path: 'providerId', select: 'firstName lastName specialty' }
  ]);

  res.status(HttpStatus.CREATED).json({
    success: true,
    message: 'Prescription created successfully',
    data: prescription,
  });
});

/**
 * Get all prescriptions for a patient
 * 
 * @access Private (Patient can view own, Doctor/Admin can view all)
 * @route GET /api/prescriptions/patient/:patientId
 */
export const getPatientPrescriptions = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { status, active } = req.query;

  // Build query
  const query = { patientId };

  // Filter by status if provided
  if (status) {
    query.status = status;
  }

  // Filter for currently active prescriptions
  if (active === 'true') {
    query.status = 'active';
    query.startDate = { $lte: new Date() };
    query.endDate = { $gte: new Date() };
  }

  const prescriptions = await Prescription.find(query)
    .populate('providerId', 'firstName lastName specialty')
    .sort({ startDate: -1 });

  res.status(HttpStatus.OK).json({
    success: true,
    count: prescriptions.length,
    data: prescriptions,
  });
});

/**
 * Get all prescriptions created by a provider
 * 
 * @access Private (Doctor can view own, Admin can view all)
 * @route GET /api/prescriptions/provider/:providerId
 */
export const getProviderPrescriptions = asyncHandler(async (req, res) => {
  const { providerId } = req.params;
  const { status, page = 1, limit = 20 } = req.query;

  // Build query
  const query = { providerId };
  if (status) {
    query.status = status;
  }

  // Pagination
  const skip = (page - 1) * limit;

  const [prescriptions, total] = await Promise.all([
    Prescription.find(query)
      .populate('patientId', 'firstName lastName dateOfBirth')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Prescription.countDocuments(query),
  ]);

  res.status(HttpStatus.OK).json({
    success: true,
    count: prescriptions.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: prescriptions,
  });
});

/**
 * Get a single prescription by ID
 * 
 * @access Private
 * @route GET /api/prescriptions/:id
 */
export const getPrescription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const prescription = await Prescription.findById(id)
    .populate('patientId', 'firstName lastName dateOfBirth email phone')
    .populate('providerId', 'firstName lastName specialty licenseNumber');

  if (!prescription) {
    throw new AppError('Prescription not found', HttpStatus.NOT_FOUND);
  }

  res.status(HttpStatus.OK).json({
    success: true,
    data: prescription,
  });
});

/**
 * Update prescription status
 * 
 * @access Private (Doctor, Admin)
 * @route PATCH /api/prescriptions/:id/status
 */
export const updatePrescriptionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const prescription = await Prescription.findById(id);

  if (!prescription) {
    throw new AppError('Prescription not found', HttpStatus.NOT_FOUND);
  }

  // Validate status transition
  if (prescription.status === 'cancelled') {
    throw new AppError('Cannot update a cancelled prescription', HttpStatus.BAD_REQUEST);
  }

  prescription.status = status;
  await prescription.save();

  res.status(HttpStatus.OK).json({
    success: true,
    message: `Prescription ${status} successfully`,
    data: prescription,
  });
});

/**
 * Cancel a prescription
 * 
 * @access Private (Doctor, Admin)
 * @route DELETE /api/prescriptions/:id
 */
export const cancelPrescription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const prescription = await Prescription.findById(id);

  if (!prescription) {
    throw new AppError('Prescription not found', HttpStatus.NOT_FOUND);
  }

  if (prescription.status === 'cancelled') {
    throw new AppError('Prescription is already cancelled', HttpStatus.BAD_REQUEST);
  }

  await prescription.cancel();

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Prescription cancelled successfully',
    data: prescription,
  });
});

/**
 * Process a prescription refill
 * 
 * @access Private (Doctor, Admin, Front Desk)
 * @route POST /api/prescriptions/:id/refill
 */
export const processRefill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const prescription = await Prescription.findById(id)
    .populate('patientId', 'firstName lastName')
    .populate('providerId', 'firstName lastName');

  if (!prescription) {
    throw new AppError('Prescription not found', HttpStatus.NOT_FOUND);
  }

  try {
    await prescription.processRefill();

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Refill processed successfully',
      data: {
        prescription,
        refillsRemaining: prescription.refillsRemaining,
      },
    });
  } catch (error) {
    throw new AppError(error.message, HttpStatus.BAD_REQUEST);
  }
});

/**
 * Get expiring prescriptions for a patient
 * 
 * @access Private
 * @route GET /api/prescriptions/patient/:patientId/expiring
 */
export const getExpiringPrescriptions = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { days = 7 } = req.query;

  const prescriptions = await Prescription.findExpiringSoon(patientId, Number(days))
    .populate('providerId', 'firstName lastName specialty');

  res.status(HttpStatus.OK).json({
    success: true,
    count: prescriptions.length,
    message: `Prescriptions expiring within ${days} days`,
    data: prescriptions,
  });
});