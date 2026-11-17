import { useEffect } from 'react';
import { Compass, Sparkles, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onStartTour: () => void;
  onExplore: () => void;
}

export function WelcomeModal({ isOpen, onStartTour, onExplore }: WelcomeModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExplore();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onExplore]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs"
      onClick={onExplore}
    >
      <div
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </span>

          <button
            type="button"
            onClick={onExplore}
            aria-label="Tutup dialog selamat datang"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div>
          <h2 id="welcome-dialog-title" className="text-xl font-bold text-[#0F172A] mb-2">
            Selamat datang di Mas_Gum_Ai
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Selamat datang. Dalam 2 menit Anda akan melihat bagaimana alat ini belajar apa yang membuat kreator berjualan, menulis brief, memeriksa draf, dan memerlukan manusia untuk menyetujuinya.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={onStartTour}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl shadow-xs transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <Compass className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Ikuti tur 2 menit</span>
          </button>

          <button
            type="button"
            onClick={onExplore}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-[#0F172A] bg-white border border-slate-200 hover:border-indigo-300 rounded-xl transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            Jelajahi sendiri
          </button>
        </div>
      </div>
    </div>
  );
}
