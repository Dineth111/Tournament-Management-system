const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const Registration = require('../models/Registration');
const Payment = require('../models/Payment');
const { translateText } = require('../utils/translation');

/**
 * AI Chatbot for Tournament Management System
 * Provides multilingual support and context-aware responses
 */

// Chatbot configuration
const CHATBOT_CONFIG = {
  primaryLanguage: 'en',
  supportedLanguages: ['en', 'si'], // English, Sinhala
  maxContextMessages: 10,
  confidenceThreshold: 0.7,
  fallbackResponse: "I apologize, but I don't understand that question. Could you please rephrase or ask about tournaments, matches, registration, or payments?"
};

// Intent patterns for different languages
const INTENT_PATTERNS = {
  en: {
    greeting: /\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i,
    tournament_info: /\b(tournament|competition|event|match|game)\b.*\b(info|information|details|when|where|who)\b/i,
    registration: /\b(regist|sign up|join|enroll|apply)\b/i,
    schedule: /\b(schedule|time|date|when|timetable|calendar)\b/i,
    results: /\b(result|score|winner|outcome|final)\b/i,
    payment: /\b(pay|payment|fee|cost|price|money)\b/i,
    profile: /\b(profile|account|my|me|dashboard)\b/i,
    help: /\b(help|support|assist|guide|how to)\b/i,
    language: /\b(language|sinhala|english|translate)\b/i
  },
  si: {
    greeting: /\b(ආයුබෝවන්|හෙලෝ|හායි)\b/i,
    tournament_info: /\b(ටුර්නමන්ට්|ප්‍රතිසන්ධානය|මැච්|ක්‍රීඩාව)\b.*\b(තොරතුරු|විස්තර|කවදා|කොහේද|කවුද)\b/i,
    registration: /\b(ලියාපදිංචි|සම්බන්ධ|එකතු)\b/i,
    schedule: /\b(කාලසටහන්|වේලාව|දිනය|කවදා)\b/i,
    results: /\b(ප්‍රතිඵල|ලකුණු|ජයග්‍රාහක|අවසන්)\b/i,
    payment: /\b(ගෙවීම|ගාස්තුව|මුදල්|මිල)\b/i,
    profile: /\b(පැතිකඩ|ගිණුම|මගේ)\b/i,
    help: /\b(උදව්|සහය|මාර්ගෝපදේශ)\b/i,
    language: /\b(භාෂාව|සිංහල|ඉංග්‍රීසි|පරිවර්තන)\b/i
  }
};

// Response templates
const RESPONSE_TEMPLATES = {
  en: {
    greeting: "Hello! I'm your tournament assistant. How can I help you today?",
    help: "I can help you with:\n• Tournament information and schedules\n• Registration assistance\n• Match results and scores\n• Payment information\n• Profile management\n• Language switching (English/Sinhala)\n\nWhat would you like to know about?",
    language_switch: "I will respond in Sinhala from now on. How can I assist you?",
    unknown_tournament: "I couldn't find that tournament. Please check the tournament name or ID and try again.",
    no_matches: "No matches found for this tournament yet.",
    no_registrations: "You don't have any active registrations.",
    payment_success: "Your payment has been processed successfully!",
    registration_success: "Registration completed successfully!"
  },
  si: {
    greeting: "ආයුබෝවන්! මම ඔබේ ටුර්නමන්ට් සහායකයා. මට ඔබට කෙසේ උදව් කළ හැකිද?",
    help: "මට ඔබට මෙවැනි දේවල් වලට උදව් කළ හැක:\n• ටුර්නමන්ට් තොරතුරු සහ කාලසටහන්\n• ලියාපදිංචි උදව්\n• මැච් ප්‍රතිඵල සහ ලකුණු\n• ගෙවීම් තොරතුරු\n• පැතිකඩ කළමනාකරණය\n• භාෂා මාරු (සිංහල/ඉංග්‍රීසි)\n\nඔබට කුමක් ගැන දැනගන්න අවශ්‍යද?",
    language_switch: "මම දැන් සිංහලෙන් පිළිතුරු දෙන්නෙමි. මට ඔබට කෙසේ උදව් කළ හැකිද?",
    unknown_tournament: "මට ඒ ටුර්නමන්ට් හමු වූයේ නැහැ. කරුණාකර ටුර්නමන්ට් නම හෝ ID පරීක්ෂා කර නැවත උත්සාහ කරන්න.",
    no_matches: "මෙම ටුර්නමන්ට් සඳහා තවමත් මැච් නොමැත.",
    no_registrations: "ඔබට ක්‍රියාකාරී ලියාපදිංචි කිසිවක් නොමැත.",
    payment_success: "ඔබේ ගෙවීම සාර්ථකව සම්පූර්ණ විය!",
    registration_success: "ලියාපදිංචිය සාර්ථකව සම්පූර්ණ විය!"
  }
};

