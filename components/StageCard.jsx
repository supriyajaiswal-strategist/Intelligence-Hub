import { LockedCard } from './Atoms';
import { StageVizSwitch } from './StageViz';
import { ZONE_REQS } from '@/lib/data';

export default function StageCard({ stage, ints, setView }) {
  const reqs = ZONE_REQS[stage.key] || [];
  const missing = reqs.filter((r) => !ints[r]);
  const locked = missing.length > 0;

  const barPct = Math.min((stage.tat / (stage.target * 2.2)) * 100, 100);
  const targetPct = Math.min((stage.target / (stage.target * 2.2)) * 100, 100);

  return (
    <button
      className={`stage ${stage.status}`}
      onClick={() => setView({ type: 'stage', key: stage.key })}
    >
      <header className="stage-head">
        <span className="stage-num mono">{stage.num}</span>
        <span className={`stage-dot ${stage.status}`} />
      </header>

      <div className="stage-title">{stage.name}</div>

      <div className="stage-tat">
        <span className={`stage-tat-val mono ${stage.status}`}>
          {stage.tat}
          <span className="stage-tat-unit">{stage.tatUnit || 'd'}</span>
        </span>
        <span className="stage-tat-target">
          target <span className="mono">{stage.target}{stage.tatUnit || 'd'}</span>
        </span>
      </div>

      <div className="stage-bar">
        <div
          className={`stage-bar-fill ${stage.status}`}
          style={{ width: `${barPct}%` }}
        />
        <div className="stage-bar-mark" style={{ left: `${targetPct}%` }} />
      </div>

      <div className="stage-viz">
        <StageVizSwitch vizType={stage.vizType} viz={stage.viz} />
      </div>

      <footer className="stage-foot">
        <span className="stage-cost mono">
          −${(stage.cost / 1000).toFixed(1)}k{stage.costUnit || '/mo'}
        </span>
        <span className="stage-arrow">→</span>
      </footer>

      {locked && <LockedCard missing={missing} est={stage.cost} />}
    </button>
  );
}
