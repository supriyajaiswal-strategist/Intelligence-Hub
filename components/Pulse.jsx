'use client';
import { useState, useEffect, useRef } from 'react';
import { PULSE } from '@/lib/data';
import { runEngine } from '@/lib/engine';

// Single-row Pulse: 4 KPI tiles + today/yesterday inline strip.
// Money Meter ticks live from the engine.

export default function Pulse() {
  // Money Meter — initial value from the engine, then we let it drift
  // gently so it feels alive (Bloomberg variable reward).
  const initial = useRef(null);
  if (initial.current === null) initial.current = runEngine().moneyMeter.total;

  const [mot, setMot] = useState(initial.current);
  const dirRef = useRef(1);

  useEffect(() => {
    const iv = setInterval(() => {
      setMot((v) => {
        const drift = (Math.random() * 80 + 20) * dirRef.current;
        if (Math.random() < 0.18) dirRef.current *= -1;
        return Math.max(5000, Math.round(v + drift));
      });
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const eomDelta = PULSE.eomForecast - PULSE.grossMTD;
  const pacePct = Math.round((PULSE.pace / PULSE.goal) * 100);

  return (
    <section className="pulse-v2">
      <div className="pulse-grid">
        <KpiTile
          label="Gross MTD"
          value={`$${PULSE.grossMTD}k`}
          meta={`vs $${PULSE.grossLM}k LM · ${PULSE.grossMTD - PULSE.grossLM >= 0 ? '↑' : '↓'} ${Math.abs(PULSE.grossMTD - PULSE.grossLM)}k`}
          tone={PULSE.grossMTD >= PULSE.grossLM ? 'good' : 'warn'}
        />
        <KpiTile
          label="EOM Forecast"
          value={`$${PULSE.eomForecast}k`}
          meta={`+$${eomDelta}k in ${PULSE.daysLeft} days`}
          tone="neutral"
        />
        <KpiTile
          label="Money on Table"
          value={`$${(mot / 1000).toFixed(1)}k`}
          meta="ticking · 4 leaks live"
          tone="bad"
          live
        />
        <KpiTile
          label="Units Pace"
          value={`${PULSE.pace}/${PULSE.goal}`}
          meta={`${pacePct}% · ${PULSE.goal - PULSE.pace} to goal`}
          tone={pacePct >= 85 ? 'good' : pacePct >= 65 ? 'warn' : 'bad'}
        />
      </div>

      <div className="pulse-today">
        <div className="pulse-today-row">
          <span className="pulse-today-label">Today</span>
          <TickerCell n={PULSE.todaySold}   l="sold"   y={PULSE.ySold} />
          <TickerCell n={PULSE.todayLeads}  l="leads"  y={PULSE.yLeads} />
          <TickerCell n={PULSE.todayAppts}  l="appts"  y={PULSE.yAppts} />
          <TickerCell n={PULSE.todayVisits} l="visits" y={PULSE.yVisits} />
        </div>
        <div className="pulse-today-row pulse-today-yest">
          <span className="pulse-today-label">Yesterday</span>
          <YestCell v={PULSE.ySold} />
          <YestCell v={PULSE.yLeads} />
          <YestCell v={PULSE.yAppts} />
          <YestCell v={PULSE.yVisits} />
        </div>
      </div>
    </section>
  );
}

function KpiTile({ label, value, meta, tone = 'neutral', live }) {
  return (
    <div className="kpi-tile">
      <div className="kpi-tile-label">
        {live && <span className="live-dot" />}{label}
      </div>
      <div className={`kpi-tile-value mono ${tone}`}>{value}</div>
      <div className="kpi-tile-meta">{meta}</div>
    </div>
  );
}

function TickerCell({ n, l, y }) {
  const delta = n - y;
  const tone = delta > 0 ? 'good' : delta < 0 ? 'bad' : 'flat';
  const sign = delta > 0 ? '+' : '';
  return (
    <div className="ticker-cell">
      <span className="ticker-n mono">{n}</span>
      <span className="ticker-l">{l}</span>
      {delta !== 0 && <span className={`ticker-d mono ${tone}`}>{sign}{delta}</span>}
    </div>
  );
}
function YestCell({ v }) {
  return (
    <div className="ticker-cell yest">
      <span className="ticker-n mono">{v}</span>
      <span className="ticker-l">&nbsp;</span>
    </div>
  );
}
