/**
 * Authentication Routes
 * 
 * Handles user authentication and account management:
 * - User registration
 * - Login with JWT tokens
 * - Token refresh
 * - Logout (token invalidation)
 * - Password reset flow
 * - Email verification (placeholder)
 * 
 * Security:
 * - Password validation
 * - Rate limiting on sensitive endpoints
 * - Audit logging for auth events
 * - Failed login attempt tracking
 * 
 * @module routes/auth
 */

import express from 'express';
import Joi from 'joi';
import User from '../models/user.model.js';
import {
  generateTokenPair,
  verifyToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  hashPassword,
} from '../services/authService.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { validate, commonSchemas } from '../middleware/validation.middleware.js';
import { asyncHandler, AppError, HttpStatus } from '../middleware/error.middleware..js';
import { auditLog } from '../middleware/auditLog.middleware.js';

const router = express.Router();

/**
 * Validation Schemas
 */

// Registration validation
const registerSchema = Joi.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
  role: Joi.string()
    .valid('patient', 'frontdesk', 'doctor')
    .default('patient'),
});

// Login validation
const loginSchema = Joi.object({
  email: commonSchemas.email,
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// Password change validation
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: commonSchemas.password,
});

// Password reset request validation
const forgotPasswordSchema = Joi.object({
  email: commonSchemas.email,
});

// Password reset validation
const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: commonSchemas.password,
});

// Refresh token validation
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validate(registerSchema),
  auditLog('USER_CREATED', 'User'),
  asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new AppError(
        'User with this email already exists',
        HttpStatus.CONFLICT
      );
    }

    // Create new user
    const user = new User({
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
      role: role || 'patient',
      isActive: true,
    });

    await user.save();

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Store refresh token
    await user.addRefreshToken(
      tokens.refreshToken,
      7 * 24 * 60 * 60 * 1000, // 7 days
      req.get('user-agent'),
      req.ip
    );

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
        ...tokens,
      },
    });
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return tokens
 * @access  Public
 */
router.post(
  '/login',
  validate(loginSchema),
  auditLog('LOGIN', 'Auth'),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+passwordHash'
    );

    if (!user) {
      throw new AppError(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new AppError(
        'Account is temporarily locked due to multiple failed login attempts',
        HttpStatus.FORBIDDEN
      );
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AppError(
        'Account is inactive. Please contact support.',
        HttpStatus.FORBIDDEN
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incrementLoginAttempts();

      throw new AppError(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Reset failed login attempts
    await user.resetLoginAttempts();

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Store refresh token
    await user.addRefreshToken(
      tokens.refreshToken,
      7 * 24 * 60 * 60 * 1000, // 7 days
      req.get('user-agent'),
      req.ip
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          mfaEnabled: user.mfaEnabled,
        },
        ...tokens,
      },
    });
  })
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyToken(refreshToken, 'refresh');

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found', HttpStatus.UNAUTHORIZED);
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AppError(
        'Account is inactive',
        HttpStatus.FORBIDDEN
      );
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.some(
      (rt) => rt.token === refreshToken && rt.expiresAt > Date.now()
    );

    if (!tokenExists) {
      throw new AppError(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Generate new token pair
    const tokens = generateTokenPair(user);

    // Replace old refresh token with new one
    await user.removeRefreshToken(refreshToken);
    await user.addRefreshToken(
      tokens.refreshToken,
      7 * 24 * 60 * 60 * 1000,
      req.get('user-agent'),
      req.ip
    );

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
    });
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
router.post(
  '/logout',
  authenticateJWT,
  auditLog('LOGOUT', 'Auth'),
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    // Find user
    const user = await User.findById(req.user.id);

    if (refreshToken) {
      // Remove specific refresh token
      await user.removeRefreshToken(refreshToken);
    } else {
      // Remove all refresh tokens (logout from all devices)
      await user.removeAllRefreshTokens();
    }

    res.json({
      success: true,
      message: 'Logout successful',
    });
  })
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  auditLog('PASSWORD_RESET', 'Auth'),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Find user
    const user = await User.findByEmail(email);

    if (!user) {
      // For security, don't reveal if email exists
      // Return success even if user not found
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent',
      });
    }

    // Generate password reset token
    const { token, hash, expiresAt } = generatePasswordResetToken();

    // Save token to user
    user.passwordResetToken = hash;
    user.passwordResetExpires = expiresAt;
    await user.save();

    // TODO: Send email with reset link
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    // await sendEmail(user.email, 'Password Reset', resetLink);

    // For development, return token (REMOVE IN PRODUCTION)
    const response = {
      success: true,
      message: 'Password reset link sent to your email',
    };

    // Only include token in development
    if (process.env.NODE_ENV === 'development') {
      response.resetToken = token; // Only for testing
    }

    res.json(response);
  })
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  auditLog('PASSWORD_CHANGE', 'Auth'),
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    // Hash the token from request
    const crypto = await import('crypto');
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw new AppError(
        'Invalid or expired password reset token',
        HttpStatus.BAD_REQUEST
      );
    }

    // Update password
    user.passwordHash = newPassword; // Will be hashed by pre-save middleware
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Invalidate all existing tokens
    await user.removeAllRefreshTokens();

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. Please login with your new password.',
    });
  })
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password (for authenticated users)
 * @access  Private
 */
router.post(
  '/change-password',
  authenticateJWT,
  validate(changePasswordSchema),
  auditLog('PASSWORD_CHANGE', 'Auth'),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Find user with password
    const user = await User.findById(req.user.id).select('+passwordHash');

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new AppError(
        'Current password is incorrect',
        HttpStatus.UNAUTHORIZED
      );
    }

    // Update password
    user.passwordHash = newPassword; // Will be hashed by pre-save middleware

    // Invalidate all existing tokens
    await user.removeAllRefreshTokens();

    await user.save();

    // Generate new tokens
    const tokens = generateTokenPair(user);

    res.json({
      success: true,
      message: 'Password changed successfully',
      data: tokens,
    });
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user information
 * @access  Private
 */
router.get(
  '/me',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
      .populate('profileId')
      .lean();

    res.json({
      success: true,
      data: { user },
    });
  })
);

/**
 * @route   GET /api/auth/verify-token
 * @desc    Verify if token is valid
 * @access  Private
 */
router.get(
  '/verify-token',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: req.user,
      },
    });
  })
);

export default router;
