'use client';
import { useState } from 'react';

// Stage-aware repair options. Each option is a recovery lever
// the Principal/GM can pull BEFORE auctioning a bleeding unit.
const ACTIONS = {
  procure: [
    { key: 'source', label: 'Source', desc: 'Pull from auction / trade / wholesale' },
    { key: 'rep',    label: 'Email rep', desc: 'Ping wholesale rep for this segment' },
    { key: 'watch',  label: 'Watch',    desc: 'Add to weekly buy list' },
  ],
  golive: [
    { key: 'escalate', label: 'Escalate', desc: 'Push detail / mech up the queue' },
    { key: 'ro',       label: 'Approve RO', desc: 'Sign off on pending repair order' },
    { key: 'clone',    label: 'Use clone photos', desc: 'Publish with library shots, reshoot later' },
  ],
  attract: [
    { key: 'reprice',  label: 'Reprice',   desc: 'Drop $1-2k to enter Top-5 search' },
    { key: 'reshoot',  label: 'Reshoot',   desc: 'Photographer back · raise BTP score' },
    { key: 'remarket', label: 'Re-market', desc: 'Push to CarGurus / FB / AutoTrader' },
    { key: 'promote',  label: 'Promote',   desc: 'Boost on owned channels' },
    { key: 'auction',  label: 'Auction',   desc: 'Last resort — send to wholesale', danger: true },
  ],
  engage: [
    { key: 'mgr',     label: 'Mgr touch', desc: 'Manager personal outreach' },
    { key: 'ai',      label: 'AI follow', desc: 'Re-engage via AI sequence' },
    { key: 'reassign', label: 'Reassign', desc: 'Hand to top-closer rep' },
    { key: 'cold',    label: 'Mark cold', desc: 'Move to nurture pool', danger: true },
  ],
  convert: [
    { key: 'coach',   label: 'Coach rep', desc: 'Save call · listen + debrief' },
    { key: 'to',      label: 'Mgr TO',    desc: 'Force manager turnover' },
    { key: 'save',    label: 'Save call', desc: 'Win-back outreach' },
    { key: 'disc',    label: 'Approve discount', desc: 'Authorize concession' },
  ],
  refill: [
    { key: 'source',  label: 'Source urgent', desc: 'Buy now to refill segment' },
    { key: 'bid',     label: 'Bid auction',  desc: 'Watchlist with active bid' },
    { key: 'tradein', label: 'Target trade', desc: 'Service-drive equity outreach' },
  ],
};

export default function RepairMenu({ stageKey, unitId }) {
  const [logged, setLogged] = useState(null);
  const opts = ACTIONS[stageKey] || [];
  if (!opts.length) return null;

  const onPick = (e, k) => {
    e.stopPropagation();
    setLogged(k);
    setTimeout(() => setLogged(null), 1400);
  };

  return (
    <div className="repair-menu" onClick={(e) => e.stopPropagation()}>
      {opts.map((o) => (
        <button
          key={o.key}
          className={`repair-chip ${o.danger ? 'danger' : ''} ${logged === o.key ? 'logged' : ''}`}
          title={o.desc}
          onClick={(e) => onPick(e, o.key)}
        >
          {logged === o.key ? '✓' : o.label}
        </button>
      ))}
    </div>
  );
}
