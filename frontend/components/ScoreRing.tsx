export function ScoreRing({ score, label = "Overall" }: { score: number; label?: string }) {
  const deg = Math.max(0, Math.min(100, score)) * 3.6;
  return (
    <div className="score-ring-wrap">
      <div className="score-ring" style={{ background: `conic-gradient(var(--gold) ${deg}deg, #292824 ${deg}deg)` }}>
        <div><strong>{score}</strong><span>/100</span></div>
      </div>
      <small>{label}</small>
    </div>
  );
}
