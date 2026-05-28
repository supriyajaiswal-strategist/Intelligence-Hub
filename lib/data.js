// Spyne Intelligence Hub — mock data for Westgate Honda
// Single source of truth. Replace with real feeds at integration time.

export const STORE = {
  name: 'Westgate Honda',
  location: 'Northbrook, IL',
  date: 'Tuesday, March 24',
  joinedSpyne: 'Nov 2025',
};

export const PULSE = {
  pace: 67, goal: 92, dayOfMonth: 21, totalDays: 30, daysLeft: 9,
  grossMTD: 211, grossLM: 244,
  eomForecast: 267,
  timeToSell: 48, timeToSellTarget: 35, timeToSellPrev: 67,
  daysSupply: 38, daysSupplyTarget: 45,
  todaySold: 4, todayLeads: 14, todayAppts: 6, todayVisits: 3,
  ySold: 3, yLeads: 11, yAppts: 5, yVisits: 2,
  grossTrend: [58, 62, 55, 64, 60, 70, 65, 58, 53, 56, 50, 48, 52, 47],
};

// JJ's TTS swimlane — 6 stages on the landing. Replaces the old
// procure/golive/attract/engage/convert/refill mental model with the
// front-of-house pipeline JJ drew on the whiteboard.
//
// `key`         — stable id (also routes the deep-dive)
// `label`       — short cap label on the swimlane card
// `name`        — full name (used in deep-dive header and Huddle Brief)
// `tat/target`  — current vs target TAT (per Martinez + JJ thresholds)
// `cost`        — $ bleeding through this stage right now
// `costUnit`    — cadence the bleed is denominated in
// `status`      — bad / warn / good (drives ONE color on the number)
// `summary`     — one-line description of what the stage measures
// `riskTagline` — one-line "what's blocking" (used in deep-dive)
// `leverTagline`— one-line "how to fix" (used in deep-dive)
// `sparkSince`  — series since Spyne live (12 points, for the deep-dive sparkline)
// JJ's TTS swimlane — 6 stages on the landing.
// Each card carries the data needed to make the WHY visible right there:
//   vizType  drives which mini diagram renders
//   vizData  is the data the diagram needs
//   bottomTagline is the one-sentence "what's bleeding" pulled below the viz
export const JJ_TTS_STAGES = [
  {
    key: 'ttf',
    name: 'Time to Frontline',
    summary: 'From buy to frontline-ready',
    tat: 6.2, tatUnit: 'd', target: 5, deltaOver: 1.2,
    cost: 14700, costUnit: '/30d',
    status: 'warn',
    vizType: 'recon_pipeline',
    vizData: {
      stages: [
        { name: 'Intake', count: 4, slaH: 24 },
        { name: 'Mech',   count: 3, slaH: 24 },
        { name: 'Body',   count: 0, slaH: 48 },
        { name: 'Detail', count: 9, slaH: 8, bottleneck: true, slaBreachX: 4.5 },
        { name: 'Photo',  count: 1, slaH: 4 },
      ],
    },
    bottomTagline: '9 units stuck at Detail bay · 4.5× SLA',
    riskTagline: 'Detail handoff 4.5× over SLA',
    leverTagline: 'Escalate · auto-approve ROs ≤ $500',
    sparkSince: [8.4, 7.9, 7.4, 7.0, 6.8, 6.6, 6.5, 6.4, 6.3, 6.3, 6.2, 6.2],
  },
  {
    key: 'ttl',
    name: 'Time to Live',
    summary: 'From frontline-ready to listing published',
    tat: 4.2, tatUnit: 'd', target: 3, deltaOver: 1.2,
    cost: 3300, costUnit: '/day',
    status: 'bad',
    vizType: 'publish_flow',
    vizData: {
      buckets: [
        { name: 'In recon',     count: 11, status: 'neutral' },
        { name: 'Awaiting publish', count: 3,  status: 'bad', highlight: true, sub: 'clone match available' },
        { name: 'Live',         count: 142, status: 'good' },
      ],
    },
    bottomTagline: '3 frontline VINs not yet live · Studio VIN Clone is 1 tap',
    riskTagline: '3 VINs dark · clone match available',
    leverTagline: 'Studio VIN Clone publishes Day-0',
    sparkSince: [8.7, 8.2, 7.5, 6.8, 6.0, 5.4, 5.0, 4.7, 4.5, 4.3, 4.2, 4.2],
  },
  {
    key: 'gen',
    name: 'Lead Generation',
    summary: 'From live listing to qualified lead',
    tat: 12, tatUnit: 'd', target: 7, deltaOver: 5,
    cost: 2800, costUnit: '/wk',
    status: 'warn',
    vizType: 'issue_bars',
    vizData: {
      issues: [
        { name: '0 leads in 14d',    count: 11, severity: 'bad' },
        { name: 'Priced above market', count: 8,  severity: 'warn' },
        { name: 'VDP score < 50',    count: 6,  severity: 'warn' },
        { name: 'Photos < 12',       count: 4,  severity: 'bad' },
      ],
    },
    bottomTagline: '29 units underperforming · biggest drag: 11 with zero leads',
    riskTagline: '11 units · 0 leads in 14 days',
    leverTagline: 'Reshoot · reprice · Smart Campaign',
    sparkSince: [15, 14, 14, 13, 13, 12, 12, 12, 12, 12, 12, 12],
  },
  {
    key: 'aptc',
    name: 'Appointment Confirmation',
    summary: 'From lead arrived to appointment confirmed',
    tat: 11, tatUnit: 'min', target: 5, deltaOver: 6,
    cost: 2400, costUnit: '/day',
    status: 'bad',
    vizType: 'response_histogram',
    vizData: {
      buckets: [
        { label: '<5m',    count: 38, status: 'good' },
        { label: '5–15m',  count: 24, status: 'warn' },
        { label: '15–60m', count: 22, status: 'bad'  },
        { label: '>60m',   count: 16, status: 'bad'  },
      ],
      slaBucketIdx: 0,
    },
    bottomTagline: '62 of 100 leads breaching 5-min SLA · Vini handles in <10s',
    riskTagline: '1 hot lead dark > 24h · 4 SLA breaches now',
    leverTagline: 'Vini Sales Outbound re-engage',
    sparkSince: [16, 15, 14, 13, 12, 12, 11, 11, 11, 11, 11, 11],
  },
  {
    key: 'visit',
    name: 'Customer Visit',
    summary: 'From confirmed appointment to walk-in',
    tat: 8.4, tatUnit: 'd', target: 6, deltaOver: 2.4,
    cost: 1000, costUnit: '/day',
    status: 'warn',
    vizType: 'show_rate_donut',
    vizData: {
      yourShowRate: 62,
      benchmark: 70,
      noShowsLastWeek: 14,
      satNoShowShare: 71,
    },
    bottomTagline: 'Show rate 62% vs 70% benchmark · 71% of no-shows on Saturdays',
    riskTagline: 'Saturday no-show cluster · weak Friday confirms',
    leverTagline: 'Vini reminder cadence · confirm calls',
    sparkSince: [10, 9.5, 9.2, 9.0, 8.8, 8.6, 8.5, 8.5, 8.5, 8.4, 8.4, 8.4],
  },
  {
    key: 'sellconv',
    name: 'Sale Conversion',
    summary: 'From walk-in to closed deal',
    tat: 8.4, tatUnit: 'd', target: 6, deltaOver: 2.4,
    cost: 4200, costUnit: '/wk',
    status: 'warn',
    vizType: 'conversion_funnel',
    vizData: {
      steps: [
        { name: 'Lead → Appt',  rate: 46, benchmark: 50 },
        { name: 'Appt → Show',  rate: 62, benchmark: 70 },
        { name: 'Show → Demo',  rate: 76, benchmark: 75 },
        { name: 'Demo → W-up',  rate: 50, benchmark: 65, bottleneck: true },
        { name: 'W-up → Sold',  rate: 88, benchmark: 85 },
      ],
    },
    bottomTagline: 'Demo→Write-up is the bottleneck · 15pt below benchmark',
    riskTagline: 'Manager TO 71% · Demo→Wup 50%',
    leverTagline: 'Coach demo → write-up · enforce mgr TO',
    sparkSince: [10, 9.5, 9.2, 9.0, 8.8, 8.6, 8.5, 8.5, 8.5, 8.4, 8.4, 8.4],
  },
];

