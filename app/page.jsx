'use client';

import { useState } from 'react';
import { STORE, PULSE } from '@/lib/data';
import FilterStrip from '@/components/FilterStrip';
import Pulse from '@/components/Pulse';
import Trajectory from '@/components/Trajectory';
import Spotted from '@/components/Spotted';
import Journey from '@/components/Journey';
import Top3 from '@/components/Top3';
import BigMove from '@/components/BigMove';
import StageDrawer from '@/components/StageDrawer';

export default function Home() {
  const [integrations, setIntegrations] = useState({
    studio: true, vini: true, dms: true, crm: true, market: true, web: true,
  });
  const [ddOpen, setDdOpen] = useState(false);
  const [drawerStage, setDrawerStage] = useState(null);

  const handleOutsideClick = (e) => {
    if (ddOpen && !e.target.closest('.fl-dropdown') && !e.target.closest('.cov-pill')) {
      setDdOpen(false);
    }
  };

  return (
    <div onClick={handleOutsideClick}>
      <FilterStrip
        integrations={integrations}
        setIntegrations={setIntegrations}
        ddOpen={ddOpen}
        setDdOpen={setDdOpen}
      />
      <div className="page">
        <div className="greet">
          <div>
            <h1>Good morning, Marcus</h1>
            <div className="sub">
              {STORE.date} · <strong>{PULSE.daysLeft} selling days left</strong> ·{' '}
              <strong style={{ color: 'var(--accent)' }}>3 recovery actions</strong> worth{' '}
              <strong>$7,460</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn ghost">Brief team</button>
            <button className="btn">Morning huddle ▾</button>
          </div>
        </div>

        <Pulse />
        <Trajectory />
        <Spotted integrations={integrations} />
        <Journey integrations={integrations} onStageClick={setDrawerStage} />
        <Top3 />
        <BigMove />
      </div>

      {drawerStage && <StageDrawer stage={drawerStage} onClose={() => setDrawerStage(null)} />}
    </div>
  );
}
