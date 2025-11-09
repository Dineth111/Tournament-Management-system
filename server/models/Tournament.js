const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tournament name is required'],
    trim: true,
    maxlength: [100, 'Tournament name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['karate', 'taekwondo', 'judo', 'boxing', 'wrestling', 'other'],
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venue: {
    name: {
      type: String,
      required: [true, 'Venue name is required']
    },
    address: {
      street: String,
      city: { type: String, required: true },
      state: String,
      country: { type: String, required: true },
      zipCode: String
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be at least 1']
    },
    facilities: [String]
  },
  dates: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    checkInTime: Date,
    openingCeremony: Date
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled'],
    default: 'draft'
  },
  categories: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['individual', 'team'],
      required: true
    },
    eventType: {
      type: String,
      enum: ['kata', 'kumite', 'team_kata', 'team_kumite', 'weapons', 'self_defense'],
      required: true
    },
    ageGroups: [{
      name: String,
      minAge: { type: Number, required: true },
      maxAge: { type: Number, required: true }
    }],
    weightClasses: [{
      name: String,
      minWeight: { type: Number, required: true },
      maxWeight: { type: Number, required: true },
      unit: { type: String, enum: ['kg', 'lbs'], default: 'kg' }
    }],
    beltRankRequirements: [{
      type: String,
      enum: ['white', 'yellow', 'orange', 'green', 'blue', 'brown', 'black', 'dan']
    }],
    gender: {
      type: String,
      enum: ['male', 'female', 'mixed'],
      default: 'mixed'
    },
    maxParticipants: Number,
    entryFee: {
      type: Number,
      required: true,
      min: 0
    },
    prizes: [{
      position: Number,
      amount: Number,
      description: String
    }],
    rules: String,
    duration: {
      type: Number,
      default: 3 // minutes
    }
  }],
  registration: {
    isOpen: {
      type: Boolean,
      default: false
    },
    maxParticipants: {
      type: Number,
      required: true,
      min: [1, 'Maximum participants must be at least 1']
    },
    currentParticipants: {
      type: Number,
      default: 0
    },
    requirements: [String],
    requiredDocuments: [String],
    paymentMethods: [{
      type: String,
      enum: ['stripe', 'paypal', 'bank_transfer', 'cash']
    }],
    refundPolicy: String
  },
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
    categories: [String], // Categories this judge is assigned to
    availability: {
      startDate: Date,
      endDate: Date
    }
  }],
  sponsors: [{
    name: String,
    logo: String,
    website: String,
    tier: {
      type: String,
      enum: ['platinum', 'gold', 'silver', 'bronze']
    },
    description: String
  }],
  media: {
    logo: String,
    banner: String,
    gallery: [String],
    videos: [String]
  },
  settings: {
    isPublic: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: true
    },
    autoGenerateSchedule: {
      type: Boolean,
      default: true
    },
    allowLateRegistration: {
      type: Boolean,
      default: false
    },
    lateRegistrationFee: {
      type: Number,
      default: 0
    }
  },
  // Tournament statistics
  stats: {
    totalParticipants: { type: Number, default: 0 },
    totalMatches: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    completionPercentage: { type: Number, default: 0 }
  },
  // AI-generated insights
  aiInsights: {
    optimalSchedule: Object,
    predictedDuration: Number,
    recommendedJudges: [String],
    riskFactors: [String],
    successProbability: Number
  },
  // Reviews and ratings
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Social media and promotion
  socialMedia: {
    hashtag: String,
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },
  // Contact information
  contact: {
    email: String,
    phone: String,
    website: String,
    emergencyContact: {
      name: String,
      phone: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
tournamentSchema.index({ 'dates.startDate': 1, 'dates.endDate': 1 });
tournamentSchema.index({ status: 1 });
tournamentSchema.index({ organizer: 1 });
tournamentSchema.index({ 'venue.address.city': 1 });
tournamentSchema.index({ 'registration.isOpen': 1 });

// Virtual for duration
tournamentSchema.virtual('duration').get(function() {
  if (!this.dates.startDate || !this.dates.endDate) return 0;
  const diffTime = Math.abs(this.dates.endDate - this.dates.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
});

// Virtual for days until registration deadline
tournamentSchema.virtual('daysUntilDeadline').get(function() {
  if (!this.dates.registrationDeadline) return null;
  const now = new Date();
  const deadline = new Date(this.dates.registrationDeadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for average rating
tournamentSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});

// Pre-save middleware to validate dates
tournamentSchema.pre('save', function(next) {
  if (this.dates.startDate >= this.dates.endDate) {
    return next(new Error('End date must be after start date'));
  }
  if (this.dates.registrationDeadline >= this.dates.startDate) {
    return next(new Error('Registration deadline must be before start date'));
  }
  next();
});

// Method to check if registration is open
tournamentSchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  return this.registration.isOpen && 
         now <= this.dates.registrationDeadline && 
         this.status === 'registration_open';
};

// Method to get available categories for a user
tournamentSchema.methods.getAvailableCategories = function(userProfile) {
  const availableCategories = [];
  
  this.categories.forEach(category => {
    const ageMatch = category.ageGroups.some(ageGroup => {
      return userProfile.age >= ageGroup.minAge && userProfile.age <= ageGroup.maxAge;
    });
    
    const weightMatch = !category.weightClasses.length || 
                       category.weightClasses.some(weightClass => {
                         return userProfile.weight >= weightClass.minWeight && 
                                userProfile.weight <= weightClass.maxWeight;
                       });
    
    const beltMatch = !category.beltRankRequirements.length || 
                      category.beltRankRequirements.includes(userProfile.beltRank);
    
    const genderMatch = category.gender === 'mixed' || 
                        category.gender === userProfile.gender;
    
    if (ageMatch && weightMatch && beltMatch && genderMatch) {
      availableCategories.push(category);
    }
  });
  
  return availableCategories;
};

// Static method to get upcoming tournaments
tournamentSchema.statics.getUpcomingTournaments = function(limit = 10) {
  return this.find({
    'dates.startDate': { $gte: new Date() },
    status: { $in: ['published', 'registration_open', 'registration_closed'] }
  })
  .populate('organizer', 'firstName lastName')
  .sort({ 'dates.startDate': 1 })
  .limit(limit);
};

// Static method to get active tournaments
tournamentSchema.statics.getActiveTournaments = function() {
  return this.find({
    status: 'in_progress'
  })
  .populate('organizer', 'firstName lastName')
  .sort({ 'dates.startDate': -1 });
};

module.exports = mongoose.model('Tournament', tournamentSchema);