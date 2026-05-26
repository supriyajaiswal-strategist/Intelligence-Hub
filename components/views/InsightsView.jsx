import { SPOTTED_FEED } from '@/lib/data';
import { Icon } from '../Atoms';

const TYPE_COLORS = {
  workflow: 'var(--accent)',
  'cross-stage': 'var(--info)',
  people: 'var(--warn)',
  market: 'var(--good)',
};

export default function InsightsView() {
  return (
    <div className="canvas">
      <div className="greet">
        <div>
          <h1>Spyne Spotted</h1>
          <div className="sub">Cross-stage patterns your team couldn't compute manually</div>
        </div>
        <button className="btn ghost sm">↗ Export insights</button>
      </div>

      <div className="insights-list">
        {SPOTTED_FEED.map((s) => {
          const barMax = Math.max(...s.bars);
          return (
            <div key={s.id} className="insight-card">
              <div className="insight-head">
                <span className="insight-type" style={{ background: `${TYPE_COLORS[s.type]}18`, color: TYPE_COLORS[s.type] }}>
                  {s.type}
                </span>
                <span className="insight-conf">{s.confidence}% confidence</span>
                <span className="insight-time">{s.timeago}</span>
              </div>

              <div className="insight-pattern">{s.pattern}</div>

              {/* mini bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, margin: '10px 0', height: 36 }}>
                {s.bars.map((b, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ width: 24, height: `${(b / barMax) * 30}px`, background: i === 0 ? TYPE_COLORS[s.type] : 'var(--surface-3)', borderRadius: 3, minHeight: 2 }} />
                    <span style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{b}</span>
                  </div>
                ))}
              </div>

              <div className="insight-impact">↑ {s.impact}</div>

              <div className="insight-actions">
                <button className="btn sm">Act on this →</button>
                <button className="btn ghost sm">Log decision</button>
                <button className="btn ghost sm">Dismiss</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
