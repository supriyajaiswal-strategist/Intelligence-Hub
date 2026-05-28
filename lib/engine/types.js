// Candidate Insight schema — the most important type in the engine.
// Every detector returns CandidateInsight[]. Surface layer renders these.
// Matches The_Best_Intelligence_Hub_Vision.md §11.2 / Velocity_Insights_Engine.md.

/**
 * INSIGHT CLASSES — §5 of the engine spec.
 * Class determines tone, urgency multiplier, surface, and action shape.
 */
export const INSIGHT_CLASS = {
  MONEY_LEAK:     'A_money_leak',      // urgency 3x · "what's bleeding right now"
  HIDDEN_PATTERN: 'B_hidden_pattern',  // urgency 1x · cross-domain · the moat
  FORECAST_RISK:  'C_forecast_risk',   // urgency 2x · "what hurts me if I do nothing"
  OPPORTUNITY:    'D_opportunity',     // urgency 1.5x · upside in a time window
  ANOMALY:        'E_anomaly',         // urgency 2x · |z| > 2 vs baseline
  COACHING:       'F_coaching',        // urgency 1x · 1:1 prep
};

/**
 * URGENCY MULTIPLIERS — §7.1 of the engine spec.
 */
export const URGENCY = {
  [INSIGHT_CLASS.MONEY_LEAK]:     3.0,
  [INSIGHT_CLASS.FORECAST_RISK]:  2.0,
  [INSIGHT_CLASS.ANOMALY]:        2.0,
  [INSIGHT_CLASS.OPPORTUNITY]:    1.5,
  [INSIGHT_CLASS.HIDDEN_PATTERN]: 1.0,
  [INSIGHT_CLASS.COACHING]:       1.0,
};

/**
 * MARTINEZ DOMAINS — §6.1 of the engine spec.
 * Used by the diversity constraint: top 3 must span ≥2 domains.
 */
export const DOMAIN = {
  RECON_SPEED:   'recon_speed',         // Ch. 4
  PRICING:       'pricing',             // Ch. 5
  AGING:         'aging',               // Ch. 6, 7
  RECON_COST:    'recon_cost',          // Ch. 8
  BDC:           'bdc',                 // Ch. 9
  SALES_FLOOR:   'sales_floor',         // Ch. 9
  FNI:           'fni',                 // Ch. 9, 11
  MIX_MARKET:    'mix_to_market',       // Ch. 5
  PAY_PEOPLE:    'pay_people',          // Ch. 10, 11
  PL:            'net_to_gross_pl',     // cross-domain
};

/**
 * ACTION TYPES — what the engine knows how to fire.
 * Each maps to a primitive in lib/engine/actions.js
 * (Studio AI, Vini AI, Marketplace, Auction lane, internal compose).
 */
// Tightened to match actual Spyne product surface (per Studio AI + Vini AI decks).
// Distinguishes customer-facing primitives (Vini *) from internal manager comms (HUB_COMPOSE).
export const ACTION_TYPE = {
  // Studio AI — visual merchandising
  STUDIO_VIN_CLONE:        'studio_vin_clone',         // match incoming VIN to existing studio media → publish Day-0
  STUDIO_SHOOT_TONIGHT:    'studio_shoot_tonight',     // queue physical/AI shoot for tonight (7h turnaround)
  STUDIO_RESHOOT_360:      'studio_reshoot_360',       // raise BTP score on a low-engagement listing
  STUDIO_SMART_CAMPAIGN:   'studio_smart_campaign',    // overlay/billboard (e.g. aged-urgency, price-drop)

  // Vini AI — customer-facing conversations
  VINI_SALES_OUTBOUND:     'vini_sales_outbound',      // re-engage aged/dark leads via call/SMS in store voice
  VINI_SERVICE_OUTBOUND:   'vini_service_outbound',    // recall, maintenance, AMC renewal campaigns
  VINI_INBOUND_FIX:        'vini_inbound_fix',         // reconfigure after-hours / AI-first routing rules

  // Marketplace + Auction
  MARKETPLACE_PUSH:        'marketplace_push',         // syndicate price/listing to AutoTrader/CarGurus/Cars.com (FTP feed)
  WHOLESALE_SEND:          'wholesale_send',           // Manheim / Adesa auction lane

  // DMS / RO
  APPROVE_RO:              'approve_ro',               // sign off pending repair order

  // Hub-internal (manager-to-manager, not customer-facing)
  HUB_COMPOSE_INTERNAL:    'hub_compose_internal',     // huddle prompt, manager touch, coaching DM
  OPEN_DRILLDOWN:          'open_drilldown',           // internal navigation to a deeper view
  MUTE:                    'mute',                     // personalization
  LOG_DECISION:            'log_decision',             // audit trail

  // Back-compat (still used in some places — deprecate after rewrite)
  COMPOSE_MESSAGE:         'hub_compose_internal',     // alias
  STUDIO_SHOOT:            'studio_shoot_tonight',     // alias
  REPRICE:                 'marketplace_push',         // alias
};

/**
 * The Candidate Insight shape.
 * Every detector emits one or more of these.
 *
 * @typedef {Object} CandidateInsight
 * @property {string}    id
 * @property {string}    class           one of INSIGHT_CLASS
 * @property {string}    domain          one of DOMAIN
 * @property {string}    headline        8-12 words, $ in lead sentence
 * @property {string}    why             1-2 sentences. Declarative.
 * @property {Array}     numbers         3-5 { label, value, unit }
 * @property {Action}    primaryAction   one-tap, fires a Spyne primitive
 * @property {Action[]}  secondaryActions  see / mute / log
 * @property {string}    ownerRole       "recon_mgr" | "ucm" | "bdc_mgr" | "sales_mgr" | "fni_mgr" | "gm"
 * @property {string[]}  rootEntities    VINs, mgr IDs, lead IDs — for dedupe
 * @property {Object}    scoreComponents { dollarImpact, urgency, actionability, novelty, confidence }
 * @property {number}    score
 * @property {string}    martinezRef     e.g. "Ch. 4 · Recon Bottleneck #2"
 * @property {string}    emittedAt       ISO timestamp
 * @property {string}    expiresAt       ISO — when this candidate goes stale
 * @property {string=}   detectorId      detector that emitted (for telemetry)
 */

/**
 * @typedef {Object} Action
 * @property {string} label
 * @property {string} type      one of ACTION_TYPE
 * @property {Object} payload   action-specific
 */

// Score gating thresholds (§7.1 + §7.4).
export const CONFIDENCE_FLOOR     = 0.7;   // hard gate; <0.7 suppressed entirely
export const MIN_PRIORITY_SCORE   = 300;   // ~$300 effective minimum to appear on Today
export const ACTIONABILITY_FLOOR  = 0.5;   // Today-slot floor (lower can still hit Feed)
export const TODAY_TOP_N          = 3;
export const PUSH_DAILY_CAP       = 3;
