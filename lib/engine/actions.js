// Action orchestration — the moat layer.
//
// The Hub's UX promise is "one tap fires a Spyne pipeline". Today these
// primitives are stubs that log + return a simulated result. Production
// replaces each stub with the real product API (Studio AI batch endpoint,
// Vini AI SMS endpoint, Marketplace push endpoint, Auction lane endpoint).
//
// Every detector emits primaryAction / secondaryActions that reference one
// of these action types. The surface layer calls fireAction(action) and
// renders the returned status.

import { ACTION_TYPE } from './types.js';

/**
 * Fire an action. Returns a normalized result envelope.
 *
 *   { ok: true, kind: 'studio_shoot', summary: '...', detail: {...} }
 *   { ok: false, kind: '...', error: '...', detail: {...} }
 *
 * Stubs return ok:true with a delay simulating the real call.
 */
export async function fireAction(action) {
  const { type, payload, label } = action || {};
  if (!type) return { ok: false, error: 'no action type' };

  switch (type) {
    case ACTION_TYPE.COMPOSE_MESSAGE: return composeMessage(payload, label);
    case ACTION_TYPE.STUDIO_SHOOT:    return studioShoot(payload, label);
    case ACTION_TYPE.REPRICE:         return reprice(payload, label);
    case ACTION_TYPE.WHOLESALE_SEND:  return wholesaleSend(payload, label);
    case ACTION_TYPE.APPROVE_RO:      return approveRO(payload, label);
    case ACTION_TYPE.OPEN_DRILLDOWN:  return { ok: true, kind: 'open_drilldown', payload };
    case ACTION_TYPE.MUTE:            return { ok: true, kind: 'mute', payload };
    case ACTION_TYPE.LOG_DECISION:    return { ok: true, kind: 'log_decision', payload };
    default:                          return { ok: false, error: `unknown action type: ${type}` };
  }
}

// ─── Vini AI (SMS / outbound comms) ─────────────────────────────────────────
async function composeMessage(payload, label) {
  const { to, template, vins = [], leadIds = [] } = payload || {};
  // STUB: production POSTs to Vini's drafts endpoint with template + entity refs.
  // Vini drafts in the manager's voice, sends from a verified store number.
  return {
    ok: true,
    kind: 'compose_message',
    summary: `Vini drafted SMS → ${to} · ${vins.length || leadIds.length} entities · template=${template}`,
    detail: {
      to, template,
      vins, leadIds,
      // In production: { viniDraftId, viniSendAt, viniPhoneNumber }
      simulated: true,
    },
  };
}

// ─── Studio AI (photography / 360 spins) ────────────────────────────────────
async function studioShoot(payload, label) {
  const { vins = [], priority = 'tonight' } = payload || {};
  // STUB: production POSTs to Studio's batch queue. Returns batch id + ETA.
  return {
    ok: true,
    kind: 'studio_shoot',
    summary: `Studio queued ${vins.length} VIN(s) for ${priority} shoot · est. 7h turnaround`,
    detail: {
      vins, priority,
      // In production: { studioBatchId, estCompleteAt, photographer }
      simulated: true,
    },
  };
}

// ─── Marketplace push (AutoTrader, Cars.com, FB) ────────────────────────────
async function reprice(payload, label) {
  const { vins = [], newPriceStrategy } = payload || {};
  // STUB: production pushes new price to syndication network and notifies
  // any active Vini follow-ups to mention the price drop in next touch.
  return {
    ok: true,
    kind: 'reprice',
    summary: `Reprice queued · ${vins.length} VIN(s) · strategy=${newPriceStrategy}`,
    detail: {
      vins, newPriceStrategy,
      // In production: { syndicationJobId, viniNotifiedFollowupIds }
      simulated: true,
    },
  };
}

// ─── Auction lane (Manheim / Adesa) ─────────────────────────────────────────
async function wholesaleSend(payload, label) {
  const { vins = [], lane } = payload || {};
  // STUB: production opens auction lane consignment with target floor.
  return {
    ok: true,
    kind: 'wholesale_send',
    summary: `Auction lane consigned · ${vins.length} VIN(s) · lane=${lane}`,
    detail: {
      vins, lane,
      simulated: true,
    },
  };
}

// ─── DMS RO approval ────────────────────────────────────────────────────────
async function approveRO(payload, label) {
  const { roIds = [] } = payload || {};
  return {
    ok: true,
    kind: 'approve_ro',
    summary: `Approved ${roIds.length} RO(s) in DMS`,
    detail: { roIds, simulated: true },
  };
}
