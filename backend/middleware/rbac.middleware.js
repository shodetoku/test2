/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * Implements authorization based on user roles.
 * 
 * Supported Roles (in order of privilege):
 * - superadmin: Highest level access, can create accounts
 * - admin: Full system access
 * - doctor: Medical staff with patient access
 * - frontdesk: Administrative staff
 * - patient: Self-service access only
 * 
 * Features:
 * - Role hierarchy support
 * - Multiple role requirements
 * - Resource-specific permissions
 * - Audit logging integration
 * 
 * @module middleware/rbac
 */

import { AppError, HttpStatus } from './error.middleware..js';
import { asyncHandler } from './error.middleware..js';

/**
 * Role Hierarchy
 * Higher numbers have more privileges
 */
const ROLE_HIERARCHY = {
  patient: 1,
  frontdesk: 2,
  doctor: 3,
  admin: 4,
  superadmin: 5,
};

/**
 * Get role level from hierarchy
 * 
 * @param {string} role - User role
 * @returns {number} Role level
 */
const getRoleLevel = (role) => {
  return ROLE_HIERARCHY[role] || 0;
};

/**
 * Require Role Middleware
 * 
 * Checks if authenticated user has one of the required roles.
 * Must be used after authenticateJWT middleware.
 * 
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @param {Object} options - Optional configuration
 * @param {boolean} options.requireHigher - Require role level >= highest allowed role
 * @returns {Function} Express middleware
 * 
 * @throws {AppError} 401 if not authenticated
 * @throws {AppError} 403 if role not authorized
 * 
 * @example
 * // Allow only admins
 * router.delete('/users/:id', authenticateJWT, requireRole('admin'), deleteUser);
 * 
 * // Allow doctors and admins
 * router.get('/patients', authenticateJWT, requireRole(['doctor', 'admin']), getPatients);
 * 
 * // Allow frontdesk and higher (frontdesk, doctor, admin)
 * router.post('/appointments', authenticateJWT, requireRole('frontdesk', { requireHigher: true }), createAppointment);
 */
export const requireRole = (allowedRoles, options = {}) => {
  // Normalize to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return asyncHandler(async (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      throw new AppError(
        'Authentication required to access this resource.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const userRole = req.user.role;

    // Check if user has required role
    if (options.requireHigher) {
      // Check if user's role level is >= minimum required level
      const minRequiredLevel = Math.min(...roles.map(getRoleLevel));
      const userLevel = getRoleLevel(userRole);

      if (userLevel < minRequiredLevel) {
        throw new AppError(
          'Access denied. Insufficient privileges.',
          HttpStatus.FORBIDDEN
        );
      }
    } else {
      // Check if user's role is in the allowed roles list
      if (!roles.includes(userRole)) {
        throw new AppError(
          `Access denied. Required roles: ${roles.join(', ')}`,
          HttpStatus.FORBIDDEN
        );
      }
    }

    next();
  });
};

/**
 * Require Admin Role
 * 
 * Convenience middleware to require admin role.
 * 
 * @example
 * router.post('/users', authenticateJWT, requireAdmin, createUser);
 */
export const requireAdmin = requireRole('admin');

/**
 * Require Doctor or Admin
 * 
 * Convenience middleware for medical staff access.
 * 
 * @example
 * router.get('/medical-records/:id', authenticateJWT, requireDoctor, getMedicalRecord);
 */
export const requireDoctor = requireRole(['doctor', 'admin']);

/**
 * Require Front Desk or Higher
 * 
 * Convenience middleware for administrative access.
 * 
 * @example
 * router.post('/appointments', authenticateJWT, requireFrontDesk, createAppointment);
 */
export const requireFrontDesk = requireRole('frontdesk', { requireHigher: true });

/**
 * Check Patient Access Middleware
 * 
 * Ensures user can only access their own patient data.
 * Doctors and admins can access any patient data.
 * 
 * @param {string} patientIdParam - Route parameter containing patient ID
 * @returns {Function} Express middleware
 * 
 * @example
 * router.get('/patients/:patientId', authenticateJWT, checkPatientAccess('patientId'), getPatient);
 */
