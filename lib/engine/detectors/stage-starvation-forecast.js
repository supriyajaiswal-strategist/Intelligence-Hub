// Detector — Stage Starvation Forecast (REPLENISH lens).
//
// Per JJ's whiteboard: REPLENISH = the FLOW through the funnel, not the inventory cycle.
// When TTF intake slows, TTL starves 2-4 days later; GEN starves 5-7 days later;
// downstream stages cascade.
//
// This is a FORECAST RISK insight class (urgency 2x) — it surfaces BEFORE the bleed
// starts, so the GM can intervene upstream.
//
// Trigger:  any stage's last-7-day rolling intake < 75% of 28-day baseline
// $ Impact: projected lost sales from cascade, computed at the most downstream
//           stage that would feel it.

import { INSIGHT_CLASS, DOMAIN, ACTION_TYPE } from '../types.js';
import { scoreCandidate, computeNovelty } from '../scoring.js';

const STARVATION_THRESHOLD = 0.75;  // 7d avg < 75% of 28d baseline

const STAGE_INFO = {
  ttf:      { label: 'TTF',      daysToCascade: 0,  upstreamLever: 'Acquisition'    },
  ttl:      { label: 'TTL',      daysToCascade: 2,  upstreamLever: 'TTF / recon'    },
  gen:      { label: 'GEN',      daysToCascade: 5,  upstreamLever: 'TTL / publish'  },
  aptc:     { label: 'APT C',    daysToCascade: 2,  upstreamLever: 'GEN / leads'    },
  visit:    { label: 'VISIT',    daysToCascade: 1,  upstreamLever: 'APT C / confirm'},
  sellconv: { label: 'Sell Conv',daysToCascade: 1,  upstreamLever: 'VISIT / shows'  },
};

export const stage_starvation_forecast = {
  id: 'stage-starvation-forecast',
  domain: DOMAIN.PL,
  class_: INSIGHT_CLASS.FORECAST_RISK,

  detect(store) {
    const intake = store.stageIntake;
    if (!intake) return [];

    // Walk each stage. Find the EARLIEST (most upstream) stage in starvation,
    // then forecast the downstream impact.
    const stages = ['ttf', 'ttl', 'gen', 'aptc', 'visit', 'sellconv'];
    const starving = [];

    for (const s of stages) {
      const arr = intake[`${s}_intake_7d`];
      const baseline = intake[`${s}_intake_28d_avg`];
      if (!arr || !baseline) continue;
      const avg7 = arr.reduce((a, b) => a + b, 0) / arr.length;
      const ratio = avg7 / baseline;
      if (ratio < STARVATION_THRESHOLD) {
        starving.push({
          stage: s,
          avg7,
          baseline,
          ratio,
          shortfallPct: Math.round((1 - ratio) * 100),
        });
      }
    }

    if (starving.length === 0) return [];

    // Most upstream starving stage drives the headline (longest cascade horizon).
    const earliest = starving[0];
    const info = STAGE_INFO[earliest.stage];

    // Project lost sales: ~the shortfall in units × Martinez front-gross.
    const projectedLostUnits = Math.round(
      (earliest.baseline - earliest.avg7) * 7  // weekly shortfall
    );
    const dollarImpact = Math.round(projectedLostUnits * store.economics.frontGrossAvg);

    const candidate = {
      id: `stage-starvation-${earliest.stage}-${store.now}`,
      class: INSIGHT_CLASS.FORECAST_RISK,
      domain: DOMAIN.PL,
      headline: `${info.label} intake ${earliest.shortfallPct}% below baseline. Downstream starves in ${info.daysToCascade}d.`,
      why: `7-day avg ${earliest.avg7.toFixed(1)}/day vs 28-day baseline ${earliest.baseline.toFixed(1)}. Untreated → projected lost ${projectedLostUnits} units = $${dollarImpact.toLocaleString()} front gross over 14d.`,
      numbers: [
        { label: 'projected loss',  value: dollarImpact, unit: '$' },
        { label: 'shortfall',       value: `-${earliest.shortfallPct}%`, unit: '' },
        { label: 'cascade in',      value: info.daysToCascade, unit: 'd' },
        { label: 'lever',           value: info.upstreamLever },
      ],
      primaryAction: {
        label: `Open ${info.label} drill-down`,
        type: ACTION_TYPE.OPEN_DRILLDOWN,
        payload: { target: `stage:${earliest.stage}`, lens: 'starvation' },
      },
      secondaryActions: [
        { label: 'Open Money Map', type: ACTION_TYPE.OPEN_DRILLDOWN, payload: { target: 'money_map' } },
        { label: 'Mute 48h',       type: ACTION_TYPE.MUTE, payload: { class: INSIGHT_CLASS.FORECAST_RISK, hours: 48 } },
      ],
      ownerRole: 'gm',
      rootEntities: [`STAGE:${earliest.stage}`],
      scoreComponents: {
        dollarImpact,
        actionability: 0.6,  // forecast → diagnostic, not one-tap
        novelty: computeNovelty({ priorEmissions: 0 }),
        confidence: 0.82,
      },
      martinezRef: 'Ch. 9-10 · Funnel throughput & pipeline replenishment',
      emittedAt: store.now,
      expiresAt: addHoursISO(store.now, 24),
      detectorId: 'stage-starvation-forecast',
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
