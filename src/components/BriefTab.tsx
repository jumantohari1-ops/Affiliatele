import {
  ArrowRight,
  Ban,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  FlaskConical,
  Tag,
} from 'lucide-react';
import { SYNTHETIC_DATASET } from '../data/syntheticData';
import { GeneratedBrief } from '../data/workflowEngine';
import { DimensionChip } from './DimensionChip';
import { InfoTooltip } from './InfoTooltip';
import { TabGuideCallout } from './TabGuideCallout';

interface BriefTabProps {
  selectedCreatorId: string;
  onSelectCreatorId: (creatorId: string) => void;
  generatedBrief: GeneratedBrief;
  onGenerateBrief: () => void;
  selectedOptionIndex: 0 | 1 | 2;
  onSelectOptionIndex: (index: 0 | 1 | 2) => void;
  onCreateDraftFromBrief: (brief: GeneratedBrief) => void;
  killSwitchActive: boolean;
  tourHighlightedTarget?: string;
}

function formatPct(val: number): string {
  return `${(val * 100).toFixed(2).replace('.', ',')}%`;
}

export function BriefTab({
  selectedCreatorId,
  onSelectCreatorId,
  generatedBrief,
  onGenerateBrief,
  selectedOptionIndex,
  onSelectOptionIndex,
  onCreateDraftFromBrief,
  killSwitchActive,
  tourHighlightedTarget,
}: BriefTabProps) {
  const creators = SYNTHETIC_DATASET.creators;

  return (
    <div className="space-y-8">
      <TabGuideCallout
        lookingAt="Brief kreator yang sudah terisi menggunakan pola video berkinerja terbaik untuk audiens dan platform kreator ini."
        whatToTry="Ganti kreator (C-001 sampai C-030) atau klik salah satu dari 3 opsi hook berperingkat di bawah, lalu ubah menjadi skrip."
        nextLabel="Berikutnya: tulis draf"
        onNext={() => onCreateDraftFromBrief(generatedBrief)}
      />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
          Pembuat brief kreator
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-1">
          Susun brief kreator terstruktur menggunakan kombinasi pemenang dari tab Pola.
        </p>
      </div>

      {/* Controls */}
      <section
        id="brief-controls"
        aria-label="Pemilihan kreator"
        className={`bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-6 ${
          tourHighlightedTarget === 'brief-controls'
            ? 'ring-2 ring-[#4F46E5] ring-offset-4'
            : ''
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1 min-w-0">
            <label
              htmlFor="creator-select"
              className="block text-xs font-semibold text-[#0F172A] mb-1.5"
            >
              Kreator (C-001 sampai C-030)
            </label>
            <select
              id="creator-select"
              value={selectedCreatorId}
              onChange={(e) => onSelectCreatorId(e.target.value)}
              className="min-h-[44px] w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-[#0F172A] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F46E5]"
            >
              {creators.map((c) => (
                <option key={c.creator_id} value={c.creator_id}>
                  {c.creator_id} — {c.audience} · {c.main_platform}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onGenerateBrief}
            disabled={killSwitchActive}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>Buat brief</span>
          </button>
        </div>
        {killSwitchActive && (
          <p className="text-xs font-semibold text-[#DC2626] mt-2.5">
            Buat brief dinonaktifkan: kill switch Administrator sedang aktif.
          </p>
        )}
      </section>

      {/* Brief Output (Always Ready via Smart Default) */}
      <div className="space-y-6">
        {/* Brief Header */}
        <section className="bg-gradient-to-br from-[#EEF2FF]/60 via-white to-white border border-indigo-200/80 rounded-2xl shadow-sm p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#4F46E5] mb-1">
                SunnieBooks (SKU ilustratif) · Brief template
              </p>
              <h2 className="text-2xl font-bold text-[#0F172A]">
                Brief untuk {generatedBrief.creator.creator_id}
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Dibuat dari{' '}
                <span className="font-mono font-bold text-[#0F172A] tabular-nums">
                  {generatedBrief.similarPostsCount}
                </span>{' '}
                postingan serupa ({generatedBrief.similarPostsScopeLabel})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200/70">
              <div>
                <p className="text-xs text-[#64748B] mb-1">Audiens</p>
                <DimensionChip dimension="audience" value={generatedBrief.creator.audience} />
              </div>
              <div>
                <p className="text-xs text-[#64748B] mb-1">Platform</p>
                <p className="text-sm font-bold text-[#0F172A]">
                  {generatedBrief.creator.main_platform}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] mb-1 inline-flex items-center gap-1">
                  <span>Kode promo</span>
                  <InfoTooltip term="promoCode" />
                </p>
                <p className="font-mono text-sm font-bold text-[#4F46E5]">
                  {generatedBrief.promoCode}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Hook Options as Colourful Selectable Cards */}
        <section aria-labelledby="hook-options-heading" className="space-y-3">
          <div>
            <h3
              id="hook-options-heading"
              className="text-lg font-bold text-[#0F172A] inline-flex items-center gap-1.5"
            >
              <span>Tiga opsi hook diurutkan berdasarkan konversi tersesuaikan</span>
              <InfoTooltip term="adjustedConversion" />
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Pilih kartu opsi untuk mengisi tab Draf terlebih dahulu; angkanya langsung berasal dari tab Pola.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedBrief.options.map((opt, idx) => {
              const optionIdx = idx as 0 | 1 | 2;
              const isSelected = selectedOptionIndex === optionIdx;
              return (
                <button
                  key={opt.optionNumber}
                  type="button"
                  onClick={() => onSelectOptionIndex(optionIdx)}
                  aria-pressed={isSelected}
                  className={`text-left rounded-2xl border p-5 shadow-sm transition-all duration-200 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                    isSelected
                      ? 'border-[#4F46E5] bg-gradient-to-br from-[#EEF2FF]/80 via-white to-white ring-2 ring-[#4F46E5]/20 -translate-y-0.5 shadow-md'
                      : 'border-slate-200/90 bg-white hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-200'
                  }`}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-bold ${
                          isSelected
                            ? 'bg-[#4F46E5] text-white'
                            : 'bg-slate-100 text-[#0F172A]'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
                        <span>Opsi {opt.optionNumber}</span>
                      </span>
                      <span className="font-mono text-xs font-medium text-[#64748B] tabular-nums">
                        {opt.posts} postingan
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <DimensionChip dimension="hook" value={opt.hook} />
                      <DimensionChip dimension="format" value={opt.format} />
                      <DimensionChip dimension="offer" value={opt.offer} />
                    </div>
                  </div>

                  <div className="w-full mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs font-mono tabular-nums">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] font-sans">Konversi tersesuaikan</span>
                      <span className="text-sm font-bold text-[#4F46E5]">
                        {formatPct(opt.shrunkConversion)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] font-sans">Konversi mentah</span>
                      <span className="text-[#0F172A]">{formatPct(opt.rawConversion)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] font-sans">Rentang kemungkinan</span>
                      <span className="text-[#64748B]">
                        {formatPct(opt.ciLow)} – {formatPct(opt.ciHigh)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Vertical Scene Timeline + Offer/Experiment Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Vertical Scene Timeline */}
          <section className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Linimasa adegan ({generatedBrief.options[0].format})
                </h3>
                <p className="text-xs text-[#64748B]">Disesuaikan dengan format Opsi 1</p>
              </div>
            </div>

            <div className="relative pl-6 space-y-5">
              <div
                aria-hidden="true"
                className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-sky-200"
              />
              {generatedBrief.scenes.map((scene) => (
                <div key={scene.timing} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-[#0284C7] border-4 border-[#E0F2FE]"
                  />
                  <span className="inline-block font-mono text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-md tabular-nums mb-1">
                    {scene.timing}
                  </span>
                  <p className="text-sm font-bold text-[#0F172A]">{scene.section}</p>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 leading-relaxed">
                    {scene.direction}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="lg:col-span-5 space-y-5">
            {/* Offer & CTA */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-xl bg-[#FCE7F3] text-[#DB2777] flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold text-[#0F172A]">Penawaran &amp; ajakan bertindak</h3>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">{generatedBrief.offerCta}</p>
            </div>

            {/* Experiment Slot as Amber Callout */}
            <div className="bg-[#FFFBEB] border border-amber-200 rounded-2xl shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                  <FlaskConical className="w-4 h-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] inline-flex items-center gap-1">
                    <span>Slot eksperimen</span>
                    <InfoTooltip term="experimentSlot" />
                  </h3>
                  <p className="text-xs font-semibold text-[#D97706]">
                    {generatedBrief.experimentSlot.label}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                <DimensionChip dimension="hook" value={generatedBrief.experimentSlot.hook} />
                <DimensionChip dimension="format" value={generatedBrief.experimentSlot.format} />
                <DimensionChip dimension="offer" value={generatedBrief.experimentSlot.offer} />
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                Postingan paling sedikit sejauh ini di segmen ini ({generatedBrief.experimentSlot.posts}{' '}
                {generatedBrief.experimentSlot.posts === 1 ? 'post' : 'posts'}). Few posts, treat
                with caution — use only as a small learning test.
              </p>
            </div>
          </section>
        </div>

        {/* Do (Green) / Don't (Red) Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#F0FDF4] border border-emerald-200 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Boleh</h3>
            </div>
            <ul className="space-y-2 text-sm text-emerald-950">
              {generatedBrief.doList.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-1" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#FEF2F2] border border-red-200 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
                <Ban className="w-4 h-4" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Jangan</h3>
            </div>
            <ul className="space-y-2 text-sm text-red-950">
              {generatedBrief.dontList.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Ban className="w-4 h-4 text-[#DC2626] shrink-0 mt-1" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA to Create Draft */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-6">
          <div>
            <p className="text-sm text-[#64748B]">
              Buat skrip template &amp; prompt video untuk{' '}
              <span className="font-bold text-[#0F172A]">{generatedBrief.creator.creator_id}</span>{' '}
              menggunakan <span className="font-semibold text-[#4F46E5]">Opsi {selectedOptionIndex + 1}</span>.
            </p>
            {killSwitchActive && (
              <p className="text-xs font-semibold text-[#DC2626] mt-1">
                Dinonaktifkan: kill switch Administrator sedang aktif.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onCreateDraftFromBrief(generatedBrief)}
            disabled={killSwitchActive}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <span>Buat draf dari brief ini</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

