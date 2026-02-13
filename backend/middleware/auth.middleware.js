/**
 * Authentication Middleware
 * 
 * Verifies JWT tokens and attaches authenticated user to request object.
 * 
 * Security Features:
 * - Bearer token extraction from Authorization header
 * - Token verification using JWT
 * - User lookup and validation
 * - Account status checking (active, locked)
 * - Token expiry validation
 * 
 * Usage:
 * - Apply to protected routes that require authentication
 * - User object will be available as req.user
 * 
 * @module middleware/auth
 */

import { verifyToken } from '../services/authService.js';
import User from '../models/user.model.js';
import { AppError, HttpStatus } from './error.middleware..js';
import { asyncHandler } from './error.middleware..js';

/**
 * Extract JWT token from Authorization header
 * 
 * Supports: "Authorization: Bearer <token>"
 * 
 * @param {Object} req - Express request object
 * @returns {string|null} JWT token or null
 */
const extractToken = (req) => {
  // Check Authorization header
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  // Alternative: Check for token in cookie (if using cookie-based auth)
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
};

/**
 * Authenticate JWT Middleware
 * 
 * Verifies JWT token and attaches user to request.
 * 
 * @throws {AppError} 401 if token is missing or invalid
 * @throws {AppError} 403 if user account is inactive or locked
 * 
 * @example
 * // Protect a route
 * router.get('/profile', authenticateJWT, userController.getProfile);
 * 
 * // Access authenticated user in controller
 * const getProfile = async (req, res) => {
 *   const user = req.user; // User object is available here
 *   res.json({ user });
 * };
 */
export const authenticateJWT = asyncHandler(async (req, res, next) => {
  // Extract token from request
  const token = extractToken(req);

  if (!token) {
    throw new AppError(
      'Access denied. No authentication token provided.',
      HttpStatus.UNAUTHORIZED
    );
  }

  try {
    // Verify token
    const decoded = verifyToken(token, 'access');

    // Find user in database
    const user = await User.findById(decoded.id).select('+passwordHash');

    if (!user) {
      throw new AppError(
        'Authentication failed. User not found.',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Check if user account is active
    if (!user.isActive) {
      throw new AppError(
        'Account is inactive. Please contact support.',
        HttpStatus.FORBIDDEN
      );
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new AppError(
        'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
        HttpStatus.FORBIDDEN
      );
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      throw new AppError(
        'Password was recently changed. Please log in again.',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Attach user to request object (exclude sensitive fields)
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      mfaEnabled: user.mfaEnabled,
      profileId: user.profileId,
      profileModel: user.profileModel,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    // Token verification errors
    throw new AppError(
      error.message || 'Invalid or expired token.',
      HttpStatus.UNAUTHORIZED
    );
  }
});

/**
 * Optional Authentication Middleware
 * 
 * Similar to authenticateJWT but doesn't throw error if token is missing.
 * Useful for routes that have different behavior for authenticated users.
 * 
 * @example
 * // Route accessible to both authenticated and unauthenticated users
 * router.get('/posts', optionalAuth, postController.list);
 * 
 * // In controller, check if user is authenticated
 * const list = async (req, res) => {
 *   if (req.user) {
 *     // Show personalized posts
 *   } else {
 *     // Show public posts only
 *   }
 * };
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(); // Continue without authentication
  }

  try {
    const decoded = verifyToken(token, 'access');
    const user = await User.findById(decoded.id);

    if (user && user.isActive && !user.isLocked) {
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      };
    }
  } catch (error) {
    // Silently fail - continue without authentication
    console.log('Optional auth failed:', error.message);
  }

  next();
});

/**
 * Require Email Verification Middleware
 * 
 * Ensures user has verified their email address.
 * Must be used after authenticateJWT.
 * 
 * @throws {AppError} 403 if email not verified
 */
export const requireEmailVerification = asyncHandler(
  async (req, res, next) => {
    if (!req.user) {
      throw new AppError(
        'Authentication required.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const user = await User.findById(req.user.id);

    if (!user.isEmailVerified) {
      throw new AppError(
        'Email verification required. Please verify your email address.',
        HttpStatus.FORBIDDEN
      );
    }

    next();
  }
);

/**
 * Require MFA Middleware
 * 
 * Ensures user has completed MFA if enabled.
 * Must be used after authenticateJWT.
 * 
 * @throws {AppError} 403 if MFA not completed
 */
export const requireMFA = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AppError(
      'Authentication required.',
      HttpStatus.UNAUTHORIZED
    );
  }

  const user = await User.findById(req.user.id);

  if (user.mfaEnabled && !req.session?.mfaVerified) {
    throw new AppError(
      'Multi-factor authentication required.',
      HttpStatus.FORBIDDEN
    );
  }

  next();
});

/**
 * Check User Ownership Middleware
 * 
 * Ensures the authenticated user owns the resource being accessed.
 * Useful for profile updates, deleting own data, etc.
 * Admins bypass this check.
 * 
 * @param {string} userIdParam - Name of the route parameter containing user ID
 * @returns {Function} Express middleware
 * 
 * @example
 * // Ensure user can only update their own profile
 * router.put('/users/:userId', authenticateJWT, checkOwnership('userId'), updateUser);
 */
export const checkOwnership = (userIdParam = 'id') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError(
        'Authentication required.',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Admins can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    const resourceUserId = req.params[userIdParam];

    if (req.user.id !== resourceUserId) {
      throw new AppError(
        'Access denied. You can only access your own resources.',
        HttpStatus.FORBIDDEN
      );
    }

    next();
  });
};

export default authenticateJWT;
