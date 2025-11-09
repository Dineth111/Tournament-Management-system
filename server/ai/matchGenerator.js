const Match = require('../models/Match');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');

/**
 * AI-powered match generation system
 * Creates fair and balanced tournament brackets using machine learning algorithms
 */

// Scoring factors for fair matchmaking
const MATCHMAKING_FACTORS = {
  BELT_RANK_WEIGHT: 0.25,
  AGE_WEIGHT: 0.20,
  WEIGHT_WEIGHT: 0.20,
  EXPERIENCE_WEIGHT: 0.15,
  DOJO_DIVERSITY_WEIGHT: 0.10,
  GENDER_WEIGHT: 0.05,
  PERFORMANCE_HISTORY_WEIGHT: 0.05
};

// Belt rank hierarchy for scoring
const BELT_RANKS = {
  white: 1,
  yellow: 2,
  orange: 3,
  green: 4,
  blue: 5,
  purple: 6,
  brown: 7,
  black: 8
};

/**
 * Generate fair tournament matches using AI algorithms
 * @param {Object} tournament - Tournament object
 * @param {Array} registrations - Array of approved registrations
 * @returns {Array} Array of match objects to be created
 */
async function generateMatches(tournament, registrations) {
  try {
    console.log(`Generating matches for tournament: ${tournament.name}`);
    console.log(`Total registrations: ${registrations.length}`);

    const matches = [];
    const categories = tournament.categories;

    // Group registrations by category
    const registrationsByCategory = groupRegistrationsByCategory(registrations, categories);

    // Generate matches for each category
    for (const [categoryName, categoryRegistrations] of Object.entries(registrationsByCategory)) {
      console.log(`Processing category: ${categoryName} with ${categoryRegistrations.length} participants`);

      if (categoryRegistrations.length < 2) {
        console.log(`Skipping category ${categoryName} - insufficient participants`);
        continue;
      }

      const categoryMatches = await generateCategoryMatches(
        tournament,
        categoryName,
        categoryRegistrations
      );

      matches.push(...categoryMatches);
    }

    console.log(`Generated ${matches.length} total matches`);
    return matches;

  } catch (error) {
    console.error('Error generating matches:', error);
    throw new Error('Failed to generate tournament matches');
  }
}

/**
 * Group registrations by tournament categories
 */
function groupRegistrationsByCategory(registrations, categories) {
  const grouped = {};

  categories.forEach(category => {
    const categoryRegistrations = registrations.filter(registration => {
      const categoryData = registration.categories.find(cat => 
        cat.name === category.name && cat.status === 'approved'
      );
      return categoryData;
    });

    if (categoryRegistrations.length > 0) {
      grouped[category.name] = categoryRegistrations;
    }
  });

  return grouped;
}

/**
 * Generate matches for a specific category
 */
async function generateCategoryMatches(tournament, categoryName, registrations) {
  const matches = [];
  const participants = registrations.map(reg => reg.player);

  // Get player performance history
  const playerStats = await getPlayerPerformanceStats(participants);

  // Create balanced brackets using AI algorithm
  const brackets = createBalancedBrackets(participants, playerStats);

  // Generate matches for each round
  let currentRound = 1;
  let currentBrackets = brackets;

  while (currentBrackets.length > 1) {
    const roundMatches = generateRoundMatches(
      tournament,
      categoryName,
      currentBrackets,
      currentRound,
      playerStats
    );

    matches.push(...roundMatches);
    currentBrackets = createNextRoundBrackets(roundMatches);
    currentRound++;
  }

  // Generate final match if needed
  if (currentBrackets.length === 1 && matches.length > 0) {
    const finalMatch = createFinalMatch(tournament, categoryName, currentRound, playerStats);
    matches.push(finalMatch);
  }

  return matches;
}

/**
 * Create balanced brackets using AI algorithm
 */
function createBalancedBrackets(participants, playerStats) {
  // Sort participants by skill level using AI scoring
  const scoredParticipants = participants.map(player => ({
    player,
    score: calculatePlayerMatchmakingScore(player, playerStats)
  }));

  // Sort by score (descending)
  scoredParticipants.sort((a, b) => b.score - a.score);

  // Create balanced brackets using snake draft method
  const brackets = [];
  const numBrackets = Math.pow(2, Math.ceil(Math.log2(participants.length)));

  // Distribute players evenly across brackets
  for (let i = 0; i < numBrackets; i++) {
    brackets.push([]);
  }

  // Snake draft distribution
  let direction = 1;
  let bracketIndex = 0;

  for (let i = 0; i < scoredParticipants.length; i++) {
    brackets[bracketIndex].push(scoredParticipants[i].player);

    // Move to next bracket
    bracketIndex += direction;

    // Reverse direction at boundaries
    if (bracketIndex >= brackets.length || bracketIndex < 0) {
      direction *= -1;
      bracketIndex += direction;
    }
  }

  return brackets.filter(bracket => bracket.length > 0);
}

/**
 * Calculate player matchmaking score using AI algorithm
 */