/**
 * Main chatbot function to process user messages
 */
async function processChatMessage(userId, message, context = {}) {
  try {
    console.log(`Processing chat message for user ${userId}: ${message}`);

    // Detect language and translate if necessary
    const detectedLanguage = detectLanguage(message);
    let processedMessage = message;
    let targetLanguage = context.language || CHATBOT_CONFIG.primaryLanguage;

    // Translate to English for processing if message is in Sinhala
    if (detectedLanguage === 'si' && targetLanguage === 'en') {
      processedMessage = await translateText(message, 'en');
    }

    // Extract intent and entities
    const { intent, entities } = extractIntent(processedMessage, detectedLanguage);

    // Get user context
    const userContext = await getUserContext(userId);

    // Generate response
    const response = await generateResponse(intent, entities, userContext, targetLanguage);

    // Translate response back to user's language if needed
    if (targetLanguage === 'si' && detectedLanguage === 'si') {
      response.text = await translateText(response.text, 'si');
    }

    return {
      text: response.text,
      intent: intent,
      confidence: response.confidence,
      suggestions: response.suggestions || [],
      context: {
        language: targetLanguage,
        lastIntent: intent,
        timestamp: new Date()
      }
    };

  } catch (error) {
    console.error('Error processing chat message:', error);
    return {
      text: CHATBOT_CONFIG.fallbackResponse,
      intent: 'error',
      confidence: 0,
      context: { timestamp: new Date() }
    };
  }
}

/**
 * Detect language of the input message
 */
function detectLanguage(message) {
  // Simple language detection based on character patterns
  const sinhalaPattern = /[\u0D80-\u0DFF]/;
  
  if (sinhalaPattern.test(message)) {
    return 'si';
  }
  
  return 'en';
}

/**
 * Extract intent and entities from message
 */
function extractIntent(message, language) {
  const patterns = INTENT_PATTERNS[language] || INTENT_PATTERNS.en;
  const entities = {};
  let detectedIntent = 'unknown';
  let maxConfidence = 0;

  // Check each intent pattern
  Object.entries(patterns).forEach(([intent, pattern]) => {
    const match = message.match(pattern);
    if (match) {
      detectedIntent = intent;
      maxConfidence = 0.8; // Base confidence for pattern match
      
      // Extract entities from match
      if (match.length > 1) {
        entities.matchedText = match[0];
        entities.groups = match.slice(1);
      }
    }
  });

  // Extract tournament names, IDs, and other entities using additional patterns
  const extractedEntities = extractEntities(message, language);
  Object.assign(entities, extractedEntities);

  return {
    intent: detectedIntent,
    entities,
    confidence: maxConfidence
  };
}

/**
 * Extract specific entities (tournament names, IDs, dates, etc.)
 */
