export function ScoreBars({ scores }: { scores: Record<string, number> }) {
  return (
    <div className="score-bars">
      {Object.entries(scores).map(([label, value]) => (
        <div className="score-row" key={label}>
          <div><span>{label}</span><strong>{value}</strong></div>
          <div className="bar-track"><div className="bar-fill" style={{ width: `${value}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
