// StoreFactModel — the canonical input the detectors read.
// Engine spec §11.1. Day-1 this is mock data; production replaces with DMS/CRM connectors.
//
// Westgate Honda · Northbrook, IL · 92-unit/month franchise · 4 months on Spyne.

const today = '2026-03-24T08:30:00-05:00';

// ─── INVENTORY ──────────────────────────────────────────────────────────────
const INVENTORY = [
  // Aged units — past Day 45 (Money Leak #11 territory)
  { vin: '5FNRL6H80NB001', model: '2022 Honda Pilot EX-L',  segment: 'midsize_suv',   daysInStock: 78, acqCost: 28800, price: 31900, marketAvg: 30400, photos: 22, leadsAllTime: 0, leadsLast14: 0, status: 'live', breakEvenDay: 75 },
  { vin: '1HGCV1F33LA002', model: '2020 Honda Accord Sport', segment: 'midsize_sedan', daysInStock: 81, acqCost: 19200, price: 22900, marketAvg: 21800, photos: 18, leadsAllTime: 1, leadsLast14: 0, status: 'live', breakEvenDay: 75 },
  { vin: '2HKRW2H89LH003', model: '2020 Honda CR-V Touring', segment: 'compact_suv',   daysInStock: 76, acqCost: 24400, price: 27500, marketAvg: 26800, photos: 14, leadsAllTime: 0, leadsLast14: 0, status: 'live', breakEvenDay: 75 },
  { vin: '5J6RW2H58NL004', model: '2023 Honda Pilot Elite',  segment: 'midsize_suv',   daysInStock: 52, acqCost: 38600, price: 42400, marketAvg: 41100, photos: 24, leadsAllTime: 2, leadsLast14: 1, status: 'live' },
  { vin: '1HGCV1F47LA005', model: '2020 Honda Accord EX',    segment: 'midsize_sedan', daysInStock: 48, acqCost: 18900, price: 21200, marketAvg: 20800, photos: 19, leadsAllTime: 3, leadsLast14: 1, status: 'live' },

  // Aged Day 16-44 — repricing zone
  { vin: '5FNRL6H72NB006', model: '2022 Honda Pilot EX',     segment: 'midsize_suv',   daysInStock: 28, photos: 21, leadsLast14: 4, price: 28900, marketAvg: 28200, status: 'live' },
  { vin: '2HKRW2H56NH007', model: '2023 Honda CR-V LX',      segment: 'compact_suv',   daysInStock: 22, photos: 17, leadsLast14: 2, price: 26100, marketAvg: 25400, status: 'live' },
  { vin: '1HGCY2F37PA008', model: '2024 Honda Accord Hybrid',segment: 'midsize_sedan', daysInStock: 19, photos: 25, leadsLast14: 8, price: 33800, marketAvg: 33900, status: 'live' },

  // Fresh units (< 15d)
  { vin: '5J6RW1H59PL009', model: '2024 Honda Pilot Sport',  segment: 'midsize_suv',   daysInStock: 6, photos: 0, leadsLast14: 0, status: 'recon' },
  { vin: '2HKRW2H40PH010', model: '2024 Honda CR-V EX',      segment: 'compact_suv',   daysInStock: 4, photos: 28, leadsLast14: 3, price: 31200, marketAvg: 31500, status: 'live' },
];

// ─── RECON PIPELINE ─────────────────────────────────────────────────────────
const RECON = [
  // Bottleneck #1 — Detail (Martinez Ch.4 detail handoff)
  { vin: '5J6RW1H59PL009', stage: 'detail',  enteredStageAt: '2026-03-22T09:00:00-05:00', hoursInStage: 71, owner: 'detail',  roTotal: 280, slaHours: 8 },
  { vin: '2HKRW2H88NH011', stage: 'detail',  enteredStageAt: '2026-03-22T14:00:00-05:00', hoursInStage: 66, owner: 'detail',  slaHours: 8 },
  { vin: '5FNRL6H68NB012', stage: 'detail',  enteredStageAt: '2026-03-23T10:00:00-05:00', hoursInStage: 46, owner: 'detail',  slaHours: 8 },
  { vin: '1HGCV1F35NA013', stage: 'detail',  enteredStageAt: '2026-03-23T11:00:00-05:00', hoursInStage: 45, owner: 'detail',  slaHours: 8 },
  { vin: '2HKRW2H72NH014', stage: 'detail',  enteredStageAt: '2026-03-23T13:00:00-05:00', hoursInStage: 43, owner: 'detail',  slaHours: 8 },
  { vin: '5J6RW2H88PL015', stage: 'detail',  enteredStageAt: '2026-03-23T15:00:00-05:00', hoursInStage: 41, owner: 'detail',  slaHours: 8 },
  { vin: '1HGCY2F49PA016', stage: 'detail',  enteredStageAt: '2026-03-23T16:00:00-05:00', hoursInStage: 40, owner: 'detail',  slaHours: 8 },
  { vin: '5FNRL6H51NB017', stage: 'detail',  enteredStageAt: '2026-03-23T17:00:00-05:00', hoursInStage: 39, owner: 'detail',  slaHours: 8 },
  { vin: '2HKRW2H45NH018', stage: 'detail',  enteredStageAt: '2026-03-23T18:00:00-05:00', hoursInStage: 38, owner: 'detail',  slaHours: 8 },

  // Mech — fine
  { vin: '5J6RW2H21PL019', stage: 'mech',    enteredStageAt: '2026-03-24T07:00:00-05:00', hoursInStage: 1, owner: 'tech_manuel', slaHours: 24 },
  { vin: '1HGCV1F02LA020', stage: 'mech',    enteredStageAt: '2026-03-24T06:00:00-05:00', hoursInStage: 2, owner: 'tech_manuel', slaHours: 24 },

  // Photo — clearing
  { vin: '5FNRL6H22NB021', stage: 'photo',   enteredStageAt: '2026-03-24T08:00:00-05:00', hoursInStage: 0.5, owner: 'photo', slaHours: 4 },
];