function extractEntities(message, language) {
  const entities = {};

  // Tournament ID pattern (alphanumeric)
  const tournamentIdMatch = message.match(/\b[A-Z]{2,3}\d{4}\b/);
  if (tournamentIdMatch) {
    entities.tournamentId = tournamentIdMatch[0];
  }

  // Tournament name pattern (quoted text or capitalized words)
  const tournamentNameMatch = message.match(/"([^"]+)"/) || message.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/);
  if (tournamentNameMatch && !tournamentIdMatch) {
    entities.tournamentName = tournamentNameMatch[1] || tournamentNameMatch[0];
  }

  // Date patterns
  const datePatterns = [
    /\b\d{1,2}\/\d{1,2}\/\d{4}\b/, // MM/DD/YYYY
    /\b\d{4}-\d{1,2}-\d{1,2}\b/, // YYYY-MM-DD
    /\b\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i,
    /\b(today|tomorrow|yesterday|next\s+week|this\s+week)\b/i
  ];

  for (const pattern of datePatterns) {
    const dateMatch = message.match(pattern);
    if (dateMatch) {
      entities.date = dateMatch[0];
      break;
    }
  }

  // Category patterns
  const categoryPatterns = /\b(kata|kumite|team\s+kata|team\s+kumite|individual|team)\b/i;
  const categoryMatch = message.match(categoryPatterns);
  if (categoryMatch) {
    entities.category = categoryMatch[1].toLowerCase();
  }

  // Age group patterns
  const ageGroupPatterns = /\b(under\s+\d+|\d+\+?\s*-\s*\d+|senior|junior|adult)\b/i;
  const ageGroupMatch = message.match(ageGroupPatterns);
  if (ageGroupMatch) {
    entities.ageGroup = ageGroupMatch[1];
  }

  return entities;
}

/**
 * Get user context from database
 */
async function getUserContext(userId) {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return { isAuthenticated: false };
    }

    // Get user's active registrations
    const registrations = await Registration.find({
      player: userId,
      status: 'approved'
    }).populate('tournament');

    // Get user's recent matches
    const recentMatches = await Match.find({
      'participants.player': userId,
      status: 'completed'
    })
      .populate('tournament', 'name')
      .sort({ completedAt: -1 })
      .limit(5);

    // Get pending payments
    const pendingPayments = await Payment.find({
      user: userId,
      status: 'pending'
    }).populate('tournament');

    return {
      isAuthenticated: true,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        beltRank: user.beltRank,
        dojo: user.dojo
      },
      activeRegistrations: registrations.map(reg => ({
        tournamentId: reg.tournament._id,
        tournamentName: reg.tournament.name,
        category: reg.category,
        status: reg.status
      })),
      recentMatches: recentMatches.map(match => ({
        matchId: match._id,
        tournamentName: match.tournament.name,
        category: match.category,
        result: match.result,
        completedAt: match.completedAt
      })),
      pendingPayments: pendingPayments.map(payment => ({
        paymentId: payment._id,
        tournamentName: payment.tournament.name,
        amount: payment.amount,
        status: payment.status
      }))
    };

  } catch (error) {
    console.error('Error getting user context:', error);
    return { isAuthenticated: false };
  }
}

/**
 * Generate response based on intent and context
 */
async function generateResponse(intent, entities, userContext, language) {
  const responses = RESPONSE_TEMPLATES[language] || RESPONSE_TEMPLATES.en;

  switch (intent) {
    case 'greeting':
      return {
        text: responses.greeting,
        confidence: 0.9,
        suggestions: ['Show my tournaments', 'View upcoming matches', 'Help me register']
      };

    case 'help':
      return {
        text: responses.help,
        confidence: 0.9,
        suggestions: ['Tournament info', 'My registrations', 'Payment status']
      };

    case 'tournament_info':
      return await handleTournamentInfo(entities, userContext, language);

    case 'registration':
      return await handleRegistrationInfo(userContext, language);

    case 'schedule':
      return await handleScheduleInfo(entities, userContext, language);

    case 'results':
      return await handleResultsInfo(entities, userContext, language);

    case 'payment':
      return await handlePaymentInfo(userContext, language);

    case 'profile':
      return await handleProfileInfo(userContext, language);

    case 'language':
      return handleLanguageSwitch(entities, language);

    default:
      return {
        text: responses.fallbackResponse || CHATBOT_CONFIG.fallbackResponse,
        confidence: 0.3,
        suggestions: ['Help', 'Tournament info', 'My profile']
      };
  }
}

/**
 * Handle tournament information requests
 */
