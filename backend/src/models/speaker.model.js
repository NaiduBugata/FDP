const mongoose = require('mongoose')

const speakerSchema = new mongoose.Schema(
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
      maxlength: 150,
    },
    org: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },
    topic: {
      type: String,
      trim: true,
      default: '',
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Speaker', speakerSchema)
