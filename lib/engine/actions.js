// Action orchestration — the moat layer.
//
// One tap → fires a Spyne product pipeline. Today these primitives are stubs
// that simulate the real call. Each stub matches the actual product surface
// described in the Studio AI + Vini AI decks. Production replaces the stub
// body with the real product API; the contract stays identical.

import { ACTION_TYPE } from './types.js';

/**
 * Fire an action. Returns a normalized result envelope.
 *   { ok: true, kind: '<type>', summary: '...', detail: {...} }
 */
export async function fireAction(action) {
  if (!action || !action.type) return { ok: false, error: 'no action type' };
  const { type, payload, label } = action;

  switch (type) {
    // ── Studio AI ────────────────────────────────────────────────────────
    case ACTION_TYPE.STUDIO_VIN_CLONE:      return studioVinClone(payload, label);
    case ACTION_TYPE.STUDIO_SHOOT_TONIGHT:  return studioShootTonight(payload, label);
    case ACTION_TYPE.STUDIO_RESHOOT_360:    return studioReshoot360(payload, label);
    case ACTION_TYPE.STUDIO_SMART_CAMPAIGN: return studioSmartCampaign(payload, label);

    // ── Vini AI ──────────────────────────────────────────────────────────
    case ACTION_TYPE.VINI_SALES_OUTBOUND:   return viniSalesOutbound(payload, label);
    case ACTION_TYPE.VINI_SERVICE_OUTBOUND: return viniServiceOutbound(payload, label);
    case ACTION_TYPE.VINI_INBOUND_FIX:      return viniInboundFix(payload, label);

    // ── Marketplace / Auction / DMS ──────────────────────────────────────
    case ACTION_TYPE.MARKETPLACE_PUSH:      return marketplacePush(payload, label);
    case ACTION_TYPE.WHOLESALE_SEND:        return wholesaleSend(payload, label);
    case ACTION_TYPE.APPROVE_RO:            return approveRO(payload, label);

    // ── Hub-internal ─────────────────────────────────────────────────────
    case ACTION_TYPE.HUB_COMPOSE_INTERNAL:  return hubComposeInternal(payload, label);
    case ACTION_TYPE.OPEN_DRILLDOWN:        return { ok: true, kind: 'open_drilldown', payload };
    case ACTION_TYPE.MUTE:                  return { ok: true, kind: 'mute', payload };
    case ACTION_TYPE.LOG_DECISION:          return { ok: true, kind: 'log_decision', payload };

    default: return { ok: false, error: `unknown action type: ${type}` };
  }
}

// ── Studio AI handlers ──────────────────────────────────────────────────
async function studioVinClone(payload) {
  const { vins = [] } = payload || {};
  // Production: POST Studio /vin-clone/match → returns matched studio assets
  // for each VIN, publishes listing live in minutes.
  return {
    ok: true, kind: 'studio_vin_clone',
    summary: `Studio matched ${vins.length} VIN(s) to existing media. Listings publishing now · ETA <15 min.`,
    detail: { vins, simulated: true },
  };
}
async function studioShootTonight(payload) {
  const { vins = [], shootType = 'images+360' } = payload || {};
  return {
    ok: true, kind: 'studio_shoot_tonight',
    summary: `Studio queued ${vins.length} VIN(s) for ${shootType} · 7h turnaround · ready by morning.`,
    detail: { vins, shootType, simulated: true },
  };
}
async function studioReshoot360(payload) {
  const { vins = [] } = payload || {};
  return {
    ok: true, kind: 'studio_reshoot_360',
    summary: `Studio reshoot scheduled · ${vins.length} VIN(s) · BTP boost projected +30 pts.`,
    detail: { vins, simulated: true },
  };
}
async function studioSmartCampaign(payload) {
  const { vins = [], campaign = 'aged_urgency' } = payload || {};
  return {
    ok: true, kind: 'studio_smart_campaign',
    summary: `Smart Campaign ${campaign} applied to ${vins.length} VIN(s) · live on VDPs now.`,
    detail: { vins, campaign, simulated: true },
  };
}

// ── Vini AI handlers ────────────────────────────────────────────────────
async function viniSalesOutbound(payload) {
  const { leadIds = [], template = 'aged_lead_reactivation' } = payload || {};
  return {
    ok: true, kind: 'vini_sales_outbound',
    summary: `Vini Sales Outbound · ${leadIds.length} lead(s) · template=${template} · first touch within 60s.`,
    detail: { leadIds, template, simulated: true },
  };
}
async function viniServiceOutbound(payload) {
  const { customerIds = [], campaign = 'recall_outreach' } = payload || {};
  return {
    ok: true, kind: 'vini_service_outbound',
    summary: `Vini Service Outbound · ${customerIds.length} customer(s) · campaign=${campaign}.`,
    detail: { customerIds, campaign, simulated: true },
  };
}
async function viniInboundFix(payload) {
  const { ruleId, change } = payload || {};
  return {
    ok: true, kind: 'vini_inbound_fix',
    summary: `Vini inbound rule updated · ${ruleId} → ${change}.`,
    detail: { ruleId, change, simulated: true },
  };
}

// ── Marketplace / Auction / DMS ─────────────────────────────────────────
async function marketplacePush(payload) {
  const { vins = [], strategy } = payload || {};
  return {
    ok: true, kind: 'marketplace_push',
    summary: `Marketplace feed pushed · ${vins.length} VIN(s) · strategy=${strategy}.`,
    detail: { vins, strategy, simulated: true },
  };
}
async function wholesaleSend(payload) {
  const { vins = [], lane = 'manheim_chicago' } = payload || {};
  return {
    ok: true, kind: 'wholesale_send',
    summary: `Auction lane consigned · ${vins.length} VIN(s) · ${lane}.`,
    detail: { vins, lane, simulated: true },
  };
}
async function approveRO(payload) {
  const { roIds = [] } = payload || {};
  return {
    ok: true, kind: 'approve_ro',
    summary: `Approved ${roIds.length} RO(s) in DMS.`,
    detail: { roIds, simulated: true },
  };
}

// ── Hub-internal ────────────────────────────────────────────────────────
async function hubComposeInternal(payload) {
  const { to, template, vins = [], leadIds = [] } = payload || {};
  return {
    ok: true, kind: 'hub_compose_internal',
    summary: `Internal note drafted → ${to} · template=${template} · ${vins.length + leadIds.length} refs.`,
    detail: { to, template, vins, leadIds, simulated: true },
  };
}