async function handleTournamentInfo(entities, userContext, language) {
  try {
    let tournament;

    // Try to find tournament by ID first
    if (entities.tournamentId) {
      tournament = await Tournament.findById(entities.tournamentId).populate('organizer', 'name');
    } else if (entities.tournamentName) {
      // Search by name (case-insensitive)
      tournament = await Tournament.findOne({
        name: { $regex: entities.tournamentName, $options: 'i' }
      }).populate('organizer', 'name');
    } else {
      // Get upcoming tournaments
      const upcomingTournaments = await Tournament.find({
        startDate: { $gte: new Date() }
      })
        .populate('organizer', 'name')
        .sort({ startDate: 1 })
        .limit(3);

      if (upcomingTournaments.length === 0) {
        return {
          text: "No upcoming tournaments found.",
          confidence: 0.8
        };
      }

      const tournamentList = upcomingTournaments.map(t => 
        `• ${t.name} (${t.startDate.toDateString()}) - ${t.location}`
      ).join('\n');

      return {
        text: `Here are the upcoming tournaments:\n${tournamentList}\n\nWhich tournament would you like to know more about?`,
        confidence: 0.8,
        suggestions: upcomingTournaments.map(t => t.name)
      };
    }

    if (!tournament) {
      return {
        text: RESPONSE_TEMPLATES[language].unknown_tournament,
        confidence: 0.7
      };
    }

    const response = `Tournament: ${tournament.name}
` +
    `Date: ${tournament.startDate.toDateString()} to ${tournament.endDate.toDateString()}
` +
    `Location: ${tournament.location}
` +
    `Categories: ${tournament.categories.join(', ')}
` +
    `Registration Fee: $${tournament.registrationFee}
` +
    `Status: ${tournament.status}
` +
    `Organizer: ${tournament.organizer.name}`;

    return {
      text: response,
      confidence: 0.9,
      suggestions: ['Register for this tournament', 'View schedule', 'See participants']
    };

  } catch (error) {
    console.error('Error handling tournament info:', error);
    return {
      text: "Sorry, I couldn't retrieve tournament information.",
      confidence: 0.5
    };
  }
}

/**
 * Handle registration information
 */
async function handleRegistrationInfo(userContext, language) {
  if (!userContext.isAuthenticated) {
    return {
      text: "Please log in to view your registrations.",
      confidence: 0.9
    };
  }

  if (userContext.activeRegistrations.length === 0) {
    return {
      text: RESPONSE_TEMPLATES[language].no_registrations,
      confidence: 0.8,
      suggestions: ['Browse tournaments', 'How to register']
    };
  }

  const registrationList = userContext.activeRegistrations.map(reg =>
    `• ${reg.tournamentName} - ${reg.category} (${reg.status})`
  ).join('\n');

  return {
    text: `Your active registrations:\n${registrationList}`,
    confidence: 0.9,
    suggestions: ['View match schedule', 'Payment status']
  };
}

/**
 * Handle schedule information
 */
async function handleScheduleInfo(entities, userContext, language) {
  if (!userContext.isAuthenticated) {
    return {
      text: "Please log in to view your match schedule.",
      confidence: 0.9
    };
  }

  try {
    let query = { 'participants.player': userContext.user.id };

    // Add date filter if provided
    if (entities.date) {
      const date = new Date(entities.date);
      if (!isNaN(date)) {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        query.scheduledAt = { $gte: startOfDay, $lte: endOfDay };
      }
    }

    const matches = await Match.find(query)
      .populate('tournament', 'name')
      .sort({ scheduledAt: 1 })
      .limit(10);

    if (matches.length === 0) {
      return {
        text: "You don't have any scheduled matches.",
        confidence: 0.8,
        suggestions: ['View tournaments', 'Registration status']
      };
    }

    const scheduleList = matches.map(match =>
      `• ${match.tournament.name} - ${match.category} (${match.round})\n` +
      `  Time: ${match.scheduledAt.toLocaleString()}\n` +
      `  Mat: ${match.mat || 'TBD'}\n` +
      `  Status: ${match.status}`
    ).join('\n\n');

    return {
      text: `Your upcoming matches:\n${scheduleList}`,
      confidence: 0.9,
      suggestions: ['View results', 'Tournament info']
    };

  } catch (error) {
    console.error('Error handling schedule info:', error);
    return {
      text: "Sorry, I couldn't retrieve your schedule.",
      confidence: 0.5
    };
  }
}

/**
 * Handle results information
 */
