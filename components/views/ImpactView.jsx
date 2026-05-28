'use client';
import { useState } from 'react';
import { TRAJECTORY, IMPACT, STORE } from '@/lib/data';
import TrajectoryChart from '../TrajectoryChart';

export default function ImpactView() {
  const [showWhy, setShowWhy] = useState(false);
  const progressPct = Math.round((IMPACT.recoveredToDate / IMPACT.annualizedRunRate) * 100);

  return (
    <div className="canvas-v2 impact">
      <header className="impact-head">
        <div className="impact-eyebrow">Impact · {STORE.name}</div>
        <h1 className="impact-title">Your business since Spyne went live</h1>
        <p className="impact-sub muted">
          {IMPACT.joinedSpyneOn} → today · {IMPACT.daysSinceJoined} days
        </p>
      </header>

      <section className="impact-hero">
        <div className="impact-hero-num mono">
          ${(IMPACT.recoveredToDate / 1000).toFixed(0)}k
        </div>
        <div className="impact-hero-label">recovered to date</div>
        <div className="impact-hero-runrate muted">
          on track to ~${(IMPACT.annualizedRunRate / 1000).toFixed(0)}k / yr
        </div>
        <div className="impact-hero-bar">
          <div className="impact-hero-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="impact-hero-bar-meta muted mono">{progressPct}% of annual target</div>
      </section>

      <section className="impact-charts">
        {TRAJECTORY.map((t) => (
          <TrajectoryChart key={t.key} {...t} />
        ))}
      </section>

      <section className="impact-why">
        <button
          className="impact-why-toggle"
          onClick={() => setShowWhy((v) => !v)}
          aria-expanded={showWhy}
        >
          {showWhy ? '−' : '+'} Why? — what Spyne actually did
        </button>

        {showWhy && (
          <div className="impact-attribution">
            <h3 className="impact-attribution-title">Attribution</h3>
            <ul className="impact-attribution-list">
              {IMPACT.attribution.map((a) => (
                <li key={a.product} className="impact-attribution-item">
                  <span className="impact-attribution-product">{a.product}</span>
                  <span className="impact-attribution-impact">{a.impact}</span>
                </li>
              ))}
            </ul>
            <p className="muted impact-attribution-foot">
              Methodology · pre/post comparison with control-store benchmark · 90-day rolling baselines
            </p>
          </div>
        )}
      </section>

      <footer className="impact-foot">
        <button className="btn-ghost-v2 sm">Export PDF</button>
        <button className="btn-ghost-v2 sm">Forward to ownership</button>
      </footer>
    </div>
  );
}
