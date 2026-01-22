const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: false
  },
  experience: {
    type: String,
    required: false
  },
  certifications: [{
    type: String
  }],
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coach', coachSchema);