import { DECISIONS } from '@/lib/data';
import BackNav from '../BackNav';

const STATUS_ORDER = { pending: 0, running: 1, queued: 2, scheduled: 3, cleared: 4 };

export default function DecisionsView({ setView }) {
  const sorted = [...DECISIONS].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
  const totalRecovered = DECISIONS.filter((d) => d.status === 'cleared').reduce((s, d) => s + d.recovered, 0);
  const pending = DECISIONS.filter((d) => ['pending', 'running', 'queued', 'scheduled'].includes(d.status)).length;

  return (
    <div className="canvas">
      <BackNav setView={setView} />
      <div className="greet">
        <div>
          <h1>Decision Log</h1>
          <div className="sub">Every action taken · who · when · what it recovered</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost sm">↗ Export</button>
          <button className="btn sm">+ Log decision</button>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { l: 'Total decisions', v: DECISIONS.length, tone: '' },
          { l: 'Recovered', v: `+$${totalRecovered.toLocaleString()}`, tone: 'good' },
          { l: 'In flight', v: pending, tone: 'warn' },
        ].map((s) => (
          <div key={s.l} style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 18px', flex: 1 }}>
            <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.l}</div>
            <div className="mono" style={{ fontSize: 24, fontWeight: 500, marginTop: 6, color: s.tone ? `var(--${s.tone})` : 'var(--text-1)' }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="dlog-prev">
        <div className="dlog-head">
          <span className="dlog-h-l">All Decisions</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Sorted by status · most active first</span>
        </div>
        {sorted.map((d, i) => (
          <div key={i} className="dlog-row">
            <span className="dlog-time">{d.time}</span>
            <span className="dlog-action">{d.action}</span>
            <span className="dlog-subject">{d.subject}</span>
            <span className="dlog-rec">{d.recovered ? `+$${d.recovered.toLocaleString()}` : '—'}</span>
            <span className="dlog-by">{d.by}</span>
            <span className={`dlog-status ${d.status}`}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
