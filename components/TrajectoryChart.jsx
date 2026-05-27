'use client';
import { TRAJECTORY_MONTHS, TRAJECTORY_LIVE_IDX } from '@/lib/data';

// Reusable trajectory chart — 12-month line with:
// • area fill under the line
// • dashed horizontal reference at `pre` (the pre-Spyne baseline)
// • dashed vertical marker at TRAJECTORY_LIVE_IDX ("Spyne live")
// • mono axis labels (3 Y ticks + 12 X labels)
//
// Pure SVG, no external deps.

export default function TrajectoryChart({
  label,
  pre,
  current,
  delta,
  direction = 'down',
  series,
  unit = '',
  color = 'var(--info)',
}) {
  const W = 520;
  const H = 220;
  const padL = 38;
  const padR = 18;
  const padT = 18;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const min = Math.min(...series, pre);
  const max = Math.max(...series, pre);
  // Pad domain ~10% on each side for breathing room.
  const dom = max - min || 1;
  const yMin = min - dom * 0.10;
  const yMax = max + dom * 0.10;
  const yDom = yMax - yMin;

  const x = (i) => padL + (i / (series.length - 1)) * innerW;
  const y = (v) => padT + innerH - ((v - yMin) / yDom) * innerH;

  // Line path
  const linePts = series.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');

  // Area path (close down to baseline at the bottom)
  const areaPts =
    `M${x(0)},${y(series[0])} ` +
    series.map((v, i) => `L${x(i)},${y(v)}`).join(' ') +
    ` L${x(series.length - 1)},${padT + innerH} L${x(0)},${padT + innerH} Z`;

  // Y-axis ticks — round numbers within domain.
  const ticks = niceTicks(yMin, yMax, 3);

  // Format helpers
  const fmt = (v) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    if (Number.isInteger(v)) return `${v}`;
    return v.toFixed(1);
  };

  const liveX = x(TRAJECTORY_LIVE_IDX);

  return (
    <div className="tj-card">
      <header className="tj-head">
        <div className="tj-h-l">
          <div className="tj-label">{label}</div>
          <div className="tj-value-row">
            <span className="tj-value mono">{fmt(current)}{unit ? <span className="tj-unit">{unit}</span> : null}</span>
            <span className={`tj-delta ${direction}`}>{delta}</span>
          </div>
        </div>
        <div className="tj-h-r">
          <div className="tj-pre-label">PRE-SPYNE AVG</div>
          <div className="tj-pre-value mono">{fmt(pre)}{unit}</div>
        </div>
      </header>

      <svg viewBox={`0 0 ${W} ${H}`} className="tj-svg" preserveAspectRatio="xMidYMid meet">
        {/* Y-axis gridlines + labels */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={padL}
              x2={padL + innerW}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="2 4"
              opacity="0.5"
            />
            <text
              x={padL - 8}
              y={y(t)}
              dy="0.32em"
              textAnchor="end"
              className="tj-axis-y mono"
            >
              {fmt(t)}
            </text>
          </g>
        ))}

        {/* X-axis labels (every other month to avoid crowding) */}
        {TRAJECTORY_MONTHS.map((m, i) => (
          i % 2 === 0 || i === TRAJECTORY_MONTHS.length - 1 ? (
            <text
              key={m}
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              className="tj-axis-x mono"
            >
              {m}
            </text>
          ) : null
        ))}

        {/* Pre-Spyne baseline (dashed horizontal) */}
        <line
          x1={padL}
          x2={padL + innerW}
          y1={y(pre)}
          y2={y(pre)}
          stroke="var(--text-3)"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          opacity="0.7"
        />

        {/* Spyne-live vertical marker */}
        <line
          x1={liveX}
          x2={liveX}
          y1={padT}
          y2={padT + innerH}
          stroke="var(--accent)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.8"
        />
        <text
          x={liveX}
          y={padT - 4}
          textAnchor="middle"
          className="tj-live-label mono"
        >
          SPYNE LIVE
        </text>

        {/* Area fill under line */}
        <path d={areaPts} fill={color} opacity="0.10" />

        {/* The line itself */}
        <path
          d={linePts}
          fill="none"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Last-point dot */}
        <circle
          cx={x(series.length - 1)}
          cy={y(series[series.length - 1])}
          r="3.5"
          fill={color}
          stroke="var(--surface-0)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

// Generate ~n round-ish ticks across [min, max].
function niceTicks(min, max, n = 3) {
  const range = max - min;
  const step = niceStep(range / (n + 1));
  const start = Math.ceil(min / step) * step;
  const out = [];
  for (let v = start; v <= max && out.length < n + 2; v += step) out.push(round(v));
  return out;
}
function niceStep(raw) {
  const exp = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / exp;
  const nice = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
  return nice * exp;
}
function round(v) {
  return Math.abs(v) < 10 ? Math.round(v * 10) / 10 : Math.round(v);
}
