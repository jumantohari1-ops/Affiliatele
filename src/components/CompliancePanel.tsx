import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Highlighter, OctagonAlert } from 'lucide-react';
import { ComplianceEvaluation, ComplianceStatus } from '../data/workflowEngine';
import { InfoTooltip } from './InfoTooltip';

interface CompliancePanelProps {
  evaluation: ComplianceEvaluation;
  scriptText?: string;
}

function BigStatusBadge({ status }: { status: ComplianceStatus }) {
  if (status === 'Memblokir') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-[#FEE2E2] text-xs font-bold text-[#DC2626] whitespace-nowrap">
        <OctagonAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Memblokir</span>
      </span>
    );
  }
  if (status === 'Peringatan') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-[#FEF3C7] text-xs font-bold text-[#D97706] whitespace-nowrap">
        <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Peringatan</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-[#DCFCE7] text-xs font-bold text-[#16A34A] whitespace-nowrap">
      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>Lolos</span>
    </span>
  );
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function CompliancePanel({ evaluation, scriptText }: CompliancePanelProps) {
  const [highlightActive, setHighlightActive] = useState(false);

  const totalCount = evaluation.results.length;
  const passCount = evaluation.results.filter((r) => r.status === 'Lolos').length;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (passCount / totalCount) * circumference;

  const ringColor = evaluation.hasBlocking
    ? '#DC2626'
    : evaluation.hasWarning
      ? '#D97706'
      : '#16A34A';

  const flaggedRules = useMemo(
    () => evaluation.results.filter((r) => r.status !== 'Lolos'),
    [evaluation.results]
  );

  const blockingTermSet = useMemo(() => {
    const terms = new Set<string>();
    for (const r of evaluation.results) {
      if (r.status === 'Memblokir' && r.matchedTerms) {
        for (const t of r.matchedTerms) terms.add(t.toLowerCase());
      }
    }
    return terms;
  }, [evaluation.results]);

  const warningTermSet = useMemo(() => {
    const terms = new Set<string>();
    for (const r of evaluation.results) {
      if (r.status === 'Peringatan' && r.matchedTerms) {
        for (const t of r.matchedTerms) terms.add(t.toLowerCase());
      }
    }
    return terms;
  }, [evaluation.results]);

  const allMatchedTerms = useMemo(() => {
    const list: string[] = [];
    for (const r of evaluation.results) {
      if (r.status !== 'Lolos' && r.matchedTerms) {
        for (const t of r.matchedTerms) {
          if (!list.some((x) => x.toLowerCase() === t.toLowerCase())) {
            list.push(t);
          }
        }
      }
    }
    return list.sort((a, b) => b.length - a.length);
  }, [evaluation.results]);

  const highlightedSegments = useMemo(() => {
    if (!scriptText || allMatchedTerms.length === 0) return null;
    const pattern = new RegExp(`(${allMatchedTerms.map(escapeRegExp).join('|')})`, 'gi');
    return scriptText.split(pattern);
  }, [scriptText, allMatchedTerms]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/70">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-[#0F172A]">Pemeriksaan merek dan klaim</h3>
            <InfoTooltip term="humanInTheLoop" />
          </div>
          <p className="text-xs text-[#64748B]">
            Rulebook demo; merek yang mengonfigurasi aturan sebenarnya
          </p>
          <p
            className={`text-xs font-semibold mt-1 ${
              evaluation.hasBlocking
                ? 'text-[#DC2626]'
                : evaluation.hasWarning
                  ? 'text-[#D97706]'
                  : 'text-[#16A34A]'
            }`}
          >
            {evaluation.summary}
          </p>
        </div>

        {/* SVG Progress Ring showing how many checks pass */}
        <div
          className="relative w-14 h-14 flex items-center justify-center shrink-0"
          aria-label={`${passCount} dari ${totalCount} pemeriksaan merek dan klaim lolos`}
        >
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 52 52">
            <circle
              cx="26"
              cy="26"
              r={radius}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="5"
            />
            <circle
              cx="26"
              cy="26"
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          </svg>
          <span className="absolute font-mono text-xs font-bold text-[#0F172A] tabular-nums">
            {passCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Inline suggestion when blocked (or warning terms exist) */}
      {evaluation.hasBlocking && (
        <div className="px-4 sm:px-5 py-3.5 bg-[#FEF2F2] border-b border-red-200 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="text-xs text-red-900 space-y-1 min-w-0">
              <p className="font-bold text-[#DC2626]">
                Cara memperbaiki draf ini sebelum menyetujui:
              </p>
              <ul className="space-y-0.5 list-disc pl-4">
                {flaggedRules
                  .filter((r) => r.status === 'Memblokir')
                  .map((r) => (
                    <li key={r.ruleId}>
                      <span className="font-mono font-bold">{r.ruleId}</span> ({r.title}):{' '}
                      {r.matchedTerms && r.matchedTerms.length > 0 ? (
                        <>
                          hapus{' '}
                          <span className="font-mono font-bold underline decoration-red-400">
                            {r.matchedTerms.map((t) => `"${t}"`).join(', ')}
                          </span>
                        </>
                      ) : (
                        r.reason
                      )}
                    </li>
                  ))}
              </ul>
            </div>

            {scriptText !== undefined && allMatchedTerms.length > 0 && (
              <button
                type="button"
                onClick={() => setHighlightActive((prev) => !prev)}
                aria-pressed={highlightActive}
                className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] ${
                  highlightActive
                    ? 'bg-[#DC2626] text-white border-[#DC2626]'
                    : 'bg-white text-[#DC2626] border-red-300 hover:bg-red-50'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{highlightActive ? 'Sembunyikan kata yang disorot' : 'Sorot kata-katanya'}</span>
              </button>
            )}
          </div>

          {highlightActive && highlightedSegments && (
            <div className="bg-white border border-red-200 rounded-xl p-3 text-xs sm:text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">
              {highlightedSegments.map((part, idx) => {
                const lower = part.toLowerCase();
                if (blockingTermSet.has(lower)) {
                  return (
                    <mark
                      key={idx}
                      className="bg-[#FEE2E2] text-[#DC2626] font-bold px-1 rounded underline decoration-[#DC2626]"
                    >
                      {part}
                    </mark>
                  );
                }
                if (warningTermSet.has(lower)) {
                  return (
                    <mark
                      key={idx}
                      className="bg-[#FEF3C7] text-[#D97706] font-bold px-1 rounded"
                    >
                      {part}
                    </mark>
                  );
                }
                return <span key={idx}>{part}</span>;
              })}
            </div>
          )}
        </div>
      )}

      <div className="divide-y divide-slate-100">
        {evaluation.results.map((rule) => (
          <div
            key={rule.ruleId}
            className={`px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 ${
              rule.status === 'Memblokir'
                ? 'bg-[#FEF2F2]/70'
                : rule.status === 'Peringatan'
                  ? 'bg-[#FFFBEB]/70'
                  : 'bg-white'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#64748B]">
                  {rule.ruleId}
                </span>
                <span className="text-sm font-semibold text-[#0F172A]">{rule.title}</span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">{rule.reason}</p>
            </div>
            <div className="shrink-0">
              <BigStatusBadge status={rule.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

