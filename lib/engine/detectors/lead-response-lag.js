// Detector #17 — Internet Lead Response Lag Money Leak.
// Engine spec §10 #17 · Martinez Ch. 9 (BDC SLA)
//
// Trigger:  >=2 unresponded leads aged past 15min OR any hot lead (score>=80) aged past 24h
// $ Impact: count × frontPVR × close-decay-per-minute-past-SLA
// Action:   Vini drafts personalized outreach + flags BDC Mgr

import { INSIGHT_CLASS, DOMAIN, ACTION_TYPE } from '../types.js';
import { scoreCandidate, computeNovelty } from '../scoring.js';

const SLA_MIN = 5;       // <5min target per Martinez Ch.9
const HOT_SCORE = 80;
const DARK_THRESHOLD_MIN = 24 * 60;

export const lead_response_lag = {
  id: 'lead-response-lag',
  domain: DOMAIN.BDC,
  class_: INSIGHT_CLASS.MONEY_LEAK,

  detect(store) {
    const leads = store.leads || [];
    const slaBreaches = leads.filter(
      (l) => !l.firstResponseAt && l.ageMin > SLA_MIN && l.state === 'open'
    );
    const hotDark = leads.filter(
      (l) => !l.firstResponseAt && l.score >= HOT_SCORE && l.ageMin > DARK_THRESHOLD_MIN
    );

    // Hot-dark is the headline if any exist (highest urgency)
    if (hotDark.length > 0) {
      return [hotLeadDarkInsight(store, hotDark, slaBreaches)];
    }
    if (slaBreaches.length >= 2) {
      return [slaBreachInsight(store, slaBreaches)];
    }
    return [];
  },
};

function hotLeadDarkInsight(store, hotDark, slaBreaches) {
  // Close-rate decay math: each minute past SLA reduces close odds.
  // Effective lost-deals math: hotDark.length × 0.30 close probability lost × frontGross
  const dollarImpact = Math.round(
    hotDark.length * 0.30 * store.economics.frontGrossAvg
  );
  const owner = store.owners.bdc_mgr;

  const candidate = {
    id: `hot-lead-dark-${store.now}`,
    class: INSIGHT_CLASS.MONEY_LEAK,
    domain: DOMAIN.BDC,
    headline: `${hotDark.length} hot leads dark > 24h. ~$${dollarImpact.toLocaleString()} in lost-deal value.`,
    why: `Scores ${hotDark.map((l) => l.score).join('·')} on ${[...new Set(hotDark.map((l) => l.vehicle))].join(', ')}. Zero response after first touch SLA.`,
    numbers: [
      { label: 'lost-deal $',     value: dollarImpact, unit: '$' },
      { label: 'hot leads dark',  value: hotDark.length, unit: 'l' },
      { label: 'oldest',          value: Math.round(Math.max(...hotDark.map((l) => l.ageMin)) / 60) + 'h', unit: '' },
      { label: 'SLA breaches now',value: slaBreaches.length, unit: '' },
    ],
    primaryAction: {
      label: 'Vini → manager touch',
      type: ACTION_TYPE.COMPOSE_MESSAGE,
      payload: {
        to: 'bdc_mgr',
        template: 'hot_lead_personal_touch',
        leadIds: hotDark.map((l) => l.id),
      },
    },
    secondaryActions: [
      { label: 'See lead list', type: ACTION_TYPE.OPEN_DRILLDOWN, payload: { target: 'leads', filter: 'hot_dark' } },
      { label: 'Mute 24h',      type: ACTION_TYPE.MUTE,           payload: { class: INSIGHT_CLASS.MONEY_LEAK, domain: DOMAIN.BDC, hours: 24 } },
    ],
    ownerRole: 'bdc_mgr',
    rootEntities: hotDark.map((l) => `LEAD:${l.id}`),
    scoreComponents: {
      dollarImpact,
      actionability: 0.9,
      novelty: computeNovelty({ priorEmissions: 0 }),
      confidence: 0.93,
    },
    martinezRef: 'Ch. 9 · CRM Accountability Report #1',
    emittedAt: store.now,
    expiresAt: addHoursISO(store.now, 8),
    detectorId: 'lead-response-lag',
  };
  scoreCandidate(candidate);
  return candidate;
}

function slaBreachInsight(store, breaches) {
  const avgAge = Math.round(breaches.reduce((s, l) => s + l.ageMin, 0) / breaches.length);
  // Decay model: per-minute close-odds loss × frontPVR × leadCount
  const dollarImpact = Math.round(
    breaches.length * Math.min(avgAge - SLA_MIN, 60) * store.economics.closeRatePerMinLag * store.economics.frontGrossAvg
  );
  const owner = store.owners.bdc_mgr;

  const candidate = {
    id: `sla-breach-${store.now}`,
    class: INSIGHT_CLASS.MONEY_LEAK,
    domain: DOMAIN.BDC,
    headline: `${breaches.length} leads past ${SLA_MIN}-min SLA. ~$${dollarImpact.toLocaleString()} bleeding.`,
    why: `Avg age ${avgAge}min vs <${SLA_MIN}min target. Every minute past SLA reduces close odds 1.2%.`,
    numbers: [
      { label: 'lost-deal $',  value: dollarImpact, unit: '$' },
      { label: 'breaching',    value: breaches.length, unit: 'l' },
      { label: 'avg age',      value: avgAge + 'min', unit: '' },
      { label: 'owner',        value: owner.name },
    ],
    primaryAction: {
      label: `Vini → first touch on ${breaches.length}`,
      type: ACTION_TYPE.COMPOSE_MESSAGE,
      payload: { to: 'bdc_mgr', template: 'sla_first_touch', leadIds: breaches.map((l) => l.id) },
    },
    secondaryActions: [
      { label: 'BDC dashboard', type: ACTION_TYPE.OPEN_DRILLDOWN, payload: { target: 'bdc' } },
    ],
    ownerRole: 'bdc_mgr',
    rootEntities: breaches.map((l) => `LEAD:${l.id}`),
    scoreComponents: {
      dollarImpact,
      actionability: 0.95,
      novelty: computeNovelty({ priorEmissions: 0 }),
      confidence: 0.9,
    },
    martinezRef: 'Ch. 9 · Internet Lead Response Curve',
    emittedAt: store.now,
    expiresAt: addHoursISO(store.now, 4),
    detectorId: 'lead-response-lag',
  };
  scoreCandidate(candidate);
  return candidate;
}

function addHoursISO(iso, hours) {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}
