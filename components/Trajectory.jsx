import { TRAJECTORY } from '@/lib/data';

export default function Trajectory() {
  return (
    <div className="trajectory">
      <div className="traj-head">
        <span className="lbl">↗ Your trajectory · 4 months on Spyne</span>
        <span className="sub">since Nov 2025</span>
      </div>
      {TRAJECTORY.map((t, i) => (
        <div key={i} className="traj-it">
          <span className="name">{t.name}</span>
          <div className="change">
            <span className="from">{t.from}</span>
            <span style={{ color: 'var(--text-3)' }}>→</span>
            <span className="to">{t.to}</span>
            <span className={`delta ${t.tone}`}>{t.delta}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
