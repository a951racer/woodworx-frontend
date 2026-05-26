interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading…' }: LoadingSpinnerProps) {
  return (
    <div className="shared-loading" aria-live="polite" aria-busy="true">
      <span className="shared-loading__spinner" aria-hidden="true" />
      <span className="shared-loading__text">{message}</span>
    </div>
  );
}