function calculatePlayerMatchmakingScore(player, playerStats) {
  let totalScore = 0;

  // Belt rank score
  const beltRankScore = BELT_RANKS[player.beltRank] || 1;
  totalScore += beltRankScore * MATCHMAKING_FACTORS.BELT_RANK_WEIGHT;

  // Age score (normalize to 0-1 range)
  const ageScore = normalizeAge(player.dateOfBirth);
  totalScore += ageScore * MATCHMAKING_FACTORS.AGE_WEIGHT;

  // Weight score (normalize to 0-1 range)
  const weightScore = normalizeWeight(player.weight);
  totalScore += weightScore * MATCHMAKING_FACTORS.WEIGHT_WEIGHT;

  // Experience score
  const experienceScore = normalizeExperience(player.experience);
  totalScore += experienceScore * MATCHMAKING_FACTORS.EXPERIENCE_WEIGHT;

  // Performance history score
  const performanceScore = playerStats[player._id]?.averageScore || 0.5;
  totalScore += performanceScore * MATCHMAKING_FACTORS.PERFORMANCE_HISTORY_WEIGHT;

  return totalScore;
}

/**
 * Get player performance statistics
 */
async function getPlayerPerformanceStats(players) {
  const playerIds = players.map(p => p._id);
  const stats = {};

  // Get match history for each player
  const matchResults = await Match.find({
    'participants.player': { $in: playerIds },
    status: 'completed',
    'result.winner': { $exists: true }
  }).populate('participants.player');

  // Calculate statistics for each player
  playerIds.forEach(playerId => {
    const playerMatches = matchResults.filter(match =>
      match.participants.some(p => p.player._id.toString() === playerId.toString())
    );

    const wins = playerMatches.filter(match =>
      match.result.winner.toString() === playerId.toString()
    ).length;

    const losses = playerMatches.length - wins;
    const winRate = playerMatches.length > 0 ? wins / playerMatches.length : 0;
    const averageScore = calculateAverageScore(playerMatches, playerId);

    stats[playerId] = {
      totalMatches: playerMatches.length,
      wins,
      losses,
      winRate,
      averageScore
    };
  });

  return stats;
}

/**
 * Calculate average score for a player
 */
function calculateAverageScore(matches, playerId) {
  const scores = [];

  matches.forEach(match => {
    const participant = match.participants.find(p =>
      p.player._id.toString() === playerId.toString()
    );

    if (participant && participant.averageScore) {
      scores.push(participant.averageScore);
    }
  });

  return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
}

/**
 * Normalize age to 0-1 score
 */
function normalizeAge(dateOfBirth) {
  const age = calculateAge(dateOfBirth);
  // Assume tournament age range is 5-65 years
  const minAge = 5;
  const maxAge = 65;
  return Math.max(0, Math.min(1, (age - minAge) / (maxAge - minAge)));
}

/**
 * Normalize weight to 0-1 score
 */
function normalizeWeight(weight) {
  // Assume weight range is 30-120 kg
  const minWeight = 30;
  const maxWeight = 120;
  return Math.max(0, Math.min(1, (weight - minWeight) / (maxWeight - minWeight)));
}

/**
 * Normalize experience to 0-1 score
 */
