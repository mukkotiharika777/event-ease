import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-elevated max-w-md w-full p-6 border border-border animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 rounded-lg hover:bg-surface-muted transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-4">
          <div className={`p-2.5 rounded-xl shrink-0 ${isDanger ? 'bg-danger-bg text-danger' : 'bg-amber-subtle text-amber-hover'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-ink mb-1.5">{title}</h3>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">{message}</p>
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink bg-surface-muted hover:bg-border rounded-lg transition"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition shadow-subtle ${
                  isDanger ? 'bg-danger hover:bg-red-700' : 'bg-midnight hover:bg-slateBlue'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
