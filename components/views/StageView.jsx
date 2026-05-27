import { STAGES, STAGE_UNITS } from '@/lib/data';
import { StageVizSwitch } from '../StageViz';
import { Sparkline } from '../Atoms';
import RepairMenu from '../RepairMenu';

const STAGE_ICONS = { procure: '📦', golive: '👁', attract: '✨', engage: '📞', convert: '🎯', refill: '🔄' };

function UnitTable({ stageKey }) {
  const units = STAGE_UNITS[stageKey] || [];
  if (!units.length) return null;

  if (stageKey === 'golive') {
    return (
      <table className="unit-table">
        <thead><tr><th>Stock</th><th>Vehicle</th><th>Stage</th><th>Days</th><th>Owner</th><th className="repair-th">Repair</th></tr></thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.stock}>
              <td className="mono-cell">{u.stock}</td>
              <td>{u.car}</td>
              <td><span className="badge-warn">{u.stage}</span></td>
              <td className="mono-cell"><span className={u.days >= 7 ? 'badge-bad' : 'badge-warn'}>{u.days}d</span></td>
              <td>{u.owner}</td>
              <td><RepairMenu stageKey={stageKey} unitId={u.stock} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (stageKey === 'engage') {
    return (
      <table className="unit-table">
        <thead><tr><th>Name</th><th>Score</th><th>Vehicle</th><th>Source</th><th>Aged</th><th>Stage</th><th className="repair-th">Repair</th></tr></thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.name}>
              <td>{u.name}</td>
              <td className="mono-cell">{u.score}</td>
              <td>{u.vehicle}</td>
              <td className="mono-cell">{u.source}</td>
              <td className="mono-cell"><span className="badge-bad">{u.aged}</span></td>
              <td><span className="badge-warn">{u.stage}</span></td>
              <td><RepairMenu stageKey={stageKey} unitId={u.name} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (stageKey === 'convert') {
    return (
      <table className="unit-table">
        <thead><tr><th>Name</th><th>Stage</th><th>Mgr TO</th><th>Rep</th><th>Vehicle</th><th>Days</th><th className="repair-th">Repair</th></tr></thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.name}>
              <td>{u.name}</td>
              <td><span className="badge-warn">{u.stage}</span></td>
              <td><span className={u.mgrTO === 'No' ? 'badge-bad' : 'badge-good'}>{u.mgrTO}</span></td>
              <td>{u.salesperson}</td>
              <td>{u.vehicle}</td>
              <td className="mono-cell">{u.days}d</td>
              <td><RepairMenu stageKey={stageKey} unitId={u.name} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (stageKey === 'procure') {
    return (
      <table className="unit-table">
        <thead><tr><th>Segment</th><th>Need</th><th>Source</th><th>Candidates</th><th>ETA</th><th className="repair-th">Repair</th></tr></thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.id}>
              <td>{u.segment}</td>
              <td className="mono-cell">{u.target} units</td>
              <td>{u.source}</td>
              <td className="mono-cell"><span className="badge-good">{u.candidates}</span></td>
              <td className="mono-cell">{u.eta}</td>
              <td><RepairMenu stageKey={stageKey} unitId={u.id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (stageKey === 'attract') {
    return (
      <table className="unit-table">
        <thead><tr><th>Stock</th><th>Vehicle</th><th>Age</th><th>VDP</th><th>Leads</th><th>Price</th><th>Issue</th><th className="repair-th">Repair</th></tr></thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.stock}>
              <td className="mono-cell">{u.stock}</td>
              <td>{u.car}</td>
              <td className="mono-cell"><span className={u.age > 21 ? 'badge-bad' : 'badge-warn'}>{u.age}d</span></td>
              <td className="mono-cell">{u.vdp}</td>
              <td className="mono-cell">{u.leads}</td>
              <td><span className={u.price === 'over' ? 'badge-warn' : 'badge-good'}>{u.price}</span></td>
              <td style={{ fontSize: 11, color: 'var(--text-2)' }}>{u.issue}</td>
              <td><RepairMenu stageKey={stageKey} unitId={u.stock} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (stageKey === 'refill') {
    return (
      <table className="unit-table">
        <thead><tr><th>Segment</th><th>Sold</th><th>Queued</th><th>Source</th><th className="repair-th">Repair</th></tr></thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.id}>
              <td>{u.sold}</td>
              <td className="mono-cell">{u.soldCount}</td>
              <td className="mono-cell"><span className={u.queue === 0 ? 'badge-bad' : u.queue < u.soldCount ? 'badge-warn' : 'badge-good'}>{u.queue}</span></td>
              <td style={{ fontSize: 11, color: 'var(--text-2)' }}>{u.replacement}</td>
              <td><RepairMenu stageKey={stageKey} unitId={u.id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return null;
}

export default function StageView({ stageKey }) {
  const stage = STAGES.find((s) => s.key === stageKey);
  if (!stage) return null;

  const pctile = stage.peerPercentile;
  const ppTone = pctile < 25 ? 'bad' : pctile < 50 ? 'warn' : 'good';

  return (
    <div className="canvas">
      {/* Header */}
      <div className="dd-header">
        <div className="dd-h-row">
          <div className="dd-h-l">
            <h2>{STAGE_ICONS[stage.key]} {stage.num} · {stage.name}</h2>
            <div className="sub">{stage.subtitle}</div>
          </div>
          <button className="btn ghost sm">↗ Export stage</button>
        </div>
        <div className="dd-stats">
          <div className="dd-stat">
            <div className="l">Current TAT</div>
            <div className={`v ${stage.status}`}>{stage.tat}{stage.tatUnit || 'd'}</div>
          </div>
          <div className="dd-stat">
            <div className="l">Target</div>
            <div className="v accent">{stage.target}{stage.tatUnit || 'd'}</div>
          </div>
          <div className="dd-stat">
            <div className="l">Delta</div>
            <div className={`v ${stage.status}`}>{stage.delta}</div>
          </div>
          <div className="dd-stat">
            <div className="l">Peer Median</div>
            <div className="v">{stage.peerMedian}{stage.tatUnit || 'd'}</div>
          </div>
          <div className="dd-stat">
            <div className="l">Peer Rank</div>
            <div className={`v ${ppTone}`}>p{pctile}</div>
          </div>
          <div className="dd-stat">
            <div className="l">Cost of Delay</div>
            <div className="v bad">−${stage.cost.toLocaleString()}{stage.costUnit}</div>
          </div>
        </div>
      </div>

      <div className="dd-grid">
        {/* Left: bleeds + units */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="dd-card">
            <h3>Ranked Bleeds</h3>
            {stage.bleeds.map((b, i) => (
              <div key={i} className="bleed-row">
                <span className="bleed-rank">{i + 1}</span>
                <div>
                  <div className="bleed-name">{b.name}</div>
                  <div className="bleed-detail">{b.detail}</div>
                </div>
                <span className="bleed-impact">{b.impact ? `−$${b.impact.toLocaleString()}` : '—'}</span>
              </div>
            ))}
          </div>

          <div className="dd-card">
            <div className="dd-card-head">
              <h3>Units in Stage — repair before auction</h3>
              <span className="dd-card-hint">Pick a lever per unit. Auction is last resort.</span>
            </div>
            <UnitTable stageKey={stageKey} />
          </div>
        </div>

        {/* Right: viz + trend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="dd-card">
            <h3>Stage Visualization</h3>
            <div style={{ padding: '8px 0' }}>
              <StageVizSwitch vizType={stage.vizType} viz={stage.viz} />
            </div>
          </div>

          <div className="dd-card">
            <h3>30-Day TAT Trend</h3>
            <div className="trend-wrap">
              <div className="trend-head">
                <span className="l">TAT over 30 days</span>
                <span className="v">{stage.tat}{stage.tatUnit || 'd'} today</span>
              </div>
              <Sparkline
                data={stage.trend30d}
                w={320}
                h={48}
                color={stage.status === 'bad' ? 'var(--bad)' : stage.status === 'warn' ? 'var(--warn)' : 'var(--good)'}
              />
            </div>
          </div>

          <div className="dd-card">
            <h3>Recommended Action</h3>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 12 }}>
              {stage.action}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 16, lineHeight: 1.5 }}>
              {stage.bleeds[0]?.detail}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn">{stage.action}</button>
              <button className="btn ghost">Log decision</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
