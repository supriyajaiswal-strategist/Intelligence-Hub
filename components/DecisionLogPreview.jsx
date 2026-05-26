import { DECISIONS } from '@/lib/data';

export default function DecisionLogPreview({ setView }) {
  const preview = DECISIONS.slice(0, 5);
  const totalRecovered = DECISIONS.filter((d) => d.status === 'cleared').reduce((s, d) => s + d.recovered, 0);

  return (
    <div className="dlog-prev">
      <div className="dlog-head">
        <span className="dlog-h-l">Decision Log</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="mono" style={{ fontSize: 12, color: 'var(--good)', fontWeight: 600 }}>
            +${totalRecovered.toLocaleString()} recovered
          </span>
          <button className="btn ghost sm" onClick={() => setView({ type: 'decisions' })}>
            All {DECISIONS.length} →
          </button>
        </div>
      </div>

      {preview.map((d, i) => (
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
  );
}
