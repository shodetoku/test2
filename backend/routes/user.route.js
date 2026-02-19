/**
 * User Routes
 * 
 * Handles user management endpoints:
 * - Get all users (admin/superadmin only)
 * - Get user by ID
 * - Update user
 * - Deactivate user
 * 
 * Authorization:
 * - Admin and superadmin can view all users
 * - Users can view their own profile
 * - Only superadmin can modify user roles
 * 
 * @module routes/user
 */

import express from 'express';
import Joi from 'joi';
import { getUsers, getUser } from '../controllers/user.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate, commonSchemas } from '../middleware/validation.middleware.js';
import { asyncHandler } from '../middleware/error.middleware..js';
import { auditLog } from '../middleware/auditLog.middleware.js';

const router = express.Router();

/**
 * All routes require authentication
 */
router.use(authenticateJWT);

/**
 * Validation Schemas
 */

// Query parameters for getting all users
const getUsersQuerySchema = Joi.object({
  role: Joi.string()
    .valid('patient', 'frontdesk', 'doctor', 'admin', 'superadmin')
    .optional(),
  isActive: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().optional(),
});

// User ID parameter validation
const userIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
    }),
});

/**
 * @route   GET /api/users
 * @desc    Get all users (with pagination and filters)
 * @access  Private (Admin, Superadmin)
 */
router.get(
  '/',
  requireRole(['admin', 'superadmin']),
  validate(getUsersQuerySchema, 'query'),
  auditLog(),
  getUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Users can view own profile, Admin/Superadmin can view all)
 */
router.get(
  '/:id',
  validate(userIdSchema, 'params'),
  asyncHandler(async (req, res, next) => {
    // Check if user is accessing their own profile or is admin/superadmin
    const requestingUser = req.user;
    const targetUserId = req.params.id;

    const isOwnProfile = requestingUser.id === targetUserId;
    const isAdmin = ['admin', 'superadmin'].includes(requestingUser.role);

    if (!isOwnProfile && !isAdmin) {
      const { AppError, HttpStatus } = await import('../middleware/error.middleware..js');
      throw new AppError(
        'Access denied. You can only view your own profile.',
        HttpStatus.FORBIDDEN
      );
    }

    next();
  }),
  getUser
);

export default router;
