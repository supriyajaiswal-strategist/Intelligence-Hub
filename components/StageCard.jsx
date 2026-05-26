import { LockedCard } from './Atoms';
import { StageVizSwitch } from './StageViz';
import { ZONE_REQS, INT_LABELS } from '@/lib/data';

export default function StageCard({ stage, ints, setView }) {
  const reqs = ZONE_REQS[stage.key] || [];
  const missing = reqs.filter((r) => !ints[r]);
  const locked = missing.length > 0;
  const est = stage.cost;

  const pctile = stage.peerPercentile;
  const ppTone = pctile < 25 ? 'bad' : pctile < 50 ? 'warn' : 'good';
  const barPct = Math.min((stage.tat / (stage.target * 2.2)) * 100, 100);
  const targetPct = Math.min((stage.target / (stage.target * 2.2)) * 100, 100);

  return (
    <div
      className={`stage flagged ${stage.status}`}
      onClick={() => setView({ type: 'stage', key: stage.key })}
    >
      <div className="st-head">
        <div className="st-name">
          <span className="st-num">{stage.num}</span>
          <span className="st-title">{stage.name}</span>
        </div>
        <span className={`st-dot ${stage.status}`} />
      </div>

      <div className="st-tat">
        <div className="st-tat-row">
          <span className={`st-tat-val ${stage.status}`}>{stage.tat}{stage.tatUnit || 'd'}</span>
          <span className="st-tat-target">/ {stage.target}{stage.tatUnit || 'd'} target</span>
          <span className={`st-tat-delta ${stage.status}`}>{stage.delta}</span>
        </div>
        <div className="st-tat-bar">
          <div className="st-tat-bar-fill" style={{ width: `${barPct}%`, background: `var(--${stage.status})` }} />
          <div className="st-tat-bar-mark" style={{ left: `${targetPct}%` }} />
        </div>
        <div className="peer-bench">
          Peer median <span className="mono">{stage.peerMedian}{stage.tatUnit || 'd'}</span> ·{' '}
          <span className={`pp ${ppTone}`}>p{pctile}</span>
        </div>
      </div>

      <div className="st-viz">
        <StageVizSwitch vizType={stage.vizType} viz={stage.viz} />
      </div>

      <div className="st-foot">
        <span className="st-cost">−${stage.cost.toLocaleString()}{stage.costUnit}</span>
        <button
          className="st-action"
          onClick={(e) => { e.stopPropagation(); setView({ type: 'stage', key: stage.key }); }}
        >
          {stage.action}
        </button>
      </div>

      {locked && (
        <LockedCard missing={missing} est={est} />
      )}
    </div>
  );
}
