'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import OverviewView from '@/components/views/OverviewView';
import StageView from '@/components/views/StageView';
import InsightsView from '@/components/views/InsightsView';
import DecisionsView from '@/components/views/DecisionsView';
import Copilot from '@/components/Copilot';
import { INT_LABELS } from '@/lib/data';

const DEFAULT_INTS = Object.fromEntries(Object.keys(INT_LABELS).map((k) => [k, true]));

const VIEW_META = {
  overview:  { title: 'Overview',      sub: 'Westgate Honda · full store dashboard' },
  stage:     { title: 'Stage Deep-Dive', sub: 'Click a stage for detailed analysis' },
  insights:  { title: 'Spyne Spotted', sub: 'Cross-stage patterns · AI-detected' },
  decisions: { title: 'Decision Log',  sub: 'Every action · who · when · outcome' },
};

export default function Page() {
  const [view, setView] = useState({ type: 'overview' });
  const [collapsed, setCollapsed] = useState(false);
  const [ints, setInts] = useState(DEFAULT_INTS);
  const [time, setTime] = useState('mtd');

  const meta = VIEW_META[view.type] || VIEW_META.overview;
  const title = view.type === 'stage' && view.key
    ? `Stage: ${view.key.charAt(0).toUpperCase() + view.key.slice(1)}`
    : meta.title;

  return (
    <div className={`shell ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar view={view} setView={setView} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="main">
        <TopBar
          ints={ints}
          setInts={setInts}
          time={time}
          setTime={setTime}
          title={title}
          sub={meta.sub}
        />

        {view.type === 'overview' && <OverviewView ints={ints} setView={setView} />}
        {view.type === 'stage' && <StageView stageKey={view.key} />}
        {view.type === 'insights' && <InsightsView />}
        {view.type === 'decisions' && <DecisionsView />}
      </div>

      <Copilot />
    </div>
  );
}
