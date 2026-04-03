const mongoose = require('mongoose')

const committeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    details: {
      type: String,
      trim: true,
      default: '',
      maxlength: 500,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Committee', committeeSchema)