async function handleResultsInfo(entities, userContext, language) {
  if (!userContext.isAuthenticated) {
    return {
      text: "Please log in to view your results.",
      confidence: 0.9
    };
  }

  try {
    let query = { 
      'participants.player': userContext.user.id,
      status: 'completed'
    };

    // Add tournament filter if provided
    if (entities.tournamentId || entities.tournamentName) {
      let tournament;
      if (entities.tournamentId) {
        tournament = await Tournament.findById(entities.tournamentId);
      } else {
        tournament = await Tournament.findOne({
          name: { $regex: entities.tournamentName, $options: 'i' }
        });
      }

      if (tournament) {
        query.tournament = tournament._id;
      }
    }

    const matches = await Match.find(query)
      .populate('tournament', 'name')
      .sort({ completedAt: -1 })
      .limit(5);

    if (matches.length === 0) {
      return {
        text: "You don't have any completed matches yet.",
        confidence: 0.8,
        suggestions: ['View schedule', 'Upcoming matches']
      };
    }

    const resultsList = matches.map(match => {
      const participant = match.participants.find(p => p.player._id.toString() === userContext.user.id);
      const result = match.result.winner.toString() === userContext.user.id ? 'WON' : 'LOST';
      const score = participant ? participant.averageScore : 'N/A';
      
      return `• ${match.tournament.name} - ${match.category} (${match.round})\n` +
             `  Result: ${result}\n` +
             `  Score: ${score}\n` +
             `  Date: ${match.completedAt.toDateString()}`;
    }).join('\n\n');

    return {
      text: `Your recent results:\n${resultsList}`,
      confidence: 0.9,
      suggestions: ['View schedule', 'Performance stats']
    };

  } catch (error) {
    console.error('Error handling results info:', error);
    return {
      text: "Sorry, I couldn't retrieve your results.",
      confidence: 0.5
    };
  }
}

/**
 * Handle payment information
 */
async function handlePaymentInfo(userContext, language) {
  if (!userContext.isAuthenticated) {
    return {
      text: "Please log in to view your payment information.",
      confidence: 0.9
    };
  }

  if (userContext.pendingPayments.length === 0) {
    return {
      text: "You don't have any pending payments.",
      confidence: 0.8,
      suggestions: ['View registrations', 'Tournament info']
    };
  }

  const paymentList = userContext.pendingPayments.map(payment =>
    `• ${payment.tournamentName}: $${payment.amount}`
  ).join('\n');

  return {
    text: `Your pending payments:\n${paymentList}\n\nWould you like to proceed with payment?`,
    confidence: 0.9,
    suggestions: ['Pay now', 'Payment help']
  };
}

/**
 * Handle profile information
 */
async function handleProfileInfo(userContext, language) {
  if (!userContext.isAuthenticated) {
    return {
      text: "Please log in to view your profile.",
      confidence: 0.9
    };
  }

  const profileInfo = `Name: ${userContext.user.name}\n` +
                    `Role: ${userContext.user.role}\n` +
                    `Belt Rank: ${userContext.user.beltRank}\n` +
                    `Dojo: ${userContext.user.dojo || 'Not specified'}`;

  return {
    text: `Your profile:\n${profileInfo}`,
    confidence: 0.9,
    suggestions: ['Edit profile', 'View stats', 'My registrations']
  };
}

/**
 * Handle language switching
 */
function handleLanguageSwitch(entities, currentLanguage) {
  const targetLanguage = entities.matchedText?.toLowerCase().includes('sinhala') ? 'si' : 'en';
  
  return {
    text: RESPONSE_TEMPLATES[targetLanguage].language_switch,
    confidence: 0.9,
    context: { language: targetLanguage }
  };
}

/**
 * Get quick suggestions based on user context
 */
function getQuickSuggestions(userContext) {
  if (!userContext.isAuthenticated) {
    return ['Login', 'Browse tournaments', 'How to register'];
  }

  const suggestions = ['My tournaments', 'View schedule', 'Help'];

  if (userContext.pendingPayments.length > 0) {
    suggestions.unshift('Pending payments');
  }

  if (userContext.activeRegistrations.length === 0) {
    suggestions.push('Register for tournament');
  }

  return suggestions;
}

module.exports = {
  processChatMessage,
  getQuickSuggestions,
  CHATBOT_CONFIG
};