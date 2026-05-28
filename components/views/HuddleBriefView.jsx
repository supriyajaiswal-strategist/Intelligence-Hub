'use client';
import { useState } from 'react';
import { runEngine } from '@/lib/engine';
import { STORE, IMPACT, TRAJECTORY } from '@/lib/data';
import BackNav from '../BackNav';

// Huddle Brief: auto-generated from engine state.
// 4 sections (Yesterday / Today's 3 Priorities / Market Pulse / One Problem),
// plus a Monthly Snapshot opening on the first Monday of the month.

export default function HuddleBriefView({ setView }) {
  const { today, store } = runEngine();
  const [sent, setSent] = useState(null);

  const now = new Date();
  // Force render the snapshot in this mock so the design is visible.
  const isFirstMondayOfMonth = true;

  const onSend = (channel) => {
    setSent(channel);
    setTimeout(() => setSent(null), 2500);
  };

  return (
    <div className="canvas-v2 huddle">
      <BackNav setView={setView} />
      <header className="huddle-head">
        <div>
          <div className="huddle-eyebrow">Huddle Brief</div>
          <h1 className="huddle-title">{STORE.name} · {formatDate(now)}</h1>
        </div>
        <div className="huddle-send">
          <button className="btn-primary-v2" onClick={() => onSend('Slack')}>
            Send to Slack
          </button>
          <button className="btn-ghost-v2" onClick={() => onSend('SMS')}>
            Send to SMS
          </button>
        </div>
      </header>

      {sent && (
        <div className="huddle-toast">✓ Sent to {sent} · delivery confirmed at {timeString()}</div>
      )}

      <article className="huddle-doc">

        {isFirstMondayOfMonth && (
          <HuddleSection title="Monthly Snapshot" eyebrow={`${monthName(now)} · 6 months of Spyne`}>
            <ul className="huddle-snapshot-list">
              {TRAJECTORY.map((t) => (
                <li key={t.key}>
                  <span className="huddle-snapshot-label">{t.label}</span>
                  <span className="mono huddle-snapshot-vals">
                    {fmtValue(t.pre, t.unit)} → {fmtValue(t.current, t.unit)}
                  </span>
                  <span className={`mono ${t.direction === 'down' ? 'tone-good' : 'tone-good'} huddle-snapshot-delta`}>
                    {t.delta}
                  </span>
                </li>
              ))}
            </ul>
            <p className="huddle-snapshot-foot">
              Estimated <span className="mono">${(IMPACT.recoveredToDate / 1000).toFixed(0)}k</span> recovered to date.
              On track to ~<span className="mono">${(IMPACT.annualizedRunRate / 1000).toFixed(0)}k</span> per year.
              Full picture: Impact view.
            </p>
          </HuddleSection>
        )}

        <HuddleSection title="Yesterday">
          <p>
            <span className="mono">4 units sold</span> · <span className="mono">$14,200</span> front /{' '}
            <span className="mono">$8,000</span> back · PVR <span className="mono">$5,550</span>.
            Best Monday in 6 weeks.
          </p>
          <p>
            2 deals fell through — financing on one (subprime), trade gap on the other
            (Sarah · 2020 Pilot).
          </p>
        </HuddleSection>

        <HuddleSection title="Today's 3 Priorities">
          <ol className="huddle-prio-list">
            {today.map((c, i) => (
              <li key={c.id}>
                <strong>{c.headline}</strong>
                <span className="muted"> {c.primaryAction.label}.</span>
              </li>
            ))}
          </ol>
        </HuddleSection>

        <HuddleSection title="Market Pulse">
          <p>
            Compact SUV market supply <span className="mono">35d</span>, your supply{' '}
            <span className="mono">14d</span>. You rank{' '}
            <span className="mono">12 of 14</span> in 25mi radius — underbought.
          </p>
          <p>
            Manheim Tuesday catalog has{' '}
            <span className="mono">6 viable buys</span> at target ACV.
          </p>
        </HuddleSection>

        <HuddleSection title="One Problem to Solve Before 10am">
          <p>
            Detail bay backlog. <span className="mono">9 units</span> stuck{' '}
            <span className="mono">38–71h</span> vs <span className="mono">8h</span> SLA.
          </p>
          <p>
            {store.owners.recon_mgr.name} to walk the bay at 8:30am. Root cause likely tech
            reallocation — Manuel has <span className="mono">11 active ROs</span> vs team avg{' '}
            <span className="mono">4</span>.
          </p>
        </HuddleSection>

      </article>
    </div>
  );
}

function HuddleSection({ title, eyebrow, children }) {
  return (
    <section className="huddle-section">
      {eyebrow && <div className="huddle-section-eyebrow muted mono">{eyebrow}</div>}
      <h2 className="huddle-section-title">{title}</h2>
      <div className="huddle-section-body">{children}</div>
    </section>
  );
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
function monthName(d) {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
function timeString() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
function fmtValue(v, unit) {
  if (unit === 'k') return `$${v}k`;
  if (unit === 'd') return `${v}d`;
  return `${v}${unit || ''}`;
}