// Impact view — value attribution since Spyne went live.
// All numbers are mock but match the Vision doc's 90-day promise math.
export const IMPACT = {
  joinedSpyneOn: 'September 2025',
  daysSinceJoined: 183,
  recoveredToDate: 268000,
  annualizedRunRate: 360000,
  attribution: [
    { product: 'Studio AI',       impact: '92 VINs published via cloning. ~5 days saved per VIN. TTL down from 8.7d to 4.2d.' },
    { product: 'Vini Sales',      impact: '4,200 leads engaged in <10s. 22% lift in lead-to-appointment.' },
    { product: 'Vini Service',    impact: '$300k in additional service revenue (recall + AMC campaigns).' },
    { product: 'Smart Campaigns', impact: 'Aged-urgency overlays on 31 units. 28% faster turn once badge fired.' },
  ],
};

// One-line opportunity-class strategic move for the landing's Big Move block.
// Should be an Opportunity-class insight; for now hardcoded, later engine-driven.
export const BIG_MOVE_LANDING = {
  headline: 'Buy 6 Compact SUV at Manheim Tuesday.',
  reasonNumbers: [
    { label: 'your supply',  value: '14d' },
    { label: 'market supply',value: '35d' },
    { label: 'your rank',    value: '12 of 14' },
    { label: 'radius',       value: '25mi' },
  ],
  upside: 14000,
  upsideNote: '6-month moat window — EV transition tailwind',
  primaryLabel: 'Open buy list',
  secondaryLabel: 'Snooze 1 day',
};

