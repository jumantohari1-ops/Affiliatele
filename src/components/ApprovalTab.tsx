import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  History,
  Info,
  Lock,
  OctagonAlert,
  Save,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {
  ApprovalQueueItem,
  ApprovalStatus,
  AuditLogEntry,
  REJECTION_REASONS,
  RejectionReason,
  evaluateCompliance,
} from '../data/workflowEngine';
import { CompliancePanel } from './CompliancePanel';
import { DimensionChip } from './DimensionChip';
import { InfoTooltip } from './InfoTooltip';
import { TabGuideCallout } from './TabGuideCallout';

interface ApprovalTabProps {
  queue: ApprovalQueueItem[];
  selectedItemId: string;
  onSelectItemId: (id: string) => void;
  onSaveEdit: (id: string, updatedScript: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: RejectionReason) => void;
  onExportCsv: () => void;
  onReplayTour: () => void;
  auditLog: AuditLogEntry[];
  killSwitchActive: boolean;
  tourHighlightedTarget?: string;
}

type QueueFilter = 'Semua' | ApprovalStatus;

const QUEUE_FILTERS: QueueFilter[] = ['Semua', 'Menunggu', 'Disetujui', 'Ditolak'];

const AUTONOMY_LADDER = [
  {
    level: 'L0',
    name: 'Manual',
    description: 'Tim memberi tag pada postingan, menulis brief, dan menyusun skrip tanpa template mesin.',
    current: false,
  },
  {
    level: 'L1',
    name: 'AI menyusun draf, manusia menyetujui setiap item',
    description:
      'Demo ini: draf & brief template; gerbang persetujuan manusia wajib untuk setiap item.',
    current: true,
  },
  {
    level: 'L2',
    name: 'Persetujuan otomatis berisiko rendah (opsi pilot mendatang)',
    description: 'Draf bersih tanpa penanda bisa dipercepat dengan pengambilan sampel berkala oleh manusia.',
    current: false,
  },
  {
    level: 'L3',
    name: 'Publikasi otonom (di luar lingkup)',
    description: 'Tidak digunakan untuk kanal afiliasi merek & konsumen yang diatur regulasi.',
    current: false,
  },
];

function QueueStatusChip({ status }: { status: ApprovalStatus }) {
  if (status === 'Disetujui') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-200 bg-[#DCFCE7] text-xs font-bold text-[#16A34A] whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Disetujui</span>
      </span>
    );
  }
  if (status === 'Ditolak') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-200 bg-[#FEE2E2] text-xs font-bold text-[#DC2626] whitespace-nowrap">
        <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Ditolak</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-200 bg-[#FEF3C7] text-xs font-bold text-[#D97706] whitespace-nowrap">
      <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>Menunggu</span>
    </span>
  );
}

