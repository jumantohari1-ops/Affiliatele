import { Info } from 'lucide-react';

interface FooterProps {
  onOpenAbout: () => void;
}

export function Footer({ onOpenAbout }: FooterProps) {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 mt-14">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs sm:text-sm text-[#64748B]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-semibold text-[#0F172A]">Mas_Gum_Ai Mesin Pembelajaran Afiliasi</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#4F46E5]">@mas_gum_ai</span>
          <span aria-hidden="true">·</span>
          <span>SunnieBooks (SKU ilustratif)</span>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={onOpenAbout}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-indigo-100 border border-indigo-200/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Tentang demo ini</span>
          </button>
        </div>
        <p className="text-[#64748B]">
          Demo ini di-hosting untuk evaluasi. Arsitektur produksi dirancang untuk di-deploy di Microsoft Azure.
        </p>
      </div>
    </footer>
  );
}

