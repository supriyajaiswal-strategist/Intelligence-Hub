// 60px sparkline at the top of each stage deep-dive.
// Shows the metric since Spyne went live — baseline dot (left) → today dot (right).
// No axes. Just the curve, two dots, two number labels, one percent change.

export default function StageTrendSpark({ stage }) {
  const series = stage.sparkSince || [];
  if (series.length < 2) return null;

  const W = 360;
  const H = 60;
  const padL = 8;
  const padR = 8;
  const padT = 8;
  const padB = 8;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const x = (i) => padL + (i / (series.length - 1)) * (W - padL - padR);
  const y = (v) => padT + (H - padT - padB) - ((v - min) / range) * (H - padT - padB);

  const start = series[0];
  const end = series[series.length - 1];
  const pct = Math.round(((end - start) / start) * 100);
  const direction = end < start ? 'down' : end > start ? 'up' : 'flat';

  // Direction "down" is "good" for TAT metrics (TTF/TTL/GEN/APT C/VISIT/Sell Conv).
  const tone = direction === 'down' ? 'tone-good' : direction === 'up' ? 'tone-bad' : 'muted';

  const path = series.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');

  return (
    <div className="stage-spark">
      <div className="stage-spark-numbers">
        <div className="stage-spark-pre">
          <div className="muted section-eyebrow">baseline</div>
          <div className="mono stage-spark-num">{start}{stage.tatUnit}</div>
        </div>
        <svg className="stage-spark-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={x(0)} cy={y(start)} r="3.5" fill="var(--text-3)" />
          <circle cx={x(series.length - 1)} cy={y(end)} r="4" fill="var(--accent)" />
        </svg>
        <div className="stage-spark-now">
          <div className="muted section-eyebrow">today</div>
          <div className="mono stage-spark-num">{end}{stage.tatUnit}</div>
        </div>
        <div className="stage-spark-delta">
          <div className="muted section-eyebrow">since Spyne</div>
          <div className={`mono ${tone}`}>
            {direction === 'down' ? '↓' : direction === 'up' ? '↑' : '·'} {Math.abs(pct)}%
          </div>
        </div>
      </div>
    </div>
  );
}
