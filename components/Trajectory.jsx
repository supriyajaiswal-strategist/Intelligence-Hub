import { TRAJECTORY, STORE } from '@/lib/data';
import { Sparkline } from './Atoms';

export default function Trajectory() {
  return (
    <div className="trajectory">
      <div className="traj-head">
        <div className="lbl">Since you joined Spyne</div>
        <div className="sub">{STORE.joinedSpyne} → today</div>
      </div>
      {TRAJECTORY.map((t) => (
        <div key={t.name} className="traj-it">
          <div className="name">{t.name}</div>
          <div className="change">
            <span className="from">{t.from}</span>
            <span>→</span>
            <span className="to">{t.to}</span>
            <span className={`delta ${t.tone}`}>{t.delta}</span>
          </div>
          <Sparkline data={t.spark} w={72} h={18} color={t.tone === 'good' ? 'var(--good)' : 'var(--warn)'} />
        </div>
      ))}
    </div>
  );
}
