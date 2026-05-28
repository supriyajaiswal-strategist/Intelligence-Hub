import { BIG_MOVE_LANDING } from '@/lib/data';

export default function BigMove() {
  const bm = BIG_MOVE_LANDING;
  return (
    <section className="bigmove-v2">
      <div className="bigmove-v2-eyebrow">This week's biggest move</div>
      <h2 className="bigmove-v2-headline">{bm.headline}</h2>

      <div className="bigmove-v2-numbers">
        {bm.reasonNumbers.map((n) => (
          <div key={n.label} className="bigmove-v2-num">
            <span className="muted mono section-eyebrow">{n.label}</span>
            <span className="mono bigmove-v2-num-v">{n.value}</span>
          </div>
        ))}
      </div>

      <div className="bigmove-v2-upside">
        <span className="mono tone-good">+${bm.upside.toLocaleString()}</span>
        <span className="muted"> · {bm.upsideNote}</span>
      </div>

      <div className="bigmove-v2-actions">
        <button className="btn-primary-v2">{bm.primaryLabel}</button>
        <button className="btn-ghost-v2">{bm.secondaryLabel}</button>
      </div>
    </section>
  );
}
