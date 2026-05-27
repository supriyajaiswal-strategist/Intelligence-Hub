import { TRAJECTORY } from '@/lib/data';
import TrajectoryChart from './TrajectoryChart';

export default function Trajectory() {
  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2 className="section-title">Since you joined Spyne</h2>
          <p className="section-sub">12-month trajectory · dashed vertical = go-live</p>
        </div>
      </div>
      <div className="tj-grid">
        {TRAJECTORY.map((t) => (
          <TrajectoryChart key={t.key} {...t} />
        ))}
      </div>
    </section>
  );
}
