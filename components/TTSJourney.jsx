'use client';
import { JJ_TTS_STAGES, PULSE } from '@/lib/data';

// JJ's TTS swimlane — 6 equal-width stage cards in a row.
// Each card: stage label, big TAT, target, $bleed. Click → deep-dive.

export default function TTSJourney({ setView }) {
  const overBy = PULSE.timeToSell - PULSE.timeToSellTarget;

  return (
    <section className="tts-v2">
      <header className="tts-head">
        <div>
          <div className="tts-eyebrow">Time to Sell</div>
          <div className="tts-hero">
            <span className="mono">{PULSE.timeToSell}</span>
            <span className="tts-hero-unit">days</span>
          </div>
          <div className="tts-hero-meta">
            <span className={`mono ${overBy > 0 ? 'tone-bad' : 'tone-good'}`}>
              {overBy > 0 ? `↑ ${overBy} over` : `✓`}
            </span>
            <span className="muted">{PULSE.timeToSellTarget}d target</span>
          </div>
        </div>
        <div className="tts-flow-hint muted">
          P → R → V/F → LIVE → LEAD → APT → VISIT → SALE
        </div>
      </header>

      <div className="tts-swim">
        {JJ_TTS_STAGES.map((s, i) => (
          <button
            key={s.key}
            className={`tts-card ${s.status}`}
            onClick={() => setView && setView({ type: 'stage', key: s.key })}
          >
            <div className="tts-card-label">{s.label}</div>
            <div className="tts-card-tat">
              <span className={`tts-card-tat-val mono ${s.status}`}>{s.tat}</span>
              <span className="tts-card-tat-unit">{s.tatUnit}</span>
            </div>
            <div className="tts-card-target mono">target {s.target}{s.tatUnit}</div>
            <div className="tts-card-cost mono">−${(s.cost / 1000).toFixed(s.cost >= 10000 ? 0 : 1)}k</div>
            <div className="tts-card-cost-cadence">{s.costUnit}</div>
            {i < JJ_TTS_STAGES.length - 1 && <div className="tts-card-arrow">→</div>}
          </button>
        ))}
      </div>
    </section>
  );
}