export const checkPatientAccess = (patientIdParam = 'patientId') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError(
        'Authentication required.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const { role, profileId } = req.user;

    // Doctors and admins can access any patient
    if (role === 'doctor' || role === 'admin') {
      return next();
    }

    // Patients can only access their own data
    if (role === 'patient') {
      const requestedPatientId = req.params[patientIdParam];

      // Convert to string for comparison
      const userProfileId = profileId?.toString();
      const requestedId = requestedPatientId?.toString();

      if (userProfileId !== requestedId) {
        throw new AppError(
          'Access denied. You can only access your own patient data.',
          HttpStatus.FORBIDDEN
        );
      }

      return next();
    }

    // Front desk cannot access patient medical records
    throw new AppError(
      'Access denied. Insufficient privileges to access patient data.',
      HttpStatus.FORBIDDEN
    );
  });
};

/**
 * Check Doctor Access Middleware
 * 
 * Ensures user can only access their own doctor data.
 * Admins can access any doctor data.
 * 
 * @param {string} doctorIdParam - Route parameter containing doctor ID
 * @returns {Function} Express middleware
 * 
 * @example
 * router.put('/doctors/:doctorId', authenticateJWT, checkDoctorAccess('doctorId'), updateDoctor);
 */
export const checkDoctorAccess = (doctorIdParam = 'doctorId') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError(
        'Authentication required.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const { role, profileId } = req.user;

    // Admins can access any doctor
    if (role === 'admin') {
      return next();
    }

    // Doctors can only access their own profile
    if (role === 'doctor') {
      const requestedDoctorId = req.params[doctorIdParam];

      // Convert to string for comparison
      const userProfileId = profileId?.toString();
      const requestedId = requestedDoctorId?.toString();

      if (userProfileId !== requestedId) {
        throw new AppError(
          'Access denied. You can only access your own doctor profile.',
          HttpStatus.FORBIDDEN
        );
      }

      return next();
    }

    // Other roles cannot access doctor data
    throw new AppError(
      'Access denied. Insufficient privileges.',
      HttpStatus.FORBIDDEN
    );
  });
};

/**
 * Check Appointment Access Middleware
 * 
 * Ensures user can only access appointments they're involved in.
 * - Patients: Own appointments only
 * - Doctors: Appointments assigned to them
 * - Front Desk: All appointments
 * - Admin: All appointments
 * 
 * @returns {Function} Express middleware
 * 
 * @example
 * router.get('/appointments/:id', authenticateJWT, checkAppointmentAccess, getAppointment);
 */
export const checkAppointmentAccess = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AppError(
      'Authentication required.',
      HttpStatus.UNAUTHORIZED
    );
  }

  const { role } = req.user;

  // Front desk and admin have full access
  if (role === 'frontdesk' || role === 'admin') {
    return next();
  }

  // For patients and doctors, the actual appointment check
  // should be done in the controller with database lookup
  // Here we just ensure the role is appropriate
  if (role === 'patient' || role === 'doctor') {
    // Add flag for controller to verify ownership
    req.requireOwnershipCheck = true;
    return next();
  }

  throw new AppError(
    'Access denied. Insufficient privileges.',
    HttpStatus.FORBIDDEN
  );
});

/**
 * Permission Check Middleware
 * 
 * Generic permission checking based on custom logic.
 * 
 * @param {Function} permissionChecker - Async function that returns true if allowed
 * @returns {Function} Express middleware
 * 
 * @example
 * const canModifyAppointment = async (req) => {
 *   const appointment = await Appointment.findById(req.params.id);
 *   return appointment.doctorId.equals(req.user.profileId);
 * };
 * 
 * router.put('/appointments/:id', 
 *   authenticateJWT, 
 *   checkPermission(canModifyAppointment),
 *   updateAppointment
 * );
 */
export const checkPermission = (permissionChecker) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError(
        'Authentication required.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const hasPermission = await permissionChecker(req);

    if (!hasPermission) {
      throw new AppError(
        'Access denied. You do not have permission to perform this action.',
        HttpStatus.FORBIDDEN
      );
    }

    next();
  });
};

export default requireRole;
