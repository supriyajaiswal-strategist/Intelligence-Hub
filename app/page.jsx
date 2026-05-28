'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import OverviewView from '@/components/views/OverviewView';
import StageView from '@/components/views/StageView';
import InsightsView from '@/components/views/InsightsView';
import DecisionsView from '@/components/views/DecisionsView';
import ImpactView from '@/components/views/ImpactView';
import HuddleBriefView from '@/components/views/HuddleBriefView';
import Copilot from '@/components/Copilot';
import { INT_LABELS, JJ_TTS_STAGES } from '@/lib/data';

const DEFAULT_INTS = Object.fromEntries(Object.keys(INT_LABELS).map((k) => [k, true]));

const VIEW_META = {
  overview:  { title: 'Today',         sub: 'Westgate Honda · daily ritual' },
  stage:     { title: 'Stage',         sub: 'Risks, opportunities, levers' },
  insights:  { title: 'Spyne Spotted', sub: 'Cross-stage patterns · AI-detected' },
  decisions: { title: 'Decision Log',  sub: 'Every action · who · when · outcome' },
  impact:    { title: 'Impact',        sub: 'Your business since Spyne went live' },
  huddle:    { title: 'Huddle Brief',  sub: 'Auto-generated · sent at 7:15am' },
};

export default function Page() {
  const [view, setView] = useState({ type: 'overview' });
  const [collapsed, setCollapsed] = useState(false);
  const [ints, setInts] = useState(DEFAULT_INTS);
  const [time, setTime] = useState('mtd');

  const meta = VIEW_META[view.type] || VIEW_META.overview;

  let title = meta.title;
  if (view.type === 'stage' && view.key) {
    const stage = JJ_TTS_STAGES.find((s) => s.key === view.key);
    title = stage ? `${stage.label} · ${stage.name}` : `Stage: ${view.key}`;
  }

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

        {view.type === 'overview'  && <OverviewView setView={setView} />}
        {view.type === 'stage'     && <StageView stageKey={view.key} setView={setView} />}
        {view.type === 'insights'  && <InsightsView />}
        {view.type === 'decisions' && <DecisionsView />}
        {view.type === 'impact'    && <ImpactView />}
        {view.type === 'huddle'    && <HuddleBriefView />}
      </div>

      <Copilot />
    </div>
  );
}
