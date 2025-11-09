const Match = require('../models/Match');
const User = require('../models/User');
const Tournament = require('../models/Tournament');

/**
 * AI-powered match analysis system
 * Provides insights, predictions, and performance analysis
 */

// Scoring criteria weights for different karate aspects
const SCORING_CRITERIA = {
  KATA: {
    technical_merit: 0.4,
    athletic_performance: 0.3,
    timing_rhythm: 0.2,
    spirit: 0.1
  },
  KUMITE: {
    techniques: 0.4,
    tactics: 0.3,
    attitude: 0.2,
    effectiveness: 0.1
  }
};

// Performance indicators
const PERFORMANCE_INDICATORS = {
  EXCELLENT: { min: 8.5, max: 10.0, description: 'Excellent performance' },
  GOOD: { min: 7.0, max: 8.4, description: 'Good performance' },
  AVERAGE: { min: 5.5, max: 6.9, description: 'Average performance' },
  NEEDS_IMPROVEMENT: { min: 0.0, max: 5.4, description: 'Needs improvement' }
};

/**
 * Generate AI insights for a completed match
 * @param {Object} match - Match object with populated data
 * @returns {Object} AI insights object
 */
async function generateMatchInsights(match) {
  try {
    console.log(`Generating AI insights for match: ${match._id}`);

    // Get participant details
    const participants = match.participants;
    const player1 = participants[0].player;
    const player2 = participants[1].player;

    // Get historical performance data
    const player1Stats = await getPlayerPerformanceStats(player1._id);
    const player2Stats = await getPlayerPerformanceStats(player2._id);

    // Analyze match performance
    const performanceAnalysis = analyzeMatchPerformance(match, player1Stats, player2Stats);

    // Generate predictions for future matches
    const futurePredictions = generateFuturePredictions(player1, player2, player1Stats, player2Stats);

    // Identify key moments and turning points
    const keyMoments = identifyKeyMoments(match);

    // Calculate fairness score
    const fairnessScore = calculateFairnessScore(match, player1Stats, player2Stats);

    // Generate improvement recommendations
    const recommendations = generateImprovementRecommendations(match, player1Stats, player2Stats);

    const insights = {
      matchId: match._id,
      performanceAnalysis,
      futurePredictions,
      keyMoments,
      fairnessScore,
      recommendations,
      generatedAt: new Date(),
      confidenceLevel: calculateConfidenceLevel(player1Stats, player2Stats)
    };

    return insights;

  } catch (error) {
    console.error('Error generating match insights:', error);
    throw new Error('Failed to generate match insights');
  }
}

/**
 * Analyze match performance using AI algorithms
 */
function analyzeMatchPerformance(match, player1Stats, player2Stats) {
  const participants = match.participants;
  const player1Scores = participants[0].scores;
  const player2Scores = participants[1].scores;

  // Calculate detailed performance metrics
  const player1Metrics = calculatePerformanceMetrics(player1Scores);
  const player2Metrics = calculatePerformanceMetrics(player2Scores);

  // Determine performance level
  const player1Level = determinePerformanceLevel(player1Metrics.averageScore);
  const player2Level = determinePerformanceLevel(player2Metrics.averageScore);

  // Analyze scoring patterns
  const scoringPatterns = analyzeScoringPatterns(player1Scores, player2Scores);

  // Calculate consistency scores
  const consistencyAnalysis = analyzeConsistency(player1Scores, player2Scores);

  // Identify strengths and weaknesses
  const strengthsWeaknesses = identifyStrengthsWeaknesses(
    player1Metrics,
    player2Metrics,
    player1Stats,
    player2Stats
  );

  return {
    player1: {
      playerId: participants[0].player._id,
      metrics: player1Metrics,
      performanceLevel: player1Level,
      consistency: consistencyAnalysis.player1
    },
    player2: {
      playerId: participants[1].player._id,
      metrics: player2Metrics,
      performanceLevel: player2Level,
      consistency: consistencyAnalysis.player2
    },
    scoringPatterns,
    strengthsWeaknesses,
    matchQuality: calculateMatchQuality(player1Metrics, player2Metrics)
  };
}

