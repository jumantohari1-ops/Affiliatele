export type DimensionKey = 'hook' | 'format' | 'offer' | 'audience';

export const DIMENSION_STYLES: Record<
  DimensionKey,
  {
    label: string;
    hex: string;
    softHex: string;
    chipClass: string;
    barClass: string;
    cardTintClass: string;
    iconTileClass: string;
    accentTextClass: string;
  }
> = {
  hook: {
    label: 'Hook',
    hex: '#6D28D9',
    softHex: '#EDE9FE',
    chipClass: 'bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]',
    barClass: 'bg-[#6D28D9]',
    cardTintClass: 'border-[#DDD6FE] bg-gradient-to-br from-[#EDE9FE]/50 via-white to-white',
    iconTileClass: 'bg-[#EDE9FE] text-[#6D28D9]',
    accentTextClass: 'text-[#6D28D9]',
  },
  format: {
    label: 'Format',
    hex: '#0284C7',
    softHex: '#E0F2FE',
    chipClass: 'bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]',
    barClass: 'bg-[#0284C7]',
    cardTintClass: 'border-[#BAE6FD] bg-gradient-to-br from-[#E0F2FE]/50 via-white to-white',
    iconTileClass: 'bg-[#E0F2FE] text-[#0284C7]',
    accentTextClass: 'text-[#0284C7]',
  },
  offer: {
    label: 'Penawaran',
    hex: '#DB2777',
    softHex: '#FCE7F3',
    chipClass: 'bg-[#FCE7F3] text-[#DB2777] border border-[#FBCFE8]',
    barClass: 'bg-[#DB2777]',
    cardTintClass: 'border-[#FBCFE8] bg-gradient-to-br from-[#FCE7F3]/50 via-white to-white',
    iconTileClass: 'bg-[#FCE7F3] text-[#DB2777]',
    accentTextClass: 'text-[#DB2777]',
  },
  audience: {
    label: 'Audiens',
    hex: '#0D9488',
    softHex: '#CCFBF1',
    chipClass: 'bg-[#CCFBF1] text-[#0D9488] border border-[#99F6E4]',
    barClass: 'bg-[#0D9488]',
    cardTintClass: 'border-[#99F6E4] bg-gradient-to-br from-[#CCFBF1]/50 via-white to-white',
    iconTileClass: 'bg-[#CCFBF1] text-[#0D9488]',
    accentTextClass: 'text-[#0D9488]',
  },
};

interface DimensionChipProps {
  dimension: DimensionKey;
  value: string;
  showLabel?: boolean;
}

export function DimensionChip({ dimension, value, showLabel = false }: DimensionChipProps) {
  const style = DIMENSION_STYLES[dimension];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold whitespace-nowrap ${style.chipClass}`}
    >
      {showLabel && <span className="opacity-75 font-medium">{style.label}:</span>}
      <span>{value}</span>
    </span>
  );
}
