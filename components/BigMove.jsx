import { BIG_MOVE } from '@/lib/data';

export default function BigMove() {
  return (
    <div className="bm">
      <div className="bm-l">
        <span className="bm-tag">↑ Big Move · this week</span>
        <div className="bm-head">{BIG_MOVE.title}</div>
        <div className="bm-sub">{BIG_MOVE.sub}</div>
        <div className="bm-chips">
          <span className="bm-chip">leads {BIG_MOVE.leads}</span>
          <span className="bm-chip">stock {BIG_MOVE.stock}</span>
          <span className="bm-chip">
            supply you {BIG_MOVE.supplyYou}d · market {BIG_MOVE.supplyMarket}d
          </span>
          <span className="bm-chip">{BIG_MOVE.candidates} lane candidates</span>
        </div>
        <div className="bm-actions" style={{ marginTop: 10 }}>
          <button className="btn">Open buy list</button>
          <button className="btn ghost">Lane preview</button>
        </div>
      </div>
      <div className="bm-r">
        {BIG_MOVE.impact.map((c, i) => (
          <div key={i} className="bm-stat">
            <div className="v">{c.v}</div>
            <div className="l">{c.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