// 12-month trajectory — Mar to Feb. Spyne went live at month index 6 (Sep).
// `pre` is the avg of months[0..liveIdx-1]; current is months[-1].
export const TRAJECTORY_MONTHS = ['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb'];
export const TRAJECTORY_LIVE_IDX = 6;   // Sep = "Spyne live"

export const TRAJECTORY = [
  {
    key: 'cars',
    label: 'Cars sold per month',
    unit: '',
    pre: 67,
    current: 78,
    delta: '+25 cars/mo since Spyne',
    direction: 'up',
    series: [67, 65, 68, 70, 66, 68, 71, 74, 72, 75, 77, 78],
    color: 'var(--info)',
  },
  {
    key: 'tts',
    label: 'Time to Sell (days)',
    unit: 'd',
    pre: 67,
    current: 48,
    delta: '−19 days since Spyne',
    direction: 'down',
    series: [67, 65, 64, 62, 60, 58, 55, 53, 51, 50, 49, 48],
    color: 'var(--good)',
  },
  {
    key: 'ttl',
    label: 'Time to Live (days)',
    unit: 'd',
    pre: 8.7,
    current: 4.2,
    delta: '−4.5 days since Spyne',
    direction: 'down',
    series: [8.7, 8.2, 7.5, 6.8, 6.0, 5.4, 5.0, 4.7, 4.5, 4.3, 4.2, 4.2],
    color: 'var(--good)',
  },
  {
    key: 'gross',
    label: 'Gross per month ($k)',
    unit: 'k',
    pre: 162,
    current: 211,
    delta: '+$49k/mo since Spyne',
    direction: 'up',
    series: [156, 162, 158, 165, 168, 162, 175, 188, 195, 202, 208, 211],
    color: 'var(--info)',
  },
];

