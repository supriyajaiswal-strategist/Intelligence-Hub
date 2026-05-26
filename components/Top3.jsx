import { TOP3 } from '@/lib/data';
import { Avatar } from './Atoms';

export default function Top3() {
  const total = TOP3.reduce((s, a) => s + a.money, 0);
  return (
    <div className="top3-wrap">
      <div className="top3-head">
        <div className="top3-h-l">
          <span className="lbl">Today's Top 3 · recovery actions</span>
          <span className="pill">${total.toLocaleString()} recoverable</span>
        </div>
        <button className="btn ghost sm">Customize ▾</button>
      </div>
      {TOP3.map((a) => (
        <div key={a.rank} className="top3-row">
          <span className="t3-rank">#{a.rank}</span>
          <span className="t3-stage">{a.stage}</span>
          <span className={`t3-pri ${a.priority}`}>
            <span className="d" />
            <span className="lbl">{a.priority === 'bad' ? 'high' : 'med'}</span>
          </span>
          <span className="t3-what">{a.what}</span>
          <span className="chips">
            {a.chips.map((c, i) => (
              <span key={i} className={`chip ${c.tone !== 'normal' ? c.tone : ''}`}>{c.label}</span>
            ))}
          </span>
          <span className="t3-money">${a.money.toLocaleString()}</span>
          <Avatar i={a.owner.i} c={a.owner.c} />
          <button className="btn">{a.action} →</button>
        </div>
      ))}
      <div className="top3-foot">
        <span>
          Total recoverable today: <span className="total">${total.toLocaleString()}</span> · Auto-safe ready: <strong>2 / 3</strong>
        </span>
        <button className="btn ghost sm">Run safe actions</button>
      </div>
    </div>
  );
}
