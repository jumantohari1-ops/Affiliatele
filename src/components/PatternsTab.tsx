import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Filter,
  MessageSquareQuote,
  Store,
  Tag,
  Users,
  Video,
} from 'lucide-react';
import {
  PlatformFilter,
  SYNTHETIC_DATASET,
  analyzePatterns,
  computePlatformSummaries,
} from '../data/syntheticData';
import { DIMENSION_STYLES, DimensionChip, DimensionKey } from './DimensionChip';
import { InfoTooltip } from './InfoTooltip';
import { TabGuideCallout } from './TabGuideCallout';

const FILTER_OPTIONS: PlatformFilter[] = ['Semua', 'TikTok Shop', 'Shopee Video'];

function formatPercent(val: number): string {
  return `${(val * 100).toFixed(2).replace('.', ',')}%`;
}

function formatNumber(val: number): string {
  return val.toLocaleString('id-ID');
}

function formatVnd(val: number): string {
  return `${val.toLocaleString('id-ID')} VND`;
}

const DIMENSION_ICONS: Record<DimensionKey, typeof MessageSquareQuote> = {
  hook: MessageSquareQuote,
  format: Video,
  offer: Tag,
  audience: Users,
};

interface PatternsTabProps {
  tourHighlightedTarget?: string;
  onNextBrief: () => void;
}

