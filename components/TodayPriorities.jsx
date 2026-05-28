import { runEngine } from '@/lib/engine';
import PriorityCard from './PriorityCard';

// Renders the engine's Top 3 priorities as spacious cards.
export default function TodayPriorities() {
  const { today, moneyMeter } = runEngine();

  return (
    <section className="prio-section">
      <header className="prio-section-head">
        <div>
          <div className="section-eyebrow">Today</div>
          <h2 className="section-title-v2">3 things to do</h2>
        </div>
        <div className="prio-section-meter">
          <span className="section-eyebrow">Money Meter</span>
          <span className="mono tone-bad prio-section-meter-val">
            ${moneyMeter.total.toLocaleString()}
          </span>
          <span className="muted mono prio-section-meter-sub">
            {moneyMeter.breakdown.length} domains live
          </span>
        </div>
      </header>

      <div className="prio-list">
        {today.length === 0 && (
          <div className="prio-empty muted">No qualifying candidates — feed is green.</div>
        )}
        {today.map((c, i) => (
          <PriorityCard key={c.id} rank={i + 1} candidate={c} />
        ))}
      </div>
    </section>
  );
}
