# Spyne Intelligence Hub

A console for dealership Principals/GMs. The dashboard organizes everything around one central metric — **Time to Sell** — decomposed into the 6 stages of a car's journey from acquisition to delivery.

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
- **The integration filter is real.** Toggle Vini/DMS/CRM/Market off and the corresponding stage cards lock with a "Connect → est. $X/mo recoverable" overlay. This is the sales-demo magic trick AND the customer's daily upsell.

## How to run

Open `index.html` in any modern browser. No build step — single self-contained file with React + Babel via CDN.

## Stack

- React 18 (CDN)
- Babel standalone for in-browser JSX
- Hand-written CSS (no Tailwind, no UI library)
- Inter + JetBrains Mono via Google Fonts
- ~1700 lines, single file

## Tour

1. Land on the page. Read Pulse top-to-bottom in 5 seconds. Time to Sell is the hero.
2. Glance at Trajectory — the "since you joined Spyne" proof.
3. Scan the 6 stage cards. The red borders show where to attack today.
4. Click any stage → deep-dive drawer slides in (ranked bleeds, recovery actions, 30-day trend).
5. Click the Coverage % pill (top right) → toggle integrations off, watch the stages lock.

## Stack of strategy docs (in `/Spyne Intelligence Hub/` of the parent project)

- `Velocity_Insights_Engine.md` — the engine spec (6 insight classes, 53 worked examples, prioritization formula)
- `The_Best_Intelligence_Hub_Vision.md` — the strategic vision (positioning, the suite-vs-portfolio argument, 90-day proof)
- `Velocity_Intelligence_Hub.html` — v1 prototype (10-zone layout · superseded by this)

## Status

v2 prototype · representative mock data · ready for stakeholder demo and design review.
