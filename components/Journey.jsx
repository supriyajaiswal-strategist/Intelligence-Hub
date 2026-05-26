import { STAGES, PULSE } from '@/lib/data';
import StageCard from './StageCard';

export default function Journey({ integrations, onStageClick }) {
  return (
    <div>
      <div className="journey-head">
        <div className="journey-title">
          <span className="lbl">Time-to-Sell Journey</span>
          <span className="central">
            Central metric · <span>{PULSE.timeToSell}d avg</span>
          </span>
        </div>
        <span className="journey-meta">
          2 stages on target · 3 warn · 1 critical · <strong>tap any stage for deep-dive</strong>
        </span>
      </div>
      <div className="journey">
        {STAGES.map((s) => (
          <StageCard
            key={s.key}
            stage={s}
            integrations={integrations}
            onClick={() => onStageClick(s)}
          />
        ))}
      </div>
    </div>
  );
}
