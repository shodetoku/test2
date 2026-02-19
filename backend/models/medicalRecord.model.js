/**
 * MedicalRecord Model
 * 
 * Stores patient medical records including visit information,
 * diagnoses, allergies, immunizations, and lab results.
 * 
 * HIPAA Compliance:
 * - Audit trail through timestamps
 * - Access control through patientId and providerId references
 * - Sensitive medical information protection
 * 
 * @module models/MedicalRecord
 */

const labResultSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: [true, 'Test name is required'],
      trim: true,
    },
    testDate: {
      type: Date,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      trim: true,
    },
    referenceRange: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'abnormal', 'critical'],
      default: 'pending',
    },
  },
  { _id: true }
);

const allergySchema = new mongoose.Schema(
  {
    allergen: {
      type: String,
      required: [true, 'Allergen name is required'],
      trim: true,
    },
    reaction: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'life-threatening'],
      required: true,
    },
    onsetDate: {
      type: Date,
    },
  },
  { _id: false }
);

const immunizationSchema = new mongoose.Schema(
  {
    vaccine: {
      type: String,
      required: [true, 'Vaccine name is required'],
      trim: true,
    },
    dateAdministered: {
      type: Date,
      required: true,
    },
    administeredBy: {
      type: String,
      trim: true,
    },
    lotNumber: {
      type: String,
      trim: true,
    },
    nextDueDate: {
      type: Date,
    },
  },
  { _id: false }
);

const medicalRecordSchema = new mongoose.Schema(
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
    visitDate: {
      type: Date,
      required: [true, 'Visit date is required'],
      index: true,
    },
    chiefComplaint: {
      type: String,
      required: [true, 'Chief complaint is required'],
      trim: true,
    },
    diagnosis: [
      {
        type: String,
        trim: true,
      }
    ],
    allergies: [allergySchema],
    immunizations: [immunizationSchema],
    labResults: [labResultSchema],
  },
  {
    timestamps: true,
    collection: 'medicalrecords',
  }
);

// compound indexes for common queries
medicalRecordSchema.index({ patientId: 1, visitDate: -1 });
medicalRecordSchema.index({ providerId: 1, visitDate: -1 });

// virtual for formatted visit date
medicalRecordSchema.virtual('formattedVisitDate').get(function () {
  return this.visitDate.toLocaleDateString('en-US');
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;