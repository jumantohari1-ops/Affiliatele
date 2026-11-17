import { ArrowRight, CheckCircle2, X } from 'lucide-react';

export interface ToastMessage {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:min-w-[360px] sm:max-w-lg z-50"
    >
      <div className="bg-[#0F172A] text-white border border-slate-700 rounded-2xl shadow-xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                onDismiss();
              }}
              className="min-h-[36px] inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-semibold text-white transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              <span>{toast.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Tutup notifikasi"
            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
