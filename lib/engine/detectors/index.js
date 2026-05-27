// Detector registry — runs all detectors against a store snapshot
// and returns the full candidate pool ready for prioritization.

import { recon_bottleneck }     from './recon-bottleneck.js';
import { aged_inventory }       from './aged-inventory.js';
import { breakeven_crossover }  from './breakeven-crossover.js';
import { lead_response_lag }    from './lead-response-lag.js';
import { manager_to_collapse }  from './manager-to-collapse.js';

export const DETECTORS = [
  recon_bottleneck,
  aged_inventory,
  breakeven_crossover,
  lead_response_lag,
  manager_to_collapse,
];

/**
 * Run all detectors against the given store, return all candidates.
 * @returns {CandidateInsight[]}
 */
export function runAllDetectors(store) {
  const all = [];
  for (const d of DETECTORS) {
    try {
      const candidates = d.detect(store);
      for (const c of candidates) all.push(c);
    } catch (err) {
      // Detector errors must never crash the engine. Log + continue.
      // eslint-disable-next-line no-console
      console.error(`detector ${d.id} threw:`, err);
    }
  }
  return all;
}
