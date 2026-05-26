'use client';
import { useState } from 'react';
import { INT_LABELS, INT_DESC, TIME_RANGES } from '@/lib/data';
import { Icon } from './Atoms';

const ALL_INTS = Object.keys(INT_LABELS);

export default function TopBar({ ints, setInts, time, setTime, title, sub }) {
  const [open, setOpen] = useState(false);
  const onCount = ALL_INTS.filter((k) => ints[k]).length;
  const allOn = onCount === ALL_INTS.length;

  const toggle = (k) => setInts((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="topbar">
      <div className="tb-left">
        <div>
          <div className="tb-title">{title}</div>
          {sub && <div className="tb-sub">{sub}</div>}
        </div>
        <div className="int-chips">
          {ALL_INTS.map((k) => (
            <button key={k} className={`int-chip ${ints[k] ? '' : 'off'}`} onClick={() => toggle(k)}>
              <span className="d" />
              {INT_LABELS[k]}
            </button>
          ))}
        </div>
      </div>
      <div className="tb-right">
        <div className="time-ctrl">
          {TIME_RANGES.map((r) => (
            <button key={r.k} className={`time-btn ${time === r.k ? 'active' : ''}`} onClick={() => setTime(r.k)}>
              {r.label}
            </button>
          ))}
        </div>
        <button className={`cov-pill ${allOn ? '' : 'partial'}`} onClick={() => setOpen((o) => !o)}>
          <Icon name="settings" size={12} />
          {onCount}/{ALL_INTS.length} connected
        </button>
      </div>

      {open && (
        <div className="tb-dropdown">
          <h4>Integrations</h4>
          <div className="sub">Toggle to simulate which data is connected</div>
          {ALL_INTS.map((k) => (
            <div key={k} className="tg-row">
              <div className="tg-info">
                <div className="name">{INT_LABELS[k]}</div>
                <div className="desc">{INT_DESC[k]}</div>
              </div>
              <button className={`tg ${ints[k] ? 'on' : ''}`} onClick={() => toggle(k)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