export const SPOTTED_FEED = [
  {
    id: 'sp-1',
    timeago: '2h ago',
    pattern: 'Pre-11am shoots → 93% same-day live · After 11am → 38%',
    impact: '+$5.6k/mo if photographer starts at 8am',
    type: 'workflow',
    confidence: 96,
    bars: [93, 38],
  },
  {
    id: 'sp-2',
    timeago: '5h ago',
    pattern: 'Friday recon handoffs slip 2.4× more than weekdays',
    impact: 'Fri-cutoff at 2pm projects -1.1d on Time-to-Live',
    type: 'workflow',
    confidence: 89,
    bars: [240, 100],
  },
  {
    id: 'sp-3',
    timeago: '1d ago',
    pattern: 'Deals closed Day 1-5 in stock → F&I PVR 28% higher than Day 15+',
    impact: 'Speed protects back-end gross, not just front',
    type: 'cross-stage',
    confidence: 84,
    bars: [128, 100],
  },
  {
    id: 'sp-4',
    timeago: '2d ago',
    pattern: 'Salesperson Lena V · 41% close on payment-driven · 18% on cash',
    impact: 'Lane test could lift overall close 4-6pt',
    type: 'people',
    confidence: 82,
    bars: [41, 18],
  },
  {
    id: 'sp-5',
    timeago: '3d ago',
    pattern: 'Sub-$15K segment market 28d supply (tightest since 2021) · you 0 units',
    impact: 'Affordability buyers being turned away · $X/mo gap',
    type: 'market',
    confidence: 91,
    bars: [28, 0],
  },
];

