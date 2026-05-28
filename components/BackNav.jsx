// Shared "Back to Today" nav. Drop at the top of any non-overview view.

export default function BackNav({ setView, right = null }) {
  if (!setView) return null;
  return (
    <nav className="dd-back-nav">
      <button
        className="dd-back-btn"
        onClick={() => setView({ type: 'overview' })}
      >
        ← Back to Today
      </button>
      <div className="dd-back-stagenav">{right}</div>
    </nav>
  );
}
