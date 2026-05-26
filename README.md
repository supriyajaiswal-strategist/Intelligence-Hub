# Spyne Intelligence Hub

A Next.js console for dealership Principals/GMs. Organizes everything around one central metric — **Time to Sell** — decomposed into the 6 stages of a car's journey from acquisition to delivery.

## What's on the screen

| Section | What it answers |
|---|---|
| **Filter strip** | Which Spyne integrations are connected · click any chip to toggle live |
| **Pulse** (5 KPIs) | Am I going to make my number? Time to Sell is the hero tile |
| **Trajectory** | What has Spyne done for me since I joined? (4-month delta) |
| **Spyne Spotted** | A cross-stage pattern the GM couldn't compute themselves |
| **Time-to-Sell Journey** (6 stages) | Where am I bleeding time? Tap any stage for deep-dive |
| **Top 3 Recovery Actions** | What do I do today to recover gross? (recovery — never abandonment) |
| **Big Move** | What's my highest-leverage move this week? |

## The 6 stages

1. **Procure** — sourcing · do I have the right mix?
2. **Go Live** — recon → photo → published · am I publishing fast?
3. **Attract** — pricing + merchandising · are leads coming?
4. **Engage** — lead → first touch · am I responding fast?
5. **Convert** — lead → appt → show → sold · am I closing?
6. **Refill** — sale → next acquisition · am I replacing what sold?

Each stage card shows: TAT (actual vs target) · data-driven bleed visualization · $ at stake · one recovery action.

## Design rules

- **Data speaks, not narrative.** Every "bleed" is a chart, bars, or chips of numbers. No prose paragraphs on the surface.
- **Recovery, not abandonment.** Action verbs are *Escalate · Reprice · Reshoot · Manager touch · Build buy list*. Auction is the last resort, buried in deep-dive.
- **Status via color, not text.** Five colors total: neutral · accent · good · warn · bad.
- **Monospace numerics throughout.** Financial-grade precision feel.
- **The integration filter is real.** Toggle Vini/DMS/CRM/Market off and the corresponding stage cards lock with a "Connect → est. $X/mo recoverable" overlay.

## Stack

- Next.js 14 (App Router)
- React 18
- next/font for Inter + JetBrains Mono (self-hosted at build)
- Hand-written CSS (no Tailwind, no UI library)
- Plain JavaScript (JSX, no TypeScript)

## Project structure

```
/
├── app/
│   ├── layout.jsx       # root layout + fonts
│   ├── page.jsx         # main dashboard (client component)
│   └── globals.css      # all styles
├── components/
│   ├── FilterStrip.jsx  # top integration filter + dropdown
│   ├── Pulse.jsx        # 5-KPI strip
│   ├── Trajectory.jsx   # since-you-joined-Spyne deltas
│   ├── Spotted.jsx      # cross-stage pattern strip
│   ├── Journey.jsx      # 6-stage container
│   ├── StageCard.jsx    # individual stage card
│   ├── StageViz.jsx     # 6 viz types (segments, pipeline, attract, histogram, funnel, queue)
│   ├── StageDrawer.jsx  # deep-dive drawer on click
│   ├── Top3.jsx         # priority actions table
│   ├── BigMove.jsx      # strategic move card
│   └── Atoms.jsx        # Avatar, Sparkline, LockedCard
└── lib/
    └── data.js          # all mock data (single source of truth)
```

## Run locally

```bash
npm install
npm run dev
# opens at http://localhost:3000
```

## Deploy

Auto-deploys on push to `main` via Vercel. Production URL set up in the Vercel dashboard.

## Tour

1. Land on the page — read Pulse top-to-bottom in 5 seconds. Time to Sell is the hero.
2. Glance at Trajectory — the "since you joined Spyne" proof.
3. Scan the 6 stage cards. The red borders show where to attack today.
4. Click any stage → deep-dive drawer slides in (ranked bleeds, recovery actions, 30-day trend).
5. Click the Coverage % pill (top right) → toggle integrations off, watch the stages lock.

## Companion strategy docs

Lives in `~/code/Spyne Intelligence Hub/`:
- `Velocity_Insights_Engine.md` — engine spec (6 insight classes, 53 worked examples, prioritization formula)
- `The_Best_Intelligence_Hub_Vision.md` — strategic vision (positioning, suite-vs-portfolio thesis, 90-day proof)
- `Velocity_Intelligence_Hub.html` — v1 prototype (10-zone layout, superseded by this Next.js version)

## Status

v2 prototype · representative mock data · ready for stakeholder demo and design review.