export function ApprovalTab({
  queue,
  selectedItemId,
  onSelectItemId,
  onSaveEdit,
  onApprove,
  onReject,
  onExportCsv,
  onReplayTour,
  auditLog,
  killSwitchActive,
  tourHighlightedTarget,
}: ApprovalTabProps) {
  const [statusFilter, setStatusFilter] = useState<QueueFilter>('Semua');

  const filteredQueue = useMemo(() => {
    if (statusFilter === 'Semua') return queue;
    return queue.filter((item) => item.status === statusFilter);
  }, [queue, statusFilter]);

  const selectedItem =
    filteredQueue.find((item) => item.id === selectedItemId) ?? filteredQueue[0] ?? null;

  const [editDraftText, setEditDraftText] = useState(selectedItem?.scriptAndCaption ?? '');
  const [rejectReason, setRejectReason] = useState<RejectionReason | ''>('');

  useEffect(() => {
    if (selectedItem) {
      setEditDraftText(selectedItem.scriptAndCaption);
      setRejectReason('');
    }
  }, [selectedItem?.id, selectedItem?.scriptAndCaption]);

  const isPending = selectedItem?.status === 'Menunggu';
  const hasUnsavedChanges =
    selectedItem !== null && editDraftText !== selectedItem.scriptAndCaption;

  const liveOrSavedEvaluation = selectedItem
    ? isPending && hasUnsavedChanges
      ? evaluateCompliance(editDraftText)
      : selectedItem.compliance
    : null;

  const approveDisabled =
    !selectedItem ||
    !isPending ||
    killSwitchActive ||
    selectedItem.compliance.hasBlocking ||
    hasUnsavedChanges;

  const pendingCount = queue.filter((q) => q.status === 'Menunggu').length;
  const approvedCount = queue.filter((q) => q.status === 'Disetujui').length;
  const rejectedCount = queue.filter((q) => q.status === 'Ditolak').length;

  let disabledReasonMessage: string | null = null;
  if (selectedItem && isPending) {
    if (killSwitchActive) {
      disabledReasonMessage =
        'Setujui dinonaktifkan: kill switch Administrator sedang aktif.';
    } else if (selectedItem.compliance.hasBlocking) {
      disabledReasonMessage =
        'Setujui dinonaktifkan: perbaiki klaim yang memblokir terlebih dahulu, lalu klik “Simpan suntingan dan periksa ulang” (atau tolak draf ini).';
    } else if (hasUnsavedChanges) {
      disabledReasonMessage =
        'Setujui dinonaktifkan: klik “Simpan suntingan dan periksa ulang” untuk memverifikasi suntingan Anda terlebih dahulu.';
    }
  }

  return (
    <div className="space-y-8">
      <TabGuideCallout
        lookingAt="Gerbang keamanan oleh manusia. Draf dengan klaim yang diblokir tidak dapat disetujui sebelum seseorang mengedit dan memeriksanya ulang, dan setiap tindakan dicatat di log audit di bawah."
        whatToTry="Periksa D-001 untuk melihat mengapa Setujui dinonaktifkan, hapus kata-kata yang diblokir lalu klik “Simpan suntingan dan periksa ulang”, atau pilih D-002 untuk menyetujui draf yang bersih."
        nextLabel="Selesai: putar ulang tur"
        onNext={onReplayTour}
        isReplay
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] inline-flex flex-wrap items-center gap-2">
            <span>Gerbang persetujuan manusia &amp; log audit</span>
            <InfoTooltip term="humanInTheLoop" />
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-1">
            Tidak ada yang berstatus Disetujui tanpa tinjauan eksplisit di sini. Item yang Disetujui dan Ditolak menjadi hanya-baca.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-amber-200 bg-[#FEF3C7] text-xs font-mono font-bold text-[#D97706] tabular-nums">
            {pendingCount} Menunggu
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-emerald-200 bg-[#DCFCE7] text-xs font-mono font-bold text-[#16A34A] tabular-nums">
            {approvedCount} Disetujui
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-red-200 bg-[#FEE2E2] text-xs font-mono font-bold text-[#DC2626] tabular-nums">
            {rejectedCount} Ditolak
          </span>
        </div>
      </div>

      {/* Queue + Detail Two-Column Layout */}
      <section
        id="approval-queue-section"
        aria-label="Antrean persetujuan dan detail item"
        className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-start rounded-2xl ${
          tourHighlightedTarget === 'approval-queue-section'
            ? 'ring-2 ring-[#4F46E5] ring-offset-4'
            : ''
        }`}
      >
        {/* Left: Queue List */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden min-w-0">
          <div className="px-4 sm:px-5 py-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
            <h2 className="text-base font-bold text-[#0F172A]">Antrean persetujuan</h2>
            <div
              role="group"
              aria-label="Filter antrean berdasarkan status"
              className="flex flex-wrap gap-1.5"
            >
              {QUEUE_FILTERS.map((filter) => {
                const active = statusFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    aria-pressed={active}
                    className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#4F46E5] text-white'
                        : 'bg-white border border-slate-200 text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredQueue.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-sm font-semibold text-[#0F172A]">
                Belum ada draf berstatus {statusFilter.toLowerCase()}
              </p>
              <p className="text-xs text-[#64748B]">
                Ubah filter untuk memeriksa draf yang menunggu tinjauan manusia.
              </p>
              <button
                type="button"
                onClick={() => setStatusFilter('Semua')}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-indigo-100 rounded-xl transition-colors"
              >
                Tampilkan semua draf
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredQueue.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectItemId(item.id)}
                    className={`w-full min-h-[44px] text-left px-4 sm:px-5 py-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4F46E5] ${
                      isSelected ? 'bg-[#EEF2FF]/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-[#0F172A]">
                        {item.id} · {item.creatorId}
                      </span>
                      <QueueStatusChip status={item.status} />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      <DimensionChip dimension="hook" value={item.hook} />
                      <DimensionChip dimension="offer" value={item.offer} />
                    </div>
                    <p className="text-xs text-[#64748B]">
                      {item.platform} ·{' '}
                      <span
                        className={
                          item.compliance.hasBlocking
                            ? 'text-[#DC2626] font-semibold'
                            : item.compliance.hasWarning
                              ? 'text-[#D97706] font-semibold'
                              : 'text-[#16A34A] font-semibold'
                        }
                      >
                        {item.compliance.hasBlocking
                          ? 'Diblokir oleh aturan merek & klaim'
                          : item.compliance.hasWarning
                            ? 'Ada penanda peringatan'
                            : 'Semua aturan lolos'}
                      </span>
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Item Detail */}
        <div className="lg:col-span-8 space-y-5 min-w-0">
          {selectedItem && liveOrSavedEvaluation ? (
            <>
              {/* Guided Callout when D-001 is blocked */}
              {selectedItem.id === 'D-001' &&
                isPending &&
                selectedItem.compliance.hasBlocking && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#EEF2FF] border border-indigo-200 text-xs sm:text-sm text-[#0F172A]">
                    <Info className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="font-medium leading-relaxed">
                      <span className="font-bold text-[#4F46E5]">Coba ini: </span>
                      Coba tekan Setujui pada draf ini. Lihat mengapa diblokir, lalu perbaiki kata-katanya dan periksa ulang.
                    </p>
                  </div>
                )}

              <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl font-bold text-[#0F172A] font-mono">
                        {selectedItem.id}
                      </h2>
                      <span className="text-sm font-semibold text-[#0F172A]">
                        {selectedItem.creatorId}
                      </span>
                      <DimensionChip dimension="audience" value={selectedItem.audience} />
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 flex flex-wrap items-center gap-1">
                      <span>{selectedItem.platform} · Kode:</span>
                      <span className="font-mono font-semibold text-[#4F46E5]">
                        {selectedItem.promoCode}
                      </span>
                      <InfoTooltip term="promoCode" />
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!isPending && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#64748B]">
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Hanya-baca</span>
                      </span>
                    )}
                    <QueueStatusChip status={selectedItem.status} />
                  </div>
                </div>

                {/* Editable Script (only while Pending) */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <label
                      htmlFor="approval-script-editor"
                      className="text-sm font-bold text-[#0F172A]"
                    >
                      Skrip dan caption {isPending ? '(dapat diedit saat Menunggu)' : '(terkunci)'}
                    </label>
                    {isPending && hasUnsavedChanges && (
                      <span className="text-xs font-semibold text-[#D97706]">
                        Suntingan belum disimpan — simpan dan periksa ulang sebelum menyetujui
                      </span>
                    )}
                  </div>

                  {isPending ? (
                    <textarea
                      id="approval-script-editor"
                      rows={7}
                      value={editDraftText}
                      onChange={(e) => setEditDraftText(e.target.value)}
                      className="w-full p-4 text-sm text-[#0F172A] bg-slate-50 border border-slate-200 rounded-xl leading-relaxed focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F46E5]"
                    />
                  ) : (
                    <div
                      id="approval-script-editor"
                      className="w-full p-4 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed whitespace-pre-wrap"
                    >
                      {selectedItem.scriptAndCaption}
                    </div>
                  )}

                  {selectedItem.status === 'Ditolak' && selectedItem.rejectionReason && (
                    <p className="mt-2.5 text-xs font-semibold text-[#DC2626]">
                      Alasan penolakan: {selectedItem.rejectionReason}
                    </p>
                  )}

                  {isPending && (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onSaveEdit(selectedItem.id, editDraftText)}
                        disabled={editDraftText.trim().length === 0}
                        className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#0F172A] bg-white border border-slate-200 hover:border-indigo-300 disabled:opacity-50 rounded-xl transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                      >
                        <Save className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
                        <span>Simpan suntingan dan periksa ulang</span>
                      </button>
                      <span className="text-xs text-[#64748B]">
                        Terakhir diperbarui: {selectedItem.updatedAt}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Controls with clear red explanation box ABOVE buttons */}
                {isPending && (
                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    {disabledReasonMessage && (
                      <div
                        role="alert"
                        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FEF2F2] border border-red-200 text-[#DC2626] text-xs sm:text-sm"
                      >
                        <OctagonAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="font-semibold leading-relaxed">{disabledReasonMessage}</p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => onApprove(selectedItem.id)}
                          disabled={approveDisabled}
                          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#16A34A] hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-600 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]"
                        >
                          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                          <span>Setujui</span>
                        </button>
                        {approveDisabled && disabledReasonMessage && (
                          <p className="text-[11px] font-medium text-[#DC2626] max-w-xs">
                            {selectedItem.compliance.hasBlocking
                              ? 'Setujui dinonaktifkan: perbaiki klaim yang memblokir terlebih dahulu.'
                              : hasUnsavedChanges
                                ? 'Setujui dinonaktifkan: simpan suntingan Anda terlebih dahulu.'
                                : 'Setujui dinonaktifkan: kill switch sedang aktif.'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <select
                            aria-label="Alasan penolakan"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value as RejectionReason | '')}
                            className="min-h-[44px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-[#0F172A] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4F46E5]"
                          >
                            <option value="">Pilih alasan penolakan...</option>
                            {REJECTION_REASONS.map((reason) => (
                              <option key={reason} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              if (rejectReason) {
                                onReject(selectedItem.id, rejectReason);
                              }
                            }}
                            disabled={!rejectReason}
                            className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#DC2626] hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-600 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
                          >
                            <XCircle className="w-4 h-4" aria-hidden="true" />
                            <span>Tolak</span>
                          </button>
                        </div>
                        {!rejectReason && (
                          <p className="text-[11px] text-[#64748B]">
                            Tolak dinonaktifkan sampai Anda memilih alasan.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Brand and Claims Results with Progress Ring & Highlight Words */}
              <CompliancePanel
                evaluation={liveOrSavedEvaluation}
                scriptText={isPending ? editDraftText : selectedItem.scriptAndCaption}
              />
            </>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-8 text-center space-y-3">
              <p className="text-base font-bold text-[#0F172A]">Tidak ada draf yang dipilih</p>
              <p className="text-sm text-[#64748B]">
                Tampilkan semua draf di antrean untuk memeriksa atau menyetujui item yang menunggu.
              </p>
              <button
                type="button"
                onClick={() => setStatusFilter('Semua')}
                className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-indigo-100 rounded-xl transition-colors"
              >
                Tampilkan semua draf
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Audit Log: Zebra-Striped Table with Timeline-Style Look */}
      <section
        id="audit-log"
        aria-labelledby="audit-log-heading"
        className={`bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden scroll-mt-16 ${
          tourHighlightedTarget === 'audit-log'
            ? 'ring-2 ring-[#4F46E5] ring-offset-4'
            : ''
        }`}
      >
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
              <History className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="audit-log-heading" className="text-xl font-bold text-[#0F172A]">
                Log audit
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                Linimasa lokal browser untuk setiap pembuatan, pemeriksaan, suntingan, persetujuan, dan penolakan (
                {auditLog.length} entri).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExportCsv}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#0F172A] bg-white border border-slate-200 hover:border-indigo-300 rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <Download className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
            <span>Ekspor CSV</span>
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-[#64748B]">
                <th className="py-3 pl-5 pr-2 w-8" aria-label="Penanda linimasa" />
                <th className="py-3 px-3 whitespace-nowrap">Waktu</th>
                <th className="py-3 px-3 whitespace-nowrap">Aktor</th>
                <th className="py-3 px-3 whitespace-nowrap">Tindakan</th>
                <th className="py-3 px-3 whitespace-nowrap">Item</th>
                <th className="py-3 pl-3 pr-5">Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLog.map((entry, idx) => {
                const isApprove = entry.action === 'Disetujui';
                const isReject = entry.action === 'Ditolak';
                const dotColor = isApprove
                  ? 'bg-[#16A34A] ring-[#DCFCE7]'
                  : isReject
                    ? 'bg-[#DC2626] ring-[#FEE2E2]'
                    : 'bg-[#4F46E5] ring-[#EEF2FF]';
                return (
                  <tr
                    key={entry.id}
                    className="odd:bg-white even:bg-slate-50/80 hover:bg-[#EEF2FF]/40 transition-colors"
                  >
                    <td className="py-3.5 pl-5 pr-2 relative align-middle">
                      <div className="flex items-center justify-center relative">
                        {idx < auditLog.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="absolute top-3 bottom-[-22px] w-px bg-slate-200"
                          />
                        )}
                        <span
                          aria-hidden="true"
                          className={`relative z-10 w-2.5 h-2.5 rounded-full ring-4 ${dotColor}`}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-[#64748B] tabular-nums whitespace-nowrap">
                      {entry.timestamp}
                    </td>
                    <td className="py-3.5 px-3 text-xs sm:text-sm font-semibold text-[#0F172A] whitespace-nowrap">
                      {entry.actor}
                    </td>
                    <td className="py-3.5 px-3 text-xs sm:text-sm font-medium text-[#0F172A] whitespace-nowrap">
                      {entry.action}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs font-semibold text-[#4F46E5] whitespace-nowrap">
                      {entry.item}
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-xs sm:text-sm text-[#64748B]">
                      {entry.reason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Autonomy Ladder Card */}
      <section
        aria-labelledby="autonomy-heading"
        className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
          <h2 id="autonomy-heading" className="text-lg font-bold text-[#0F172A]">
            Tangga otonomi (L0 – L3)
          </h2>
          <p className="text-xs font-bold text-[#4F46E5]">
            Demo ini: L1, AI menyusun draf, manusia menyetujui setiap item
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AUTONOMY_LADDER.map((tier) => (
            <div
              key={tier.level}
              className={`rounded-2xl p-4 border ${
                tier.current
                  ? 'bg-[#EEF2FF]/70 border-[#4F46E5]'
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`font-mono text-xs font-bold ${
                    tier.current ? 'text-[#4F46E5]' : 'text-[#64748B]'
                  }`}
                >
                  {tier.level}
                </span>
                {tier.current && (
                  <span className="text-[11px] font-bold text-[#4F46E5]">Aktif</span>
                )}
              </div>
              <p className="text-sm font-bold text-[#0F172A]">{tier.name}</p>
              <p className="text-xs text-[#64748B] mt-1 leading-snug">{tier.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

