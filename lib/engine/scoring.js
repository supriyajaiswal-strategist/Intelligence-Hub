// Scoring — the single formula that ranks every Candidate Insight.
//
// score = $Impact × Urgency × Actionability × Novelty × Confidence
//
// Vision §7.1 / Engine spec §7.1. The factors are deliberately multiplicative
// so any one going to 0 (e.g. confidence below floor) kills the candidate.

import { URGENCY, CONFIDENCE_FLOOR } from './types.js';

const DOLLAR_CAP = 10000;  // Cap at $10K so a single $50K insight can't dominate Today

/**
 * Compute the score for a single candidate.
 * Mutates score + scoreComponents on the input and returns it.
 */
export function scoreCandidate(c, opts = {}) {
  const {
    dollarImpact = 0,
    actionability = 1.0,
    novelty = 1.0,
    confidence = 1.0,
  } = c.scoreComponents || {};

  const cappedDollar = Math.min(dollarImpact, DOLLAR_CAP);
  const urgency = URGENCY[c.class] ?? 1.0;

  // Hard gate: confidence below floor → score 0 (will be filtered).
  if (confidence < CONFIDENCE_FLOOR) {
    c.score = 0;
    c.scoreComponents = { ...c.scoreComponents, urgency };
    return c;
  }

  const score = cappedDollar * urgency * actionability * novelty * confidence;

  c.score = Math.round(score);
  c.scoreComponents = {
    dollarImpact,
    urgency,
    actionability,
    novelty,
    confidence,
  };
  return c;
}

/**
 * Score an array of candidates in place. Returns the same array.
 */
export function scoreAll(candidates) {
  for (const c of candidates) scoreCandidate(c);
  return candidates;
}

/**
 * Novelty decay — §7.1.
 * 1.0 first emission · decays toward 0.2 if same insight repeats in 72h
 * without acknowledgment · 0 if acknowledged + within mute window.
 *
 * The caller is expected to provide priorEmissions, the count of times this
 * insight (by signature) has been emitted in the last 72h, plus an `acked`
 * flag and a `mutedUntil` ISO date if applicable.
 */
export function computeNovelty({ priorEmissions = 0, acked = false, mutedUntil = null, now = new Date() }) {
  if (mutedUntil && new Date(mutedUntil) > now) return 0;
  if (acked) return 0.2;
  // Decay: 1.0, 0.7, 0.5, 0.35, 0.25, 0.2 floor.
  const decay = [1.0, 0.7, 0.5, 0.35, 0.25, 0.2];
  return decay[Math.min(priorEmissions, decay.length - 1)];
}
