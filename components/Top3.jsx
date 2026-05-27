'use client';
import { useState } from 'react';
import { TOP3, TOP3_QUEUE } from '@/lib/data';

export default function Top3({ setView }) {
  const [cleared, setCleared] = useState(new Set());
  const [queue, setQueue] = useState(TOP3_QUEUE);
  const [items, setItems] = useState(TOP3);

  const onAct = (e, id) => {
    e.stopPropagation();
    setCleared((p) => new Set([...p, id]));
    setTimeout(() => {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        if (queue.length > 0) {
          const [promoted, ...rest] = queue;
          setQueue(rest);
          return [...next, { ...promoted, rank: next.length + 1 }];
        }
        return next;
      });
      setCleared((p) => { const s = new Set(p); s.delete(id); return s; });
    }, 1600);
  };

  const total = items.reduce((s, i) => s + i.money, 0);

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2 className="section-title">Recovery actions</h2>
          <p className="section-sub">
            {items.length} active · <span className="mono">−${total.toLocaleString()}</span> at risk
          </p>
        </div>
      </div>

      <ul className="actions">
        {items.map((it) => (
          <li
            key={it.id}
            className={`action ${cleared.has(it.id) ? 'cleared' : ''}`}
            onClick={() => setView({ type: 'stage', key: it.stageKey })}
          >
            <div className={`action-pri ${it.priority}`} />
            <div className="action-body">
              <div className="action-meta">
                <span className="action-stage">{it.stage}</span>
                <span className="action-priority">{it.priority} priority</span>
              </div>
              <div className="action-what">{it.what}</div>
              <div className="action-chips">
                {it.chips.map((c) => (
                  <span key={c.label} className={`chip ${c.tone !== 'normal' ? c.tone : ''}`}>
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="action-money mono">−${it.money.toLocaleString()}</div>
            <button className="btn sm" onClick={(e) => onAct(e, it.id)}>
              {it.action}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
