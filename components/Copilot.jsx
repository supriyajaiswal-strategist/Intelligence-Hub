'use client';
import { useState, useRef, useEffect } from 'react';
import { COPILOT_PRESETS } from '@/lib/data';
import { Icon } from './Atoms';

const INIT = [
  { role: 'ai', text: "I'm watching your store in real time. What do you want to know?" }
];

const AI_REPLIES = {
  default: "I see what you mean. Based on your current data, the biggest lever is your Go Live bottleneck — 9 units at detail is costing you ~$3.3k/day in holding and lost momentum.",
  "time to sell": "Your Time to Sell is 48d vs 35d target. The biggest contributors are Detail (4.2d → 5d+) and Attract (11 zero-lead units). Fix those two and you'd be near target.",
  "wholesale": "Units U23984, U24033, U24011 are Day 76+. My model puts them at <12% close probability. Recommend wholesale send before weekend to capture higher market prices.",
  "risk": "Top risk this week: 3 hot leads (scores 88-82-79) with 24h+ zero touch. Each day without contact drops close probability by ~8%. Manager touch today is the move.",
  "coaching": "For Ravi on close discipline: his demo→write-up rate is 50% vs 65% team target. Pattern shows he stalls when customer mentions 'thinking about it' — recommend a reframe script for that objection.",
};

function getReply(msg) {
  const m = msg.toLowerCase();
  for (const [k, v] of Object.entries(AI_REPLIES)) {
    if (k !== 'default' && m.includes(k)) return v;
  }
  return AI_REPLIES.default;
}

export default function Copilot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(INIT);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  const send = (text) => {
    const t = text || input.trim();
    if (!t) return;
    setMsgs((p) => [...p, { role: 'you', text: t }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((p) => [...p, { role: 'ai', text: getReply(t) }]);
    }, 900 + Math.random() * 600);
  };

  return (
    <>
      <button className="copilot-btn" onClick={() => setOpen((o) => !o)}>
        <span className="dot" />
        Co-pilot
      </button>

      {open && (
        <div className="copilot-panel">
          <div className="copilot-head">
            <div className="icon"><Icon name="sparkle" size={14} /></div>
            <div>
              <div className="name">Spyne Co-pilot</div>
              <div className="sub">Powered by your live data</div>
            </div>
            <button className="close" onClick={() => setOpen(false)}>
              <Icon name="close" size={14} />
            </button>
          </div>

          <div className="copilot-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`copilot-msg ${m.role}`}>{m.text}</div>
            ))}
            {typing && <div className="copilot-msg ai" style={{ opacity: 0.5 }}>…</div>}
          </div>

          {msgs.length < 3 && (
            <div className="copilot-presets">
              {COPILOT_PRESETS.map((p) => (
                <button key={p} className="copilot-preset" onClick={() => send(p)}>{p}</button>
              ))}
            </div>
          )}

          <div className="copilot-input">
            <div className="copilot-input-row">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask anything about your store…"
              />
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)' }} onClick={() => send()}>
                <Icon name="send" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
