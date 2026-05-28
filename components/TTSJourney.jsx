'use client';
import { JJ_TTS_STAGES, PULSE } from '@/lib/data';

// JJ's Time to Sell journey, rendered as 6 data-rich cards.
// Each card carries a stage-specific mini-diagram that makes the WHY visible.

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
              {overBy > 0 ? `${overBy} days over target` : 'on target'}
            </span>
            <span className="muted">target {PULSE.timeToSellTarget}d</span>
          </div>
        </div>
      </header>

      <div className="tts-swim">
        {JJ_TTS_STAGES.map((s) => (
          <article
            key={s.key}
            className="tts-card"
            onClick={() => setView && setView({ type: 'stage', key: s.key })}
            role="button"
            tabIndex={0}
          >
            <header className="tts-card-head">
              <h3 className="tts-card-name">{s.name}</h3>
              <p className="tts-card-summary muted">{s.summary}</p>
            </header>

            <div className="tts-card-numbers">
              <div className="tts-card-tat-block">
                <div className={`tts-card-tat-val ${s.status}`}>
                  {s.tat}<span className="tts-card-tat-unit">{s.tatUnit}</span>
                </div>
                <div className="tts-card-tat-target muted">
                  target {s.target}{s.tatUnit}
                </div>
              </div>
              <div className={`tts-card-over ${s.status}`}>
                +{s.deltaOver}{s.tatUnit} over
              </div>
            </div>

            <StageViz stage={s} />

            <div className="tts-card-bottom">
              <div className="tts-card-tagline">{s.bottomTagline}</div>
              <div className="tts-card-cost-row">
                <span className="tts-card-cost">−${(s.cost / 1000).toFixed(s.cost >= 10000 ? 0 : 1)}k</span>
                <span className="muted tts-card-cost-cadence">{s.costUnit}</span>
                <span className="tts-card-cta muted">Explore →</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ───────────────── Stage-specific mini diagrams ─────────────────

function StageViz({ stage }) {
  switch (stage.vizType) {
    case 'recon_pipeline':     return <ReconPipeline data={stage.vizData} />;
    case 'publish_flow':       return <PublishFlow   data={stage.vizData} />;
    case 'issue_bars':         return <IssueBars     data={stage.vizData} />;
    case 'response_histogram': return <ResponseHist  data={stage.vizData} />;
    case 'show_rate_donut':    return <ShowRateDonut data={stage.vizData} />;
    case 'conversion_funnel':  return <ConvFunnel    data={stage.vizData} />;
    default: return null;
  }
}

// TTF — recon pipeline with bottleneck cell highlighted
function ReconPipeline({ data }) {
  return (
    <div className="viz-recon">
      <div className="viz-recon-pipe">
        {data.stages.map((s, i) => (
          <div key={s.name} className={`viz-recon-cell ${s.bottleneck ? 'bottleneck' : ''}`}>
            <div className="viz-recon-count">{s.count}</div>
            <div className="viz-recon-name muted">{s.name}</div>
            {s.bottleneck && (
              <div className="viz-recon-badge">{s.slaBreachX}× SLA</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// TTL — three-bucket flow with the dark bucket highlighted
function PublishFlow({ data }) {
  return (
    <div className="viz-publish">
      {data.buckets.map((b, i) => (
        <div key={b.name} className={`viz-publish-step ${b.status} ${b.highlight ? 'highlight' : ''}`}>
          <div className="viz-publish-count">{b.count}</div>
          <div className="viz-publish-name">{b.name}</div>
          {b.sub && <div className="viz-publish-sub muted">{b.sub}</div>}
        </div>
      ))}
    </div>
  );
}

// GEN — horizontal bars showing units by issue, biggest highlighted
function IssueBars({ data }) {
  const max = Math.max(...data.issues.map((i) => i.count));
  return (
    <div className="viz-issues">
      {data.issues.map((iss) => (
        <div key={iss.name} className="viz-issue-row">
          <div className="viz-issue-name muted">{iss.name}</div>
          <div className="viz-issue-track">
            <div className={`viz-issue-fill ${iss.severity}`} style={{ width: `${(iss.count / max) * 100}%` }} />
          </div>
          <div className="viz-issue-count">{iss.count}</div>
        </div>
      ))}
    </div>
  );
}

// APT C — response-time histogram, SLA mark
function ResponseHist({ data }) {
  const max = Math.max(...data.buckets.map((b) => b.count));
  return (
    <div className="viz-resp">
      <div className="viz-resp-bars">
        {data.buckets.map((b, i) => (
          <div key={b.label} className="viz-resp-col">
            <div className="viz-resp-bar-wrap">
              <div className={`viz-resp-bar ${b.status}`} style={{ height: `${(b.count / max) * 100}%` }}>
                <span className="viz-resp-bar-n">{b.count}</span>
              </div>
            </div>
            <div className="viz-resp-label muted">{b.label}</div>
          </div>
        ))}
      </div>
      <div className="viz-resp-sla muted">5-min SLA cutoff</div>
    </div>
  );
}

// VISIT — donut comparing show rate vs benchmark
function ShowRateDonut({ data }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const yourArc = (data.yourShowRate / 100) * c;
  return (
    <div className="viz-donut">
      <svg viewBox="0 0 100 100" className="viz-donut-svg">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e6ebf1" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="var(--st-warn)" strokeWidth="10"
          strokeDasharray={`${yourArc} ${c}`}
          strokeDashoffset={c / 4}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="48" textAnchor="middle" className="viz-donut-num">{data.yourShowRate}%</text>
        <text x="50" y="62" textAnchor="middle" className="viz-donut-sub">show rate</text>
      </svg>
      <div className="viz-donut-side">
        <div className="viz-donut-row">
          <span className="muted">benchmark</span>
          <span className="viz-donut-row-v">{data.benchmark}%</span>
        </div>
        <div className="viz-donut-row">
          <span className="muted">no-shows · wk</span>
          <span className="viz-donut-row-v">{data.noShowsLastWeek}</span>
        </div>
        <div className="viz-donut-row">
          <span className="muted">Sat share</span>
          <span className="viz-donut-row-v tone-warn">{data.satNoShowShare}%</span>
        </div>
      </div>
    </div>
  );
}

// SELL CONV — funnel rates with bottleneck step highlighted
function ConvFunnel({ data }) {
  return (
    <div className="viz-funnel">
      {data.steps.map((s) => {
        const gap = s.rate - s.benchmark;
        return (
          <div key={s.name} className={`viz-funnel-row ${s.bottleneck ? 'bottleneck' : ''}`}>
            <div className="viz-funnel-name">{s.name}</div>
            <div className="viz-funnel-track">
              <div className="viz-funnel-fill" style={{ width: `${s.rate}%` }} />
              <div className="viz-funnel-bench" style={{ left: `${s.benchmark}%` }} title={`benchmark ${s.benchmark}%`} />
            </div>
            <div className={`viz-funnel-pct ${s.bottleneck ? 'tone-bad' : ''}`}>{s.rate}%</div>
          </div>
        );
      })}
    </div>
  );
}
