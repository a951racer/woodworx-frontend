interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="shared-dialog-overlay" role="presentation" onClick={onCancel}>
      <div
        className="shared-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="shared-dialog__title">{title}</h2>
        <p id="confirm-dialog-message" className="shared-dialog__message">{message}</p>
        <div className="shared-dialog__actions">
          <button
            type="button"
            className="shared-dialog__cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="shared-dialog__confirm"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
