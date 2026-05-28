'use client';
import { useState } from 'react';
import { fireAction } from '@/lib/engine';

// One priority card — renders a CandidateInsight from the engine.
// Layout: rank · class badge · big $ headline · why · mini-viz · actions · Martinez ref.

export default function PriorityCard({ rank, candidate }) {
  const [actionResult, setActionResult] = useState(null);

  const onPrimary = async () => {
    const r = await fireAction(candidate.primaryAction);
    setActionResult(r);
    setTimeout(() => setActionResult(null), 4000);
  };

  return (
    <article className="prio-card">
      <header className="prio-card-head">
        <span className="prio-card-rank mono">#{rank}</span>
        <span className={`prio-card-class ${classToTone(candidate.class)}`}>
          {classLabel(candidate.class)}
        </span>
        <span className="prio-card-domain muted mono">{candidate.domain.replace(/_/g, ' ')}</span>
      </header>

      <div className="prio-card-body">
        <div className="prio-card-headline-row">
          <span className="prio-card-money mono">
            ${candidate.scoreComponents.dollarImpact.toLocaleString()}
          </span>
          <h3 className="prio-card-headline">{candidate.headline}</h3>
        </div>
        <p className="prio-card-why">{candidate.why}</p>

        <PriorityViz candidate={candidate} />

        <div className="prio-card-actions">
          <button className="btn-primary-v2" onClick={onPrimary}>
            {candidate.primaryAction.label}
          </button>
          {candidate.secondaryActions.map((a, idx) => (
            <button key={idx} className="btn-ghost-v2" onClick={(e) => e.stopPropagation()}>
              {a.label}
            </button>
          ))}
        </div>

        {actionResult && (
          <div className="prio-card-toast">
            ✓ {actionResult.summary}
          </div>
        )}
      </div>

      <footer className="prio-card-foot muted mono">
        source: {candidate.martinezRef}
      </footer>
    </article>
  );
}

function classLabel(c) {
  return ({
    A_money_leak: 'Money Leak',
    B_hidden_pattern: 'Hidden Pattern',
    C_forecast_risk: 'Forecast Risk',
    D_opportunity: 'Opportunity',
    E_anomaly: 'Anomaly',
    F_coaching: 'Coaching',
  })[c] || c;
}
function classToTone(c) {
  return ({
    A_money_leak: 'tone-bad',
    C_forecast_risk: 'tone-warn',
    E_anomaly: 'tone-warn',
    D_opportunity: 'tone-good',
    B_hidden_pattern: 'tone-accent',
    F_coaching: 'tone-neutral',
  })[c] || 'tone-neutral';
}

// ─── MINI VIZ — one per detector type ───────────────────────────────────
function PriorityViz({ candidate }) {
  switch (candidate.detectorId) {
    case 'manager-to-collapse':     return <VizProgressBar candidate={candidate} />;
    case 'aged-inventory':          return <VizAgeDots candidate={candidate} />;
    case 'breakeven-crossover':     return <VizAgeDots candidate={candidate} markerLabel="BE day 75" />;
    case 'lead-response-lag':       return <VizLeadTimes candidate={candidate} />;
    case 'recon-bottleneck':        return <VizReconBars candidate={candidate} />;
    case 'dark-vin-publish-lag':    return <VizDarkVins candidate={candidate} />;
    case 'stage-starvation-forecast': return <VizStarvation candidate={candidate} />;
    default:                        return null;
  }
}

function VizProgressBar({ candidate }) {
  // Manager TO — show actual vs target as a progress bar with target marker.
  const actual = parseFloat(String(candidate.numbers.find((n) => n.label === 'TO rate')?.value || '0%').replace('%', '')) / 100;
  const target = 0.9;
  return (
    <div className="viz viz-progress">
      <div className="viz-progress-track">
        <div className="viz-progress-fill bad" style={{ width: `${actual * 100}%` }} />
        <div className="viz-progress-mark" style={{ left: `${target * 100}%` }} />
      </div>
      <div className="viz-progress-labels mono muted">
        <span>{Math.round(actual * 100)}%</span>
        <span>target {Math.round(target * 100)}%</span>
      </div>
    </div>
  );
}

