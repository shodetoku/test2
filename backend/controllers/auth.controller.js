/**
 * Authentication Service
 * 
 * Provides core authentication functionality including:
 * - Password hashing and comparison
 * - JWT token generation and verification
 * - Token refresh mechanism
 * - Password reset token generation
 * 
 * Security Features:
 * - bcrypt password hashing with configurable rounds
 * - Separate secrets for access and refresh tokens
 * - Token expiry management
 * - Secure token generation for password reset
 * 
 * @module services/authService
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import appConfig from '../config/index.js';

/**
 * Hash a password using bcrypt
 * 
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 * 
 * @example
 * const hashedPassword = await hashPassword('myPassword123!');
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(appConfig.security.bcryptRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password: ' + error.message);
  }
};

/**
 * Compare plain text password with hashed password
 * 
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 * 
 * @example
 * const isMatch = await comparePassword('myPassword123!', user.passwordHash);
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords: ' + error.message);
  }
};

/**
 * Generate JWT Access Token
 * 
 * Contains user identification and role for authorization.
 * Short-lived (default: 15 minutes) for security.
 * 
 * @param {Object} payload - Token payload
 * @param {string} payload.id - User ID
 * @param {string} payload.email - User email
 * @param {string} payload.role - User role
 * @returns {string} Signed JWT token
 * 
 * @example
 * const token = generateAccessToken({
 *   id: user._id,
 *   email: user.email,
 *   role: user.role
 * });
 */
export const generateAccessToken = (payload) => {
  try {
    const { id, email, role } = payload;

    const tokenPayload = {
      id,
      email,
      role,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(tokenPayload, appConfig.jwt.secret, {
      expiresIn: appConfig.jwt.accessExpiry,
      issuer: 'parms-backend',
      audience: 'parms-frontend',
    });
  } catch (error) {
    throw new Error('Error generating access token: ' + error.message);
  }
};

/**
 * Generate JWT Refresh Token
 * 
 * Used to obtain new access tokens without re-authentication.
 * Longer-lived (default: 7 days) but stored securely.
 * 
 * @param {Object} payload - Token payload
 * @param {string} payload.id - User ID
 * @returns {string} Signed JWT refresh token
 * 
 * @example
 * const refreshToken = generateRefreshToken({ id: user._id });
 */
export const generateRefreshToken = (payload) => {
  try {
    const { id } = payload;

    const tokenPayload = {
      id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(tokenPayload, appConfig.jwt.refreshSecret, {
      expiresIn: appConfig.jwt.refreshExpiry,
      issuer: 'parms-backend',
      audience: 'parms-frontend',
    });
  } catch (error) {
    throw new Error('Error generating refresh token: ' + error.message);
  }
};

/**
 * Verify JWT Token
 * 
 * @param {string} token - JWT token to verify
 * @param {string} type - Token type ('access' or 'refresh')
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 * 
 * @example
 * const decoded = verifyToken(token, 'access');
 * console.log(decoded.id, decoded.email, decoded.role);
 */
export const verifyToken = (token, type = 'access') => {
    const JWT_ERROR_MESSAGES = {
      'TokenExpiredError': 'Token has expired',
      'JsonWebTokenError': 'Invalid token',
      'NotBeforeError': 'Token not yet valid'
    };

  try {
    const secret =
      type === 'refresh' ? appConfig.jwt.refreshSecret : appConfig.jwt.secret;

    const decoded = jwt.verify(token, secret, {
      issuer: 'parms-backend',
      audience: 'parms-frontend',
    });

    if (decoded.type !== type) {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    const message = JWT_ERROR_MESSAGES[error.name] 
    || `Token verification failed: ${error.message}`;
    throw new Error(message);
  }
};

/**
 * Generate Token Pair (Access + Refresh)
 * 
 * Convenience method to generate both tokens at once.
 * 
 * @param {Object} user - User object
 * @returns {Object} Object with accessToken and refreshToken
 * 
 * @example
 * const tokens = generateTokenPair(user);
 * res.json({ ...tokens });
 */
export const generateTokenPair = (user) => {
  const accessToken = generateAccessToken({
    id: user._id || user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id || user.id,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: appConfig.jwt.accessExpiry,
  };
};

/**
 * Generate Password Reset Token
 * 
 * Creates a secure random token for password reset links.
 * Should be stored hashed in database and expire after short time.
 * 
 * @returns {Object} Token and its hash
 * @returns {string} token - Raw token to send in email
 * @returns {string} hash - Hashed token to store in database
 * @returns {Date} expiresAt - Token expiration time
 * 
 * @example
 * const { token, hash, expiresAt } = generatePasswordResetToken();
 * user.passwordResetToken = hash;
 * user.passwordResetExpires = expiresAt;
 * await user.save();
 * sendEmail(user.email, `Reset link: /reset-password?token=${token}`);
 */
export const generatePasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  return {
    token,
    hash,
    expiresAt,
  };
};

/**
 * Verify Password Reset Token
 * 
 * @param {string} token - Raw token from email link
 * @param {string} hashedToken - Hashed token from database
 * @returns {boolean} True if token matches
 * 
 * @example
 * const isValid = verifyPasswordResetToken(req.query.token, user.passwordResetToken);
 */
export const verifyPasswordResetToken = (token, hashedToken) => {
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return hash === hashedToken;
};

/**
 * Generate Email Verification Token
 * 
 * Similar to password reset but for email verification.
 * 
 * @returns {Object} Token and its hash
 */
export const generateEmailVerificationToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return {
    token,
    hash,
    expiresAt,
  };
};

/**
 * Decode JWT without verification (for debugging only)
 * 
 * WARNING: Do not use for authentication! This does not verify the signature.
 * Only use for debugging or getting token info before verification.
 * 
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Error decoding token: ' + error.message);
  }
};

/**
 * Check if token is expired (without verification)
 * 
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;

    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiry time
 * 
 * @param {string} token - JWT token
 * @returns {Date|null} Expiry date or null if invalid
 */
export const getTokenExpiry = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

export default {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateTokenPair,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  generateEmailVerificationToken,
  decodeToken,
  isTokenExpired,
  getTokenExpiry,
};
