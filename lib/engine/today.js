// Today algorithm — §7.2 of the engine spec.
//
// Pipeline:
//   1. filter        confidence >= 0.7, score >= MIN_PRIORITY_SCORE, not muted
//   2. rank          desc by score
//   3. diversity     top 3 must span >=2 Martinez domains
//   4. dedupe        by root entity (VIN, mgr id, lead id)
//   5. top N         default 3

import {
  CONFIDENCE_FLOOR,
  MIN_PRIORITY_SCORE,
  ACTIONABILITY_FLOOR,
  TODAY_TOP_N,
} from './types.js';

/**
 * Compute today's top-3 priority insights from the full candidate pool.
 *
 * @param {CandidateInsight[]} candidates      scored candidates
 * @param {Object} principalState              { mutedClasses: Set, mutedDomains: Set, ackedIds: Set }
 * @returns {CandidateInsight[]}               top N (default 3)
 */
export function selectToday(candidates, principalState = {}) {
  const muted    = principalState.mutedClasses || new Set();
  const mutedDom = principalState.mutedDomains || new Set();
  const acked    = principalState.ackedIds || new Set();

  // 1. Filter
  const filtered = candidates.filter((c) => {
    const conf = c.scoreComponents?.confidence ?? 0;
    const act  = c.scoreComponents?.actionability ?? 0;
    if (conf < CONFIDENCE_FLOOR) return false;
    if (c.score < MIN_PRIORITY_SCORE) return false;
    if (act < ACTIONABILITY_FLOOR) return false;
    if (muted.has(c.class)) return false;
    if (mutedDom.has(c.domain)) return false;
    if (acked.has(c.id)) return false;
    return true;
  });

  // 2. Rank by score desc
  filtered.sort((a, b) => b.score - a.score);

  // 3+4. Greedy fill with diversity + dedupe-by-root.
  const selected = [];
  const domainsUsed = new Set();
  const rootsUsed   = new Set();

  for (const c of filtered) {
    if (selected.length >= TODAY_TOP_N) break;

    // Dedupe by root entity (any overlap with already-selected disqualifies).
    const roots = c.rootEntities || [];
    if (roots.some((r) => rootsUsed.has(r))) continue;

    // Diversity: when filling the 3rd slot, force a new domain if only 1 used.
    if (selected.length === 2 && domainsUsed.size === 1 && domainsUsed.has(c.domain)) {
      continue;
    }

    selected.push(c);
    domainsUsed.add(c.domain);
    for (const r of roots) rootsUsed.add(r);
  }

  // Edge case: if the diversity constraint was unsatisfiable (e.g. only 1 domain
  // has any candidates), fall through and let top N stand — better to show than starve.
  if (selected.length < TODAY_TOP_N) {
    for (const c of filtered) {
      if (selected.length >= TODAY_TOP_N) break;
      if (selected.includes(c)) continue;
      const roots = c.rootEntities || [];
      if (roots.some((r) => rootsUsed.has(r))) continue;
      selected.push(c);
      for (const r of roots) rootsUsed.add(r);
    }
  }

  return selected;
}

/**
 * Full Feed view — same filter rules but ranked, not truncated.
 * Used for the Feed surface (§4.3).
 */
export function selectFeed(candidates, principalState = {}, limit = 50) {
  const muted    = principalState.mutedClasses || new Set();
  const mutedDom = principalState.mutedDomains || new Set();

  const filtered = candidates.filter((c) => {
    const conf = c.scoreComponents?.confidence ?? 0;
    if (conf < CONFIDENCE_FLOOR) return false;
    if (muted.has(c.class)) return false;
    if (mutedDom.has(c.domain)) return false;
    return true;
  });

  filtered.sort((a, b) => b.score - a.score);
  return filtered.slice(0, limit);
}

/**
 * Money Meter total — sum of $dollarImpact across active Money Leak insights.
 * Returned with a per-domain breakdown for the live ticker visualization.
 */
export function computeMoneyMeter(candidates) {
  const leaks = candidates.filter(
    (c) => c.class === 'A_money_leak' && (c.scoreComponents?.confidence ?? 0) >= CONFIDENCE_FLOOR
  );
  const total = leaks.reduce((s, c) => s + (c.scoreComponents?.dollarImpact ?? 0), 0);

  // Group by domain for the decomposed bar.
  const byDomain = {};
  for (const c of leaks) {
    const v = c.scoreComponents?.dollarImpact ?? 0;
    byDomain[c.domain] = (byDomain[c.domain] || 0) + v;
  }
  const breakdown = Object.entries(byDomain)
    .map(([domain, value]) => ({ domain, value }))
    .sort((a, b) => b.value - a.value);

  return { total: Math.round(total), breakdown };
}
