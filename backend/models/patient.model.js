/**
 * Patient Model
 * 
 * Stores comprehensive patient information including demographics,
 * medical history, insurance, and emergency contacts.
 * 
 * HIPAA Compliance:
 * - Encrypted sensitive fields (future enhancement)
 * - Audit trail through timestamps
 * - Access control through User reference
 * - No PHI exposed in error messages
 * 
 * @module models/Patient
 */

import mongoose from 'mongoose';
import { connectToDatabasePARMS } from '../database/mongodb.js';

/**
 * Address Subdocument Schema
 */
const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    apartment: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      uppercase: true,
      length: 2,
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      match: [/^\d{5}(-\d{4})?$/, 'Please provide a valid ZIP code'],
    },
  },
  { _id: false }
);

/**
 * Emergency Contact Subdocument Schema
 */
const emergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true,
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      enum: ['spouse', 'parent', 'child', 'sibling', 'friend', 'other'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?1?\d{10,15}$/, 'Please provide a valid phone number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email',
      ],
    },
  },
  { _id: false }
);

/**
 * Insurance Information Subdocument Schema
 */
const insuranceSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: [true, 'Insurance provider is required'],
      trim: true,
    },
    policyNumber: {
      type: String,
      required: [true, 'Policy number is required'],
      trim: true,
      uppercase: true,
    },
    groupNumber: {
      type: String,
      trim: true,
    },
    policyHolderName: {
      type: String,
      required: [true, 'Policy holder name is required'],
      trim: true,
    },
    policyHolderRelationship: {
      type: String,
      required: [true, 'Relationship to policy holder is required'],
      enum: ['self', 'spouse', 'parent', 'child', 'other'],
    },
    effectiveDate: {
      type: Date,
      required: [true, 'Effective date is required'],
    },
    expirationDate: {
      type: Date,
    },
    copay: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

/**
 * Medical History Subdocument Schema
 */
const medicalHistorySchema = new mongoose.Schema(
  {
    allergies: [
      {
        allergen: String,
        reaction: String,
        severity: {
          type: String,
          enum: ['mild', 'moderate', 'severe'],
        },
      },
    ],
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    conditions: [
      {
        name: String,
        diagnosedDate: Date,
        status: {
          type: String,
          enum: ['active', 'resolved', 'chronic'],
          default: 'active',
        },
      },
    ],
    surgeries: [
      {
        procedure: String,
        date: Date,
        hospital: String,
        notes: String,
      },
    ],
  },
  { _id: false }
);

/**
 * Patient Schema Definition
 */
const patientSchema = new mongoose.Schema(
  {
    // Reference to User account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
      index: true,
    },

    // Demographics
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },

    middleName: {
      type: String,
      trim: true,
      maxlength: [50, 'Middle name cannot exceed 50 characters'],
    },

    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function (value) {
          return value < new Date();
        },
        message: 'Date of birth must be in the past',
      },
    },

    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['male', 'female', 'other', 'prefer-not-to-say'],
        message: '{VALUE} is not a valid gender option',
      },
    },

    // Contact Information
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?1?\d{10,15}$/, 'Please provide a valid phone number'],
    },

    address: {
      type: addressSchema,
      required: [true, 'Address is required'],
    },

    // Medical Record Number (auto-generated)
    mrn: {
      type: String,
      unique: true,
      uppercase: true,
      index: true,
    },

    // Social Security Number (encrypted in production)
    ssn: {
      type: String,
      select: false, // Never return in queries
      match: [/^\d{3}-\d{2}-\d{4}$/, 'Invalid SSN format'],
    },

    // Blood Type
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
      default: 'unknown',
    },

    // Emergency Contact
    emergencyContact: {
      type: emergencyContactSchema,
      required: [true, 'Emergency contact is required'],
    },

    // Insurance Information
    insurance: {
      type: insuranceSchema,
    },

    // Medical History
    medicalHistory: {
      type: medicalHistorySchema,
      default: {},
    },

    // Preferred Language
    preferredLanguage: {
      type: String,
      default: 'English',
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'inactive', 'deceased'],
      default: 'active',
      index: true,
    },

    // Primary Care Physician
    primaryPhysician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },

    // Notes (for internal use)
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    collection: 'patients',
  }
);

/**
 * Indexes for Performance
 */
patientSchema.index({ lastName: 1, firstName: 1 });
patientSchema.index({ dateOfBirth: 1 });

/**
 * Virtual Properties
 */

// Full name
patientSchema.virtual('fullName').get(function () {
  if (this.middleName) {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }
  return `${this.firstName} ${this.lastName}`;
});

// Age calculation
patientSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

/**
 * Pre-save Middleware
 */

// Generate MRN (Medical Record Number) before saving
patientSchema.pre('save', async function () {
  if (!this.mrn) {
    // Generate unique MRN: PAT + 8 random alphanumeric characters
    const generateMRN = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let mrn = 'PAT';
      for (let i = 0; i < 8; i++) {
        mrn += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return mrn;
    };

    // Ensure uniqueness
    let mrnExists = true;
    let newMRN;
    
    while (mrnExists) {
      newMRN = generateMRN();
      const existing = await this.constructor.findOne({ mrn: newMRN });
      if (!existing) {
        mrnExists = false;
      }
    }
    
    this.mrn = newMRN;
  }
});

/**
 * Static Methods
 */

/**
 * Find patient by MRN
 * 
 * @param {string} mrn - Medical Record Number
 * @returns {Promise<Object>} Patient document
 */
patientSchema.statics.findByMRN = function (mrn) {
  return this.findOne({ mrn: mrn.toUpperCase() });
};

/**
 * Find patients by name (case-insensitive search)
 * 
 * @param {string} name - Patient name (first, last, or full)
 * @returns {Promise<Array>} Array of patient documents
 */
patientSchema.statics.searchByName = function (name) {
  const searchRegex = new RegExp(name, 'i');
  return this.find({
    $or: [
      { firstName: searchRegex },
      { lastName: searchRegex },
    ],
  });
};

/**
 * Transform output (remove sensitive fields)
 */
patientSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.ssn; // Never expose SSN
    return ret;
  },
});

/**
 * Create and export Patient model
 * Uses PARMS database connection
 */
let Patient;

export async function getPatientModel() {
  if (!Patient) {
    const connection = await connectToDatabasePARMS();
    Patient = connection.model('Patient', patientSchema);
  }
  return Patient;
}

// Export initialized model (will be undefined until database connects)
export default Patient;
