/**
 * Prescription Model
 * 
 * Stores patient prescription information including medication details,
 * dosage, frequency, and prescription status tracking.
 * 
 * HIPAA Compliance:
 * - Audit trail through timestamps
 * - Access control through patientId and providerId references
 * - Secure medication information handling
 * 
 * @module models/Prescription
 */

import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
      index: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Provider ID is required'],
      index: true,
    },
    medication: {
      type: String,
      required: [true, 'Medication name is required'],
      trim: true,
      index: true, // for searching by medication
    },
    dosage: {
      type: String,
      required: [true, 'Dosage is required'],
      trim: true,
      // Example: "500mg", "10ml", "2 tablets"
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      trim: true,
      // Example: "twice daily", "every 6 hours", "as needed"
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      index: true,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function(value) {
          // endDate must be after startDate
          return value > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status'
      },
      default: 'active',
      required: true,
      index: true,
    },
    // Optional but useful fields:
    instructions: {
      type: String,
      trim: true,
      // Example: "Take with food", "Do not crush"
    },
    refillsAllowed: {
      type: Number,
      default: 0,
      min: [0, 'Refills cannot be negative'],
    },
    refillsRemaining: {
      type: Number,
      default: 0,
      min: [0, 'Refills remaining cannot be negative'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'prescriptions',
  }
);

// find all active prescriptions for a patient
prescriptionSchema.index({ patientId: 1, status: 1 });

// find all prescriptions by a provider, sorted by date
prescriptionSchema.index({ providerId: 1, startDate: -1 });

// find active prescriptions ending soon (for renewal alerts)
prescriptionSchema.index({ status: 1, endDate: 1 });

/**
 * Mark prescription as completed
 */
prescriptionSchema.methods.complete = function() {
  this.status = 'completed';
  return this.save();
};

/**
 * Cancel prescription
 */
prescriptionSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

/**
 * Check if prescription is currently active
 */
prescriptionSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    this.startDate <= now &&
    this.endDate >= now
  );
};

/**
 * Process a refill
 */
prescriptionSchema.methods.processRefill = function() {
  if (this.refillsRemaining <= 0) {
    throw new Error('No refills remaining');
  }
  if (this.status !== 'active') {
    throw new Error('Cannot refill inactive prescription');
  }
  
  this.refillsRemaining -= 1;
  return this.save();
};

/**
 * Find all active prescriptions for a patient
 */
prescriptionSchema.statics.findActiveByPatient = function(patientId) {
  return this.find({
    patientId: patientId,
    status: 'active',
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  }).sort({ startDate: -1 });
};

/**
 * Find prescriptions expiring soon (within next 7 days)
 */
prescriptionSchema.statics.findExpiringSoon = function(patientId, days = 7) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return this.find({
    patientId: patientId,
    status: 'active',
    endDate: { $gte: now, $lte: futureDate }
  });
};

/**
 * Pre-save hook to auto-complete expired prescriptions
 */
prescriptionSchema.pre('save', function(next) {
  const now = new Date();
  
  // Auto-complete if end date has passed
  if (this.status === 'active' && this.endDate < now) {
    this.status = 'completed';
  }
  
  // Validate refills
  if (this.refillsRemaining > this.refillsAllowed) {
    this.refillsRemaining = this.refillsAllowed;
  }
  
  next();
});

/**
 * Get duration in days
 */
prescriptionSchema.virtual('durationDays').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

/**
 * Get days remaining
 */
prescriptionSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  if (this.endDate < now) return 0;
  
  const diffTime = this.endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

/**
 * Check if prescription is expired
 */
prescriptionSchema.virtual('isExpired').get(function() {
  return this.endDate < new Date();
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;