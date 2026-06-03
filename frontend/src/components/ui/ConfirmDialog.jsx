import Modal from './Modal';

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm', message = 'Are you sure?', confirmLabel = 'Confirm', variant = 'danger' }) {
  const btnColors = {
    danger: 'bg-red-600 hover:bg-red-700',
    primary: 'bg-indigo-600 hover:bg-indigo-700',
  };

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${btnColors[variant] || btnColors.danger}`}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
