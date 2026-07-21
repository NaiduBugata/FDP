const mongoose = require('mongoose')

const PARTICIPANT_TYPES = [
  'Faculty',
  'Researchers',
  'Ph.D. Scholars',
  'Clinicians & Industry Persons',
]

const registrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    designation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    participantType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    mode: {
      type: String,
      required: true,
      enum: ['Online', 'Offline'],
    },
    apaarId: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    // Kept for older records only; new registrations no longer collect photos.
    passportPhoto: {
      type: String,
      trim: true,
      default: '',
    },
    declaration: {
      type: String,
      required: true,
      enum: ['Yes', 'No'],
    },
    // Kept for older records only; new registrations no longer collect signatures.
    signature: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'New_Registrations',
  },
)

const Registration = mongoose.model('NewRegistration', registrationSchema)
Registration.PARTICIPANT_TYPES = PARTICIPANT_TYPES

module.exports = Registration
