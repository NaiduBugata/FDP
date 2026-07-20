const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    date: {
      type: Date,
    },
    startTime: {
      type: String,
      trim: true,
      default: '',
    },
    endTime: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
      maxlength: 200,
    },
    speaker: {
      type: String,
      trim: true,
      default: '',
      maxlength: 120,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Schedule', scheduleSchema)
