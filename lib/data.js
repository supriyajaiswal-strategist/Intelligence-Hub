// Spyne Intelligence Hub — mock data for Westgate Honda
// Replace with real data feeds at integration time.

export const STORE = {
  name: 'Westgate Honda',
  location: 'Northbrook, IL',
  date: 'Tuesday, March 24',
};

export const PULSE = {
  pace: 67, goal: 92, dayOfMonth: 21, totalDays: 30, daysLeft: 9,
  grossMTD: 211, grossLM: 244,
  timeToSell: 48, timeToSellTarget: 35, timeToSellPrev: 67,
  daysSupply: 38, daysSupplyTarget: 45,
  todaySold: 4, todayLeads: 14, todayUps: 23,
  yLeads: 11, ySold: 3, yUps: 19,
  grossTrend: [58, 62, 55, 64, 60, 70, 65, 58, 53, 56, 50, 48, 52, 47],
};

export const TRAJECTORY = [
  { name: 'Time to Sell', from: '67d', to: '48d', delta: '-28%', tone: 'good' },
  { name: 'Time to Live', from: '8.7d', to: '4.2d', delta: '-52%', tone: 'good' },
  { name: 'Aged share', from: '23%', to: '16%', delta: '-7pt', tone: 'good' },
  { name: 'Units / mo', from: '67', to: '78', delta: '+16%', tone: 'good' },
];

export const SPOTTED = {
  pattern: 'Pre-11am shoots → 93% same-day live · After 11am → 38%',
  impact: '+$5.6k/mo if photographer starts at 8am',
};

export const STAGES = [
  {
    key: 'procure', num: '01', name: 'Procure', subtitle: 'Sourcing',
    tat: 6.2, target: 5.0, status: 'warn', delta: '+1.2d',
    vizType: 'segments',
    viz: [
      { lbl: 'Compact SUV', you: 14, market: 35, gap: -9, status: 'bad' },
      { lbl: 'Truck',       you: 11, market: 38, gap: -8, status: 'bad' },
      { lbl: 'EV',          you:  0, market: 31, gap: -12, status: 'bad' },
      { lbl: 'Sedan',       you: 41, market: 26, gap: +6, status: 'warn' },
    ],
    cost: 14700, costUnit: '/30d',
    action: 'Build buy list →',
  },
  {
    key: 'golive', num: '02', name: 'Go Live', subtitle: 'Recon → Photo → Live',
    tat: 4.2, target: 3.0, status: 'bad', delta: '+1.2d',
    vizType: 'pipeline',
    viz: [
      { lbl: 'Intake',   count: 4, bottleneck: false },
      { lbl: 'Mech',     count: 3, bottleneck: false },
      { lbl: 'Body',     count: 0, bottleneck: false },
      { lbl: 'Detail',   count: 9, bottleneck: true },
      { lbl: 'Photo',    count: 8, bottleneck: false },
    ],
    cost: 3260, costUnit: '/day',
    action: 'Escalate detail →',
  },
  {
    key: 'attract', num: '03', name: 'Attract', subtitle: 'Pricing · merchandising',
    tat: 12, target: 7, status: 'warn', delta: '+5d',
    vizType: 'attract',
    viz: [
      { lbl: '0 leads / 14d', count: 11, pct: 38, status: 'bad' },
      { lbl: 'VDP score <50', count: 6, pct: 22, status: 'warn' },
      { lbl: 'Above market', count: 8, pct: 30, status: 'warn' },
      { lbl: 'Photos < 12', count: 4, pct: 16, status: 'bad' },
    ],
    cost: 2800, costUnit: '/wk',
    action: 'Reprice 3 + reshoot 4 →',
  },
  {
    key: 'engage', num: '04', name: 'Engage', subtitle: 'Lead → first touch',
    tat: 11, target: 5, status: 'bad', delta: '+6m', tatUnit: 'min',
    vizType: 'histogram',
    viz: [
      { lbl: '<5m', count: 38, color: 'var(--good)' },
      { lbl: '5-15m', count: 24, color: 'var(--warn)' },
      { lbl: '15-60m', count: 22, color: 'var(--bad)' },
      { lbl: '>60m', count: 16, color: 'var(--bad)' },
    ],
    aged: 11,
    cost: 2400, costUnit: '/day',
    action: 'Manager touch →',
  },
  {
    key: 'convert', num: '05', name: 'Convert', subtitle: 'Lead → sold',
    tat: 8.4, target: 6.0, status: 'warn', delta: '+2.4d',
    vizType: 'funnel',
    viz: [
      { lbl: 'L→Appt',    pct: 46, benchmark: 50, status: 'normal' },
      { lbl: 'Appt→Show', pct: 62, benchmark: 70, status: 'warn' },
      { lbl: 'Show→Demo', pct: 76, benchmark: 75, status: 'good' },
      { lbl: 'Demo→Wup',  pct: 50, benchmark: 65, status: 'bad' },
      { lbl: 'Wup→Sold',  pct: 88, benchmark: 85, status: 'good' },
    ],
    cost: 4200, costUnit: '/wk',
    action: 'Coach demo→write-up →',
  },
  {
    key: 'refill', num: '06', name: 'Refill', subtitle: 'Sold → replaced',
    tat: 7.0, target: 3.0, status: 'bad', delta: '+4d',
    vizType: 'queue',
    viz: [
      { seg: 'Compact', sold: 4, queue: 0, status: 'bad' },
      { seg: 'Truck',   sold: 3, queue: 2, status: 'warn' },
      { seg: 'Sedan',   sold: 5, queue: 6, status: 'good' },
      { seg: 'EV',      sold: 1, queue: 0, status: 'bad' },
    ],
    cost: 8400, costUnit: 'fp risk',
    action: 'Trigger Manheim buy →',
  },
];