/**
 * Calculate detailed performance metrics
 */
function calculatePerformanceMetrics(scores) {
  if (!scores || scores.length === 0) {
    return {
      averageScore: 0,
      scoreDistribution: {},
      judgeAgreement: 0,
      improvementTrend: 0
    };
  }

  // Calculate average score across all judges
  const totalScores = scores.map(score => score.totalScore);
  const averageScore = totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length;

  // Calculate score distribution
  const scoreDistribution = calculateScoreDistribution(totalScores);

  // Calculate judge agreement (consistency between judges)
  const judgeAgreement = calculateJudgeAgreement(scores);

  // Calculate improvement trend (if historical data available)
  const improvementTrend = calculateImprovementTrend(scores);

  return {
    averageScore: Math.round(averageScore * 100) / 100,
    scoreDistribution,
    judgeAgreement: Math.round(judgeAgreement * 100) / 100,
    improvementTrend: Math.round(improvementTrend * 100) / 100,
    scoreRange: {
      min: Math.min(...totalScores),
      max: Math.max(...totalScores)
    }
  };
}

/**
 * Calculate score distribution across different ranges
 */
function calculateScoreDistribution(scores) {
  const distribution = {
    excellent: 0,
    good: 0,
    average: 0,
    needsImprovement: 0
  };

  scores.forEach(score => {
    if (score >= PERFORMANCE_INDICATORS.EXCELLENT.min) {
      distribution.excellent++;
    } else if (score >= PERFORMANCE_INDICATORS.GOOD.min) {
      distribution.good++;
    } else if (score >= PERFORMANCE_INDICATORS.AVERAGE.min) {
      distribution.average++;
    } else {
      distribution.needsImprovement++;
    }
  });

  // Convert to percentages
  const total = scores.length;
  Object.keys(distribution).forEach(key => {
    distribution[key] = Math.round((distribution[key] / total) * 100);
  });

  return distribution;
}

/**
 * Calculate judge agreement score
 */
function calculateJudgeAgreement(scores) {
  if (scores.length < 2) return 1.0;

  const totalScores = scores.map(score => score.totalScore);
  const average = totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length;

  // Calculate standard deviation
  const variance = totalScores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / totalScores.length;
  const standardDeviation = Math.sqrt(variance);

  // Convert to agreement score (lower std dev = higher agreement)
  const maxScore = 10; // Maximum possible score
  const agreementScore = 1 - (standardDeviation / maxScore);

  return Math.max(0, agreementScore);
}

/**
 * Calculate improvement trend
 */
function calculateImprovementTrend(scores) {
  if (scores.length < 2) return 0;

  // Simple linear trend calculation
  const totalScores = scores.map(score => score.totalScore);
  const n = totalScores.length;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += totalScores[i];
    sumXY += i * totalScores[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope;
}

/**
 * Determine performance level based on score
 */
function determinePerformanceLevel(averageScore) {
  for (const [level, range] of Object.entries(PERFORMANCE_INDICATORS)) {
    if (averageScore >= range.min && averageScore <= range.max) {
      return {
        level,
        description: range.description,
        score: averageScore
      };
    }
  }

  return {
    level: 'UNKNOWN',
    description: 'Performance level could not be determined',
    score: averageScore
  };
}

/**
 * Analyze scoring patterns between players
 */
function analyzeScoringPatterns(player1Scores, player2Scores) {
  const p1Total = player1Scores.map(s => s.totalScore);
  const p2Total = player2Scores.map(s => s.totalScore);

  return {
    scoreDifference: Math.abs(
      p1Total.reduce((sum, score) => sum + score, 0) / p1Total.length -
      p2Total.reduce((sum, score) => sum + score, 0) / p2Total.length
    ),
    competitiveness: calculateCompetitiveness(p1Total, p2Total),
    scoringConsistency: {
      player1: calculateScoringConsistency(p1Total),
      player2: calculateScoringConsistency(p2Total)
    }
  };
}

/**
 * Calculate match competitiveness
 */
function calculateCompetitiveness(scores1, scores2) {
  if (scores1.length !== scores2.length) return 0;

  let totalDifference = 0;
  for (let i = 0; i < scores1.length; i++) {
    totalDifference += Math.abs(scores1[i] - scores2[i]);
  }

  const averageDifference = totalDifference / scores1.length;
  return Math.max(0, 1 - (averageDifference / 10)); // Normalize to 0-1
}

/**
 * Calculate scoring consistency
 */
function calculateScoringConsistency(scores) {
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);

  return Math.max(0, 1 - (standardDeviation / 10)); // Normalize to 0-1
}

