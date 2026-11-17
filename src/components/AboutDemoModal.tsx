import { useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface AboutDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutDemoModal({ isOpen, onClose }: AboutDemoModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-demo-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="about-demo-title" className="text-lg font-bold text-[#0F172A]">
                Tentang demo ini
              </h2>
              <p className="text-xs text-[#64748B]">
                Mas_Gum_Ai Mesin Pembelajaran Afiliasi · @mas_gum_ai
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog tentang demo ini"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3 text-sm text-[#0F172A] leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#EEF2FF]/70 border border-indigo-200/80 text-xs sm:text-sm text-[#4338CA] font-medium">
            Demo hanya dengan data sintetis. Tanpa data merek atau konsumen yang sebenarnya.
          </div>

          <p className="text-[#64748B]">
            Dalam demo ini, tag dan pola sudah dihitung sebelumnya dari data sintetis. Pemberian tag oleh LLM adalah bagian dari pilot, bukan demo. Taksonomi yang ditampilkan bersifat ilustratif; taksonomi sebenarnya disepakati dengan merek.
          </p>

          <p className="text-[#64748B]">
            Brief dan draf dihasilkan dari template deterministik yang diisi dengan angka dari Tabel Pola. Penyusunan draf oleh LLM adalah bagian dari pilot, bukan demo.
          </p>

          <p className="text-xs text-[#64748B] pt-2 border-t border-slate-100">
            Demo ini di-hosting untuk evaluasi. Arsitektur produksi dirancang untuk di-deploy di Microsoft Azure.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
