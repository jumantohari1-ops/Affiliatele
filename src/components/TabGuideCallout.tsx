import { ArrowRight, RotateCcw } from 'lucide-react';

interface TabGuideCalloutProps {
  lookingAt: string;
  whatToTry: string;
  nextLabel: string;
  onNext: () => void;
  isReplay?: boolean;
}

export function TabGuideCallout({
  lookingAt,
  whatToTry,
  nextLabel,
  onNext,
  isReplay = false,
}: TabGuideCalloutProps) {
  return (
    <section
      aria-label="Panduan halaman"
      className="bg-[#EEF2FF]/75 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
    >
      <div className="space-y-1.5 text-sm min-w-0">
        <p className="text-[#0F172A]">
          <span className="font-bold text-[#4F46E5]">Yang sedang Anda lihat: </span>
          <span>{lookingAt}</span>
        </p>
        <p className="text-[#64748B]">
          <span className="font-semibold text-[#0F172A]">Yang bisa dicoba: </span>
          <span>{whatToTry}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
      >
        {isReplay ? (
          <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
        ) : (
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        )}
        <span>{nextLabel}</span>
      </button>
    </section>
  );
}
