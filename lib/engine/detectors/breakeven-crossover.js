// Detector #12 — Break-even Crossover Money Leak.
// Engine spec §10 #12 · Martinez Ch. 7 (wholesale calc has higher EV than continued hold)
//
// Trigger:  units that crossed their personal break-even day (front gross exhausted by carry)
// $ Impact: count × daily holding cost — the bleed each additional day
// Action:   one-tap wholesale calc + auction lane send

import { INSIGHT_CLASS, DOMAIN, ACTION_TYPE } from '../types.js';
import { scoreCandidate, computeNovelty } from '../scoring.js';

export const breakeven_crossover = {
  id: 'breakeven-crossover',
  domain: DOMAIN.AGING,
  class_: INSIGHT_CLASS.MONEY_LEAK,

  detect(store) {
    const crossed = (store.inventory || []).filter(
      (u) => u.breakEvenDay != null && u.daysInStock >= u.breakEvenDay && u.leadsLast14 === 0
    );
    if (crossed.length === 0) return [];

    const dollarImpact = Math.round(crossed.length * store.economics.holdingCostPerDay * 7);
    const owner = store.owners.ucm;

    const candidate = {
      id: `breakeven-crossover-${store.now}`,
      class: INSIGHT_CLASS.MONEY_LEAK,
      domain: DOMAIN.AGING,
      headline: `${crossed.length} units crossed break-even with 0 leads. Wholesale calc beats hold.`,
      why: `Front gross exhausted by carry. Continued retail hold has lower EV than auction send. Martinez Ch. 7.`,
      numbers: [
        { label: 'next 7d bleed',  value: dollarImpact, unit: '$' },
        { label: 'units past BE',  value: crossed.length, unit: 'u' },
        { label: 'days past',      value: Math.max(...crossed.map((u) => u.daysInStock - u.breakEvenDay)) + '+', unit: 'd' },
        { label: 'leads (14d)',    value: 0, unit: '' },
      ],
      primaryAction: {
        label: 'Wholesale calc + send',
        type: ACTION_TYPE.WHOLESALE_SEND,
        payload: { vins: crossed.map((u) => u.vin), lane: 'manheim_chicago' },
      },
      secondaryActions: [
        { label: 'See units', type: ACTION_TYPE.OPEN_DRILLDOWN, payload: { target: 'inventory', filter: 'past_breakeven' } },
        { label: 'Try reprice first', type: ACTION_TYPE.REPRICE, payload: { vins: crossed.map((u) => u.vin), newPriceStrategy: 'rescue_neg_4pct' } },
      ],
      ownerRole: 'ucm',
      rootEntities: crossed.map((u) => `VIN:${u.vin}`),
      scoreComponents: {
        dollarImpact,
        actionability: 0.85,
        novelty: computeNovelty({ priorEmissions: 0 }),
        confidence: 1.0,
      },
      martinezRef: 'Ch. 7 · Break-even & wholesale calc',
      emittedAt: store.now,
      expiresAt: addHoursISO(store.now, 24),
      detectorId: 'breakeven-crossover',
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
