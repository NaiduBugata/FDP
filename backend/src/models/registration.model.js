const mongoose = require('mongoose')

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
    signature: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Registration', registrationSchema)
