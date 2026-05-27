import { PULSE } from '@/lib/data';

// Compact daily-snapshot row: Sold · Engaged · Ups · vs yesterday.
// Mono numbers, colored delta vs prior day.

function delta(today, yesterday) {
  const d = today - yesterday;
  if (d === 0) return { sign: '·', tone: 'flat', text: 'flat' };
  if (d > 0)   return { sign: '↑', tone: 'good', text: `+${d}` };
  return                { sign: '↓', tone: 'bad',  text: `${d}` };
}

export default function TodayTickers() {
  const tickers = [
    { label: 'Sold today',    n: PULSE.todaySold,  y: PULSE.ySold },
    { label: 'Leads engaged', n: PULSE.todayLeads, y: PULSE.yLeads },
    { label: 'Ups',           n: PULSE.todayUps,   y: PULSE.yUps },
  ];

  return (
    <section className="today-strip" aria-label="Today's snapshot">
      <div className="today-label">Today</div>
      <ul className="today-list">
        {tickers.map((t) => {
          const d = delta(t.n, t.y);
          return (
            <li key={t.label} className="ticker">
              <span className="ticker-n mono">{t.n}</span>
              <div className="ticker-meta">
                <span className="ticker-l">{t.label}</span>
                <span className={`ticker-d ${d.tone}`}>
                  <span className="ticker-d-sign">{d.sign}</span>
                  <span className="mono">{d.text}</span>
                  <span className="ticker-d-vs">vs yest ({t.y})</span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
