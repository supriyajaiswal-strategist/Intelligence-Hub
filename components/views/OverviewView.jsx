import Pulse from '../Pulse';
import Trajectory from '../Trajectory';
import SpottedFeed from '../SpottedFeed';
import Journey from '../Journey';
import Top3 from '../Top3';
import BigMove from '../BigMove';
import DecisionLogPreview from '../DecisionLogPreview';
import { STORE, PULSE } from '@/lib/data';

export default function OverviewView({ ints, setView }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="canvas">
      <div className="greet">
        <div>
          <h1>{greet}, Marcus.</h1>
          <div className="sub">
            {STORE.date} · {STORE.location} ·{' '}
            <strong>{PULSE.daysLeft} selling days</strong> left this month
          </div>
        </div>
        <button className="btn ghost sm">
          <span>↗ Export</span>
        </button>
      </div>

      <Pulse />
      <Trajectory />
      <SpottedFeed setView={setView} />
      <Journey ints={ints} setView={setView} />
      <Top3 setView={setView} />
      <BigMove />
      <DecisionLogPreview setView={setView} />
    </div>
  );
}
