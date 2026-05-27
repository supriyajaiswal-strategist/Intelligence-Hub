// Public entry to the engine.
//
//   import { runEngine } from '@/lib/engine';
//   const result = runEngine();
//   //   result.candidates  — all detectors' output, scored
//   //   result.today       — top 3 (filter → rank → diversity → dedupe)
//   //   result.feed        — full ranked stream
//   //   result.moneyMeter  — { total, breakdown }
//
// Production replaces getStoreFactModel() with live data connectors;
// every other layer stays unchanged.

import { getStoreFactModel } from './store.js';
import { runAllDetectors }   from './detectors/index.js';
import { selectToday, selectFeed, computeMoneyMeter } from './today.js';

export { fireAction } from './actions.js';
export { INSIGHT_CLASS, DOMAIN, ACTION_TYPE } from './types.js';

export function runEngine(principalState = {}) {
  const store = getStoreFactModel();
  const candidates = runAllDetectors(store);

  return {
    store,
    candidates,
    today: selectToday(candidates, principalState),
    feed:  selectFeed(candidates, principalState),
    moneyMeter: computeMoneyMeter(candidates),
  };
}