function VizAgeDots({ candidate, markerLabel }) {
  // Aged-inventory — show each unit's age along a 90-day axis with BE marker.
  // Pull the unit days from rootEntities count + assumed range; in production
  // each candidate would carry the raw days array.
  const count = parseInt(candidate.numbers.find((n) => n.unit === 'u')?.value || 0, 10);
  // For now, derive sample positions from candidate id — real impl reads from payload.
  const days = sampleAgesForViz(candidate.id, count);
  const max = 90;
  const beAt = 75;
  return (
    <div className="viz viz-dots">
      <div className="viz-dots-track">
        {days.map((d, i) => (
          <div key={i} className={`viz-dot ${d >= beAt ? 'bad' : 'warn'}`} style={{ left: `${(d / max) * 100}%` }} title={`Day ${d}`} />
        ))}
        <div className="viz-dots-marker" style={{ left: `${(beAt / max) * 100}%` }}>
          <span className="mono">{markerLabel || `BE ${beAt}d`}</span>
        </div>
      </div>
      <div className="viz-dots-axis mono muted">
        <span>day 0</span><span>day 45</span><span>day 90</span>
      </div>
    </div>
  );
}

function VizLeadTimes({ candidate }) {
  const oldestStr = candidate.numbers.find((n) => n.label === 'oldest')?.value;
  const oldestHrs = parseInt(String(oldestStr).replace('h', ''), 10) || 24;
  const slaH = 24;
  return (
    <div className="viz viz-leadtime">
      <div className="viz-leadtime-bar">
        <div className="viz-leadtime-fill bad" style={{ width: `${Math.min(oldestHrs / 48, 1) * 100}%` }} />
        <div className="viz-leadtime-sla" style={{ left: `${(slaH / 48) * 100}%` }} />
      </div>
      <div className="viz-leadtime-labels mono muted">
        <span>0h</span>
        <span>24h SLA</span>
        <span>oldest {oldestHrs}h</span>
      </div>
    </div>
  );
}

function VizReconBars({ candidate }) {
  const stuck = parseInt(candidate.numbers.find((n) => n.unit === 'u')?.value || 0, 10);
  return (
    <div className="viz viz-reconbars">
      {Array.from({ length: stuck }).map((_, i) => (
        <div key={i} className="viz-reconbar bad" style={{ height: `${20 + (i % 3) * 16}px` }} />
      ))}
      <span className="viz-reconbars-label mono muted">{stuck} units · all past 2× SLA</span>
    </div>
  );
}

function VizDarkVins({ candidate }) {
  const count = parseInt(candidate.numbers.find((n) => n.unit === 'u')?.value || 0, 10);
  const oldest = parseInt(candidate.numbers.find((n) => n.label === 'oldest dark')?.value || 0, 10);
  return (
    <div className="viz viz-darkvins">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="viz-darkvin-row">
          <span className="viz-darkvin-label mono muted">VIN {i + 1}</span>
          <div className="viz-darkvin-track">
            {Array.from({ length: 5 }).map((_, d) => (
              <span key={d} className={`viz-darkvin-day ${d < oldest ? 'bad' : ''}`} />
            ))}
          </div>
        </div>
      ))}
      <div className="viz-darkvins-axis mono muted">
        <span>frontline →</span><span>day 5 = critical</span>
      </div>
    </div>
  );
}

function VizStarvation({ candidate }) {
  // Show 7-day trend line vs 28-day baseline.
  const shortfall = String(candidate.numbers.find((n) => n.label === 'shortfall')?.value || '');
  return (
    <div className="viz viz-starvation">
      <div className="viz-starvation-trend">
        <svg viewBox="0 0 200 40" preserveAspectRatio="none" style={{ width: '100%', height: 36 }}>
          <line x1="0" y1="20" x2="200" y2="20" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="1" />
          <polyline points="0,18 30,20 60,22 90,24 120,22 150,28 180,32 200,34" fill="none" stroke="#d97706" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      <div className="viz-starvation-labels mono muted">
        <span>28d baseline</span>
        <span className="tone-warn">7d trend {shortfall}</span>
      </div>
    </div>
  );
}

// Deterministic pseudo-random sample for viz from candidate id.
function sampleAgesForViz(seed, count) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  const out = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) | 0;
    const base = 45 + Math.abs(h % 45);
    out.push(base);
  }
  return out;
}
