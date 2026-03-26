import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState(null);

  const confirm = useCallback((config) => {
    return new Promise((resolve) => {
      setModalConfig({
        ...config,
        isOpen: true,
        onConfirm: () => {
          setModalConfig(null);
          resolve(true);
        },
        onClose: () => {
          setModalConfig(null);
          resolve(false);
        }
      });
    });
  }, []);

  const alert = useCallback((config) => {
    return new Promise((resolve) => {
      setModalConfig({
        ...config,
        isOpen: true,
        confirmText: config.confirmText || 'OK',
        cancelText: null, // No cancel button for alert
        onConfirm: () => {
          setModalConfig(null);
          resolve(true);
        },
        onClose: () => {
          setModalConfig(null);
          resolve(true);
        }
      });
    });
  }, []);

  return (
    <ModalContext.Provider value={{ confirm, alert }}>
      {children}
      {modalConfig && (
        <ConfirmModal
          {...modalConfig}
          onClose={modalConfig.onClose}
        />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
