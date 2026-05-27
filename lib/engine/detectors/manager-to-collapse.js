// Detector #21 — Manager Turnover Rate Collapse Money Leak.
// Engine spec §10 #21 · Martinez Ch. 9 (manager TO discipline)
//
// Trigger:  yesterday's manager-TO rate < 90% threshold
// $ Impact: ups_without_TO × ~$900 lost-deal-net (Martinez gut-math)
// Action:   Sales Mgr huddle prompt + lost-deal review

import { INSIGHT_CLASS, DOMAIN, ACTION_TYPE } from '../types.js';
import { scoreCandidate, computeNovelty } from '../scoring.js';

const TO_TARGET = 0.90;
const LOST_DEAL_NET = 900;

export const manager_to_collapse = {
  id: 'manager-to-collapse',
  domain: DOMAIN.SALES_FLOOR,
  class_: INSIGHT_CLASS.MONEY_LEAK,

  detect(store) {
    const y = store.yesterdayUps;
    if (!y || y.totalUps === 0) return [];
    const toRate = y.upsWithMgrTO / y.totalUps;
    if (toRate >= TO_TARGET) return [];

    const missed = y.totalUps - y.upsWithMgrTO;
    const dollarImpact = Math.round(missed * LOST_DEAL_NET);
    const owner = store.owners.sales_mgr;

    const candidate = {
      id: `manager-to-collapse-${store.now}`,
      class: INSIGHT_CLASS.MONEY_LEAK,
      domain: DOMAIN.SALES_FLOOR,
      headline: `Manager TO rate ${(toRate * 100).toFixed(0)}% yesterday. ${missed} ups walked without TO.`,
      why: `Target ≥90% (Martinez Ch. 9). TO is the single highest-leverage walk-in lever. Lost-deal net ~$${LOST_DEAL_NET}/up.`,
      numbers: [
        { label: 'lost-deal $',     value: dollarImpact, unit: '$' },
        { label: 'TO rate',         value: `${(toRate * 100).toFixed(0)}%`, unit: '' },
        { label: 'ups w/o TO',      value: missed, unit: 'u' },
        { label: 'owner',           value: owner.name },
      ],
      primaryAction: {
        label: 'Send Sales Mgr huddle prompt',
        type: ACTION_TYPE.COMPOSE_MESSAGE,
        payload: { to: 'sales_mgr', template: 'to_discipline_huddle' },
      },
      secondaryActions: [
        { label: 'See lost ups', type: ACTION_TYPE.OPEN_DRILLDOWN, payload: { target: 'sales_floor', filter: 'no_to_yesterday' } },
        { label: 'Mute 7d',      type: ACTION_TYPE.MUTE, payload: { class: INSIGHT_CLASS.MONEY_LEAK, domain: DOMAIN.SALES_FLOOR, hours: 168 } },
      ],
      ownerRole: 'sales_mgr',
      rootEntities: [`MGR:sales_mgr`],
      scoreComponents: {
        dollarImpact,
        actionability: 0.8,
        novelty: computeNovelty({ priorEmissions: 0 }),
        confidence: 1.0,
      },
      martinezRef: 'Ch. 9 · Walk-in Process Step 5 (Manager TO)',
      emittedAt: store.now,
      expiresAt: addHoursISO(store.now, 12),
      detectorId: 'manager-to-collapse',
    };

    scoreCandidate(candidate);
    return [candidate];
  },
};

function addHoursISO(iso, hours) {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}
