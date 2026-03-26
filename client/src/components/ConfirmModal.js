import React from 'react';
import Modal from './Modal';
import { AlertCircle, Trash2, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning' | 'info'
  isLoading = false
}) => {
  const icons = {
    danger: <Trash2 className="h-6 w-6 text-danger-600" />,
    warning: <AlertCircle className="h-6 w-6 text-warning-600" />,
    info: <HelpCircle className="h-6 w-6 text-primary-600" />
  };

  const bgColors = {
    danger: 'bg-danger-100',
    warning: 'bg-warning-100',
    info: 'bg-primary-100'
  };

  const confirmBtnStyles = {
    danger: 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500',
    warning: 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-500',
    info: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showClose={false}
      size="sm"
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className={clsx(
          "flex items-center justify-center h-12 w-12 rounded-full mb-4",
          bgColors[type]
        )}>
          {icons[type]}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Message */}
        {message && (
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            {message}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={clsx(
              "flex-1 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all active:scale-95 disabled:opacity-50",
              confirmBtnStyles[type]
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
