import { STAGES, PULSE } from '@/lib/data';
import StageCard from './StageCard';

export default function Journey({ ints, setView }) {
  return (
    <div>
      <div className="journey-head">
        <div className="journey-title">
          <span className="lbl">Time-to-Sell Journey</span>
          <span className="central">
            Central metric: <span>{PULSE.timeToSell}d</span> avg (target {PULSE.timeToSellTarget}d)
          </span>
        </div>
        <div className="journey-meta">
          <strong>{STAGES.filter((s) => s.status === 'bad').length}</strong> stages critical ·{' '}
          <strong>{STAGES.filter((s) => s.status === 'warn').length}</strong> watch
        </div>
      </div>
      <div className="journey">
        {STAGES.map((s) => (
          <StageCard key={s.key} stage={s} ints={ints} setView={setView} />
        ))}
      </div>
    </div>
  );
}
