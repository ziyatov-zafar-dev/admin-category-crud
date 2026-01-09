
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onClose, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fade-in" 
        onClick={!isLoading ? onClose : undefined} 
      />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl animate-slide-up overflow-hidden border border-slate-100 dark:border-slate-800 p-8 text-center">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <i className="fas fa-exclamation-triangle text-3xl text-rose-500 animate-bounce-subtle"></i>
        </div>
        
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Yo'q
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-[1.5] px-6 py-4 rounded-2xl font-bold bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <i className="fas fa-spinner fa-spin"></i>}
            Ha, o'chirilsin
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
