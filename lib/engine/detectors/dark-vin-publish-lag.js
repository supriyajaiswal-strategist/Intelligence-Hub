// Detector — Dark VIN Publish Lag (TTL stage).
//
// Per JJ's whiteboard: TTL = frontline-ready → first listing live.
// Every day a frontline VIN sits unpublished = ~$120-$250 in lost VDP visibility
// (Studio AI deck) + holding cost. The fix is a SINGLE Spyne action:
// Studio VIN Clone — match the incoming VIN to existing matched-VIN media and
// publish Day-0. This is Spyne's single highest-ROI primitive.
//
// Trigger:  any VIN with status='frontline' AND daysSinceFrontline >= 2
// $ Impact: count × (holdingCostPerDay + $150 lost-visibility) × daysSinceFrontline
// Action:   STUDIO_VIN_CLONE if cloneMatchAvailable, else STUDIO_SHOOT_TONIGHT

import { INSIGHT_CLASS, DOMAIN, ACTION_TYPE } from '../types.js';
import { scoreCandidate, computeNovelty } from '../scoring.js';

const LOST_VISIBILITY_PER_DAY = 150;  // conservative end of Studio deck's $120-$250 range

export const dark_vin_publish_lag = {
  id: 'dark-vin-publish-lag',
  domain: DOMAIN.PRICING,  // TTL/listing lives closest to pricing/merchandising in the matrix
  class_: INSIGHT_CLASS.MONEY_LEAK,

  detect(store) {
    const dark = (store.inventory || []).filter(
      (u) => u.status === 'frontline' && (u.daysSinceFrontline || 0) >= 2
    );
    if (dark.length === 0) return [];

    const dollarImpact = Math.round(
      dark.reduce(
        (s, u) => s + (store.economics.holdingCostPerDay + LOST_VISIBILITY_PER_DAY) * u.daysSinceFrontline,
        0
      )
    );

    const allHaveClone = dark.every((u) => u.cloneMatchAvailable);
    const someHaveClone = dark.some((u) => u.cloneMatchAvailable);

    const primaryLabel = allHaveClone
      ? `Studio VIN Clone + publish ${dark.length}`
      : someHaveClone
        ? `Clone ${dark.filter((u) => u.cloneMatchAvailable).length} + shoot tonight ${dark.filter((u) => !u.cloneMatchAvailable).length}`
        : `Studio shoot tonight · ${dark.length}`;

    const primaryAction = allHaveClone
      ? {
          label: primaryLabel,
          type: ACTION_TYPE.STUDIO_VIN_CLONE,
          payload: { vins: dark.map((u) => u.vin) },
        }
      : {
          label: primaryLabel,
          type: ACTION_TYPE.STUDIO_SHOOT_TONIGHT,
          payload: { vins: dark.map((u) => u.vin), shootType: 'images+360' },
        };

    const candidate = {
      id: `dark-vin-publish-lag-${store.now}`,
      class: INSIGHT_CLASS.MONEY_LEAK,
      domain: DOMAIN.PRICING,
      headline: `${dark.length} VINs frontline-ready, still not live. $${dollarImpact.toLocaleString()} lost.`,
      why: someHaveClone
        ? `Clone match available — Day-0 publish is one tap.`
        : `No clone match — shoot tonight, live tomorrow.`,
      numbers: [
        { label: 'lost / dark',    value: dollarImpact, unit: '$' },
        { label: 'dark VINs',      value: dark.length, unit: 'u' },
        { label: 'oldest dark',    value: Math.max(...dark.map((u) => u.daysSinceFrontline)), unit: 'd' },
        { label: 'clone matches',  value: dark.filter((u) => u.cloneMatchAvailable).length, unit: '/' + dark.length },
      ],
      primaryAction,
      secondaryActions: [
        { label: 'See VINs', type: ACTION_TYPE.OPEN_DRILLDOWN, payload: { target: 'stage:ttl' } },
        { label: 'Mute 24h', type: ACTION_TYPE.MUTE, payload: { class: INSIGHT_CLASS.MONEY_LEAK, domain: DOMAIN.PRICING, hours: 24 } },
      ],
      ownerRole: 'ucm',
      rootEntities: dark.map((u) => `VIN:${u.vin}`),
      scoreComponents: {
        dollarImpact,
        actionability: 0.95,  // one tap, one product, immediate
        novelty: computeNovelty({ priorEmissions: 0 }),
        confidence: 0.94,
      },
      martinezRef: 'Ch. 4 · Time to Live · Studio AI VIN Clone',
      emittedAt: store.now,
      expiresAt: addHoursISO(store.now, 12),
      detectorId: 'dark-vin-publish-lag',
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
