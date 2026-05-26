import { BIG_MOVE, LAST_BIG_MOVE } from '@/lib/data';

export default function BigMove() {
  return (
    <div className="bm-row">
      <div className="bm">
        <div className="bm-l">
          <div className="bm-tag">⚡ Big Move This Week</div>
          <div className="bm-head">{BIG_MOVE.title}</div>
          <div className="bm-sub">{BIG_MOVE.sub}</div>
          <div className="bm-chips">
            <span className="bm-chip">{BIG_MOVE.leads} leads waiting</span>
            <span className="bm-chip">{BIG_MOVE.stock} in stock</span>
            <span className="bm-chip">{BIG_MOVE.candidates} candidates at auction</span>
          </div>
          <div className="bm-actions">
            <button className="btn">Open buy list →</button>
            <button className="btn ghost">Snooze 1d</button>
          </div>
        </div>
        <div className="bm-r">
          {BIG_MOVE.impact.map((s) => (
            <div key={s.l} className="bm-stat">
              <div className="v">{s.v}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="last-move">
        <div className="lm-tag">Last Week</div>
        <div className="lm-head">{LAST_BIG_MOVE.title}</div>
        <div className={`lm-status ${LAST_BIG_MOVE.outcomeColor}`}>{LAST_BIG_MOVE.status}</div>
        <div className="lm-out">{LAST_BIG_MOVE.outcome}</div>
      </div>
    </div>
  );
}
