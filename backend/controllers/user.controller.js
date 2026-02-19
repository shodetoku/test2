/**
 * User Controller
 * 
 * Handles business logic for user management operations.
 * 
 * Features:
 * - Get all users with pagination and filtering
 * - Get user by ID
 * - Search users by email
 * - Role-based access control
 * 
 * @module controllers/user
 */

import User from '../models/user.model.js';
import { asyncHandler, AppError, HttpStatus } from '../middleware/error.middleware..js';

/**
 * Get All Users
 * 
 * @route   GET /api/users
 * @access  Private (Admin, Superadmin)
 * 
 * Query Parameters:
 * - role: Filter by user role
 * - isActive: Filter by active status
 * - page: Page number (default: 1)
 * - limit: Results per page (default: 20, max: 100)
 * - search: Search by email
 */
export const getUsers = asyncHandler(async (req, res) => {
  const {
    role,
    isActive,
    page = 1,
    limit = 20,
    search,
  } = req.query;

  // Build query filter
  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (search) {
    filter.email = { $regex: search, $options: 'i' };
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const [users, totalCount] = await Promise.all([
    User.find(filter)
      .select('-passwordHash -refreshTokens -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean(),
    User.countDocuments(filter),
  ]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / parseInt(limit));

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Users retrieved successfully',
    data: {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalResults: totalCount,
        limit: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    },
  });
});

/**
 * Get User by ID
 * 
 * @route   GET /api/users/:id
 * @access  Private (Users can view own profile, Admin/Superadmin can view all)
 * 
 * Route Parameters:
 * - id: User ID
 */
export const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find user by ID
  const user = await User.findById(userId)
    .select('-passwordHash -refreshTokens -passwordResetToken -passwordResetExpires')
    .populate('profileId')
    .lean();

  if (!user) {
    throw new AppError(
      'User not found',
      HttpStatus.NOT_FOUND
    );
  }

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'User retrieved successfully',
    data: { user },
  });
});