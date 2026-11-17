import { Info, Sparkles } from 'lucide-react';

interface TopBannerProps {
  onOpenAbout: () => void;
}

export function TopBanner({ onOpenAbout }: TopBannerProps) {
  return (
    <div
      role="banner"
      className="sticky top-0 z-40 px-4 py-1 bg-[#F5F7FF]/95 backdrop-blur-md border-b border-indigo-100/80 flex justify-center"
    >
      <button
        type="button"
        onClick={onOpenAbout}
        aria-label="Demo hanya dengan data sintetis. Buka informasi tentang demo ini"
        className="min-h-[44px] inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF2FF] hover:bg-indigo-100/80 border border-indigo-200/80 text-xs font-medium text-[#4338CA] text-center shadow-2xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" aria-hidden="true" />
        <span>Demo hanya dengan data sintetis. Tanpa data merek atau konsumen yang sebenarnya.</span>
        <span className="inline-flex items-center gap-1 font-semibold underline decoration-indigo-300 underline-offset-2 shrink-0">
          <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Tentang demo ini</span>
        </span>
      </button>
    </div>
  );
}