export const STAGES = [
  {
    key: 'procure', num: '01', name: 'Procure', subtitle: 'Sourcing · do I have the right mix?',
    tat: 6.2, target: 5.0, status: 'warn', delta: '+1.2d',
    peerMedian: 5.4, peerPercentile: 38,
    vizType: 'segments',
    viz: [
      { lbl: 'Compact SUV', you: 14, market: 35, gap: -9, status: 'bad' },
      { lbl: 'Truck',       you: 11, market: 38, gap: -8, status: 'bad' },
      { lbl: 'EV',          you:  0, market: 31, gap: -12, status: 'bad' },
      { lbl: 'Sedan',       you: 41, market: 26, gap: +6, status: 'warn' },
    ],
    cost: 14700, costUnit: '/30d',
    action: 'Build buy list →',
    trend30d: [6.8, 6.5, 6.7, 6.2, 6.4, 6.1, 6.3, 6.0, 6.5, 6.2, 6.3, 6.1, 6.2, 6.2, 6.4, 6.1, 6.0, 6.3, 6.2, 6.5, 6.2, 6.0, 6.1, 6.3, 6.2, 6.4, 6.2, 6.1, 6.3, 6.2],
    bleeds: [
      { name: 'EV: missing segment entirely', detail: 'Market moving 38/mo at 31d supply · you have 0', impact: 4500 },
      { name: 'Compact SUV: 9-unit gap', detail: '47 active leads · 8 in stock · 14d supply vs 35d market', impact: 4200 },
      { name: 'Truck: 8-unit gap', detail: '31 leads · 4 in stock · 11d supply', impact: 3600 },
      { name: 'Sedan: 6 units overstocked', detail: '41d supply vs 26d market · slow turn', impact: 2400 },
    ],
  },
  {
    key: 'golive', num: '02', name: 'Go Live', subtitle: 'Recon → Photo → Published',
    tat: 4.2, target: 3.0, status: 'bad', delta: '+1.2d',
    peerMedian: 3.6, peerPercentile: 22,
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
    trend30d: [3.2, 3.4, 3.0, 3.8, 4.1, 3.9, 4.2, 4.5, 4.2, 3.9, 4.0, 4.2, 4.3, 4.1, 3.8, 4.2, 4.4, 4.1, 4.0, 4.2, 4.3, 4.5, 4.2, 4.0, 4.1, 4.3, 4.2, 4.0, 4.2, 4.2],
    bleeds: [
      { name: '9 units stuck at Detail · Day 5+', detail: 'SLA 38h actual vs 8h target · 6 of 9 are Day 5+', impact: 3260 },
      { name: 'Friday handoff pattern (2.4× slip)', detail: '5 of last 6 Monday walks found Fri-stuck car', impact: 1800 },
      { name: 'Photo bay backlog', detail: '8 units waiting · clone matches available for 6', impact: 1100 },
      { name: '4 RO approvals pending >4h', detail: 'Threshold may need raising · holding cost active', impact: 480 },
    ],
  },
  {
    key: 'attract', num: '03', name: 'Attract', subtitle: 'Pricing + merchandising',
    tat: 12, target: 7, status: 'warn', delta: '+5d',
    peerMedian: 8, peerPercentile: 28,
    vizType: 'attract',
    viz: [
      { lbl: '0 leads / 14d', count: 11, pct: 38, status: 'bad' },
      { lbl: 'VDP score <50', count: 6, pct: 22, status: 'warn' },
      { lbl: 'Above market', count: 8, pct: 30, status: 'warn' },
      { lbl: 'Photos < 12', count: 4, pct: 16, status: 'bad' },
    ],
    cost: 2800, costUnit: '/wk',
    action: 'Reprice 3 + reshoot 4 →',
    trend30d: [9, 9, 10, 11, 10, 11, 12, 13, 12, 11, 12, 11, 13, 12, 12, 11, 12, 13, 12, 11, 13, 12, 12, 13, 11, 12, 13, 12, 11, 12],
    bleeds: [
      { name: '11 units · 0 leads / 14d', detail: 'Combined VDP views down 22% · listing quality issue likely', impact: 1800 },
      { name: '8 units priced above market', detail: 'Rank #11-14 in 25mi radius · reprice -1.5% recovers Top 5', impact: 600 },
      { name: '6 units VDP score < 50', detail: 'Photos < 18 avg · category avg 71', impact: 240 },
      { name: '4 units missing from CarGurus', detail: 'Marketplace coverage gap on EV listings', impact: 160 },
    ],
  },
  {
    key: 'engage', num: '04', name: 'Engage', subtitle: 'Lead → first touch',
    tat: 11, target: 5, status: 'bad', delta: '+6m', tatUnit: 'min',
    peerMedian: 6, peerPercentile: 14,
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
    trend30d: [8, 9, 10, 11, 9, 12, 11, 10, 11, 13, 12, 11, 12, 10, 11, 11, 12, 13, 11, 10, 12, 11, 13, 12, 11, 12, 11, 12, 11, 11],
    bleeds: [
      { name: '3 hot leads · 24h+ no touch', detail: 'Scores 88·82·79 on F-150, CR-V, Pilot', impact: 2400 },
      { name: '4 leads >15min response right now', detail: 'Cars.com source · BDC SLA breach', impact: 1100 },
      { name: '11 leads aged 72h+ dark', detail: 'Zero activity · CRM accountability flag', impact: 900 },
      { name: 'After-hours coverage gap', detail: '8 leads last night got human-first response (target: AI)', impact: 600 },
    ],
  },
  {
    key: 'convert', num: '05', name: 'Convert', subtitle: 'Lead → appt → show → sold',
    tat: 8.4, target: 6.0, status: 'warn', delta: '+2.4d',
    peerMedian: 7.1, peerPercentile: 32,
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
    trend30d: [7.2, 7.5, 7.8, 8.0, 7.9, 8.1, 8.4, 8.6, 8.3, 8.5, 8.7, 8.4, 8.2, 8.6, 8.5, 8.3, 8.5, 8.7, 8.4, 8.2, 8.4, 8.6, 8.5, 8.3, 8.4, 8.5, 8.4, 8.3, 8.4, 8.4],
    bleeds: [
      { name: 'Demo → Write-up 50% (vs 65% benchmark)', detail: 'Close discipline lapse · concentrated in Sat coverage', impact: 2800 },
      { name: 'Appt → Show 62% (vs 70%)', detail: 'Friday confirmation cadence weak · 4 no-shows last Sat', impact: 1100 },
      { name: 'Saturday close rate 33% vs 41% weekday', detail: 'Mgr coverage rotation may be the cause', impact: 800 },
      { name: 'Walk-in TO rate 71% (target 90%)', detail: '8 ups walked without manager TO yesterday', impact: 600 },
    ],
  },
  {
    key: 'refill', num: '06', name: 'Refill', subtitle: 'Sold → replaced',
    tat: 7.0, target: 3.0, status: 'bad', delta: '+4d',
    peerMedian: 4.2, peerPercentile: 18,
    vizType: 'queue',
    viz: [
      { seg: 'Compact', sold: 4, queue: 0, status: 'bad' },
      { seg: 'Truck',   sold: 3, queue: 2, status: 'warn' },
      { seg: 'Sedan',   sold: 5, queue: 6, status: 'good' },
      { seg: 'EV',      sold: 1, queue: 0, status: 'bad' },
    ],
    cost: 8400, costUnit: 'fp risk',
    action: 'Trigger Manheim buy →',
    trend30d: [4.2, 4.5, 5.0, 5.5, 6.0, 6.2, 6.5, 6.8, 7.0, 6.8, 7.2, 7.0, 6.8, 7.1, 7.0, 7.3, 7.0, 6.9, 7.1, 7.0, 7.2, 7.0, 6.9, 7.1, 7.0, 7.2, 7.0, 7.1, 7.0, 7.0],
    bleeds: [
      { name: 'Compact SUV: queue empty', detail: 'Sold 4 this week · 0 replacements queued · 47 leads active', impact: 5200 },
      { name: 'EV: queue empty', detail: 'Sold 1 · 0 replacements · entire segment unstaffed', impact: 2400 },
      { name: 'Truck: queue 2 vs 3 sold', detail: 'Falling behind on highest-velocity segment', impact: 800 },
      { name: 'Floorplan exposure climbing', detail: 'Aged inventory blocking $X of buying headroom', impact: 0 },
    ],
  },
];