// ─── LEADS ──────────────────────────────────────────────────────────────────
const LEADS = [
  // Hot, dark > 24h (Money Leak #17)
  { id: 'L-3401', source: 'cars.com',  vehicle: 'F-150', score: 88, receivedAt: '2026-03-23T07:30:00-05:00', firstResponseAt: null, ageMin: 1500, state: 'open', salesperson: null },
  { id: 'L-3402', source: 'cars.com',  vehicle: 'CR-V',  score: 82, receivedAt: '2026-03-23T09:10:00-05:00', firstResponseAt: null, ageMin: 1400, state: 'open', salesperson: null },
  { id: 'L-3403', source: 'autotrader',vehicle: 'Pilot', score: 79, receivedAt: '2026-03-23T11:00:00-05:00', firstResponseAt: null, ageMin: 1290, state: 'open', salesperson: null },

  // Recent — SLA breach right now (Money Leak #17)
  { id: 'L-3501', source: 'cars.com',     vehicle: 'CR-V',  score: 71, receivedAt: '2026-03-24T07:55:00-05:00', firstResponseAt: null, ageMin: 35, state: 'open', salesperson: null },
  { id: 'L-3502', source: 'website',      vehicle: 'Civic', score: 66, receivedAt: '2026-03-24T08:00:00-05:00', firstResponseAt: null, ageMin: 30, state: 'open', salesperson: null },
  { id: 'L-3503', source: 'autotrader',   vehicle: 'Pilot', score: 74, receivedAt: '2026-03-24T08:05:00-05:00', firstResponseAt: null, ageMin: 25, state: 'open', salesperson: null },
  { id: 'L-3504', source: 'cars.com',     vehicle: 'Accord',score: 62, receivedAt: '2026-03-24T08:10:00-05:00', firstResponseAt: null, ageMin: 20, state: 'open', salesperson: null },

  // Already responded
  { id: 'L-3505', source: 'cars.com',  vehicle: 'Accord', score: 70, receivedAt: '2026-03-24T07:00:00-05:00', firstResponseAt: '2026-03-24T07:04:00-05:00', ageMin: 90, state: 'engaged', salesperson: 'rep_anna' },
];

// ─── YESTERDAY'S DEALS (for Sales Floor signals) ────────────────────────────
const YESTERDAY_UPS = {
  totalUps: 28,
  upsWithMgrTO: 20,         // 71%
  closes: 9,
  testDriveRate: 0.51,
};

// ─── MARKET ─────────────────────────────────────────────────────────────────
const MARKET = {
  // Segment-level deltas (Pricing/Mix detectors)
  segments: {
    compact_suv:    { yourSupplyDays: 14, marketSupplyDays: 35, yourUnits: 8,  yourRank: 12 },
    midsize_suv:    { yourSupplyDays: 41, marketSupplyDays: 26, yourUnits: 9,  yourRank: 7 },
    midsize_sedan:  { yourSupplyDays: 36, marketSupplyDays: 24, yourUnits: 7,  yourRank: 9 },
    truck:          { yourSupplyDays: 11, marketSupplyDays: 38, yourUnits: 4,  yourRank: 14 },
    ev:             { yourSupplyDays: 0,  marketSupplyDays: 31, yourUnits: 0,  yourRank: null },
  },
};

// ─── ECONOMIC CONSTANTS (Martinez) ──────────────────────────────────────────
const ECONOMICS = {
  holdingCostPerDay:     46,    // Martinez Ch.6 reference math at this store size
  frontGrossAvg:         1420,  // current store avg
  frontGrossTarget:      1500,  // Martinez target
  fniPvrTarget:          2000,
  totalPvrTarget:        3500,
  closeRatePerMinLag:    0.012, // 1.2% decay per minute past 5-min SLA
};

// ─── MANAGERS / OWNERS ──────────────────────────────────────────────────────
const OWNERS = {
  recon_mgr:   { id: 'recon_mgr',   name: 'Diego Rivera',   phone: '+1-708-555-0143' },
  ucm:         { id: 'ucm',         name: 'Lena Vargas',    phone: '+1-708-555-0157' },
  bdc_mgr:     { id: 'bdc_mgr',     name: 'Priya Shah',     phone: '+1-708-555-0192' },
  sales_mgr:   { id: 'sales_mgr',   name: 'Mark Greco',     phone: '+1-708-555-0211' },
  fni_mgr:     { id: 'fni_mgr',     name: 'Sarah Chen',     phone: '+1-708-555-0258' },
  gm:          { id: 'gm',          name: 'Marcus Chen',    phone: '+1-708-555-0100' },
};

/**
 * Get a fresh StoreFactModel snapshot.
 * In production this hydrates from DMS/CRM connectors at the configured cadence.
 */
export function getStoreFactModel() {
  return {
    now: today,
    storeName: 'Westgate Honda',
    storeLocation: 'Northbrook, IL',
    inventory: INVENTORY,
    recon: RECON,
    leads: LEADS,
    yesterdayUps: YESTERDAY_UPS,
    market: MARKET,
    economics: ECONOMICS,
    owners: OWNERS,
  };
}
