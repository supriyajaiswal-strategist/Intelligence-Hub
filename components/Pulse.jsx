'use client';
import { useState, useEffect, useRef } from 'react';
import { PULSE } from '@/lib/data';
import { Sparkline } from './Atoms';

export default function Pulse() {
  const [mot, setMot] = useState(PULSE.moneyOnTableStart);
  const [flash, setFlash] = useState(false);
  const tickDir = useRef(1);

  useEffect(() => {
    const iv = setInterval(() => {
      setMot((v) => {
        const delta = (Math.random() * 80 + 20) * tickDir.current;
        if (Math.random() < 0.15) tickDir.current *= -1;
        return Math.max(8000, Math.round(v + delta));
      });
      setFlash(true);
      setTimeout(() => setFlash(false), 700);
    }, 3800);
    return () => clearInterval(iv);
  }, []);

  const ttsDelta = PULSE.timeToSellPrev - PULSE.timeToSell;
  const motTotal = PULSE.moneyOnTableBreakdown.reduce((s, i) => s + i.value, 0);
  const paceW = (PULSE.pace / PULSE.goal) * 100;
  const paceTone = paceW >= 85 ? 'good' : paceW >= 65 ? 'warn' : 'bad';

  return (
    <section className="kpis">
      {/* Hero: Time to Sell */}
      <div className="kpi kpi-hero">
        <div className="kpi-label">Time to Sell</div>
        <div className="kpi-value-row">
          <span className="kpi-value mono">{PULSE.timeToSell}</span>
          <span className="kpi-unit">days</span>
        </div>
        <div className="kpi-meta">
          <span className="trend down">↓ {ttsDelta}d since you joined Spyne</span>
          <span className="kpi-sep">·</span>
          <span>Target {PULSE.timeToSellTarget}d</span>
        </div>
        <div className="kpi-bar">
          <div
            className="kpi-bar-fill"
            style={{
              width: `${Math.min((PULSE.timeToSellTarget / PULSE.timeToSell) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Money on Table */}
      <div className={`kpi ${flash ? 'flash' : ''}`}>
        <div className="kpi-label">
          <span className="live" /> Money on table
        </div>
        <div className="kpi-value-row">
          <span className="kpi-value mono kpi-bad">${(mot / 1000).toFixed(1)}k</span>
        </div>
        <div className="kpi-meta">Recoverable today across 6 stages</div>
        <div className="kpi-stack">
          {PULSE.moneyOnTableBreakdown.map((b) => (
            <div
              key={b.label}
              style={{ width: `${(b.value / motTotal) * 100}%`, background: b.color }}
              title={`${b.label}: $${b.value.toLocaleString()}`}
            />
          ))}
        </div>
      </div>

      {/* Units pace */}
      <div className="kpi">
        <div className="kpi-label">Units pace</div>
        <div className="kpi-value-row">
          <span className="kpi-value mono">{PULSE.pace}</span>
          <span className="kpi-of">/ {PULSE.goal}</span>
        </div>
        <div className="kpi-meta">
          {PULSE.daysLeft} days left · {PULSE.goal - PULSE.pace} units to goal
        </div>
        <div className="kpi-bar">
          <div
            className={`kpi-bar-fill ${paceTone}`}
            style={{ width: `${paceW}%` }}
          />
          <div className="kpi-bar-mark" style={{ left: '85%' }} />
        </div>
      </div>
    </section>
  );
}
