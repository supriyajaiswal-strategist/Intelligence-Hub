// Detector #1 — Recon Bottleneck Money Leak.
// Engine spec §10 #1 · Martinez Ch. 4 (Recon Bottleneck #2 — detail handoff)
//
// Trigger:  any recon stage with >=3 units past 2x its SLA
// $ Impact: count_of_stuck_units × holdingCostPerDay × avg_days_overdue
// Action:   Vini drafts SMS to Recon Mgr (or Detail owner) with VIN list

import { INSIGHT_CLASS, DOMAIN, ACTION_TYPE } from '../types.js';
import { scoreCandidate, computeNovelty } from '../scoring.js';

export const recon_bottleneck = {
  id: 'recon-bottleneck',
  domain: DOMAIN.RECON_SPEED,
  class_: INSIGHT_CLASS.MONEY_LEAK,

  detect(store) {
    const stuck = (store.recon || []).filter(
      (r) => r.hoursInStage > 2 * (r.slaHours || 8)
    );
    if (stuck.length < 3) return [];

    // Group by stage so we surface the worst bottleneck.
    const byStage = {};
    for (const r of stuck) {
      (byStage[r.stage] = byStage[r.stage] || []).push(r);
    }
    const worstStage = Object.entries(byStage)
      .sort((a, b) => b[1].length - a[1].length)[0];

    const stageName = worstStage[0];
    const stuckUnits = worstStage[1];
    const stuckCount = stuckUnits.length;
    const dollarImpact = Math.round(
      stuckCount * store.economics.holdingCostPerDay
    );
    const owner = store.owners.recon_mgr;

    const candidate = {
      id: `recon-bottleneck-${stageName}-${store.now}`,
      class: INSIGHT_CLASS.MONEY_LEAK,
      domain: DOMAIN.RECON_SPEED,
      headline: `$${dollarImpact.toLocaleString()} bleeding in recon. ${stuckCount} units stuck at ${stageName}.`,
      why: `${stageName.charAt(0).toUpperCase() + stageName.slice(1)} handoff is the bottleneck. Avg ${Math.round(avgHours(stuckUnits))}h vs ${stuckUnits[0].slaHours}h SLA.`,
      numbers: [
        { label: 'at stake today',  value: dollarImpact, unit: '$' },
        { label: 'units stuck',     value: stuckCount,  unit: 'u' },
        { label: 'SLA breach',      value: `${Math.round(avgHours(stuckUnits) / stuckUnits[0].slaHours)}×`, unit: '' },
        { label: 'owner',           value: owner.name },
      ],
      primaryAction: {
        label: `Text ${owner.name.split(' ')[0]}`,
        type: ACTION_TYPE.COMPOSE_MESSAGE,
        payload: {
          to: 'recon_mgr',
          template: 'recon_stuck',
          vins: stuckUnits.map((u) => u.vin),
        },
      },
      secondaryActions: [
        { label: 'See units', type: ACTION_TYPE.OPEN_DRILLDOWN, payload: { target: `stage:golive` } },
        { label: 'Mute 72h',  type: ACTION_TYPE.MUTE,           payload: { class: INSIGHT_CLASS.MONEY_LEAK, domain: DOMAIN.RECON_SPEED, hours: 72 } },
      ],
      ownerRole: 'recon_mgr',
      rootEntities: stuckUnits.map((u) => `VIN:${u.vin}`),
      scoreComponents: {
        dollarImpact,
        actionability: 0.9,
        novelty: computeNovelty({ priorEmissions: 0 }),
        confidence: 0.95,
      },
      martinezRef: 'Ch. 4 · Bottleneck #2 (detail handoff)',
      emittedAt: store.now,
      expiresAt: addHoursISO(store.now, 24),
      detectorId: 'recon-bottleneck',
    };

    scoreCandidate(candidate);
    return [candidate];
  },
};

function avgHours(units) {
  return units.reduce((s, u) => s + u.hoursInStage, 0) / units.length;
}

function addHoursISO(iso, hours) {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}
