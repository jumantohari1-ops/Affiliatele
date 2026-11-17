import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, X } from 'lucide-react';
import { TabId } from './Navbar';

export interface TourStep {
  stepNumber: number;
  tab: TabId;
  targetId?: string;
  title: string;
  description: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    stepNumber: 1,
    tab: 'patterns',
    targetId: 'pattern-table',
    title: 'Lihat kombinasi pemenang teratas',
    description:
      'Kombinasi diurutkan berdasarkan konversi tersesuaikan agar sampel kecil tidak menipu Anda. Coba ganti platform atau buka tabel lengkap.',
  },
  {
    stepNumber: 2,
    tab: 'brief',
    targetId: 'brief-controls',
    title: 'Pilih kreator dan baca brief-nya',
    description:
      'Pilih kreator mana pun (C-001 sampai C-030) untuk melihat 3 opsi hook berperingkat, waktu adegan, pedoman Boleh dan Jangan, serta slot uji coba berisiko rendah.',
  },
  {
    stepNumber: 3,
    tab: 'draft',
    targetId: 'draft-compliance-card',
    title: 'Baca draf & pemeriksaan merek dan klaim',
    description:
      'Edit skrip di sebelah kiri dan lihat pemeriksaan merek dan klaim diperbarui langsung di sini. Klaim berisiko ditandai sebelum apa pun masuk ke persetujuan.',
  },
  {
    stepNumber: 4,
    tab: 'approval',
    targetId: 'approval-queue-section',
    title: 'Periksa D-001, lalu setujui draf yang bersih',
    description:
      'Buka D-001 untuk melihat mengapa Setujui diblokir. Anda bisa memperbaiki kata-katanya dan memeriksa ulang, atau pilih D-002, tambahkan #ad, simpan, lalu setujui.',
  },
  {
    stepNumber: 5,
    tab: 'approval',
    targetId: 'audit-log',
    title: 'Lihat setiap tindakan yang tercatat di log audit',
    description:
      'Setiap draf, suntingan, persetujuan, dan penolakan dicatat di sini lengkap dengan aktor dan cap waktu, siap diekspor sebagai CSV.',
  },
];

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface GuidedTourProps {
  currentStepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onReplay: () => void;
  onClose: () => void;
}

export function GuidedTour({
  currentStepIndex,
  onNext,
  onPrev,
  onReplay,
  onClose,
}: GuidedTourProps) {
  const [completed, setCompleted] = useState(false);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const step = TOUR_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  useEffect(() => {
    setCompleted(false);
  }, [currentStepIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!step?.targetId || completed) {
      setSpotlight(null);
      return;
    }

    let rafId = 0;

    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setViewport({ width: vw, height: vh });

      const el = document.getElementById(step.targetId!);
      if (!el) {
        setSpotlight(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      const pad = 8;
      // Clamp spotlight inside visible viewport bounds nicely
      const left = Math.max(4, rect.left - pad);
      const top = Math.max(4, rect.top - pad);
      const right = Math.min(vw - 4, rect.right + pad);
      const bottom = Math.min(vh - 4, rect.bottom + pad);
      if (right <= left || bottom <= top) {
        setSpotlight(null);
        return;
      }
      setSpotlight({
        top,
        left,
        width: right - left,
        height: bottom - top,
      });
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

    // Measure after AnimatePresence tab transition & smooth scroll settle
    const timer1 = window.setTimeout(scheduleMeasure, 240);
    const timer2 = window.setTimeout(scheduleMeasure, 520);

    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [step?.targetId, currentStepIndex, completed]);

  if (!step) return null;

  // Compute responsive coach-mark position on tablet/desktop
  const isMobile = viewport.width < 640;
  let cardStyle: React.CSSProperties | undefined;

  if (!isMobile && spotlight && !completed) {
    const cardWidth = 390;
    const estimatedCardHeight = 230;
    const clampedLeft = Math.max(
      16,
      Math.min(spotlight.left, viewport.width - cardWidth - 16)
    );

    const spaceBelow = viewport.height - (spotlight.top + spotlight.height);
    const spaceAbove = spotlight.top;

    if (spaceBelow >= estimatedCardHeight + 20) {
      cardStyle = {
        top: Math.min(viewport.height - estimatedCardHeight - 16, spotlight.top + spotlight.height + 14),
        left: clampedLeft,
        width: cardWidth,
      };
    } else if (spaceAbove >= estimatedCardHeight + 20) {
      cardStyle = {
        top: Math.max(16, spotlight.top - estimatedCardHeight - 14),
        left: clampedLeft,
        width: cardWidth,
      };
    } else {
      cardStyle = {
        bottom: 20,
        right: 20,
        width: cardWidth,
      };
    }
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none" aria-live="polite">
      {/* Dimming overlay with SVG spotlight cutout */}
      <svg
        className="w-full h-full pointer-events-none"
        width={viewport.width}
        height={viewport.height}
        aria-hidden="true"
      >
        <defs>
          <mask id="tour-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {spotlight && !completed && (
              <rect
                x={spotlight.left}
                y={spotlight.top}
                width={spotlight.width}
                height={spotlight.height}
                rx="16"
                ry="16"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.52)"
          mask="url(#tour-spotlight-mask)"
        />
        {spotlight && !completed && (
          <rect
            x={spotlight.left}
            y={spotlight.top}
            width={spotlight.width}
            height={spotlight.height}
            rx="16"
            ry="16"
            fill="none"
            stroke="#818CF8"
            strokeWidth="2.5"
          />
        )}
      </svg>

      {/* Coach-Mark Card */}
      <aside
        role="dialog"
        aria-label="Tur terpandu"
        style={cardStyle}
        className={`pointer-events-auto fixed z-50 bg-[#0F172A] text-white border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-5 ${
          isMobile || !cardStyle
            ? 'bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:w-[390px]'
            : ''
        }`}
      >
        {completed ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span className="font-mono text-xs font-bold uppercase tracking-wide">
                  Tur selesai
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup tur terpandu"
                className="min-w-[44px] min-h-[44px] -m-2 flex items-center justify-center text-slate-400 hover:text-white rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Anda sudah melihat seluruh alurnya
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pola &rarr; Brief &rarr; Draf &rarr; Persetujuan Manusia &rarr; Log Audit. Coba edit brief atau draf kreator mana pun sendiri.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCompleted(false);
                  onReplay();
                }}
                className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Putar ulang</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[44px] inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-600 text-slate-100 hover:bg-slate-800 transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              >
                Jelajahi sendiri
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="font-mono text-xs font-semibold text-indigo-300 tabular-nums">
                Tur terpandu · Langkah {step.stepNumber} dari {TOUR_STEPS.length}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup tur terpandu"
                className="min-w-[44px] min-h-[44px] -m-2 flex items-center justify-center text-slate-400 hover:text-white rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">{step.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {step.description}
            </p>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={isFirst}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Kembali</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-3 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-xl transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  Lewati
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isLast) {
                      setCompleted(true);
                    } else {
                      onNext();
                    }
                  }}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                >
                  <span>{isLast ? 'Selesai' : 'Berikutnya'}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