/**
 * Analyze consistency between judges
 */
function analyzeConsistency(player1Scores, player2Scores) {
  return {
    player1: calculateInterJudgeConsistency(player1Scores),
    player2: calculateInterJudgeConsistency(player2Scores)
  };
}

/**
 * Calculate inter-judge consistency
 */
function calculateInterJudgeConsistency(scores) {
  if (scores.length < 2) return 1.0;

  // Calculate average score for each criterion across all judges
  const criteriaScores = {};
  const criteriaCount = {};

  scores.forEach(scoreObj => {
    Object.entries(scoreObj.scores || {}).forEach(([criterion, score]) => {
      if (!criteriaScores[criterion]) {
        criteriaScores[criterion] = 0;
        criteriaCount[criterion] = 0;
      }
      criteriaScores[criterion] += score;
      criteriaCount[criterion]++;
    });
  });

  // Calculate consistency for each criterion
  let totalConsistency = 0;
  let criteriaAnalyzed = 0;

  Object.entries(criteriaScores).forEach(([criterion, totalScore]) => {
    const averageScore = totalScore / criteriaCount[criterion];
    const individualScores = scores.map(s => s.scores?.[criterion] || 0);

    const consistency = calculateScoringConsistency(individualScores);
    totalConsistency += consistency;
    criteriaAnalyzed++;
  });

  return criteriaAnalyzed > 0 ? totalConsistency / criteriaAnalyzed : 1.0;
}

/**
 * Identify strengths and weaknesses
 */
function identifyStrengthsWeaknesses(player1Metrics, player2Metrics, player1Stats, player2Stats) {
  return {
    player1: {
      strengths: identifyStrengths(player1Metrics, player1Stats),
      weaknesses: identifyWeaknesses(player1Metrics, player1Stats),
      opportunities: identifyOpportunities(player1Metrics, player2Metrics)
    },
    player2: {
      strengths: identifyStrengths(player2Metrics, player2Stats),
      weaknesses: identifyWeaknesses(player2Metrics, player2Stats),
      opportunities: identifyOpportunities(player2Metrics, player1Metrics)
    }
  };
}

/**
 * Identify player strengths
 */
function identifyStrengths(metrics, stats) {
  const strengths = [];

  if (metrics.averageScore >= 8.0) {
    strengths.push('High scoring average');
  }

  if (metrics.judgeAgreement >= 0.8) {
    strengths.push('Consistent performance across judges');
  }

  if (metrics.improvementTrend > 0.1) {
    strengths.push('Positive improvement trend');
  }

  if (stats.winRate >= 0.7) {
    strengths.push('Strong historical win rate');
  }

  return strengths;
}

/**
 * Identify player weaknesses
 */
function identifyWeaknesses(metrics, stats) {
  const weaknesses = [];

  if (metrics.averageScore < 6.0) {
    weaknesses.push('Low scoring average');
  }

  if (metrics.judgeAgreement < 0.6) {
    weaknesses.push('Inconsistent performance across judges');
  }

  if (metrics.improvementTrend < -0.1) {
    weaknesses.push('Declining performance trend');
  }

  if (stats.winRate < 0.3) {
    weaknesses.push('Poor historical win rate');
  }

  return weaknesses;
}

/**
 * Identify opportunities for improvement
 */
