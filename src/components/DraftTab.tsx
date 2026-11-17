import { useMemo } from 'react';
import { Clapperboard, FileEdit, Send, Sparkles, Video } from 'lucide-react';
import {
  DraftTemplateOutput,
  GeneratedBrief,
  evaluateCompliance,
} from '../data/workflowEngine';
import { CompliancePanel } from './CompliancePanel';
import { DimensionChip } from './DimensionChip';
import { InfoTooltip } from './InfoTooltip';
import { TabGuideCallout } from './TabGuideCallout';

interface DraftTabProps {
  activeBrief: GeneratedBrief;
  selectedOptionIndex: 0 | 1 | 2;
  onSelectOptionIndex: (index: 0 | 1 | 2) => void;
  draftOutput: DraftTemplateOutput;
  scriptText: string;
  onChangeScriptText: (val: string) => void;
  onGenerateDraft: () => void;
  onSendToApproval: () => void;
  onGoToBrief: () => void;
  onGoToApproval: () => void;
  killSwitchActive: boolean;
  tourHighlightedTarget?: string;
}

export function DraftTab({
  activeBrief,
  selectedOptionIndex,
  onSelectOptionIndex,
  draftOutput,
  scriptText,
  onChangeScriptText,
  onGenerateDraft,
  onSendToApproval,
  onGoToBrief,
  onGoToApproval,
  killSwitchActive,
  tourHighlightedTarget,
}: DraftTabProps) {
  const compliance = useMemo(() => evaluateCompliance(scriptText), [scriptText]);

  const sendDisabled = killSwitchActive || scriptText.trim().length === 0;
  let sendDisabledReason: string | null = null;
  if (killSwitchActive) {
    sendDisabledReason = 'Kirim ke persetujuan dinonaktifkan: kill switch Administrator sedang aktif.';
  } else if (scriptText.trim().length === 0) {
    sendDisabledReason = 'Kirim ke persetujuan dinonaktifkan: isi teks skrip sebelum mengirim.';
  }

  return (
    <div className="space-y-8">
      <TabGuideCallout
        lookingAt="Skrip, prompt video, dan daftar shot yang siap diedit sudah dimuat untuk Opsi 1, ditambah pemeriksaan merek dan klaim secara langsung."
        whatToTry="Ketik kata berisiko seperti “dijamin” atau “imunitas” di kotak skrip untuk melihat aturan menandainya langsung, atau kirim draf ini ke Persetujuan."
        nextLabel="Berikutnya: tinjau & setujui"
        onNext={onGoToApproval}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Draf &amp; pemeriksaan merek dan klaim langsung
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#64748B] mt-1">
            <span>
              Brief aktif:{' '}
              <span className="font-bold text-[#0F172A]">{activeBrief.creator.creator_id}</span>
            </span>
            <DimensionChip dimension="audience" value={activeBrief.creator.audience} />
            <span>· {activeBrief.creator.main_platform} ·</span>
            <span className="font-mono font-semibold text-[#4F46E5] inline-flex items-center gap-1">
              <span>{activeBrief.promoCode}</span>
              <InfoTooltip term="promoCode" />
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoToBrief}
          className="min-h-[44px] self-start sm:self-auto px-4 py-2 text-xs font-semibold text-[#0F172A] bg-white border border-slate-200 hover:border-indigo-300 rounded-xl transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
        >
          Ubah brief / kreator
        </button>
      </div>

      {/* Option Selector & Generate */}
      <section
        id="draft-controls"
        aria-label="Pemilih opsi brief"
        className={`bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-6 ${
          tourHighlightedTarget === 'draft-controls'
            ? 'ring-2 ring-[#4F46E5] ring-offset-4'
            : ''
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {activeBrief.options.map((opt, idx) => {
              const optionIdx = idx as 0 | 1 | 2;
              const isSelected = selectedOptionIndex === optionIdx;
              return (
                <button
                  key={opt.optionNumber}
                  type="button"
                  onClick={() => onSelectOptionIndex(optionIdx)}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] text-left p-4 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                    isSelected
                      ? 'bg-[#EEF2FF]/70 border-[#4F46E5] ring-2 ring-[#4F46E5]/20 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`font-mono text-xs font-bold ${
                        isSelected ? 'text-[#4F46E5]' : 'text-[#0F172A]'
                      }`}
                    >
                      Opsi {opt.optionNumber}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#64748B] tabular-nums">
                      {(opt.shrunkConversion * 100).toFixed(2).replace('.', ',')}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <DimensionChip dimension="hook" value={opt.hook} />
                    <DimensionChip dimension="format" value={opt.format} />
                    <DimensionChip dimension="offer" value={opt.offer} />
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onGenerateDraft}
            disabled={killSwitchActive}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Buat skrip dan prompt video</span>
          </button>
        </div>

        {killSwitchActive && (
          <p className="text-xs font-semibold text-[#DC2626] mt-3">
            Pembuatan skrip dan pengiriman dinonaktifkan: kill switch Administrator sedang aktif.
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Editable Script + Video Prompt + Shot List */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          <section className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#6D28D9] flex items-center justify-center shrink-0">
                  <FileEdit className="w-4 h-4" aria-hidden="true" />
                </span>
                <label
                  htmlFor="draft-script-editor"
                  className="text-base font-bold text-[#0F172A]"
                >
                  Skrip dan caption
                </label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <DimensionChip dimension="hook" value={draftOutput.hook} />
                <DimensionChip dimension="format" value={draftOutput.format} />
                <DimensionChip dimension="offer" value={draftOutput.offer} />
              </div>
            </div>
            <textarea
              id="draft-script-editor"
              rows={8}
              value={scriptText}
              onChange={(e) => onChangeScriptText(e.target.value)}
              className="w-full p-4 text-sm text-[#0F172A] bg-slate-50 border border-slate-200 rounded-xl leading-relaxed focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F46E5]"
            />
            <p className="text-xs text-[#64748B] mt-2.5">
              Edit baris mana pun di atas untuk menguji pemeriksaan merek dan klaim langsung di sebelah kanan (coba ketik &ldquo;dijamin&rdquo;, &ldquo;imunitas&rdquo;, atau hapus &ldquo;#ad&rdquo;).
            </p>
          </section>

          {/* Video Prompt Card */}
          <section className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">Prompt video (9:16)</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              {draftOutput.videoPrompt}
            </p>
          </section>

          {/* Shot List Card */}
          <section className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 sm:px-6 border-b border-slate-200 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center shrink-0">
                <Clapperboard className="w-4 h-4" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-[#0F172A]">
                Shot list ({draftOutput.format})
              </h3>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-[#64748B]">
                    <th className="py-3 pl-5 pr-3 whitespace-nowrap">Waktu</th>
                    <th className="py-3 px-3 whitespace-nowrap">Shot</th>
                    <th className="py-3 pl-3 pr-5">Catatan visual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {draftOutput.shotList.map((item) => (
                    <tr key={item.timing} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 pl-5 pr-3 font-mono text-xs font-bold text-[#0284C7] tabular-nums whitespace-nowrap align-top">
                        {item.timing}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#0F172A] whitespace-nowrap align-top">
                        {item.shot}
                      </td>
                      <td className="py-3 pl-3 pr-5 text-[#64748B] text-xs sm:text-sm align-top">
                        {item.visualNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right: Sticky Brand and Claims Check & Send to Approval */}
        <div
          id="draft-compliance-card"
          className={`lg:col-span-5 space-y-5 lg:sticky lg:top-16 min-w-0 rounded-2xl ${
            tourHighlightedTarget === 'draft-compliance-card'
              ? 'ring-2 ring-[#4F46E5] ring-offset-4'
              : ''
          }`}
        >
          <CompliancePanel evaluation={compliance} scriptText={scriptText} />

          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 space-y-3">
            <p className="text-xs text-[#64748B] leading-relaxed">
              Draf tidak bisa langsung Disetujui di sini. Mengirim akan menambahkan draf ini ke antrean Persetujuan dengan status{' '}
              <span className="font-bold text-[#0F172A]">Menunggu</span> untuk ditinjau manusia.{' '}
              <InfoTooltip term="humanInTheLoop" />
            </p>
            {sendDisabledReason && (
              <p className="text-xs font-semibold text-[#DC2626]">{sendDisabledReason}</p>
            )}
            <button
              type="button"
              onClick={onSendToApproval}
              disabled={sendDisabled}
              className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>Kirim ke persetujuan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

