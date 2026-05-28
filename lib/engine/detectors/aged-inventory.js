// Detector #11 — Aged Inventory Carry Money Leak.
// Engine spec §10 #11 · Martinez Ch. 6 / Ch. 7 (The 45-Day Walk)
//
// Trigger:  share of aged-45+ units > 10%
// $ Impact: sum(holdingCostPerDay × daysPast45) across the aged set
// Action:   open 45-Day Walk queue

import { INSIGHT_CLASS, DOMAIN, ACTION_TYPE } from '../types.js';
import { scoreCandidate, computeNovelty } from '../scoring.js';

export const aged_inventory = {
  id: 'aged-inventory',
  domain: DOMAIN.AGING,
  class_: INSIGHT_CLASS.MONEY_LEAK,

  detect(store) {
    const inv = store.inventory || [];
    if (!inv.length) return [];

    const aged45 = inv.filter((u) => u.daysInStock >= 45);
    const sharePct = aged45.length / inv.length;
    if (sharePct <= 0.10) return [];  // Martinez: <10% target

    const dollarImpact = Math.round(
      aged45.reduce(
        (s, u) => s + store.economics.holdingCostPerDay * Math.max(0, u.daysInStock - 45),
        0
      )
    );
    const owner = store.owners.ucm;

    const candidate = {
      id: `aged-inventory-${store.now}`,
      class: INSIGHT_CLASS.MONEY_LEAK,
      domain: DOMAIN.AGING,
      headline: `$${dollarImpact.toLocaleString()} accrued holding cost on ${aged45.length} aged units.`,
      why: `Aged-share ${(sharePct * 100).toFixed(1)}% (target <10%). Inaction is the most expensive option.`,
      numbers: [
        { label: 'accrued carry',  value: dollarImpact, unit: '$' },
        { label: 'aged 45+',       value: aged45.length, unit: 'u' },
        { label: 'aged share',     value: `${(sharePct * 100).toFixed(1)}%`, unit: '' },
        { label: 'owner',          value: owner.name },
      ],
      primaryAction: {
        label: 'Open 45-Day Walk',
        type: ACTION_TYPE.OPEN_DRILLDOWN,
        payload: { target: 'walk_queue', filter: 'aged45plus' },
      },
      secondaryActions: [
        { label: 'Smart Campaign · aged-urgency overlay', type: ACTION_TYPE.STUDIO_SMART_CAMPAIGN, payload: { vins: aged45.map((u) => u.vin), campaign: 'aged_urgency' } },
        { label: 'Marketplace reprice -2%',                type: ACTION_TYPE.MARKETPLACE_PUSH,     payload: { vins: aged45.map((u) => u.vin), strategy: 'aged_neg_2pct' } },
        { label: 'Mute 72h',    type: ACTION_TYPE.MUTE,    payload: { class: INSIGHT_CLASS.MONEY_LEAK, domain: DOMAIN.AGING, hours: 72 } },
      ],
      ownerRole: 'ucm',
      rootEntities: aged45.map((u) => `VIN:${u.vin}`),
      scoreComponents: {
        dollarImpact,
        actionability: 0.9,
        novelty: computeNovelty({ priorEmissions: 0 }),
        confidence: 1.0,
      },
      martinezRef: 'Ch. 7 · The 45-Day Walk',
      emittedAt: store.now,
      expiresAt: addHoursISO(store.now, 24),
      detectorId: 'aged-inventory',
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