function identifyOpportunities(playerMetrics, opponentMetrics) {
  const opportunities = [];

  if (playerMetrics.averageScore < opponentMetrics.averageScore) {
    opportunities.push('Improve overall scoring average');
  }

  if (playerMetrics.judgeAgreement < opponentMetrics.judgeAgreement) {
    opportunities.push('Increase consistency across judges');
  }

  return opportunities;
}

/**
 * Calculate match quality score
 */
function calculateMatchQuality(player1Metrics, player2Metrics) {
  const scoreQuality = (player1Metrics.averageScore + player2Metrics.averageScore) / 20; // Normalize to 0-1
  const consistencyQuality = (player1Metrics.judgeAgreement + player2Metrics.judgeAgreement) / 2;
  const competitiveness = 1 - Math.abs(player1Metrics.averageScore - player2Metrics.averageScore) / 10;

  return {
    overall: Math.round((scoreQuality + consistencyQuality + competitiveness) / 3 * 100) / 100,
    scoreQuality: Math.round(scoreQuality * 100) / 100,
    consistencyQuality: Math.round(consistencyQuality * 100) / 100,
    competitiveness: Math.round(competitiveness * 100) / 100
  };
}

/**
 * Generate future match predictions
 */
function generateFuturePredictions(player1, player2, player1Stats, player2Stats) {
  return {
    rematchPrediction: predictRematchOutcome(player1, player2, player1Stats, player2Stats),
    tournamentProgression: predictTournamentProgression(player1, player2, player1Stats, player2Stats),
    improvementPotential: calculateImprovementPotential(player1, player2, player1Stats, player2Stats)
  };
}

/**
 * Predict rematch outcome
 */
function predictRematchOutcome(player1, player2, player1Stats, player2Stats) {
  const p1Score = calculatePlayerPredictionScore(player1, player1Stats);
  const p2Score = calculatePlayerPredictionScore(player2, player2Stats);

  const totalScore = p1Score + p2Score;
  return {
    player1WinProbability: (p1Score / totalScore) * 100,
    player2WinProbability: (p2Score / totalScore) * 100,
    confidence: calculatePredictionConfidence(player1Stats, player2Stats)
  };
}

/**
 * Calculate player prediction score
 */
function calculatePlayerPredictionScore(player, stats) {
  let score = 0.5; // Base score

  // Factor in historical performance
  score += (stats.winRate - 0.5) * 0.3;

  // Factor in experience
  score += (player.experience / 20) * 0.2;

  // Factor in belt rank
  const beltRanks = { white: 0.1, yellow: 0.2, orange: 0.3, green: 0.4, blue: 0.5, purple: 0.6, brown: 0.8, black: 1.0 };
  score += (beltRanks[player.beltRank] || 0.1) * 0.3;

  return Math.max(0.1, Math.min(0.9, score));
}

/**
 * Calculate prediction confidence
 */
function calculatePredictionConfidence(player1Stats, player2Stats) {
  const dataQuality = Math.min(player1Stats.totalMatches, player2Stats.totalMatches) / 10;
  const performanceStability = (player1Stats.consistency + player2Stats.consistency) / 2;

  return Math.round((dataQuality + performanceStability) / 2 * 100) / 100;
}

/**
 * Predict tournament progression
 */
function predictTournamentProgression(player1, player2, player1Stats, player2Stats) {
  return {
    player1: {
      likelyFinishPosition: predictFinishPosition(player1, player1Stats),
      advancementProbability: calculateAdvancementProbability(player1, player1Stats)
    },
    player2: {
      likelyFinishPosition: predictFinishPosition(player2, player2Stats),
      advancementProbability: calculateAdvancementProbability(player2, player2Stats)
    }
  };
}

/**
 * Predict finish position
 */
function predictFinishPosition(player, stats) {
  if (stats.winRate >= 0.8) return 'Top 3';
  if (stats.winRate >= 0.6) return 'Top 8';
  if (stats.winRate >= 0.4) return 'Top 16';
  return 'Group Stage';
}

/**
 * Calculate advancement probability
 */
