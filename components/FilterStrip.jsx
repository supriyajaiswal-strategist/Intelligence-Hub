import { STORE, INT_LABELS, INT_DESC } from '@/lib/data';

export default function FilterStrip({ integrations, setIntegrations, ddOpen, setDdOpen }) {
  const onCount = Object.values(integrations).filter((v) => v).length;
  const coverage = Math.round((onCount / Object.keys(integrations).length) * 100);
  const toggle = (k) => setIntegrations((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <>
      <div className="filter-strip">
        <div className="fl-left">
          <div className="fl-logo">
            <span className="fl-logo-mark">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <circle cx="6" cy="6" r="3" />
                <circle cx="18" cy="6" r="3" opacity="0.85" />
                <circle cx="6" cy="18" r="3" opacity="0.85" />
                <circle cx="18" cy="18" r="3" opacity="0.7" />
              </svg>
            </span>
            <span>Spyne Intelligence Hub</span>
          </div>
          <div className="fl-divider" />
          <div className="fl-store">
            <strong>{STORE.name}</strong> · {STORE.location}
          </div>
        </div>
        <div className="fl-left">
          <div className="int-chips">
            {Object.keys(integrations).map((k) => (
              <button
                key={k}
                className={`int-chip ${integrations[k] ? '' : 'off'}`}
                onClick={() => toggle(k)}
              >
                <span className="d" />
                {INT_LABELS[k]}
              </button>
            ))}
          </div>
          <div className="fl-divider" />
          <button
            className={`cov-pill ${coverage < 100 ? 'partial' : ''}`}
            onClick={() => setDdOpen(!ddOpen)}
          >
            Coverage {coverage}% ▾
          </button>
        </div>
      </div>
      {ddOpen && (
        <div className="fl-dropdown">
          <h4>Integration status</h4>
          <div className="sub">
            Toggle to preview how the dashboard changes. Sales reps use this in demos.
          </div>
          {Object.keys(integrations).map((k) => (
            <div key={k} className="tg-row">
              <div className="tg-info">
                <span className="name">{INT_LABELS[k]}</span>
                <span className="desc">{INT_DESC[k]}</span>
              </div>
              <button
                className={`tg ${integrations[k] ? 'on' : ''}`}
                onClick={() => toggle(k)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