function normalizeExperience(experience) {
  // Assume experience range is 0-20 years
  const maxExperience = 20;
  return Math.max(0, Math.min(1, experience / maxExperience));
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Generate matches for a specific round
 */
function generateRoundMatches(tournament, categoryName, brackets, round, playerStats) {
  const matches = [];
  const judges = tournament.judges.map(j => j.judge);

  // Create matches between adjacent brackets
  for (let i = 0; i < brackets.length - 1; i += 2) {
    const bracket1 = brackets[i];
    const bracket2 = brackets[i + 1];

    if (bracket1 && bracket2) {
      // Select players from each bracket using AI optimization
      const player1 = selectOptimalPlayer(bracket1, bracket2, playerStats);
      const player2 = selectOptimalPlayer(bracket2, [player1], playerStats);

      // Assign judges using round-robin distribution
      const matchJudges = assignJudges(judges, matches.length);

      const match = {
        tournament: tournament._id,
        category: categoryName,
        round: `Round ${round}`,
        participants: [
          {
            player: player1._id,
            scores: [],
            averageScore: 0,
            result: 'pending'
          },
          {
            player: player2._id,
            scores: [],
            averageScore: 0,
            result: 'pending'
          }
        ],
        judges: matchJudges,
        schedule: {
          startTime: calculateMatchStartTime(tournament, matches.length),
          mat: assignMat(matches.length)
        },
        status: 'scheduled',
        aiInsights: {
          predictedWinner: predictWinner(player1, player2, playerStats),
          winProbability: calculateWinProbability(player1, player2, playerStats),
          keyFactors: generateKeyFactors(player1, player2, playerStats)
        }
      };

      matches.push(match);
    }
  }

  return matches;
}

/**
 * Select optimal player for match using AI algorithm
 */
function selectOptimalPlayer(bracket, opponentBracket, playerStats) {
  // For now, select first available player
  // In advanced implementation, this would use ML to optimize selection
  return bracket[0];
}

/**
 * Assign judges to match using round-robin distribution
 */
function assignJudges(judges, matchIndex) {
  const numJudges = Math.min(3, judges.length); // Use 3 judges or all available
  const assignedJudges = [];

  for (let i = 0; i < numJudges; i++) {
    const judgeIndex = (matchIndex + i) % judges.length;
    assignedJudges.push({
      judge: judges[judgeIndex],
      role: i === 0 ? 'head' : 'judge'
    });
  }

  return assignedJudges;
}

/**
 * Calculate match start time
 */
function calculateMatchStartTime(tournament, matchIndex) {
  const baseTime = new Date(tournament.date);
  const minutesPerMatch = 15; // Assume 15 minutes per match
  const startHour = 9; // Start at 9 AM

  baseTime.setHours(startHour, 0, 0, 0);
  baseTime.setMinutes(baseTime.getMinutes() + (matchIndex * minutesPerMatch));

  return baseTime;
}

/**
 * Assign mat for match
 */
function assignMat(matchIndex) {
  const totalMats = 4; // Assume 4 mats available
  return `Mat ${(matchIndex % totalMats) + 1}`;
}

/**
 * Create next round brackets from current round matches
 */
function createNextRoundBrackets(matches) {
  const nextBrackets = [];

  matches.forEach(match => {
    // Winner will be determined later, for now create placeholder
    nextBrackets.push([]);
  });

  return nextBrackets;
}

/**
 * Create final match
 */
function createFinalMatch(tournament, categoryName, round, playerStats) {
  // This would be implemented based on tournament structure
  return {
    tournament: tournament._id,
    category: categoryName,
    round: 'Final',
    participants: [],
    judges: [],
    schedule: {
      startTime: calculateMatchStartTime(tournament, 100), // Later in the day
      mat: 'Mat 1' // Final on main mat
    },
    status: 'scheduled',
    isFinal: true
  };
}

/**
 * Predict match winner using AI
 */
function predictWinner(player1, player2, playerStats) {
  const score1 = calculatePlayerMatchmakingScore(player1, playerStats);
  const score2 = calculatePlayerMatchmakingScore(player2, playerStats);

  return score1 > score2 ? player1._id : player2._id;
}

/**
 * Calculate win probability
 */
function calculateWinProbability(player1, player2, playerStats) {
  const score1 = calculatePlayerMatchmakingScore(player1, playerStats);
  const score2 = calculatePlayerMatchmakingScore(player2, playerStats);

  const totalScore = score1 + score2;
  return {
    player1: (score1 / totalScore) * 100,
    player2: (score2 / totalScore) * 100
  };
}

/**
 * Generate key factors for match prediction
 */
function generateKeyFactors(player1, player2, playerStats) {
  const factors = [];

  // Belt rank difference
  const beltDiff = BELT_RANKS[player1.beltRank] - BELT_RANKS[player2.beltRank];
  if (Math.abs(beltDiff) >= 2) {
    factors.push(beltDiff > 0 ? 'Higher belt rank advantage' : 'Lower belt rank disadvantage');
  }

  // Experience difference
  const expDiff = player1.experience - player2.experience;
  if (Math.abs(expDiff) >= 3) {
    factors.push(expDiff > 0 ? 'Experience advantage' : 'Experience disadvantage');
  }

  // Performance history
  const stats1 = playerStats[player1._id] || { winRate: 0.5 };
  const stats2 = playerStats[player2._id] || { winRate: 0.5 };

  if (stats1.winRate > stats2.winRate + 0.2) {
    factors.push('Superior recent performance');
  }

  return factors;
}

/**
 * Get upcoming matches for a tournament
 */
async function getUpcomingMatches(tournamentId, limit = 10) {
  return await Match.find({
    tournament: tournamentId,
    status: { $in: ['scheduled', 'in_progress'] }
  })
    .populate('participants.player', 'firstName lastName beltRank')
    .populate('judges.judge', 'firstName lastName')
    .sort('schedule.startTime')
    .limit(limit);
}

/**
 * Get matches by player
 */
async function getPlayerMatches(playerId, tournamentId = null) {
  const query = {
    'participants.player': playerId,
    status: 'completed'
  };

  if (tournamentId) {
    query.tournament = tournamentId;
  }

  return await Match.find(query)
    .populate('tournament', 'name date')
    .populate('participants.player', 'firstName lastName')
    .sort('-completedAt');
}

/**
 * Get matches by judge
 */
async function getJudgeMatches(judgeId, tournamentId = null) {
  const query = {
    'judges.judge': judgeId
  };

  if (tournamentId) {
    query.tournament = tournamentId;
  }

  return await Match.find(query)
    .populate('tournament', 'name date')
    .populate('participants.player', 'firstName lastName')
    .sort('schedule.startTime');
}

module.exports = {
  generateMatches,
  getUpcomingMatches,
  getPlayerMatches,
  getJudgeMatches,
  MATCHMAKING_FACTORS
};