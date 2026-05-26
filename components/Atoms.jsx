import { INT_LABELS } from '@/lib/data';

export const Avatar = ({ i, c }) => (
  <span className="avatar" style={{ background: c }}>{i}</span>
);

export const Sparkline = ({ data, w = 64, h = 22, color = 'var(--accent)' }) => {
  if (!data || !data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 2) - 1}`)
    .join(' ');
  return (
    <svg width={w} height={h}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const LockedCard = ({ missing, est }) => (
  <div className="lockover">
    <div className="lockcard">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <h5>Connect {missing.map((m) => INT_LABELS[m]).join(' + ')}</h5>
      <p>
        This stage activates once {missing.length === 1 ? 'this integration is' : 'these integrations are'} connected.
      </p>
      <div className="est">est. ${est}/mo recoverable</div>
      <button className="btn xs">Connect →</button>
    </div>
  </div>
);
