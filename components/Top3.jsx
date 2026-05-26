'use client';
import { useState } from 'react';
import { TOP3, TOP3_QUEUE } from '@/lib/data';
import { Avatar } from './Atoms';

export default function Top3({ setView }) {
  const [cleared, setCleared] = useState(new Set());
  const [queue, setQueue] = useState(TOP3_QUEUE);
  const [items, setItems] = useState(TOP3);

  const onAct = (id) => {
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
    <div className="top3-wrap">
      <div className="top3-head">
        <div className="top3-h-l">
          <span className="lbl">Top Recovery Actions</span>
          <span className="pill">{items.length} active</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Act → next item slides up</span>
      </div>

      {items.map((it) => (
        <div key={it.id} className={`top3-row ${cleared.has(it.id) ? 'cleared' : ''}`}>
          <span className="t3-rank">#{it.rank}</span>
          <span
            className="t3-stage"
            onClick={() => setView({ type: 'stage', key: it.stageKey })}
          >
            {it.stage}
          </span>
          <div className={`t3-pri ${it.priority}`}>
            <span className="d" />
            <span className="lbl">{it.priority}</span>
          </div>
          <span className="t3-what">{it.what}</span>
          <div className="chips">
            {it.chips.map((c) => (
              <span key={c.label} className={`chip ${c.tone !== 'normal' ? c.tone : ''}`}>{c.label}</span>
            ))}
          </div>
          <span className="t3-money">−${it.money.toLocaleString()}</span>
          <Avatar i={it.owner.i} c={it.owner.c} />
          <button className="btn sm" onClick={() => onAct(it.id)}>
            {it.action} →
          </button>
        </div>
      ))}

      <div className="top3-foot">
        <span>Total at risk: <strong className="mono" style={{ color: 'var(--bad)' }}>−${total.toLocaleString()}</strong></span>
        <span className="total">Recovery potential · act today</span>
      </div>
    </div>
  );
}
