
import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-500 text-white shadow-emerald-500/20',
    error: 'bg-rose-500 text-white shadow-rose-500/20',
    info: 'bg-brand-500 text-white shadow-brand-500/20',
    warning: 'bg-amber-500 text-white shadow-amber-500/20',
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle',
  };

  return (
    <div
      onClick={onClose}
      className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl animate-slide-up cursor-pointer hover:scale-105 transition-transform duration-200 ${styles[toast.type]}`}
    >
      <i className={`fas ${icons[toast.type]} text-lg`}></i>
      <span className="font-semibold text-sm">{toast.message}</span>
    </div>
  );
};

export default Toast;
