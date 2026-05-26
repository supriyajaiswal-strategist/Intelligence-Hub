export const SegmentsViz = ({ data }) => (
  <div>
    <div className="vz-label">Segment gaps · you vs market</div>
    {data.map((d, i) => {
      const maxGap = 15;
      const pct = Math.min((Math.abs(d.gap) / maxGap) * 100, 100);
      const fillColor =
        d.status === 'bad' ? 'var(--bad)' :
        d.status === 'warn' ? 'var(--warn)' : 'var(--good)';
      return (
        <div key={i} className="vz-row">
          <span className="lbl">{d.lbl}</span>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${pct}%`, background: fillColor }} />
          </div>
          <span className={`val ${d.status}`}>{d.gap > 0 ? '+' : ''}{d.gap}</span>
        </div>
      );
    })}
  </div>
);

export const PipelineViz = ({ data }) => (
  <div>
    <div className="vz-label">Stuck per stage</div>
    <div className="pipeline">
      {data.map((d, i) => (
        <div key={i} className={`pipe-stage ${d.bottleneck ? 'bottleneck' : ''}`}>
          <div className="pname">{d.lbl}</div>
          <div className="pcount">{d.count}</div>
        </div>
      ))}
    </div>
  </div>
);

export const AttractViz = ({ data }) => (
  <div>
    <div className="vz-label">Units with attract issues</div>
    {data.map((d, i) => (
      <div key={i} className="vz-row">
        <span className="lbl">{d.lbl}</span>
        <div className="bar">
          <div
            className="bar-fill"
            style={{
              width: `${d.pct}%`,
              background: d.status === 'bad' ? 'var(--bad)' : 'var(--warn)',
            }}
          />
        </div>
        <span className={`val ${d.status}`}>{d.count}</span>
      </div>
    ))}
  </div>
);

export const HistogramViz = ({ data, aged }) => {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div>
      <div className="vz-label">Response time distribution</div>
      <div className="histo">
        {data.map((d, i) => (
          <div
            key={i}
            className="histo-bar"
            style={{ height: `${(d.count / max) * 100}%`, background: d.color }}
          />
        ))}
      </div>
      <div className="histo-labels">
        {data.map((d, i) => (
          <span key={i}>{d.lbl}</span>
        ))}
      </div>
      <div className="vz-row" style={{ marginTop: 6 }}>
        <span className="lbl">Aged 72h+</span>
        <div className="bar">
          <div className="bar-fill" style={{ width: '80%', background: 'var(--bad)' }} />
        </div>
        <span className="val bad">{aged}</span>
      </div>
    </div>
  );
};

export const FunnelViz = ({ data }) => (
  <div>
    <div className="vz-label">Conversion at each step</div>
    <div className="funnel-mini">
      {data.map((d, i) => {
        const color =
          d.status === 'good' ? 'var(--good)' :
          d.status === 'warn' ? 'var(--warn)' :
          d.status === 'bad' ? 'var(--bad)' : 'var(--accent)';
        return (
          <div key={i} className={`fm-row ${d.status === 'bad' ? 'worst' : ''}`}>
            <span className="name">{d.lbl}</span>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${d.pct}%`, background: color }} />
            </div>
            <span className="pct">{d.pct}%</span>
          </div>
        );
      })}
    </div>
  </div>
);

export const QueueViz = ({ data }) => (
  <div>
    <div className="vz-label">Sold vs queue · by segment</div>
    <div className="queue">
      {data.map((d, i) => (
        <div key={i} className="q-row">
          <span className="seg">{d.seg}</span>
          <span className="stat">sold {d.sold} · queue {d.queue}</span>
          <span className={`dot ${d.status}`} />
        </div>
      ))}
    </div>
  </div>
);
