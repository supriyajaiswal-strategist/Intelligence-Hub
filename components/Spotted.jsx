import { SPOTTED } from '@/lib/data';

export default function Spotted({ integrations }) {
  if (!integrations.studio) return null;
  return (
    <div className="spotted">
      <span className="sp-icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
        </svg>
      </span>
      <span className="sp-lbl">Spyne Spotted</span>
      <span className="sp-text">{SPOTTED.pattern}</span>
      <span className="sp-mini">
        <span style={{ height: '13px' }} />
        <span style={{ height: '5px' }} />
      </span>
      <span className="sp-val">{SPOTTED.impact}</span>
      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>view ▶</span>
    </div>
  );
}
