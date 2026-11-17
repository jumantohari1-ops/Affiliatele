import { Database } from 'lucide-react';
import { TabId } from './Navbar';

export type JourneyStepNumber = 1 | 2 | 3 | 4 | 5;

const JOURNEY_STEPS: Array<{
  num: JourneyStepNumber;
  label: string;
  tab: TabId;
  targetId?: string;
}> = [
  { num: 1, label: 'Pola', tab: 'patterns' },
  { num: 2, label: 'Brief', tab: 'brief' },
  { num: 3, label: 'Draf', tab: 'draft' },
  { num: 4, label: 'Persetujuan', tab: 'approval' },
  { num: 5, label: 'Log audit', tab: 'approval', targetId: 'audit-log' },
];

interface JourneyBarProps {
  activeTab: TabId;
  activeStep: JourneyStepNumber | null;
  onSelectStep: (tab: TabId, targetId?: string, stepNum?: JourneyStepNumber) => void;
}

export function JourneyBar({ activeTab, activeStep, onSelectStep }: JourneyBarProps) {
  return (
    <div className="bg-white/90 border-b border-slate-200/80 px-4 sm:px-6 py-2">
      <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div
          aria-label="Alur tinjauan 5 langkah"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
        >
          {JOURNEY_STEPS.map((step, idx) => {
            const isCurrent = activeStep === step.num;
            const isCompleted = activeStep !== null && step.num < activeStep;
            return (
              <div key={step.num} className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectStep(step.tab, step.targetId, step.num)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`min-h-[36px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                    isCurrent
                      ? 'bg-[#4F46E5] text-white shadow-2xs'
                      : isCompleted
                        ? 'bg-[#EEF2FF] text-[#4F46E5] hover:bg-indigo-100'
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      isCurrent ? 'text-indigo-100' : ''
                    }`}
                  >
                    {step.num}
                  </span>
                  <span>{step.label}</span>
                </button>
                {idx < JOURNEY_STEPS.length - 1 && (
                  <span aria-hidden="true" className="text-slate-300 text-xs">
                    /
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onSelectStep('data')}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors whitespace-nowrap self-start sm:self-auto rounded-lg px-2.5 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
            activeTab === 'data'
              ? 'bg-[#EEF2FF] text-[#4F46E5]'
              : 'text-[#64748B] hover:text-[#4F46E5]'
          }`}
        >
          <Database className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Di balik angka</span>
        </button>
      </div>
    </div>
  );
}
