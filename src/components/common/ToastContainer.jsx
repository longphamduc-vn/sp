import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
  };

  const borders = {
    success: 'border-l-4 border-l-[#10B981]',
    warning: 'border-l-4 border-l-[#F59E0B]',
    danger: 'border-l-4 border-l-[#EF4444]',
    info: 'border-l-4 border-l-[#3B82F6]'
  };

  return (
    <div className="fixed bottom-5 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 bg-white p-4 rounded-lg shadow-popover border border-slate-200 ${borders[toast.type] || borders.info} animate-fade-in`}
        >
          {icons[toast.type] || icons.info}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 leading-tight">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