function calculateAdvancementProbability(player, stats) {
  const baseProbability = stats.winRate;
  const experienceBonus = Math.min(player.experience / 20, 0.2);
  return Math.round(Math.min(0.95, baseProbability + experienceBonus) * 100) / 100;
}

/**
 * Calculate improvement potential
 */
function calculateImprovementPotential(player1, player2, player1Stats, player2Stats) {
  return {
    player1: estimateImprovementPotential(player1, player1Stats),
    player2: estimateImprovementPotential(player2, player2Stats)
  };
}

/**
 * Estimate improvement potential
 */
function estimateImprovementPotential(player, stats) {
  const ageFactor = Math.max(0, 1 - (calculateAge(player.dateOfBirth) - 20) / 30);
  const experienceFactor = Math.max(0, 1 - player.experience / 15);
  const performanceFactor = Math.max(0, 1 - stats.winRate);

  return Math.round((ageFactor + experienceFactor + performanceFactor) / 3 * 100) / 100;
}

/**
 * Identify key moments in the match
 */
function identifyKeyMoments(match) {
  const moments = [];

  // Analyze live updates for key moments
  if (match.liveUpdates && match.liveUpdates.length > 0) {
    match.liveUpdates.forEach(update => {
      if (update.type === 'score_update') {
        moments.push({
          type: 'score_change',
          timestamp: update.timestamp,
          description: update.message,
          significance: calculateMomentSignificance(update, match)
        });
      } else if (update.type === 'incident') {
        moments.push({
          type: 'incident',
          timestamp: update.timestamp,
          description: update.message,
          significance: 'high'
        });
      }
    });
  }

  // Analyze incidents
  if (match.incidents && match.incidents.length > 0) {
    match.incidents.forEach(incident => {
      moments.push({
        type: 'incident',
        timestamp: incident.timestamp,
        description: incident.description,
        severity: incident.severity,
        significance: incident.severity === 'critical' ? 'high' : 'medium'
      });
    });
  }

  // Sort by significance and timestamp
  return moments.sort((a, b) => {
    const significanceOrder = { high: 3, medium: 2, low: 1 };
    if (significanceOrder[a.significance] !== significanceOrder[b.significance]) {
      return significanceOrder[b.significance] - significanceOrder[a.significance];
    }
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
}

/**
 * Calculate moment significance
 */
function calculateMomentSignificance(update, match) {
  // Simple significance calculation based on score changes and timing
  if (update.data && update.data.scoreChange) {
    const scoreChange = Math.abs(update.data.scoreChange);
    if (scoreChange >= 2) return 'high';
    if (scoreChange >= 1) return 'medium';
  }
  return 'low';
}

/**
 * Calculate fairness score for the match
 */
function calculateFairnessScore(match, player1Stats, player2Stats) {
  const participants = match.participants;
  const player1 = participants[0].player;
  const player2 = participants[1].player;

  // Calculate skill level difference
  const skillDifference = calculateSkillDifference(player1, player2, player1Stats, player2Stats);

  // Calculate physical attribute differences
  const physicalDifference = calculatePhysicalDifference(player1, player2);

  // Calculate experience difference
  const experienceDifference = Math.abs(player1.experience - player2.experience);

  // Overall fairness score
  const fairnessScore = 1 - (skillDifference + physicalDifference + experienceDifference / 20) / 3;

  return {
    overall: Math.round(Math.max(0, fairnessScore) * 100) / 100,
    skillBalance: Math.round((1 - skillDifference) * 100) / 100,
    physicalBalance: Math.round((1 - physicalDifference) * 100) / 100,
    experienceBalance: Math.round((1 - experienceDifference / 20) * 100) / 100
  };
}

/**
 * Calculate skill level difference
 */
function calculateSkillDifference(player1, player2, player1Stats, player2Stats) {
  const beltDifference = Math.abs(
    (BELT_RANKS[player1.beltRank] || 1) - (BELT_RANKS[player2.beltRank] || 1)
  ) / 8; // Normalize to 0-1

  const performanceDifference = Math.abs(player1Stats.winRate - player2Stats.winRate);

  return (beltDifference + performanceDifference) / 2;
}

/**
 * Calculate physical attribute differences
 */
function calculatePhysicalDifference(player1, player2) {
  const weightDifference = Math.abs(player1.weight - player2.weight) / 100; // Normalize to 0-1
  const ageDifference = Math.abs(calculateAge(player1.dateOfBirth) - calculateAge(player2.dateOfBirth)) / 50; // Normalize to 0-1

  return (weightDifference + ageDifference) / 2;
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
 * Generate improvement recommendations
 */
function generateImprovementRecommendations(match, player1Stats, player2Stats) {
  const participants = match.participants;
  const player1 = participants[0].player;
  const player2 = participants[1].player;

  return {
    player1: generatePlayerRecommendations(player1, participants[0], player1Stats),
    player2: generatePlayerRecommendations(player2, participants[1], player2Stats),
    general: generateGeneralRecommendations(match, player1Stats, player2Stats)
  };
}

/**
 * Generate player-specific recommendations
 */
function generatePlayerRecommendations(player, participant, stats) {
  const recommendations = [];

  // Performance-based recommendations
  if (participant.averageScore < 6.0) {
    recommendations.push('Focus on fundamental technique training');
    recommendations.push('Increase practice time and repetition');
  }

  if (stats.winRate < 0.4) {
    recommendations.push('Work on competitive strategy and mental preparation');
  }

  // Skill-based recommendations
  if (player.experience < 2) {
    recommendations.push('Consider additional coaching for skill development');
  }

  if (player.beltRank === 'white' || player.beltRank === 'yellow') {
    recommendations.push('Focus on basic kata and kumite fundamentals');
  }

  return recommendations;
}

/**
 * Generate general recommendations
 */
function generateGeneralRecommendations(match, player1Stats, player2Stats) {
  const recommendations = [];

  // Match quality recommendations
  const qualityScore = calculateMatchQuality(
    calculatePerformanceMetrics(match.participants[0].scores),
    calculatePerformanceMetrics(match.participants[1].scores)
  );

  if (qualityScore.overall < 0.6) {
    recommendations.push('Consider adjusting training intensity for better performance');
  }

  // Judge agreement recommendations
  if (qualityScore.consistencyQuality < 0.7) {
    recommendations.push('Judges may benefit from additional training for consistent scoring');
  }

  return recommendations;
}

/**
 * Calculate confidence level for insights
 */
function calculateConfidenceLevel(player1Stats, player2Stats) {
  const dataQuality = Math.min(player1Stats.totalMatches, player2Stats.totalMatches) / 10;
  const performanceStability = (player1Stats.consistency + player2Stats.consistency) / 2;

  const confidence = (dataQuality + performanceStability) / 2;

  if (confidence >= 0.8) return 'HIGH';
  if (confidence >= 0.6) return 'MEDIUM';
  return 'LOW';
}

/**
 * Get player performance statistics
 */
async function getPlayerPerformanceStats(playerId) {
  const matches = await Match.find({
    'participants.player': playerId,
    status: 'completed',
    'result.winner': { $exists: true }
  }).populate('participants.player');

  if (matches.length === 0) {
    return {
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      averageScore: 0,
      consistency: 0
    };
  }

  const wins = matches.filter(match => match.result.winner.toString() === playerId.toString()).length;
  const losses = matches.length - wins;
  const winRate = wins / matches.length;

  // Calculate average score
  const allScores = [];
  matches.forEach(match => {
    const participant = match.participants.find(p => p.player._id.toString() === playerId.toString());
    if (participant && participant.averageScore) {
      allScores.push(participant.averageScore);
    }
  });

  const averageScore = allScores.length > 0 ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length : 0;
  const consistency = allScores.length > 1 ? calculateScoringConsistency(allScores) : 0;

  return {
    totalMatches: matches.length,
    wins,
    losses,
    winRate,
    averageScore,
    consistency
  };
}

module.exports = {
  generateMatchInsights,
  getPlayerPerformanceStats
};