export const STAGE_UNITS = {
  procure: [
    { id: 'gap-1', segment: 'Compact SUV', target: 9, source: 'Manheim Chicago Tue lane 4-7', candidates: 14, eta: 'Tue 9am' },
    { id: 'gap-2', segment: 'Truck $30-45K', target: 8, source: 'ADESA Wed lane 12', candidates: 9, eta: 'Wed 11am' },
    { id: 'gap-3', segment: 'EV used', target: 6, source: 'Off-lease pipeline', candidates: 4, eta: 'Mar 28' },
  ],
  golive: [
    { stock: 'U24087', vin: '1HG...A12', car: '24 Honda CR-V EX', stage: 'Detail', days: 5, owner: 'Pete H.' },
    { stock: 'U24091', vin: '5FN...B33', car: '23 Honda Pilot Elite', stage: 'Detail', days: 6, owner: 'Pete H.' },
    { stock: 'U23998', vin: '1HG...C45', car: '22 Honda Civic Sport', stage: 'Detail', days: 7, owner: 'Pete H.' },
    { stock: 'U24033', vin: '5J6...D67', car: '23 Honda Accord EX-L', stage: 'Detail', days: 5, owner: 'Pete H.' },
    { stock: 'U24011', vin: '2HK...E89', car: '21 Honda Pilot', stage: 'Detail', days: 8, owner: 'Pete H.' },
    { stock: 'U23984', vin: '5TF...F01', car: '20 Toyota Tacoma TRD', stage: 'Detail', days: 5, owner: 'Pete H.' },
    { stock: 'U24102', vin: '1FT...G23', car: '23 Ford F-150 XLT', stage: 'Detail', days: 6, owner: 'Pete H.' },
    { stock: 'U24056', vin: '3GN...H45', car: '22 Chevy Equinox', stage: 'Detail', days: 5, owner: 'Pete H.' },
    { stock: 'U24078', vin: '5N1...I67', car: '23 Nissan Rogue SV', stage: 'Detail', days: 5, owner: 'Pete H.' },
  ],
  attract: [
    { stock: 'U24001', car: '23 Civic LX',     age: 17, vdp: 42, leads: 0, price: 'over', issue: '4 photos' },
    { stock: 'U24014', car: '22 Accord EX-L',  age: 22, vdp: 48, leads: 0, price: 'over', issue: '6 photos · no interior' },
    { stock: 'U24029', car: '21 CR-V EX',      age: 28, vdp: 51, leads: 1, price: 'ok',   issue: 'no 360' },
    { stock: 'U24044', car: '23 HR-V Sport',   age: 16, vdp: 38, leads: 0, price: 'ok',   issue: 'low VDP score' },
    { stock: 'U24061', car: '22 Civic Sport',  age: 19, vdp: 44, leads: 2, price: 'over', issue: 'no video' },
    { stock: 'U24073', car: '21 Pilot Elite',  age: 24, vdp: 49, leads: 1, price: 'over', issue: 'reshoot needed' },
  ],
  engage: [
    { name: 'Aaron Patel', score: 88, vehicle: 'F-150 XLT', source: 'AutoTrader', aged: '26h', rep: 'Marcus T.', stage: 'no touch' },
    { name: 'Jasmine Reed', score: 82, vehicle: 'CR-V EX', source: 'CarGurus', aged: '24h', rep: 'Lena V.', stage: 'no touch' },
    { name: 'Tyrone Brooks', score: 79, vehicle: 'Pilot Elite', source: 'Cars.com', aged: '18h', rep: 'Marcus T.', stage: 'no touch' },
    { name: 'Priya Singh', score: 76, vehicle: 'Civic Sport', source: 'Website', aged: '12h', rep: 'Ravi P.', stage: '1 attempt' },
    { name: 'Diego Romero', score: 74, vehicle: 'Accord EX-L', source: 'Cars.com', aged: '16h', rep: 'Lena V.', stage: 'replied · stalled' },
    { name: 'Hannah Ito', score: 71, vehicle: 'HR-V Sport', source: 'AutoTrader', aged: '20h', rep: 'Sam O.', stage: '2 attempts' },
  ],
  convert: [
    { name: 'Carlos Morales', stage: 'Demo · stalled', mgrTO: 'No', salesperson: 'Ravi P.', vehicle: 'CR-V EX', days: 3 },
    { name: 'Erica Bennett', stage: 'Appt · no show', mgrTO: 'No', salesperson: 'Sam O.', vehicle: 'Civic LX', days: 2 },
    { name: 'Wei Park', stage: 'Write-up · pending', mgrTO: 'Yes', salesperson: 'Lena V.', vehicle: 'Pilot Elite', days: 1 },
    { name: 'Brent Carter', stage: 'Demo · stalled', mgrTO: 'No', salesperson: 'Ravi P.', vehicle: 'Accord EX-L', days: 4 },
    { name: 'Sofia Khan', stage: 'Appt · confirmed', mgrTO: 'Pending', salesperson: 'Marcus T.', vehicle: 'HR-V Sport', days: 0 },
  ],
  refill: [
    { id: 'r-1', sold: 'Compact SUV', soldCount: 4, queue: 0, replacement: 'Manheim Tue · 14 candidates' },
    { id: 'r-2', sold: 'EV', soldCount: 1, queue: 0, replacement: 'Off-lease pipeline · 4 candidates' },
    { id: 'r-3', sold: 'Truck', soldCount: 3, queue: 2, replacement: 'ADESA Wed · 9 candidates' },
    { id: 'r-4', sold: 'Sedan', soldCount: 5, queue: 6, replacement: 'Trade-ins · healthy' },
  ],
};

