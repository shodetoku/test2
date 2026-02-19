/**
 * Doctor Model
 * 
 * Stores doctor/physician information including credentials,
 * specialties, availability, and professional details.
 * 
 * Features:
 * - Professional credentials tracking
 * - Specialty and subspecialty management
 * - Availability scheduling
 * - Patient capacity management
 * - License verification status
 * 
 * @module models/Doctor
 */

import mongoose from 'mongoose';

/**
 * Availability Schedule Subdocument Schema
 * Defines doctor's weekly availability
 */
const availabilitySchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: String,
      required: true,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)'],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

/**
 * Education Subdocument Schema
 */
const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
      enum: ['MD', 'DO', 'MBBS', 'PhD', 'Other'],
    },
    institution: {
      type: String,
      required: true,
    },
    graduationYear: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear(),
    },
    fieldOfStudy: {
      type: String,
    },
  },
  { _id: true }
);

/**
 * Certification Subdocument Schema
 */
const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    issuingOrganization: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expirationDate: {
      type: Date,
    },
    certificationNumber: {
      type: String,
    },
  },
  { _id: true }
);

/**
 * Doctor Schema Definition
 */
const doctorSchema = new mongoose.Schema(
  {
    // Reference to User account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
      index: true,
    },

    // Personal Information
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

    // Professional Title
    title: {
      type: String,
      enum: ['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.'],
      default: 'Dr.',
    },

    // Contact Information
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?1?\d{10,15}$/, 'Please provide a valid phone number'],
    },

    officePhone: {
      type: String,
      match: [/^\+?1?\d{10,15}$/, 'Please provide a valid phone number'],
    },

    // Medical License
    licenseNumber: {
      type: String,
      required: [true, 'Medical license number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    licenseState: {
      type: String,
      required: [true, 'License state is required'],
      uppercase: true,
      length: 2,
    },

    licenseExpirationDate: {
      type: Date,
      required: [true, 'License expiration date is required'],
    },

    licenseVerified: {
      type: Boolean,
      default: false,
    },

    // NPI (National Provider Identifier)
    npiNumber: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^\d{10}$/, 'NPI must be exactly 10 digits'],
    },

    // DEA Number (for controlled substances prescription)
    deaNumber: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      select: false, // Sensitive information
    },

    // Specialization
    specialty: {
      type: String,
      required: [true, 'Medical specialty is required'],
      enum: [
        'General Practice',
        'Internal Medicine',
        'Pediatrics',
        'Cardiology',
        'Dermatology',
        'Orthopedics',
        'Neurology',
        'Psychiatry',
        'Obstetrics & Gynecology',
        'Ophthalmology',
        'Oncology',
        'Radiology',
        'Anesthesiology',
        'Emergency Medicine',
        'Family Medicine',
        'Surgery',
        'Other',
      ],
      index: true,
    },

    subspecialties: [
      {
        type: String,
      },
    ],

    // Education
    education: [educationSchema],

    // Certifications
    certifications: [certificationSchema],

    // Years of Experience
    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 70,
    },

    // Biography
    biography: {
      type: String,
      maxlength: [1000, 'Biography cannot exceed 1000 characters'],
    },

    // Languages Spoken
    languages: [
      {
        type: String,
        default: 'English',
      },
    ],

    // Availability Schedule
    availability: [availabilitySchema],

    // Patient Capacity
    maxPatientsPerDay: {
      type: Number,
      default: 20,
      min: 1,
      max: 100,
    },

    appointmentDuration: {
      type: Number, // in minutes
      default: 30,
      min: 15,
      max: 120,
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'on-leave', 'inactive', 'retired'],
      default: 'active',
      index: true,
    },

    // Accepting New Patients
    acceptingNewPatients: {
      type: Boolean,
      default: true,
    },

    // Consultation Fee
    consultationFee: {
      type: Number,
      min: 0,
    },

    // Office Address
    officeAddress: {
      building: String,
      room: String,
      floor: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },

    // Hospital Affiliations
    hospitalAffiliations: [
      {
        hospitalName: String,
        role: String,
        startDate: Date,
        endDate: Date,
      },
    ],

    // Professional Memberships
    professionalMemberships: [
      {
        organization: String,
        membershipNumber: String,
        joinDate: Date,
      },
    ],

    // Rating and Reviews
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    // Statistics
    totalPatients: {
      type: Number,
      default: 0,
    },

    totalAppointments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'doctors',
  }
);

