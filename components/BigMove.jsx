import { BIG_MOVE } from '@/lib/data';

export default function BigMove() {
  return (
    <section className="bigmove">
      <div className="bigmove-l">
        <div className="bigmove-tag">This week's biggest move</div>
        <h3 className="bigmove-title">{BIG_MOVE.title}</h3>
        <p className="bigmove-sub">{BIG_MOVE.sub}</p>
        <div className="bigmove-actions">
          <button className="btn">Open buy list</button>
          <button className="btn ghost">Snooze 1 day</button>
        </div>
      </div>
      <div className="bigmove-r">
        {BIG_MOVE.impact.map((s) => (
          <div key={s.l} className="bigmove-stat">
            <div className="bigmove-stat-v mono">{s.v}</div>
            <div className="bigmove-stat-l">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
