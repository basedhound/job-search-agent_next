type Props = {
  linkedInConnected?: boolean;
};

export function ConnectedAccounts({ linkedInConnected = false }: Props) {
  return (
    <div
      className="bg-surface border border-border"
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
      }}
    >
      <h2 className="text-base font-semibold text-text-primary mb-1">Connected Accounts</h2>
      <p className="text-sm text-text-secondary mb-4">
        Connect your LinkedIn so the agent handles manual apply with LinkedIn workflows.
      </p>

      <div className="flex items-center justify-between py-3 border-t border-border">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 flex-shrink-0"
            style={{
              background: 'var(--color-linkedin)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M4.5 6.75H2.25V15.75H4.5V6.75Z"
                fill="white"
              />
              <circle cx="3.375" cy="4.125" r="1.125" fill="white" />
              <path
                d="M15.75 15.75H13.5V11.25C13.5 10.2 12.825 9.75 12 9.75C11.175 9.75 10.5 10.35 10.5 11.25V15.75H8.25V6.75H10.5V7.875C10.95 7.125 11.925 6.75 12.75 6.75C14.4 6.75 15.75 7.95 15.75 10.125V15.75Z"
                fill="white"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">LinkedIn</p>
            <p className="text-xs text-text-muted">
              {linkedInConnected ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </div>

        {linkedInConnected ? (
          <button
            type="button"
            className="text-sm font-medium px-4 py-2 border border-border text-text-secondary hover:bg-surface-secondary transition-colors"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            Disconnect
          </button>
        ) : (
          <button
            type="button"
            className="text-sm font-medium px-4 py-2 text-white hover:opacity-90 transition-opacity"
            style={{
              background: 'var(--color-linkedin)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Connect LinkedIn
          </button>
        )}
      </div>
    </div>
  );
}
