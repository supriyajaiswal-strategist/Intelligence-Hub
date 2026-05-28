'use client';
import { TRAJECTORY_MONTHS, TRAJECTORY_LIVE_IDX } from '@/lib/data';

// 12-month trajectory chart styled in the expansion-playbook paper aesthetic.
//   * smooth curve through every data point (Catmull-Rom > cubic Bezier)
//   * filled dot at every data point
//   * subtle area fill below the curve
//   * dashed gray pre-Spyne baseline
//   * dashed purple "SPYNE LIVE" vertical marker with uppercase mono label
//   * mono Y-axis ticks on the left, mono X-axis month labels at the bottom
//   * card header: big number + green delta pill on the left, pre-avg on the right

export default function TrajectoryChart({
  label,
  pre,
  current,
  delta,
  direction = 'down',
  series,
  unit = '',
  color = '#22c55e',      // good direction default
  colorPositive = '#22c55e',  // green for downward TAT trends
  colorNegative = '#7c4dff',  // violet for upward volume/gross trends
}) {
  const W = 760;
  const H = 320;
  const padL = 50;
  const padR = 24;
  const padT = 32;
  const padB = 42;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  // Color picks: down direction = good (green), up direction = volume (violet).
  const lineColor = direction === 'down' ? colorPositive : colorNegative;
  const fillColor = lineColor;

  const min = Math.min(...series, pre);
  const max = Math.max(...series, pre);
  const dom = max - min || 1;
  const yMin = min - dom * 0.12;
  const yMax = max + dom * 0.12;
  const yDom = yMax - yMin;

  const x = (i) => padL + (i / (series.length - 1)) * innerW;
  const y = (v) => padT + innerH - ((v - yMin) / yDom) * innerH;

  // Catmull-Rom interpolation through the data points, expressed as cubic Beziers.
  // Produces a smooth curve that PASSES through every point.
  const smoothPath = buildSmoothPath(series, x, y);
  const areaPath =
    smoothPath +
    ` L${x(series.length - 1)},${padT + innerH} L${x(0)},${padT + innerH} Z`;

  const ticks = niceTicks(yMin, yMax, 4);
  const liveX = x(TRAJECTORY_LIVE_IDX);

  const fmt = (v) => {
    if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString();
    if (Number.isInteger(v)) return `${v}`;
    return v.toFixed(1);
  };

  return (
    <div className="tj-card-v2">
      <header className="tj-head-v2">
        <div className="tj-h-l">
          <div className="tj-label-v2">{label}</div>
          <div className="tj-value-row-v2">
            <span className="tj-value-v2">{fmt(current)}{unit && <span className="tj-unit-v2">{unit}</span>}</span>
            <span className="tj-delta-v2">{delta}</span>
          </div>
        </div>
        <div className="tj-h-r">
          <div className="tj-pre-label-v2">PRE-SPYNE AVG</div>
          <div className="tj-pre-value-v2">{fmt(pre)}{unit}</div>
        </div>
      </header>

      <svg viewBox={`0 0 ${W} ${H}`} className="tj-svg-v2" preserveAspectRatio="xMidYMid meet">
        {/* Y gridlines + labels */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={padL} x2={padL + innerW}
              y1={y(t)} y2={y(t)}
              stroke="#d6cfbd"
              strokeWidth="1"
              strokeDasharray="2 5"
              opacity="0.7"
            />
            <text
              x={padL - 12} y={y(t)}
              dy="0.32em" textAnchor="end"
              className="tj-axis-y-v2"
            >
              {fmt(t)}
            </text>
          </g>
        ))}

        {/* X labels (every month, gentle) */}
        {TRAJECTORY_MONTHS.map((m, i) => (
          <text
            key={m}
            x={x(i)} y={H - 14}
            textAnchor="middle"
            className="tj-axis-x-v2"
          >
            {m}
          </text>
        ))}

        {/* Pre-Spyne baseline */}
        <line
          x1={padL} x2={padL + innerW}
          y1={y(pre)} y2={y(pre)}
          stroke="#6b7280"
          strokeWidth="1.2"
          strokeDasharray="5 4"
          opacity="0.55"
        />

        {/* SPYNE LIVE vertical marker */}
        <line
          x1={liveX} x2={liveX}
          y1={padT} y2={padT + innerH}
          stroke="#7c4dff"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          opacity="0.85"
        />
        <text
          x={liveX} y={padT - 8}
          textAnchor="middle"
          className="tj-live-label-v2"
        >
          SPYNE LIVE
        </text>

        {/* Area + line */}
        <path d={areaPath} fill={fillColor} opacity="0.12" />
        <path
          d={smoothPath}
          fill="none"
          stroke={lineColor}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dot at every point */}
        {series.map((v, i) => (
          <circle
            key={i}
            cx={x(i)} cy={y(v)} r="3.5"
            fill="#faf6ec"
            stroke={lineColor}
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );
}

// Build a smooth path through points using a Catmull-Rom to Bezier conversion.
// Tension 0.5 gives gentle curves like the expansion-playbook charts.
function buildSmoothPath(series, x, y) {
  if (series.length < 2) return '';
  const n = series.length;
  let d = `M${x(0)},${y(series[0])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = { x: x(Math.max(0, i - 1)),     y: y(series[Math.max(0, i - 1)]) };
    const p1 = { x: x(i),                       y: y(series[i]) };
    const p2 = { x: x(i + 1),                   y: y(series[i + 1]) };
    const p3 = { x: x(Math.min(n - 1, i + 2)), y: y(series[Math.min(n - 1, i + 2)]) };
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

// Round-ish Y ticks across [min, max]
function niceTicks(min, max, n = 4) {
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