/**
 * Indexes for Performance
 */
doctorSchema.index({ specialty: 1, status: 1 });
doctorSchema.index({ lastName: 1, firstName: 1 });
doctorSchema.index({ acceptingNewPatients: 1, status: 1 });
doctorSchema.index({ averageRating: -1 });

/**
 * Virtual Properties
 */

// Full name with title
doctorSchema.virtual('fullName').get(function () {
  if (this.middleName) {
    return `${this.title} ${this.firstName} ${this.middleName} ${this.lastName}`;
  }
  return `${this.title} ${this.firstName} ${this.lastName}`;
});

// Check if license is expired
doctorSchema.virtual('isLicenseExpired').get(function () {
  return this.licenseExpirationDate < new Date();
});

// Check if accepting appointments
doctorSchema.virtual('isAcceptingAppointments').get(function () {
  return (
    this.status === 'active' &&
    this.acceptingNewPatients &&
    !this.isLicenseExpired
  );
});

/**
 * Instance Methods
 */

/**
 * Check if doctor is available on a specific day
 * 
 * @param {string} dayOfWeek - Day of week (e.g., 'monday')
 * @returns {boolean} True if available
 */
doctorSchema.methods.isAvailableOnDay = function (dayOfWeek) {
  return this.availability.some(
    (slot) =>
      slot.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase() &&
      slot.isAvailable
  );
};

/**
 * Get available time slots for a specific day
 * 
 * @param {string} dayOfWeek - Day of week
 * @returns {Array} Array of available time slots
 */
doctorSchema.methods.getAvailableSlots = function (dayOfWeek) {
  return this.availability.filter(
    (slot) =>
      slot.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase() &&
      slot.isAvailable
  );
};

/**
 * Update patient statistics
 */
doctorSchema.methods.incrementPatientCount = async function () {
  this.totalPatients += 1;
  return await this.save();
};

/**
 * Update appointment statistics
 */
doctorSchema.methods.incrementAppointmentCount = async function () {
  this.totalAppointments += 1;
  return await this.save();
};

/**
 * Static Methods
 */

/**
 * Find doctors by specialty
 * 
 * @param {string} specialty - Medical specialty
 * @returns {Promise<Array>} Array of doctor documents
 */
doctorSchema.statics.findBySpecialty = function (specialty) {
  return this.find({
    specialty,
    status: 'active',
  });
};

/**
 * Find available doctors accepting new patients
 * 
 * @returns {Promise<Array>} Array of doctor documents
 */
doctorSchema.statics.findAvailableDoctors = function () {
  return this.find({
    status: 'active',
    acceptingNewPatients: true,
    licenseExpirationDate: { $gt: new Date() },
  });
};

/**
 * Search doctors by name
 * 
 * @param {string} name - Doctor name
 * @returns {Promise<Array>} Array of doctor documents
 */
doctorSchema.statics.searchByName = function (name) {
  const searchRegex = new RegExp(name, 'i');
  return this.find({
    $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
  });
};

/**
 * Pre-save Middleware
 */

// Validate license expiration
doctorSchema.pre('save', function () {
  if (this.licenseExpirationDate < new Date()) {
    this.status = 'inactive';
    this.acceptingNewPatients = false;
  }
});

/**
 * Transform output (remove sensitive fields)
 */
doctorSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.deaNumber; // Never expose DEA number
    return ret;
  },
});

/**
 * Create and export Doctor model
 */
const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
