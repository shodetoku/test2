/**
 * User Model
 * 
 * Core user entity for authentication and authorization in PARMS.
 * Supports multiple user roles: patient, frontdesk, doctor, admin.
 * 
 * Security Features:
 * - Password hashing with bcrypt
 * - Email validation and uniqueness
 * - MFA support placeholder
 * - Account activation/deactivation
 * - Last login tracking
 * 
 * HIPAA Compliance:
 * - Audit trail through timestamps
 * - Role-based access control (RBAC)
 * - Password never returned in queries
 * 
 * @module models/User
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema Definition
 */
const userSchema = new mongoose.Schema(
  {
    // Basic Information
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },

    // Authentication
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Never return password in queries by default
      minlength: [8, 'Password must be at least 8 characters'],
    },

    // Authorization
    role: {
      type: String,
      enum: {
        values: ['patient', 'frontdesk', 'doctor', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'patient',
      required: true,
      index: true,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Multi-Factor Authentication
    mfaEnabled: {
      type: Boolean,
      default: false,
    },

    mfaSecret: {
      type: String,
      select: false, // Never return MFA secret
    },

    // Security Tracking
    lastLogin: {
      type: Date,
      default: null,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    accountLockedUntil: {
      type: Date,
      default: null,
    },

    // Password Reset
    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    // Email Verification
    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    // Refresh Tokens (for JWT)
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        expiresAt: {
          type: Date,
          required: true,
        },
        device: {
          type: String,
        },
        ipAddress: {
          type: String,
        },
      },
    ],

    // Profile Reference (links to Patient or Doctor profile)
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'profileModel',
    },

    profileModel: {
      type: String,
      enum: ['Patient', 'Doctor'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'users',
  }
);

/**
 * Indexes for Performance
 */
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ lastLogin: -1 });

/**
 * Virtual Properties
 */

// Check if account is locked
userSchema.virtual('isLocked').get(function () {
  return !!(this.accountLockedUntil && this.accountLockedUntil > Date.now());
});

/**
 * Instance Methods
 */

/**
 * Compare password with hashed password
 * 
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>} True if password matches
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Check if password was changed after JWT was issued
 * 
 * @param {number} jwtTimestamp - JWT issued timestamp
 * @returns {boolean} True if password was changed after JWT issued
 */
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.updatedAt) {
    const passwordChangedTimestamp = parseInt(
      this.updatedAt.getTime() / 1000,
      10
    );
    return jwtTimestamp < passwordChangedTimestamp;
  }
  return false;
};

/**
 * Increment failed login attempts and lock account if threshold exceeded
 */
userSchema.methods.incrementLoginAttempts = async function () {
  // Reset attempts if lock has expired
  if (this.accountLockedUntil && this.accountLockedUntil < Date.now()) {
    return await this.updateOne({
      $set: {
        failedLoginAttempts: 1,
        accountLockedUntil: null,
      },
    });
  }

  // Increment failed attempts
  const updates = {
    $inc: { failedLoginAttempts: 1 },
  };

  // Lock account after 5 failed attempts for 2 hours
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  if (this.failedLoginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { accountLockedUntil: Date.now() + lockTime };
  }

  return await this.updateOne(updates);
};

/**
 * Reset failed login attempts
 */
userSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $set: {
      failedLoginAttempts: 0,
      accountLockedUntil: null,
      lastLogin: Date.now(),
    },
  });
};

/**
 * Add refresh token
 * 
 * @param {string} token - Refresh token
 * @param {number} expiresIn - Expiry time in milliseconds
 * @param {string} device - Device identifier
 * @param {string} ipAddress - IP address
 */
userSchema.methods.addRefreshToken = async function (
  token,
  expiresIn,
  device = null,
  ipAddress = null
) {
  this.refreshTokens.push({
    token,
    expiresAt: new Date(Date.now() + expiresIn),
    device,
    ipAddress,
  });

  // Keep only last 5 tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }

  return await this.save();
};

/**
 * Remove refresh token
 * 
 * @param {string} token - Refresh token to remove
 */
userSchema.methods.removeRefreshToken = async function (token) {
  this.refreshTokens = this.refreshTokens.filter((rt) => rt.token !== token);
  return await this.save();
};

/**
 * Remove all refresh tokens (logout from all devices)
 */
userSchema.methods.removeAllRefreshTokens = async function () {
  this.refreshTokens = [];
  return await this.save();
};

/**
 * Static Methods
 */

/**
 * Find user by email (including inactive)
 * 
 * @param {string} email - User email
 * @returns {Promise<Object>} User document
 */
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Find active user by email
 * 
 * @param {string} email - User email
 * @returns {Promise<Object>} User document
 */
userSchema.statics.findActiveByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

/**
 * Pre-save Middleware
 */

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash if password is modified
  if (!this.isModified('passwordHash')) {
    return;
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Clean up expired refresh tokens before saving
userSchema.pre('save', function () {
  this.refreshTokens = this.refreshTokens.filter(
    (rt) => rt.expiresAt > Date.now()
  );
});

/**
 * Transform output (remove sensitive fields)
 */
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    delete ret.mfaSecret;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpires;
    delete ret.refreshTokens;
    return ret;
  },
});

/**
 * Create and export User model
 */
const User = mongoose.model('User', userSchema);

export default User;
