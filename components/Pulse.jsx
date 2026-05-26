import { PULSE } from '@/lib/data';
import { Sparkline } from './Atoms';

export default function Pulse() {
  return (
    <div className="pulse">
      <div className="pulse-tile">
        <div>
          <div className="p-label">March pace</div>
          <div className="p-value mono">
            {PULSE.pace}<span className="of"> / {PULSE.goal}</span>
          </div>
          <div className="p-bar">
            <div
              className="p-bar-fill"
              style={{ width: `${(PULSE.pace / PULSE.goal) * 100}%`, background: 'var(--accent)' }}
            />
            <div className="p-bar-mark" style={{ left: `${(PULSE.dayOfMonth / PULSE.totalDays) * 100}%` }} />
          </div>
        </div>
        <div className="p-sub">{PULSE.daysLeft}d left · projects 82 ±3</div>
      </div>

      <div className="pulse-tile">
        <div>
          <div className="p-label">Gross MTD</div>
          <div className="p-value mono">${PULSE.grossMTD}k</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span className="p-sub">
            vs ${PULSE.grossLM}k LM <span style={{ color: 'var(--bad)', fontWeight: 600 }}>-13%</span>
          </span>
          <Sparkline data={PULSE.grossTrend} color="var(--bad)" />
        </div>
      </div>

      <div className="pulse-tile hero">
        <div>
          <div className="p-label"><span className="live" />Time to Sell · avg</div>
          <div className="p-value mono hero">
            {PULSE.timeToSell}<span className="of">d</span>
          </div>
          <div className="p-bar">
            <div
              className="p-bar-fill"
              style={{
                width: `${Math.min((PULSE.timeToSellTarget / PULSE.timeToSell) * 100, 100)}%`,
                background: 'var(--accent)',
              }}
            />
            <div
              className="p-bar-mark"
              style={{ left: `${(PULSE.timeToSellTarget / PULSE.timeToSell) * 100}%` }}
            />
          </div>
        </div>
        <div className="p-sub">target {PULSE.timeToSellTarget}d · was {PULSE.timeToSellPrev}d on join</div>
      </div>

      <div className="pulse-tile">
        <div>
          <div className="p-label">Days of supply</div>
          <div className="p-value mono">
            {PULSE.daysSupply}<span className="of">d</span>
          </div>
        </div>
        <div className="p-sub">target {PULSE.daysSupplyTarget}d · 4 segments off</div>
      </div>

      <div className="pulse-tile">
        <div>
          <div className="p-label">Today</div>
          <div className="today" style={{ marginTop: 8 }}>
            <div className="today-it">
              <div className="today-n">{PULSE.todaySold}</div>
              <div className="today-l">Sold</div>
            </div>
            <div className="today-it">
              <div className="today-n">{PULSE.todayLeads}</div>
              <div className="today-l">Leads</div>
            </div>
            <div className="today-it">
              <div className="today-n">{PULSE.todayUps}</div>
              <div className="today-l">Ups</div>
            </div>
          </div>
        </div>
        <div className="p-sub">vs {PULSE.ySold}·{PULSE.yLeads}·{PULSE.yUps} yesterday</div>
      </div>
    </div>
  );
}