export const TOP3 = [
  {
    id: 'act-1',
    rank: 1, stage: 'Engage', stageKey: 'engage', priority: 'bad',
    what: '3 hot leads · 24h+ no touch',
    chips: [
      { label: 'score 88·82·79', tone: 'normal' },
      { label: '$2.4k at risk', tone: 'bad' },
      { label: 'F-150·CRV·Pilot', tone: 'normal' },
    ],
    money: 2400, owner: { i: 'AP', c: '#7c3aed', name: 'Andre Park' },
    action: 'Manager touch',
  },
  {
    id: 'act-2',
    rank: 2, stage: 'Go Live', stageKey: 'golive', priority: 'bad',
    what: '9 units stuck at detail · Day 5+',
    chips: [
      { label: 'SLA 38h / 8h', tone: 'bad' },
      { label: 'Fri-handoff', tone: 'warn' },
      { label: '+$3.3k/d', tone: 'bad' },
    ],
    money: 3260, owner: { i: 'PH', c: '#2563eb', name: 'Pete Hollis' },
    action: 'Escalate',
  },
  {
    id: 'act-3',
    rank: 3, stage: 'Attract', stageKey: 'attract', priority: 'warn',
    what: '6 units · 0 leads / 14d · VDP <50',
    chips: [
      { label: 'photos <12', tone: 'warn' },
      { label: 'rank >5', tone: 'warn' },
      { label: 'reshoot avail', tone: 'good' },
    ],
    money: 1800, owner: { i: 'AS', c: '#0e9f6e', name: 'Aria Sun' },
    action: 'Reshoot + reprice',
  },
];

