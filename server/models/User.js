const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'player', 'judge', 'coach', 'organizer'],
    default: 'player'
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date,
    required: function() { return this.role === 'player'; }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function() { return this.role === 'player'; }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  // Player-specific fields
  playerProfile: {
    beltRank: {
      type: String,
      enum: ['white', 'yellow', 'orange', 'green', 'blue', 'brown', 'black', 'dan'],
      required: function() { return this.role === 'player'; }
    },
    weight: {
      type: Number,
      required: function() { return this.role === 'player'; },
      min: [20, 'Weight must be at least 20kg'],
      max: [200, 'Weight cannot exceed 200kg']
    },
    height: {
      type: Number,
      required: function() { return this.role === 'player'; },
      min: [100, 'Height must be at least 100cm'],
      max: [250, 'Height cannot exceed 250cm']
    },
    dojo: {
      type: String,
      required: function() { return this.role === 'player'; }
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    },
    medicalInfo: {
      allergies: [String],
      conditions: [String],
      medications: [String]
    }
  },
  // Judge-specific fields
  judgeProfile: {
    licenseNumber: String,
    certificationLevel: {
      type: String,
      enum: ['regional', 'national', 'international']
    },
    yearsOfExperience: Number,
    specializations: [String]
  },
  // Coach-specific fields
  coachProfile: {
    licenseNumber: String,
    certificationLevel: String,
    yearsOfExperience: Number,
    dojoName: String,
    dojoAddress: String,
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  // Organizer-specific fields
  organizerProfile: {
    organizationName: String,
    organizationType: String,
    taxId: String,
    website: String
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpire: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  lastLogin: Date,
  // Statistics
  stats: {
    tournamentsParticipated: { type: Number, default: 0 },
    tournamentsWon: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    ranking: { type: Number, default: 0 }
  },
  // Payment information
  paymentInfo: {
    customerId: String, // Stripe customer ID
    subscriptionId: String,
    paymentMethod: String
  },
  // Preferences
  preferences: {
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    privacy: {
      profileVisible: { type: Boolean, default: true },
      statsVisible: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'playerProfile.dojo': 1 });
userSchema.index({ 'playerProfile.beltRank': 1 });
userSchema.index({ 'playerProfile.weight': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for profile completion percentage
userSchema.virtual('profileCompletion').get(function() {
  let totalFields = 0;
  let completedFields = 0;
  
  // Basic fields
  const basicFields = ['firstName', 'lastName', 'email', 'phone'];
  basicFields.forEach(field => {
    totalFields++;
    if (this[field]) completedFields++;
  });
  
  // Role-specific fields
  if (this.role === 'player' && this.playerProfile) {
    const playerFields = ['beltRank', 'weight', 'height', 'dojo'];
    playerFields.forEach(field => {
      totalFields++;
      if (this.playerProfile[field]) completedFields++;
    });
  }
  
  return Math.round((completedFields / totalFields) * 100);
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get JWT token
userSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Method to generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  return resetToken;
};

// Method to generate verification token
userSchema.methods.getVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Static method to find users by role and dojo
userSchema.statics.findByRoleAndDojo = function(role, dojo) {
  return this.find({ role, 'playerProfile.dojo': dojo });
};

// Static method to get top performers
userSchema.statics.getTopPerformers = function(limit = 10) {
  return this.find({ role: 'player' })
    .sort({ 'stats.averageScore': -1, 'stats.tournamentsWon': -1 })
    .limit(limit)
    .select('firstName lastName avatar stats playerProfile');
};

module.exports = mongoose.model('User', userSchema);