const CONFETTI_COLORS = [
  '#f59e0b',
  '#22c55e',
  '#3b82f6',
  '#ec4899',
  '#8b5cf6',
  '#ef4444',
  '#14b8a6',
  '#f97316',
];

function CompletionCelebration({ title, allCompleted }) {
  return (
    <div
      className={`celebration ${allCompleted ? 'celebration-all' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="confetti" aria-hidden="true">
        {CONFETTI_COLORS.map((color, index) => (
          <span
            key={`${color}-${index}`}
            style={{
              '--confetti-index': index,
              '--confetti-color': color,
              left: `${8 + index * 12}%`,
            }}
          />
        ))}
      </div>
      <span className="celebration-icon" aria-hidden="true">
        {allCompleted ? '🏆' : '🎉'}
      </span>
      <div className="celebration-content">
        <strong>{allCompleted ? 'Hoàn thành tất cả!' : 'Tuyệt vời!'}</strong>
        <span>
          {allCompleted
            ? 'Bạn đã hoàn thành toàn bộ công việc.'
            : `Bạn đã hoàn thành “${title}”.`}
        </span>
      </div>
    </div>
  );
}

export default CompletionCelebration;
