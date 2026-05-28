import Pulse from '../Pulse';
import TTSJourney from '../TTSJourney';
import TodayPriorities from '../TodayPriorities';
import BigMove from '../BigMove';
import { STORE, PULSE } from '@/lib/data';

export default function OverviewView({ setView }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="canvas-v2">
      <header className="overview-head">
        <div>
          <h1 className="overview-title">{greet}, Marcus.</h1>
          <p className="overview-sub muted">
            {STORE.name} · {STORE.date} · {PULSE.daysLeft} selling days left
          </p>
        </div>
        <button className="btn-ghost-v2 sm">Export</button>
      </header>

      <Pulse />
      <TTSJourney setView={setView} />
      <TodayPriorities />
      <BigMove />
    </div>
  );
}
