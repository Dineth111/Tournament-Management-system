const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  ageGroup: {
    type: String,
    required: true,
    enum: ['U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'U21', 'Senior']
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Mixed']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);