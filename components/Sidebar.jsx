import { STAGES, STORE } from '@/lib/data';
import { Icon } from './Atoms';

const STAGE_ICONS = {
  procure: 'truck', golive: 'eye', attract: 'sparkle',
  engage: 'phone', convert: 'funnel', refill: 'refresh',
};

const STAGE_LABELS = {
  procure: 'Procure', golive: 'Go Live', attract: 'Attract',
  engage: 'Engage', convert: 'Convert', refill: 'Refill',
};

export default function Sidebar({ view, setView, collapsed, setCollapsed }) {
  const isActive = (v) =>
    (view.type === v.type && view.key === v.key) || (view.type === v.type && !v.key);

  return (
    <div className="sidebar">
      <div className="sb-brand">
        <div className="sb-brand-text">
          <div className="sb-brand-name">Spyne IH</div>
          <div className="sb-brand-store">{STORE.name}</div>
        </div>
        <button
          className="sb-header-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <Icon name={collapsed ? 'chevRight' : 'chevLeft'} size={13} />
        </button>
      </div>

      <button
        className={`sb-item ${isActive({ type: 'overview' }) ? 'active' : ''}`}
        onClick={() => setView({ type: 'overview' })}
        data-tip="Overview"
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
          data-tip={`${s.num} · ${STAGE_LABELS[s.key] || s.name}`}
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
        data-tip="Spotted · 5"
      >
        <span className="ico"><Icon name="sparkle" size={15} /></span>
        <span className="lbl">Spotted</span>
        <span className="num">5</span>
      </button>
      <button
        className={`sb-item ${isActive({ type: 'decisions' }) ? 'active' : ''}`}
        onClick={() => setView({ type: 'decisions' })}
        data-tip="Decisions · 8"
      >
        <span className="ico"><Icon name="log" size={15} /></span>
        <span className="lbl">Decisions</span>
        <span className="num">8</span>
      </button>

      <div className="sb-spacer" />

      <div className="sb-foot">
        <div className="user" title="Marcus Chen · Principal">
          <span className="user-av">MC</span>
          <div className="user-info">
            <div className="user-name">Marcus Chen</div>
            <div className="user-role">Principal · {STORE.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