export const TOP3_QUEUE = [
  {
    id: 'act-4',
    rank: 4, stage: 'Refill', stageKey: 'refill', priority: 'warn',
    what: 'Compact SUV queue empty · sold 4, 0 ready',
    chips: [
      { label: '47 leads active', tone: 'warn' },
      { label: 'Manheim Tue', tone: 'good' },
      { label: '14 candidates', tone: 'good' },
    ],
    money: 5200, owner: { i: 'DR', c: '#7c3aed', name: 'Diana Reyes' },
    action: 'Open buy list',
  },
  {
    id: 'act-5',
    rank: 5, stage: 'Procure', stageKey: 'procure', priority: 'warn',
    what: 'EV segment: 0 units · market deep',
    chips: [
      { label: 'mkt 31d supply', tone: 'normal' },
      { label: 'off-lease pipeline', tone: 'good' },
    ],
    money: 4500, owner: { i: 'DR', c: '#7c3aed', name: 'Diana Reyes' },
    action: 'Strategic buy',
  },
  {
    id: 'act-6',
    rank: 6, stage: 'Convert', stageKey: 'convert', priority: 'warn',
    what: 'Saturday close 33% vs 41% weekday',
    chips: [
      { label: 'mgr swap test', tone: 'normal' },
      { label: '4-6pt lift', tone: 'good' },
    ],
    money: 1600, owner: { i: 'JM', c: '#d97706', name: 'Jess Moore' },
    action: 'Schedule coaching',
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

export const LAST_BIG_MOVE = {
  title: 'Last week: Buy F-150 trucks at ADESA',
  status: 'Won',
  outcome: '9 of 12 candidates bought · 7 already sold in 11 days · +$11k gross MTD',
  outcomeColor: 'good',
};

export const DECISIONS = [
  { time: '07:42', action: 'Wholesale send', subject: '3 units (Day 76+)', recovered: 4800, by: 'Marcus C.', status: 'pending' },
  { time: 'Yest 14:23', action: 'Reprice -3%', subject: 'CR-V EX U24029', recovered: 240, by: 'Diana R.', status: 'cleared' },
  { time: 'Yest 11:08', action: 'Escalated recon', subject: '4 units at detail', recovered: 920, by: 'Pete H.', status: 'cleared' },
  { time: 'Yest 09:15', action: 'Manager touch', subject: 'Hot lead Jasmine R.', recovered: 1200, by: 'Andre P.', status: 'cleared' },
  { time: 'Mar 22 16:48', action: 'Smart Campaign launched', subject: 'Aged 30+ inventory · 14 VINs', recovered: 1100, by: 'Aria S.', status: 'running' },
  { time: 'Mar 22 09:30', action: 'Auto-shoot batch', subject: '8 units overnight', recovered: 640, by: 'Studio AI', status: 'cleared' },
  { time: 'Mar 21 17:12', action: 'Buy list approved', subject: 'Manheim Tue · 14 lanes', recovered: 0, by: 'Marcus C.', status: 'queued' },
  { time: 'Mar 21 08:00', action: 'Coaching scheduled', subject: 'Ravi P. · close discipline', recovered: 0, by: 'Marcus C.', status: 'scheduled' },
];

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

export const TIME_RANGES = [
  { k: 'today', label: 'Today' },
  { k: 'wtd', label: 'WTD' },
  { k: 'mtd', label: 'MTD' },
  { k: '30d', label: '30d' },
  { k: 'yoy', label: 'YoY' },
];

export const COPILOT_PRESETS = [
  "Why is my Time to Sell trending up?",
  "Draft a coaching note for Ravi on close discipline",
  "What's my biggest risk this week?",
  "Which units should I move to wholesale?",
  "Compare my performance to peer Honda stores",
];
