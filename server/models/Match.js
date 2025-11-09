const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  judge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scores: {
    technical: {
      type: Number,
      min: [0, 'Technical score cannot be negative'],
      max: [10, 'Technical score cannot exceed 10']
    },
    athletic: {
      type: Number,
      min: [0, 'Athletic score cannot be negative'],
      max: [10, 'Athletic score cannot exceed 10']
    },
    focus: {
      type: Number,
      min: [0, 'Focus score cannot be negative'],
      max: [10, 'Focus score cannot exceed 10']
    },
    speed: {
      type: Number,
      min: [0, 'Speed score cannot be negative'],
      max: [10, 'Speed score cannot exceed 10']
    },
    strength: {
      type: Number,
      min: [0, 'Strength score cannot be negative'],
      max: [10, 'Strength score cannot exceed 10']
    },
    stamina: {
      type: Number,
      min: [0, 'Stamina score cannot be negative'],
      max: [10, 'Stamina score cannot exceed 10']
    }
  },
  totalScore: {
    type: Number,
    min: 0,
    max: 60
  },
  notes: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const matchSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  category: {
    name: String,
    type: String,
    eventType: String,
    gender: String,
    ageGroup: String,
    weightClass: String
  },
  round: {
    type: String,
    enum: ['qualifier', 'preliminary', 'quarterfinal', 'semifinal', 'final', 'exhibition'],
    required: true
  },
  matchNumber: {
    type: Number,
    required: true
  },
  participants: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    seed: Number,
    scores: [scoreSchema],
    averageScore: {
      type: Number,
      default: 0
    },
    result: {
      type: String,
      enum: ['win', 'loss', 'draw', 'disqualified', 'injury', 'no_show'],
      default: null
    },
    isWinner: {
      type: Boolean,
      default: false
    },
    notes: String
  }],
  judges: [{
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['head_judge', 'corner_judge', 'referee', 'scorekeeper'],
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  schedule: {
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    estimatedDuration: {
      type: Number,
      default: 5 // minutes
    },
    mat: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'],
    default: 'scheduled'
  },
  result: {
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    method: {
      type: String,
      enum: ['points', 'decision', 'disqualification', 'injury', 'walkover', 'technical']
    },
    details: String,
    scores: {
      player1: Number,
      player2: Number
    }
  },
  // AI-generated insights
  aiInsights: {
    predictedWinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    winProbability: {
      player1: Number,
      player2: Number
    },
    expectedScoreDifference: Number,
    keyFactors: [String]
  },
  // Match statistics
  stats: {
    totalScores: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    duration: { type: Number, default: 0 }, // in minutes
    interruptions: { type: Number, default: 0 },
    violations: { type: Number, default: 0 }
  },
  // Live updates
  liveUpdates: [{
    type: {
      type: String,
      enum: ['score_update', 'status_change', 'violation', 'injury', 'timeout', 'resume']
    },
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Video recording
  video: {
    url: String,
    thumbnail: String,
    duration: Number,
    quality: String,
    isAvailable: {
      type: Boolean,
      default: false
    }
  },
  // Match notes and comments
  notes: String,
  // Disqualification or injury details
  incidents: [{
    type: {
      type: String,
      enum: ['violation', 'injury', 'disqualification', 'forfeit']
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    description: String,
    timestamp: Date,
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
matchSchema.index({ tournament: 1, 'schedule.date': 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ 'participants.player': 1 });
matchSchema.index({ 'judges.judge': 1 });
matchSchema.index({ round: 1, 'schedule.mat': 1, 'schedule.order': 1 });

// Virtual for match identifier
matchSchema.virtual('matchId').get(function() {
  return `${this.tournament.toString().slice(-4)}-${this.category.name}-${this.round}-${this.matchNumber}`;
});

// Virtual for estimated end time
matchSchema.virtual('estimatedEndTime').get(function() {
  if (!this.schedule.startTime) return null;
  const endTime = new Date(this.schedule.startTime);
  endTime.setMinutes(endTime.getMinutes() + this.schedule.estimatedDuration);
  return endTime;
});

// Virtual for participant count
matchSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Pre-save middleware to calculate average scores
matchSchema.pre('save', function(next) {
  this.participants.forEach(participant => {
    if (participant.scores.length > 0) {
      const totalScore = participant.scores.reduce((sum, score) => {
        return sum + (score.totalScore || 0);
      }, 0);
      participant.averageScore = totalScore / participant.scores.length;
    }
  });
  next();
});

// Method to add score
matchSchema.methods.addScore = function(playerId, judgeId, scores, notes = '') {
  const participant = this.participants.find(p => p.player.toString() === playerId.toString());
  if (!participant) {
    throw new Error('Player not found in this match');
  }
  
  const judge = this.judges.find(j => j.judge.toString() === judgeId.toString());
  if (!judge) {
    throw new Error('Judge not assigned to this match');
  }
  
  // Calculate total score
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  const scoreEntry = {
    judge: judgeId,
    scores: scores,
    totalScore: totalScore,
    notes: notes
  };
  
  participant.scores.push(scoreEntry);
  
  // Update average score
  const allScores = participant.scores.map(s => s.totalScore);
  participant.averageScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
  
  return this.save();
};

// Method to determine winner
matchSchema.methods.determineWinner = function() {
  if (this.participants.length !== 2) {
    throw new Error('Can only determine winner for matches with exactly 2 participants');
  }
  
  const [player1, player2] = this.participants;
  
  if (player1.averageScore > player2.averageScore) {
    player1.isWinner = true;
    player1.result = 'win';
    player2.result = 'loss';
    this.result.winner = player1.player;
  } else if (player2.averageScore > player1.averageScore) {
    player2.isWinner = true;
    player2.result = 'win';
    player1.result = 'loss';
    this.result.winner = player2.player;
  } else {
    // Draw - could implement tie-breaker logic here
    player1.result = 'draw';
    player2.result = 'draw';
  }
  
  this.result.method = 'points';
  this.result.scores = {
    player1: player1.averageScore,
    player2: player2.averageScore
  };
  
  return this.save();
};

// Method to add live update
matchSchema.methods.addLiveUpdate = function(type, description, judgeId) {
  this.liveUpdates.push({
    type: type,
    description: description,
    judge: judgeId,
    timestamp: new Date()
  });
  
  return this.save();
};

// Static method to get matches by tournament and status
matchSchema.statics.getMatchesByTournament = function(tournamentId, status = null) {
  const query = { tournament: tournamentId };
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('participants.player', 'firstName lastName avatar playerProfile')
    .populate('judges.judge', 'firstName lastName')
    .populate('result.winner', 'firstName lastName')
    .sort({ 'schedule.date': 1, 'schedule.order': 1 });
};

// Static method to get matches by player
matchSchema.statics.getMatchesByPlayer = function(playerId) {
  return this.find({ 'participants.player': playerId })
    .populate('tournament', 'name dates venue')
    .populate('participants.player', 'firstName lastName avatar')
    .sort({ 'schedule.date': -1 });
};

// Static method to get matches by judge
matchSchema.statics.getMatchesByJudge = function(judgeId) {
  return this.find({ 'judges.judge': judgeId })
    .populate('tournament', 'name dates venue')
    .populate('participants.player', 'firstName lastName avatar')
    .sort({ 'schedule.date': -1 });
};

// Static method to get upcoming matches
matchSchema.statics.getUpcomingMatches = function(limit = 20) {
  const now = new Date();
  return this.find({
    status: 'scheduled',
    'schedule.startTime': { $gte: now }
  })
    .populate('tournament', 'name')
    .populate('participants.player', 'firstName lastName avatar')
    .sort({ 'schedule.startTime': 1 })
    .limit(limit);
};

module.exports = mongoose.model('Match', matchSchema);