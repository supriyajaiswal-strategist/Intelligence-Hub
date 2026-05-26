'use client';
import { useState, useEffect } from 'react';
import { SPOTTED_FEED } from '@/lib/data';
import { Icon } from './Atoms';

export default function SpottedFeed({ setView }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setActive((i) => (i + 1) % SPOTTED_FEED.length), 6000);
    return () => clearInterval(iv);
  }, []);

  const s = SPOTTED_FEED[active];
  const barMax = Math.max(...s.bars);

  return (
    <div className="spotted-feed">
      <div className="sf-head">
        <div className="l">
          <span className="sp-icon"><Icon name="sparkle" size={12} /></span>
          <span className="sf-h-title">Spyne Spotted</span>
          <span className="sf-h-meta">
            <strong>{SPOTTED_FEED.length}</strong> patterns · rotating
          </span>
        </div>
        <button className="btn ghost sm" onClick={() => setView({ type: 'insights' })}>
          View all →
        </button>
      </div>

      <div className="sp-row" style={{ cursor: 'default' }}>
        <div className="sp-time">{s.timeago}</div>
        <div className="sp-pattern">
          <span className="sp-mini-bars">
            {s.bars.map((b, i) => (
              <span key={i} style={{ height: `${Math.max(4, (b / barMax) * 18)}px` }} />
            ))}
          </span>
          {s.pattern}
        </div>
        <div className="sp-impact">{s.impact}</div>
        <div className="sp-conf">
          {s.confidence}% conf
          <div style={{ display: 'flex', gap: 3, marginTop: 4, justifyContent: 'flex-end' }}>
            {SPOTTED_FEED.map((_, i) => (
              <span
                key={i}
                onClick={() => setActive(i)}
                style={{ width: i === active ? 14 : 6, height: 4, borderRadius: 2, background: i === active ? 'var(--accent)' : 'var(--surface-3)', cursor: 'pointer', transition: 'all .3s' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
