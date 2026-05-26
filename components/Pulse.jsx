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
      setTimeout(() => setFlash(false), 600);
    }, 3800);
    return () => clearInterval(iv);
  }, []);

  const paceW = (PULSE.pace / PULSE.goal) * 100;
  const motTotal = PULSE.moneyOnTableBreakdown.reduce((s, i) => s + i.value, 0);

  return (
    <div className="pulse">
      {/* Pace */}
      <div className="pulse-tile">
        <div className="p-label">Units Pace</div>
        <div className="p-value">
          {PULSE.pace}<span className="of"> / {PULSE.goal}</span>
        </div>
        <div className="p-sub">{PULSE.daysLeft}d left · need {PULSE.goal - PULSE.pace} more</div>
        <div className="p-bar">
          <div className="p-bar-fill" style={{ width: `${paceW}%`, background: paceW >= 85 ? 'var(--good)' : paceW >= 65 ? 'var(--warn)' : 'var(--bad)' }} />
          <div className="p-bar-mark" style={{ left: '85%' }} />
        </div>
      </div>

      {/* Gross */}
      <div className="pulse-tile">
        <div className="p-label">Gross MTD</div>
        <div className="p-value">${PULSE.grossMTD}k</div>
        <div className="p-sub">LM ${PULSE.grossLM}k · {Math.round(((PULSE.grossMTD - PULSE.grossLM) / PULSE.grossLM) * 100)}%</div>
        <Sparkline data={PULSE.grossTrend} w={80} h={20} color="var(--accent)" />
      </div>

      {/* Time to Sell — hero */}
      <div className="pulse-tile hero">
        <div className="p-label">⏱ Time to Sell</div>
        <div className="p-value hero">{PULSE.timeToSell}d</div>
        <div className="p-sub">Target {PULSE.timeToSellTarget}d · was {PULSE.timeToSellPrev}d when you joined</div>
        <div className="p-bar" style={{ marginTop: 12 }}>
          <div className="p-bar-fill" style={{ width: `${Math.min((PULSE.timeToSellTarget / PULSE.timeToSell) * 100, 100)}%`, background: 'var(--accent)' }} />
        </div>
      </div>

      {/* Money on Table */}
      <div className={`pulse-tile ${flash ? 'tick-flash' : ''}`}>
        <div className="p-label"><span className="live" /> Money on Table</div>
        <div className="p-value bleed mono">${mot.toLocaleString()}</div>
        <div className="stacked-bar">
          {PULSE.moneyOnTableBreakdown.map((b) => (
            <div key={b.label} style={{ width: `${(b.value / motTotal) * 100}%`, background: b.color }} title={`${b.label}: $${b.value.toLocaleString()}`} />
          ))}
        </div>
        <div className="p-sub" style={{ marginTop: 5 }}>
          {PULSE.moneyOnTableBreakdown.map((b) => (
            <span key={b.label} style={{ marginRight: 8, fontSize: 10.5, color: b.color }}>{b.label}</span>
          ))}
        </div>
      </div>

      {/* Today */}
      <div className="pulse-tile">
        <div className="p-label">Today</div>
        <div className="today" style={{ marginTop: 8 }}>
          <div className="today-it">
            <span className="today-n mono">{PULSE.todaySold}</span>
            <span className="today-l">Sold</span>
          </div>
          <div className="today-it">
            <span className="today-n mono">{PULSE.todayLeads}</span>
            <span className="today-l">Leads</span>
          </div>
          <div className="today-it">
            <span className="today-n mono">{PULSE.todayUps}</span>
            <span className="today-l">Ups</span>
          </div>
        </div>
        <div className="p-sub" style={{ marginTop: 6 }}>
          Yest: {PULSE.ySold} sold · {PULSE.yLeads} leads · {PULSE.yUps} ups
        </div>
        <div className="p-bar">
          <div className="p-bar-fill" style={{ width: `${(PULSE.todaySold / (PULSE.goal / PULSE.totalDays)) * 100}%`, background: 'var(--good)' }} />
        </div>
      </div>
    </div>
  );
}
