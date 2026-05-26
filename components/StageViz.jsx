// Six visualization types for stage cards

export function SegmentsViz({ viz }) {
  const max = Math.max(...viz.flatMap((r) => [r.you, r.market]));
  return (
    <div>
      <div className="vz-label">You vs Market (days supply)</div>
      {viz.map((r) => (
        <div key={r.lbl} className="vz-row">
          <span className="lbl">{r.lbl}</span>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${(r.you / max) * 100}%`, background: r.status === 'bad' ? 'var(--bad)' : r.status === 'warn' ? 'var(--warn)' : 'var(--good)' }} />
          </div>
          <span className={`val ${r.status}`}>{r.you}d</span>
        </div>
      ))}
    </div>
  );
}

export function PipelineViz({ viz }) {
  return (
    <div className="pipeline">
      {viz.map((s) => (
        <div key={s.lbl} className={`pipe-stage ${s.bottleneck ? 'bottleneck' : ''}`}>
          <div className="pname">{s.lbl}</div>
          <div className="pcount">{s.count}</div>
        </div>
      ))}
    </div>
  );
}

export function AttractViz({ viz }) {
  const max = Math.max(...viz.map((r) => r.count));
  return (
    <div>
      <div className="vz-label">Units by issue</div>
      {viz.map((r) => (
        <div key={r.lbl} className="vz-row">
          <span className="lbl" style={{ fontSize: 9.5 }}>{r.lbl}</span>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${(r.count / max) * 100}%`, background: r.status === 'bad' ? 'var(--bad)' : 'var(--warn)' }} />
          </div>
          <span className={`val ${r.status}`}>{r.count}</span>
        </div>
      ))}
    </div>
  );
}

export function HistogramViz({ viz }) {
  const max = Math.max(...viz.map((r) => r.count));
  return (
    <div>
      <div className="histo">
        {viz.map((r) => (
          <div key={r.lbl} className="histo-bar" style={{ height: `${(r.count / max) * 44}px`, background: r.color }} />
        ))}
      </div>
      <div className="histo-labels">
        {viz.map((r) => <span key={r.lbl}>{r.lbl}</span>)}
      </div>
    </div>
  );
}

export function FunnelViz({ viz }) {
  const worst = viz.reduce((a, b) => (b.pct - b.benchmark < a.pct - a.benchmark ? b : a));
  return (
    <div className="funnel-mini">
      {viz.map((r) => (
        <div key={r.lbl} className={`fm-row ${r === worst ? 'worst' : ''}`}>
          <span className="name">{r.lbl}</span>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${r.pct}%`, background: r.status === 'bad' ? 'var(--bad)' : r.status === 'good' ? 'var(--good)' : 'var(--warn)' }} />
            <div className="bar-bench" style={{ left: `${r.benchmark}%` }} />
          </div>
          <span className="pct">{r.pct}%</span>
        </div>
      ))}
    </div>
  );
}

export function QueueViz({ viz }) {
  return (
    <div className="queue">
      {viz.map((r) => (
        <div key={r.seg} className="q-row">
          <span className="seg">{r.seg}</span>
          <span className="stat">{r.queue}/{r.sold} queued</span>
          <span className={`dot ${r.status}`} />
        </div>
      ))}
    </div>
  );
}

export function StageVizSwitch({ vizType, viz }) {
  switch (vizType) {
    case 'segments':  return <SegmentsViz viz={viz} />;
    case 'pipeline':  return <PipelineViz viz={viz} />;
    case 'attract':   return <AttractViz viz={viz} />;
    case 'histogram': return <HistogramViz viz={viz} />;
    case 'funnel':    return <FunnelViz viz={viz} />;
    case 'queue':     return <QueueViz viz={viz} />;
    default: return null;
  }
}