export function PatternsTab({ tourHighlightedTarget, onNextBrief }: PatternsTabProps) {
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('Semua');
  const [showAllCombinations, setShowAllCombinations] = useState<boolean>(false);

  const analysis = useMemo(
    () => analyzePatterns(SYNTHETIC_DATASET.posts, platformFilter),
    [platformFilter]
  );

  const platformSummaries = useMemo(
    () => computePlatformSummaries(SYNTHETIC_DATASET.posts),
    []
  );

  const topThree = analysis.topPatterns.slice(0, 3);

  const maxDimensionConversion = useMemo(() => {
    let maxVal = 0.08;
    for (const dim of analysis.dimensions) {
      for (const item of dim.values) {
        if (item.conversion > maxVal) maxVal = item.conversion;
      }
    }
    return maxVal * 1.1;
  }, [analysis.dimensions]);

  const maxShrunkConversion = useMemo(() => {
    let maxVal = 0.08;
    for (const row of analysis.topPatterns) {
      if (row.shrunkConversion > maxVal) maxVal = row.shrunkConversion;
    }
    return maxVal * 1.08;
  }, [analysis.topPatterns]);

  return (
    <div className="space-y-9">
      <TabGuideCallout
        lookingAt="Apa yang berhasil di 900 postingan kreator sintetis — menunjukkan kombinasi hook, format video, penawaran, dan audiens mana yang paling laku."
        whatToTry="Ganti filter platform antara TikTok Shop dan Shopee Video, atau buka tabel lengkap di bawah grafik."
        nextLabel="Berikutnya: buat brief"
        onNext={onNextBrief}
      />

      {/* Header & Platform Filter */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Pembelajaran pola &amp; kombinasi pemenang
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Dataset sintetis deterministik (seed 42) · 30 kreator · 90 hari · SunnieBooks (SKU ilustratif)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
            <Filter className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" aria-hidden="true" />
            <span>Filter platform</span>
          </span>
          <div
            role="group"
            aria-label="Filter berdasarkan platform"
            className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl overflow-x-auto max-w-full"
          >
            {FILTER_OPTIONS.map((option) => {
              const active = platformFilter === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPlatformFilter(option)}
                  aria-pressed={active}
                  className={`min-h-[44px] sm:min-h-0 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                    active
                      ? 'bg-[#4F46E5] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/80'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <section aria-label="Metrik kinerja utama" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
          <p className="text-xs font-semibold text-[#64748B]">Postingan</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-1.5 font-mono tabular-nums">
            {formatNumber(analysis.kpis.posts)}
          </p>
          <p className="text-xs text-[#64748B] mt-1">{platformFilter}</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
          <p className="text-xs font-semibold text-[#64748B]">Klik</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-1.5 font-mono tabular-nums">
            {formatNumber(analysis.kpis.clicks)}
          </p>
          <p className="text-xs text-[#64748B] mt-1">Klik tautan terlacak</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
          <p className="text-xs font-semibold text-[#64748B]">Pesanan</p>
          <p className="text-2xl font-bold text-[#0F172A] mt-1.5 font-mono tabular-nums">
            {formatNumber(analysis.kpis.orders)}
          </p>
          <p className="text-xs text-[#64748B] mt-1">Pesanan teratribusi</p>
        </div>
        <div className="bg-white border border-indigo-200/90 rounded-2xl shadow-sm p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-[#EEF2FF]/60 via-white to-white">
          <p className="text-xs font-semibold text-[#4F46E5] inline-flex items-center gap-1">
            <span>Konversi</span>
            <InfoTooltip term="conversion" />
          </p>
          <p className="text-2xl font-bold text-[#4F46E5] mt-1.5 font-mono tabular-nums">
            {formatPercent(analysis.kpis.conversion)}
          </p>
          <p className="text-xs text-[#64748B] mt-1">Pesanan / klik</p>
        </div>
      </section>

      {/* Top 3 Winning Combinations (Lead Cards) */}
      <section aria-labelledby="top3-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h2 id="top3-heading" className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            3 kombinasi pemenang teratas
          </h2>
          <span className="text-xs sm:text-sm text-[#64748B] inline-flex items-center gap-1">
            <span>Peringkat berdasarkan konversi tersesuaikan · {platformFilter}</span>
            <InfoTooltip term="adjustedConversion" />
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topThree.map((row) => {
            const isFirst = row.rank === 1;
            return (
              <article
                key={`top3-${row.rank}`}
                className={`rounded-2xl border p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                  isFirst
                    ? 'border-[#4F46E5] bg-gradient-to-br from-[#EEF2FF]/70 via-white to-white'
                    : 'border-slate-200/90 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono tabular-nums ${
                        isFirst
                          ? 'bg-[#4F46E5] text-white'
                          : 'bg-slate-100 text-[#0F172A]'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>#{row.rank}</span>
                    </span>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {row.lowSample && (
                        <span className="inline-block rounded-lg px-2 py-0.5 text-[11px] font-semibold bg-[#FEF3C7] text-[#D97706] border border-amber-200">
                          Postingan sedikit, gunakan dengan hati-hati
                        </span>
                      )}
                      <span className="font-mono text-xs font-semibold text-[#64748B] tabular-nums">
                        {row.posts} postingan
                      </span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-xs font-medium text-[#64748B] inline-flex items-center gap-1">
                      <span>Konversi tersesuaikan</span>
                      <InfoTooltip term="adjustedConversion" />
                    </p>
                    <p
                      className={`text-3xl sm:text-4xl font-bold font-mono tabular-nums mt-0.5 ${
                        isFirst ? 'text-[#4F46E5]' : 'text-[#0F172A]'
                      }`}
                    >
                      {formatPercent(row.shrunkConversion)}
                    </p>
                    <p className="text-xs text-[#64748B] font-mono tabular-nums mt-1 flex flex-wrap items-center gap-1">
                      <span>
                        Mentah {formatPercent(row.rawConversion)} · Rentang kemungkinan:{' '}
                        {formatPercent(row.ciLow)}–{formatPercent(row.ciHigh)}
                      </span>
                      <InfoTooltip term="likelyRange" />
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                  <DimensionChip dimension="hook" value={row.hook} />
                  <DimensionChip dimension="format" value={row.format} />
                  <DimensionChip dimension="offer" value={row.offer} />
                  <DimensionChip dimension="audience" value={row.audience} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Top 10 Horizontal Bar Chart + Collapsible Pattern Table */}
      <div
        id="pattern-table"
        className={`space-y-5 scroll-mt-24 rounded-2xl ${
          tourHighlightedTarget === 'pattern-table'
            ? 'ring-2 ring-[#4F46E5] ring-offset-4'
            : ''
        }`}
      >
        <section
          aria-labelledby="top10-chart-heading"
          className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-7"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
            <div>
              <h2 id="top10-chart-heading" className="text-xl font-bold text-[#0F172A] inline-flex items-center gap-1.5">
                <span>10 kombinasi teratas berdasarkan konversi tersesuaikan</span>
                <InfoTooltip term="adjustedConversion" />
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Konversi tersesuaikan menarik sampel kecil mendekati rata-rata agar rentetan keberuntungan tidak disalahartikan sebagai pemenang.
              </p>
            </div>
            <span className="text-xs font-mono text-[#64748B] tabular-nums whitespace-nowrap">
              {analysis.totalEligibleCombos} kombinasi dengan ≥ 3 postingan
            </span>
          </div>

          <div className="space-y-3.5">
            {analysis.topPatterns.map((row) => {
              const isWinner = row.rank === 1;
              const widthPct = Math.min(100, (row.shrunkConversion / maxShrunkConversion) * 100);
              return (
                <div
                  key={`chart-${row.hook}-${row.format}-${row.offer}-${row.audience}`}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:gap-4 items-center p-2.5 rounded-xl transition-colors ${
                    isWinner ? 'bg-[#EEF2FF]/60' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="lg:col-span-6 flex flex-wrap items-center gap-1.5 min-w-0">
                    <span
                      className={`font-mono text-xs font-bold tabular-nums w-7 shrink-0 ${
                        isWinner ? 'text-[#4F46E5]' : 'text-[#64748B]'
                      }`}
                    >
                      #{row.rank}
                    </span>
                    <DimensionChip dimension="hook" value={row.hook} />
                    <DimensionChip dimension="format" value={row.format} />
                    <DimensionChip dimension="offer" value={row.offer} />
                    <DimensionChip dimension="audience" value={row.audience} />
                  </div>

                  <div className="lg:col-span-4 flex items-center">
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isWinner ? 'bg-[#4F46E5]' : 'bg-indigo-300'
                        }`}
                        style={{ width: `${widthPct.toFixed(1)}%` }}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-2 flex items-center justify-between lg:justify-end gap-2">
                    {row.lowSample && (
                      <span className="inline-block rounded-lg px-2 py-0.5 text-[10px] font-semibold bg-[#FEF3C7] text-[#D97706] border border-amber-200 whitespace-nowrap">
                        Postingan sedikit, gunakan dengan hati-hati
                      </span>
                    )}
                    <span
                      className={`font-mono text-xs sm:text-sm tabular-nums ${
                        isWinner ? 'font-bold text-[#4F46E5]' : 'font-semibold text-[#0F172A]'
                      }`}
                    >
                      {formatPercent(row.shrunkConversion)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[#64748B]">
              {showAllCombinations
                ? 'Menampilkan tabel lengkap 10 kombinasi teratas dengan konversi mentah dan rentang kemungkinan.'
                : 'Buka tabel lengkap untuk memeriksa postingan, konversi mentah, dan rentang kemungkinan.'}
            </span>
            <button
              type="button"
              onClick={() => setShowAllCombinations((prev) => !prev)}
              aria-expanded={showAllCombinations}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-indigo-100/80 border border-indigo-200/80 rounded-xl transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              <span>{showAllCombinations ? 'Sembunyikan tabel kombinasi' : 'Lihat semua kombinasi'}</span>
              {showAllCombinations ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </section>

        {/* Collapsible Full Pattern Table */}
        {showAllCombinations && (
          <section
            aria-labelledby="pattern-table-heading"
            className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <h2 id="pattern-table-heading" className="text-xl font-bold text-[#0F172A]">
                  Semua 10 kombinasi teratas (hook × format × penawaran × audiens)
                </h2>
                <span className="text-xs text-[#64748B] font-mono tabular-nums">
                  10 teratas dari {analysis.totalEligibleCombos} kombinasi dengan ≥ 3 postingan
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Konversi tersesuaikan menarik sampel kecil mendekati rata-rata agar rentetan keberuntungan tidak disalahartikan sebagai pemenang.
              </p>
            </div>

            <div className="w-full overflow-x-auto max-h-[520px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                  <tr className="text-xs font-semibold text-[#64748B]">
                    <th className="py-3.5 pl-5 pr-3 whitespace-nowrap">Peringkat</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Hook</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Format</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Penawaran</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Audiens</th>
                    <th className="py-3.5 px-3 text-right whitespace-nowrap">Postingan</th>
                    <th className="py-3.5 px-3 text-right whitespace-nowrap">Konversi mentah</th>
                    <th className="py-3.5 px-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 justify-end">
                        <span>Rentang kemungkinan</span>
                        <InfoTooltip term="likelyRange" />
                      </span>
                    </th>
                    <th className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 justify-end">
                        <span>Konversi tersesuaikan</span>
                        <InfoTooltip term="adjustedConversion" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analysis.topPatterns.map((row) => {
                    const isTop = row.rank === 1;
                    return (
                      <tr
                        key={`${row.hook}-${row.format}-${row.offer}-${row.audience}`}
                        className={
                          isTop
                            ? 'bg-[#EEF2FF]/60 hover:bg-[#EEF2FF] transition-colors'
                            : 'hover:bg-slate-50/80 transition-colors'
                        }
                      >
                        <td
                          className={`py-3.5 pl-5 pr-3 font-mono text-xs font-bold tabular-nums whitespace-nowrap ${
                            isTop ? 'text-[#4F46E5]' : 'text-[#64748B]'
                          }`}
                        >
                          #{row.rank}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <DimensionChip dimension="hook" value={row.hook} />
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <DimensionChip dimension="format" value={row.format} />
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <DimensionChip dimension="offer" value={row.offer} />
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <DimensionChip dimension="audience" value={row.audience} />
                        </td>
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            {row.lowSample && (
                              <span className="inline-block rounded-lg px-2 py-0.5 text-[11px] font-semibold bg-[#FEF3C7] text-[#D97706] border border-amber-200">
                                Postingan sedikit, gunakan dengan hati-hati
                              </span>
                            )}
                            <span className="font-mono text-[#0F172A] tabular-nums">
                              {row.posts}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                          {formatPercent(row.rawConversion)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-xs text-[#64748B] tabular-nums whitespace-nowrap">
                          {formatPercent(row.ciLow)} – {formatPercent(row.ciHigh)}
                        </td>
                        <td
                          className={`py-3.5 pl-3 pr-5 text-right font-mono tabular-nums whitespace-nowrap ${
                            isTop ? 'font-bold text-[#4F46E5]' : 'font-semibold text-[#4F46E5]'
                          }`}
                        >
                          {formatPercent(row.shrunkConversion)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* Four Coloured Dimension Summary Cards */}
      <section aria-labelledby="dimensions-heading" className="space-y-4">
        <div>
          <h2 id="dimensions-heading" className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Konversi menurut dimensi kreatif
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 inline-flex items-center gap-1 flex-wrap">
            <span>Setiap dimensi memakai warna yang konsisten di chip, bar, dan brief</span>
            <span>(Rentang kemungkinan ditampilkan di bawah setiap bar).</span>
            <InfoTooltip term="likelyRange" />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {analysis.dimensions.map((dim) => {
            const style = DIMENSION_STYLES[dim.key];
            const Icon = DIMENSION_ICONS[dim.key];
            return (
              <article
                key={dim.key}
                className={`border rounded-2xl shadow-sm p-5 sm:p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${style.cardTintClass}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.iconTileClass}`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-bold text-[#0F172A]">{dim.label}</h3>
                </div>

                <div className="space-y-4">
                  {dim.values.map((item, idx) => {
                    const widthPct = Math.min(
                      100,
                      (item.conversion / maxDimensionConversion) * 100
                    );
                    const isTop = idx === 0;
                    return (
                      <div key={item.value} className="space-y-1.5">
                        <div className="flex items-baseline justify-between gap-3">
                          <span
                            className={`text-sm ${
                              isTop ? 'font-bold text-[#0F172A]' : 'font-medium text-slate-700'
                            }`}
                          >
                            {item.value}
                          </span>
                          <span
                            className={`font-mono text-sm font-bold tabular-nums shrink-0 ${
                              isTop ? style.accentTextClass : 'text-[#0F172A]'
                            }`}
                          >
                            {formatPercent(item.conversion)}
                          </span>
                        </div>

                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isTop ? style.barClass : `${style.barClass} opacity-45`
                            }`}
                            style={{ width: `${widthPct.toFixed(1)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#64748B] font-mono tabular-nums">
                          <span>{item.posts} postingan</span>
                          <span>
                            Rentang kemungkinan: {formatPercent(item.ciLow)} – {formatPercent(item.ciHigh)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Did the engine find the planted winners? */}
      <section aria-labelledby="recovery-heading" className="space-y-4">
        <div>
          <h2 id="recovery-heading" className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Apakah mesin menemukan pemenang yang ditanam?
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Pola-pola ini sengaja disembunyikan di dalam data sintetis untuk memastikan mesin menemukan sinyal yang nyata, bukan menebak.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysis.recoveryRows.map((row) => {
            const dimKey = (({ hook: 'hook', format: 'format', penawaran: 'offer', audiens: 'audience' } as Record<string, DimensionKey>)[row.dimension.toLowerCase()] ?? 'hook') as DimensionKey;
            return (
              <article
                key={row.dimension}
                className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <DimensionChip dimension={dimKey} value={row.dimension} />
                    {row.match ? (
                      <span
                        title="Cocok"
                        className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0"
                      >
                        <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : (
                      <span
                        title="Meleset"
                        className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0"
                      >
                        <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#64748B]">Pemenang yang ditanam</p>
                  <p className="text-base font-bold text-[#0F172A] mb-2">{row.plantedWinner}</p>

                  <p className="text-xs text-[#64748B]">Ditemukan mesin</p>
                  <p className="text-sm font-semibold text-[#0F172A]">{row.recoveredWinner}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-[#0F172A] tabular-nums">
                    +{(row.liftVsRest * 100).toFixed(1).replace('.', ',')}% dibanding sisanya
                  </span>
                  <span
                    className={`font-semibold ${
                      row.match ? 'text-[#16A34A]' : 'text-[#D97706]'
                    }`}
                  >
                    {row.match ? 'Cocok' : 'Meleset'}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <p className="text-sm text-[#0F172A] bg-[#EEF2FF]/70 border border-indigo-200/80 rounded-xl px-4 py-3">
          Kombinasi peringkat #1 memuat{' '}
          <span className="font-bold text-[#4F46E5] tabular-nums">
            {analysis.topComboPlantedMatches} dari 4
          </span>{' '}
          pemenang yang ditanam.
        </p>
      </section>

      {/* Platform Comparison as Two Side-by-Side Cards */}
      <section aria-labelledby="platform-table-heading" className="space-y-4">
        <div>
          <h2 id="platform-table-heading" className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Per platform, tidak dirata-ratakan
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Biaya dan komisi akan digabung dengan pendapatan dalam pilot, sehingga ROI dihitung per kanal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {platformSummaries.map((row) => (
            <article
              key={row.platform}
              className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">{row.platform}</h3>
                    <p className="text-xs text-[#64748B] font-mono tabular-nums">
                      {formatNumber(row.posts)} postingan
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#64748B] inline-flex items-center justify-end gap-1">
                    <span>Konversi</span>
                    <InfoTooltip term="conversion" />
                  </p>
                  <p className="text-2xl font-bold font-mono text-[#4F46E5] tabular-nums">
                    {formatPercent(row.conversion)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs sm:text-sm">
                <div>
                  <p className="text-xs text-[#64748B]">Klik</p>
                  <p className="font-mono font-semibold text-[#0F172A] tabular-nums mt-0.5">
                    {formatNumber(row.clicks)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Pesanan</p>
                  <p className="font-mono font-semibold text-[#0F172A] tabular-nums mt-0.5">
                    {formatNumber(row.orders)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Pendapatan</p>
                  <p className="font-mono font-semibold text-[#0F172A] tabular-nums mt-0.5">
                    {formatVnd(row.revenue)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
