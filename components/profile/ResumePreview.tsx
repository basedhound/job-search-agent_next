type Props = {
  fileName: string;
  uploadedAt: string;
  downloadUrl: string;
};

export function ResumePreview({ fileName, uploadedAt, downloadUrl }: Props) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 border border-border"
      style={{
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface-secondary)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-9 h-9 flex-shrink-0"
          style={{
            background: 'var(--color-accent-light)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M10.5 2.25H4.5C3.675 2.25 3 2.925 3 3.75V14.25C3 15.075 3.675 15.75 4.5 15.75H13.5C14.325 15.75 15 15.075 15 14.25V6.75L10.5 2.25Z"
              stroke="var(--color-accent)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.5 2.25V6.75H15"
              stroke="var(--color-accent)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 9.75H12M6 12H9.75"
              stroke="var(--color-accent)"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">{fileName}</p>
          <p className="text-xs text-text-muted">Uploaded {uploadedAt}</p>
        </div>
      </div>

      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-accent hover:opacity-80 transition-opacity px-3 py-1.5 border border-accent"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        Download
      </a>
    </div>
  );
}
