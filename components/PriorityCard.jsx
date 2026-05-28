'use client';
import { useState } from 'react';
import { fireAction } from '@/lib/engine';

// One priority row — Stripe-style table layout.
// Grid: rank · class badge · body · actions

export default function PriorityCard({ rank, candidate }) {
  const [toast, setToast] = useState(null);

  const onPrimary = async () => {
    const r = await fireAction(candidate.primaryAction);
    setToast(r.summary || 'Done');
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <article className="prio-card">
      <span className="prio-card-rank">#{rank}</span>
      <span className={`prio-card-class ${classToTone(candidate.class)}`}>
        {classLabel(candidate.class)}
      </span>

      <div className="prio-card-body">
        <div className="prio-card-headline-row">
          <span className="prio-card-money">
            ${candidate.scoreComponents.dollarImpact.toLocaleString()}
          </span>
          <h3 className="prio-card-headline">{candidate.headline}</h3>
        </div>
        <p className="prio-card-why">{candidate.why}</p>

        <PriorityViz candidate={candidate} />

        <div className="prio-card-foot">source: {candidate.martinezRef}</div>
      </div>

      <div className="prio-card-actions">
        <button className="btn-primary-v2" onClick={onPrimary}>
          {candidate.primaryAction.label}
        </button>
        {candidate.secondaryActions.slice(0, 1).map((a, idx) => (
          <button key={idx} className="btn-ghost-v2" onClick={(e) => e.stopPropagation()}>
            {a.label}
          </button>
        ))}
      </div>

      {toast && <div className="prio-card-toast">✓ {toast}</div>}
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
  const actual = parseFloat(String(candidate.numbers.find((n) => n.label === 'TO rate')?.value || '0%').replace('%', '')) / 100;
  const target = 0.9;
  return (
    <div className="viz viz-progress">
      <div className="viz-progress-track">
        <div className="viz-progress-fill bad" style={{ width: `${actual * 100}%` }} />
        <div className="viz-progress-mark" style={{ left: `${target * 100}%` }} />
      </div>
      <div className="viz-progress-labels">
        <span>{Math.round(actual * 100)}%</span>
        <span>target {Math.round(target * 100)}%</span>
      </div>
    </div>
  );
}

function VizAgeDots({ candidate, markerLabel }) {
  const count = parseInt(candidate.numbers.find((n) => n.unit === 'u')?.value || 0, 10);
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
          <span>{markerLabel || `BE ${beAt}d`}</span>
        </div>
      </div>
      <div className="viz-dots-axis">
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
        <div className="viz-leadtime-fill" style={{ width: `${Math.min(oldestHrs / 48, 1) * 100}%` }} />
        <div className="viz-leadtime-sla" style={{ left: `${(slaH / 48) * 100}%` }} />
      </div>
      <div className="viz-leadtime-labels">
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
        <div key={i} className="viz-reconbar" style={{ height: `${10 + (i % 3) * 8}px` }} />
      ))}
      <span className="viz-reconbars-label">{stuck} units · all past 2× SLA</span>
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
          <span className="viz-darkvin-label">VIN {i + 1}</span>
          <div className="viz-darkvin-track">
            {Array.from({ length: 5 }).map((_, d) => (
              <span key={d} className={`viz-darkvin-day ${d < oldest ? 'bad' : ''}`} />
            ))}
          </div>
        </div>
      ))}
      <div className="viz-darkvins-axis">
        <span>frontline →</span><span>day 5 = critical</span>
      </div>
    </div>
  );
}

function VizStarvation({ candidate }) {
  const shortfall = String(candidate.numbers.find((n) => n.label === 'shortfall')?.value || '');
  return (
    <div className="viz viz-starvation">
      <div className="viz-starvation-trend">
        <svg viewBox="0 0 200 40" preserveAspectRatio="none" style={{ width: '100%', height: 30 }}>
          <line x1="0" y1="20" x2="200" y2="20" stroke="#c7d0d9" strokeDasharray="3 3" strokeWidth="1" />
          <polyline points="0,18 30,20 60,22 90,24 120,22 150,28 180,32 200,34" fill="none" stroke="#bb651d" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      <div className="viz-starvation-labels">
        <span>28d baseline</span>
        <span className="tone-warn">7d trend {shortfall}</span>
      </div>
    </div>
  );
}

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
