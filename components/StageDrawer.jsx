import { Sparkline } from './Atoms';

export default function StageDrawer({ stage, onClose }) {
  const tatUnit = stage.tatUnit || 'd';
  return (
    <div className="drawer-bg" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="dr-head">
          <div>
            <div className="dr-title">Stage {stage.num} · {stage.name}</div>
            <div className="dr-sub">
              {stage.subtitle} · TAT {stage.tat}{tatUnit} (target {stage.target}{tatUnit})
            </div>
          </div>
          <button className="dr-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="dr-body">
          <div className="dr-section">
            <h4>Today's bleeds · ranked</h4>
            <div style={{ fontSize: 12, color: 'var(--text-2)', padding: '8px 12px', background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 6 }}>
              Detailed bleed list lives here — same data driving the card surface, plus next-ranked items, plus the source signal slice and confidence score.
            </div>
          </div>
          <div className="dr-section">
            <h4>Recovery actions available</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="btn" style={{ justifyContent: 'flex-start' }}>{stage.action}</button>
              <button className="btn ghost" style={{ justifyContent: 'flex-start' }}>Bulk action · all flagged units</button>
              <button className="btn ghost" style={{ justifyContent: 'flex-start' }}>Set policy · auto-trigger next time</button>
            </div>
          </div>
          <div className="dr-section">
            <h4>Trend · last 30 days</h4>
            <div style={{ padding: 14, background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <Sparkline
                data={[5.2, 4.8, 5.0, 4.5, 4.2, 4.6, 4.3, 4.1, 4.4, 4.2, 4.0, 3.9, 4.2, 4.3, 4.2]}
                w={460}
                h={50}
                color="var(--accent)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
