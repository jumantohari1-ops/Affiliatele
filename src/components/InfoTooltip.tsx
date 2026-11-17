import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

export type GlossaryTerm =
  | 'adjustedConversion'
  | 'likelyRange'
  | 'conversion'
  | 'attribution'
  | 'promoCode'
  | 'experimentSlot'
  | 'humanInTheLoop';

const TERM_DEFINITIONS: Record<GlossaryTerm, { label: string; explanation: string }> = {
  adjustedConversion: {
    label: 'Konversi tersesuaikan',
    explanation:
      'Menarik sampel kecil mendekati rata-rata keseluruhan agar rentetan keberuntungan pada beberapa postingan tidak disalahartikan sebagai pemenang sungguhan.',
  },
  likelyRange: {
    label: 'Rentang kemungkinan',
    explanation:
      'Rentang tempat tingkat konversi sebenarnya paling mungkin berada, yang makin sempit seiring bertambahnya jumlah orang yang mengeklik.',
  },
  conversion: {
    label: 'Konversi',
    explanation:
      'Persentase klik tautan yang berubah menjadi pesanan sungguhan (pesanan dibagi klik).',
  },
  attribution: {
    label: 'Atribusi',
    explanation:
      'Mencocokkan setiap penjualan kembali ke postingan kreator yang mendorongnya menggunakan kode promo unik atau tautan terlacak.',
  },
  promoCode: {
    label: 'Kode promo',
    explanation:
      'Kode unik yang diberikan kepada satu kreator di satu platform agar setiap checkout dikreditkan dengan akurat.',
  },
  experimentSlot: {
    label: 'Slot eksperimen',
    explanation:
      'Kombinasi dengan sangat sedikit postingan sejauh ini, disarankan sebagai uji coba kecil berisiko rendah untuk mengumpulkan lebih banyak bukti.',
  },
  humanInTheLoop: {
    label: 'Human-in-the-loop',
    explanation:
      'Setiap draf diperiksa secara otomatis, tetapi orang sungguhan harus meninjau dan menyetujuinya sebelum apa pun tayang.',
  },
};

interface InfoTooltipProps {
  term: GlossaryTerm;
}

export function InfoTooltip({ term }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const info = TERM_DEFINITIONS[term];

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-expanded={open}
        aria-label={`Jelaskan ${info.label}`}
        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[#64748B] hover:text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
      >
        <Info className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 max-w-[80vw] p-3 rounded-xl bg-[#0F172A] text-white text-xs font-normal leading-relaxed shadow-lg z-40 pointer-events-none text-left whitespace-normal"
        >
          <span className="block font-semibold text-indigo-200 mb-0.5">{info.label}</span>
          <span>{info.explanation}</span>
        </span>
      )}
    </span>
  );
}
