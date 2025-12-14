const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: false
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false
  },
  value: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: false,
    enum: ['goals', 'assists', 'yellow_cards', 'red_cards', 'minutes_played']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Score', scoreSchema);