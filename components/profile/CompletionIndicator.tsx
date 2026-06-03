type Props = {
  percentage: number;
  missingFields: string[];
};

export function CompletionIndicator({ percentage, missingFields }: Props) {
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div
      className="w-full border"
      style={{
        background: 'rgba(255, 137, 4, 0.05)',
        borderColor: 'rgba(255, 137, 4, 0.2)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 24px',
      }}
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 1.5L14.5 13.5H1.5L8 1.5Z"
                stroke="var(--color-warning)"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <path d="M8 6V9.5" stroke="var(--color-warning)" strokeWidth="1.25" strokeLinecap="round" />
              <circle cx="8" cy="11.5" r="0.75" fill="var(--color-warning)" />
            </svg>
            <span className="text-sm font-semibold text-text-primary">Profile needs attention</span>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            Complete the required fields to improve your chances of getting hired and generating quality resumes.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {missingFields.map((field) => (
              <span
                key={field}
                className="text-xs font-medium uppercase tracking-wide px-2.5 py-1"
                style={{
                  background: 'rgba(255, 137, 4, 0.12)',
                  color: 'var(--color-warning)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {field}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 relative" style={{ width: 80, height: 80 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold text-text-primary">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
