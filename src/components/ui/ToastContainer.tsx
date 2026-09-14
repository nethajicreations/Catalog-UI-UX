import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-200 backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-white border-emerald-800/60 shadow-emerald-950/30'
              : toast.type === 'error'
              ? 'bg-rose-950/90 text-white border-rose-800/60 shadow-rose-950/30'
              : 'bg-neutral-900/90 text-white border-neutral-700/60 shadow-black/30'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
          </div>
          <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-white/60 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
