import { STAGES, STORE } from '@/lib/data';
import { Icon } from './Atoms';

const STAGE_ICONS = {
  procure: 'truck', golive: 'eye', attract: 'sparkle',
  engage: 'phone', convert: 'funnel', refill: 'refresh',
};

export default function Sidebar({ view, setView, collapsed, setCollapsed }) {
  const isActive = (v) =>
    (view.type === v.type && view.key === v.key) || (view.type === v.type && !v.key);

  return (
    <div className="sidebar">
      <div className="sb-brand">
        <span className="sb-brand-mark">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="6" r="3" opacity="0.85" />
            <circle cx="6" cy="18" r="3" opacity="0.85" />
            <circle cx="18" cy="18" r="3" opacity="0.7" />
          </svg>
        </span>
        <div className="sb-brand-text">
          <div className="sb-brand-name">Spyne IH</div>
          <div className="sb-brand-store">{STORE.name}</div>
        </div>
      </div>

      <button
        className={`sb-item ${isActive({ type: 'overview' }) ? 'active' : ''}`}
        onClick={() => setView({ type: 'overview' })}
      >
        <span className="ico"><Icon name="home" size={15} /></span>
        <span className="lbl">Overview</span>
      </button>

      <div className="sb-section">Journey</div>
      {STAGES.map((s) => (
        <button
          key={s.key}
          className={`sb-item ${isActive({ type: 'stage', key: s.key }) ? 'active' : ''}`}
          onClick={() => setView({ type: 'stage', key: s.key })}
        >
          <span className="ico"><Icon name={STAGE_ICONS[s.key]} size={15} /></span>
          <span className="lbl">{s.num} · {s.name}</span>
          <span className={`status-dot ${s.status}`} />
        </button>
      ))}

      <div className="sb-section">Intelligence</div>
      <button
        className={`sb-item ${isActive({ type: 'insights' }) ? 'active' : ''}`}
        onClick={() => setView({ type: 'insights' })}
      >
        <span className="ico"><Icon name="sparkle" size={15} /></span>
        <span className="lbl">Spotted</span>
        <span className="num">5</span>
      </button>
      <button
        className={`sb-item ${isActive({ type: 'decisions' }) ? 'active' : ''}`}
        onClick={() => setView({ type: 'decisions' })}
      >
        <span className="ico"><Icon name="log" size={15} /></span>
        <span className="lbl">Decisions</span>
        <span className="num">8</span>
      </button>

      <button className="sb-toggle" onClick={() => setCollapsed(!collapsed)}>
        <Icon name={collapsed ? 'chevRight' : 'chevLeft'} size={13} />
        {!collapsed && <span>Collapse</span>}
      </button>
    </div>
  );
}
