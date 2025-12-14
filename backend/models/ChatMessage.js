const mongoose = require('mongoose');

// Stores a single Q/A turn between user and assistant
// For guests, user will be null and role will be 'guest'
const chatMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    role: {
      type: String,
      enum: ['guest', 'admin', 'player', 'judge', 'coach', 'organizer'],
      default: 'guest',
    },
    message: { type: String, required: true },
    reply: { type: String, required: true },
    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);