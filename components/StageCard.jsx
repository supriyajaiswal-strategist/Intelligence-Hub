import { LockedCard } from './Atoms';
import { ZONE_REQS } from '@/lib/data';
import { SegmentsViz, PipelineViz, AttractViz, HistogramViz, FunnelViz, QueueViz } from './StageViz';

const VIZ = {
  segments: SegmentsViz,
  pipeline: PipelineViz,
  attract: AttractViz,
  histogram: HistogramViz,
  funnel: FunnelViz,
  queue: QueueViz,
};

export default function StageCard({ stage, integrations, onClick }) {
  const reqs = ZONE_REQS[stage.key] || [];
  const missing = reqs.filter((r) => !integrations[r]);
  const locked = missing.length > 0;
  const tatUnit = stage.tatUnit || 'd';
  const VizComp = VIZ[stage.vizType];

  return (
    <div
      className={`stage flagged ${stage.status}`}
      onClick={!locked ? onClick : undefined}
    >
      <div className="st-head">
        <div className="st-name">
          <span className="st-num">STAGE {stage.num}</span>
          <span className="st-title">{stage.name}</span>
        </div>
        <span className={`st-dot ${stage.status}`} />
      </div>

      <div className="st-tat">
        <div className="st-tat-row">
          <span className={`st-tat-val ${stage.status}`}>
            {stage.tat}
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{tatUnit}</span>
          </span>
          <span className="st-tat-target">target {stage.target}{tatUnit}</span>
          <span className={`st-tat-delta ${stage.status}`} style={{ marginLeft: 'auto' }}>{stage.delta}</span>
        </div>
        <div className="st-tat-bar">
          <div
            className="st-tat-bar-fill"
            style={{
              width: `${Math.min((stage.tat / (stage.target * 2)) * 100, 100)}%`,
              background:
                stage.status === 'bad' ? 'var(--bad)' :
                stage.status === 'warn' ? 'var(--warn)' : 'var(--good)',
            }}
          />
          <div className="st-tat-bar-mark" style={{ left: `${(stage.target / (stage.target * 2)) * 100}%` }} />
        </div>
      </div>

      <div className="st-viz">
        {VizComp && <VizComp data={stage.viz} aged={stage.aged} />}
      </div>

      <div className="st-foot">
        <span className="st-cost">
          ${stage.cost.toLocaleString()}
          <span style={{ color: 'var(--text-3)', fontWeight: 400, fontSize: 10, marginLeft: 3 }}>{stage.costUnit}</span>
        </span>
        <button className="st-action">{stage.action}</button>
      </div>

      {locked && <LockedCard missing={missing} est="X" />}
    </div>
  );
}
