import Pulse from '../Pulse';
import TodayTickers from '../TodayTickers';
import Trajectory from '../Trajectory';
import Journey from '../Journey';
import Top3 from '../Top3';
import BigMove from '../BigMove';
import { STORE, PULSE } from '@/lib/data';

export default function OverviewView({ ints, setView }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="canvas">
      <header className="page-head">
        <div>
          <h1 className="page-title">{greet}, Marcus.</h1>
          <p className="page-sub">
            {STORE.date} · {PULSE.daysLeft} selling days left · {STORE.location}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn ghost sm">Export</button>
        </div>
      </header>

      <Pulse />
      <TodayTickers />
      <Trajectory />
      <Journey ints={ints} setView={setView} />
      <Top3 setView={setView} />
      <BigMove />
    </div>
  );
}