export const TOP3 = [
  {
    rank: 1, stage: 'Engage', priority: 'bad',
    what: '3 hot leads · 24h+ no touch',
    chips: [
      { label: 'score 88·82·79', tone: 'normal' },
      { label: '$2.4k at risk', tone: 'bad' },
      { label: 'F-150·CRV·Pilot', tone: 'normal' },
    ],
    money: 2400, owner: { i: 'AP', c: '#7c3aed' },
    action: 'Manager touch',
  },
  {
    rank: 2, stage: 'Go Live', priority: 'bad',
    what: '9 units stuck at detail · Day 5+',
    chips: [
      { label: 'SLA 38h / 8h', tone: 'bad' },
      { label: 'Fri-handoff', tone: 'warn' },
      { label: '+$3.3k/d', tone: 'bad' },
    ],
    money: 3260, owner: { i: 'PH', c: '#2563eb' },
    action: 'Escalate',
  },
  {
    rank: 3, stage: 'Attract', priority: 'warn',
    what: '6 units · 0 leads / 14d · VDP <50',
    chips: [
      { label: 'photos <12', tone: 'warn' },
      { label: 'rank >5', tone: 'warn' },
      { label: 'reshoot avail', tone: 'good' },
    ],
    money: 1800, owner: { i: 'AS', c: '#0e9f6e' },
    action: 'Reshoot + reprice',
  },
];

export const BIG_MOVE = {
  title: 'Buy compact SUVs at Manheim Tuesday',
  sub: 'Demand outpacing supply by 9 units · highest-leverage move this week',
  leads: 47, stock: 8, supplyYou: 14, supplyMarket: 35,
  candidates: 14,
  impact: [
    { l: 'units inventory', v: '+12' },
    { l: 'gross 30d', v: '+$14.7k' },
    { l: 'turn velocity', v: '+6/mo' },
  ],
};

export const ZONE_REQS = {
  procure: ['market'],
  golive: ['studio'],
  attract: ['studio', 'market'],
  engage: ['vini', 'crm'],
  convert: ['crm', 'dms'],
  refill: ['dms', 'market'],
};

export const INT_LABELS = {
  studio: 'Studio AI',
  vini: 'Vini AI',
  dms: 'DMS',
  crm: 'CRM',
  market: 'Market data',
  web: 'Website',
};

export const INT_DESC = {
  studio: 'Photo · 360 · VDP scores',
  vini: 'Voice + chat agents',
  dms: 'Deals · gross · F&I',
  crm: 'Leads · BDC · funnel',
  market: 'Day supply · price rank',
  web: 'VDP traffic · conversion',
};
