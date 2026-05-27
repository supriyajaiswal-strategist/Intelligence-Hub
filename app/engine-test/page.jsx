// Engine smoke test — http://localhost:3000/engine-test
// Renders raw engine output so we can verify detectors + scoring + Today
// before wiring to surfaces.

import { runEngine } from '@/lib/engine';

export const dynamic = 'force-dynamic';

export default function EngineTestPage() {
  const result = runEngine();
  const { candidates, today, moneyMeter } = result;

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto', fontFamily: 'var(--font-sans, system-ui), sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
        Engine Smoke Test
      </h1>
      <p style={{ color: '#475569', marginTop: 6, marginBottom: 28 }}>
        Westgate Honda · 5 rule detectors live · Phase 1 / 4 of the Velocity build sequence
      </p>

      {/* Money Meter */}
      <section style={section}>
        <h2 style={h2}>Money Meter</h2>
        <div style={{ fontSize: 42, fontFamily: 'var(--font-mono, monospace)', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: '#dc2626', letterSpacing: '-0.03em' }}>
          ${moneyMeter.total.toLocaleString()}
        </div>
        <div style={{ color: '#475569', fontSize: 13, marginTop: 6 }}>
          decomposed across {moneyMeter.breakdown.length} domain(s)
        </div>
        <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {moneyMeter.breakdown.map((b) => (
            <li key={b.domain} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono, monospace)', fontSize: 13 }}>
              <span style={{ color: '#475569' }}>{b.domain}</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>${b.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Today */}
      <section style={section}>
        <h2 style={h2}>Today · Top 3</h2>
        {today.length === 0 && <em style={{ color: '#94a3b8' }}>no qualifying candidates</em>}
        {today.map((c, i) => (
          <div key={c.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                #{i + 1} · {c.class.replace('_', ' ').toUpperCase()} · {c.domain.replace('_', ' ')}
              </div>
              <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, color: '#94a3b8' }}>score {c.score.toLocaleString()}</div>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: '8px 0 4px', letterSpacing: '-0.01em' }}>{c.headline}</h3>
            <p style={{ margin: 0, color: '#475569', fontSize: 13.5, lineHeight: 1.5 }}>{c.why}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
              {c.numbers.map((n, idx) => (
                <div key={idx} style={numChip}>
                  <span style={{ color: '#94a3b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{n.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontVariantNumeric: 'tabular-nums', fontSize: 15, fontWeight: 700 }}>
                    {n.unit === '$' ? `$${typeof n.value === 'number' ? n.value.toLocaleString() : n.value}` : `${n.value}${n.unit || ''}`}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button style={primaryBtn}>{c.primaryAction.label}</button>
              {c.secondaryActions.map((a, idx) => (
                <button key={idx} style={ghostBtn}>{a.label}</button>
              ))}
            </div>
            <div style={{ marginTop: 12, fontFamily: 'var(--font-mono, monospace)', fontSize: 10.5, color: '#94a3b8', letterSpacing: '0.05em' }}>
              source: {c.martinezRef}
            </div>
          </div>
        ))}
      </section>

      {/* Full candidate dump */}
      <section style={section}>
        <h2 style={h2}>All Candidates · {candidates.length} emitted</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '10px 8px' }}>class</th>
              <th style={{ padding: '10px 8px' }}>domain</th>
              <th style={{ padding: '10px 8px' }}>headline</th>
              <th style={{ padding: '10px 8px', textAlign: 'right' }}>$ impact</th>
              <th style={{ padding: '10px 8px', textAlign: 'right' }}>conf</th>
              <th style={{ padding: '10px 8px', textAlign: 'right' }}>score</th>
            </tr>
          </thead>
          <tbody>
            {candidates.sort((a, b) => b.score - a.score).map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono, monospace)', fontSize: 11 }}>{c.class}</td>
                <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono, monospace)', fontSize: 11 }}>{c.domain}</td>
                <td style={{ padding: '10px 8px' }}>{c.headline}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: 'var(--font-mono, monospace)', fontVariantNumeric: 'tabular-nums' }}>${c.scoreComponents.dollarImpact.toLocaleString()}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: 'var(--font-mono, monospace)', fontVariantNumeric: 'tabular-nums' }}>{c.scoreComponents.confidence.toFixed(2)}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: 'var(--font-mono, monospace)', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{c.score.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const section = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 18 };
const h2      = { fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569', margin: '0 0 14px' };
const cardStyle = { padding: 18, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 12, background: '#fafafa' };
const numChip = { display: 'flex', flexDirection: 'column', gap: 3, padding: '8px 12px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6 };
const primaryBtn = { background: '#0f172a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' };
const ghostBtn   = { background: '#fff', color: '#475569', border: '1px solid #d1d5db', padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' };
