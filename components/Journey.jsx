import { STAGES, PULSE } from '@/lib/data';
import StageCard from './StageCard';

export default function Journey({ ints, setView }) {
  const critical = STAGES.filter((s) => s.status === 'bad').length;
  const watch = STAGES.filter((s) => s.status === 'warn').length;

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2 className="section-title">Time-to-Sell journey</h2>
          <p className="section-sub">
            6 stages · avg <span className="mono">{PULSE.timeToSell}d</span> · target{' '}
            <span className="mono">{PULSE.timeToSellTarget}d</span>
          </p>
        </div>
        <div className="section-meta">
          {critical > 0 && <span className="meta-pill bad">{critical} critical</span>}
          {watch > 0 && <span className="meta-pill warn">{watch} watch</span>}
        </div>
      </div>
      <div className="journey">
        {STAGES.map((s) => (
          <StageCard key={s.key} stage={s} ints={ints} setView={setView} />
        ))}
      </div>
    </section>
  );
}
