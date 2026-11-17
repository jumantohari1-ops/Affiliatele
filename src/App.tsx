import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OctagonAlert } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { TopBanner } from './components/TopBanner';
import { Navbar, TabId } from './components/Navbar';
import { JourneyBar, JourneyStepNumber } from './components/JourneyBar';
import { OverviewTab } from './components/OverviewTab';
import { PatternsTab } from './components/PatternsTab';
import { DataAttributionTab } from './components/DataAttributionTab';
import { BriefTab } from './components/BriefTab';
import { DraftTab } from './components/DraftTab';
import { ApprovalTab } from './components/ApprovalTab';
import { GuidedTour, TOUR_STEPS } from './components/GuidedTour';
import { WelcomeModal } from './components/WelcomeModal';
import { AboutDemoModal } from './components/AboutDemoModal';
import { Toast, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';
import {
  ApprovalQueueItem,
  AuditLogEntry,
  DraftTemplateOutput,
  GeneratedBrief,
  PersistedDemoState,
  RejectionReason,
  UserRole,
  createInitialDemoState,
  evaluateCompliance,
  exportAuditLogCsv,
  formatUtcTimestamp,
  generateBriefForCreator,
  generateDraftFromOption,
  loadPersistedDemoState,
  savePersistedDemoState,
} from './data/workflowEngine';

const WELCOME_SEEN_KEY = 'mas_gum_ai_welcome_seen_v1';

function readWelcomeSeen(): boolean {
  try {
    return window.localStorage.getItem(WELCOME_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markWelcomeSeen(): void {
  try {
    window.localStorage.setItem(WELCOME_SEEN_KEY, '1');
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [journeyOverride, setJourneyOverride] = useState<JourneyStepNumber | null>(null);

  // Welcome & About dialogs
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(() => !readWelcomeSeen());
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);

  // Toast feedback
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback(
    (message: string, actionLabel?: string, onAction?: () => void) => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      setToast({
        id: Date.now(),
        message,
        actionLabel,
        onAction,
      });
      toastTimerRef.current = window.setTimeout(() => {
        setToast(null);
      }, 6000);
    },
    []
  );

  // Persisted per-visitor Approval queue + Audit log
  const [persistedState, setPersistedState] = useState<PersistedDemoState>(() =>
    loadPersistedDemoState()
  );

  useEffect(() => {
    savePersistedDemoState(persistedState);
  }, [persistedState]);

  // Brief & Draft working state with smart defaults (never empty)
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>('C-001');
  const [generatedBrief, setGeneratedBrief] = useState<GeneratedBrief>(() =>
    generateBriefForCreator('C-001')
  );
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<0 | 1 | 2>(0);
  const [draftOutput, setDraftOutput] = useState<DraftTemplateOutput>(() =>
    generateDraftFromOption(generateBriefForCreator('C-001'), 0)
  );
  const [draftScriptText, setDraftScriptText] = useState<string>(
    () => generateDraftFromOption(generateBriefForCreator('C-001'), 0).scriptAndCaption
  );

  // Approval selection (default D-001)
  const [selectedApprovalId, setSelectedApprovalId] = useState<string>(
    () => persistedState.queue.find((q) => q.id === 'D-001')?.id ?? persistedState.queue[0]?.id ?? 'D-001'
  );

  // Guided Tour state
  const [tourStepIndex, setTourStepIndex] = useState<number | null>(null);

  // Simulated role & Administrator kill switch (controlled inside More menu)
  const [role, setRole] = useState<UserRole>('Reviewer');
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(false);

  const pendingCount = useMemo(
    () => persistedState.queue.filter((item) => item.status === 'Menunggu').length,
    [persistedState.queue]
  );

  const activeJourneyStep: JourneyStepNumber | null = useMemo(() => {
    if (activeTab === 'patterns') return 1;
    if (activeTab === 'brief') return 2;
    if (activeTab === 'draft') return 3;
    if (activeTab === 'approval') return journeyOverride === 5 ? 5 : 4;
    return null;
  }, [activeTab, journeyOverride]);

  const tourHighlightedTarget =
    tourStepIndex !== null ? TOUR_STEPS[tourStepIndex]?.targetId : undefined;

  const scrollToTarget = (targetId?: string) => {
    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    requestAnimationFrame(() => {
      window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 210);
    });
  };

  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    setJourneyOverride(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJourneyStep = (tab: TabId, targetId?: string, stepNum?: JourneyStepNumber) => {
    setActiveTab(tab);
    setJourneyOverride(stepNum === 5 ? 5 : null);
    scrollToTarget(targetId);
  };

  const handleExplorePatterns = () => {
    setActiveTab('patterns');
    setJourneyOverride(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToTourStep = (stepIdx: number) => {
    const step = TOUR_STEPS[stepIdx];
    if (!step) return;
    setTourStepIndex(stepIdx);
    setActiveTab(step.tab);
    setJourneyOverride(step.stepNumber === 5 ? 5 : null);
    if (step.stepNumber === 4) {
      setSelectedApprovalId('D-001');
    }
    scrollToTarget(step.targetId);
  };

  const handleStartTour = () => {
    markWelcomeSeen();
    setWelcomeOpen(false);
    goToTourStep(0);
  };

  const handleCloseWelcome = () => {
    markWelcomeSeen();
    setWelcomeOpen(false);
  };

  const handleResetDemo = () => {
    const fresh = createInitialDemoState();
    const initialBrief = generateBriefForCreator('C-001');
    const initialDraft = generateDraftFromOption(initialBrief, 0);
    setPersistedState(fresh);
    setSelectedCreatorId('C-001');
    setGeneratedBrief(initialBrief);
    setSelectedOptionIndex(0);
    setDraftOutput(initialDraft);
    setDraftScriptText(initialDraft.scriptAndCaption);
    setSelectedApprovalId('D-001');
    setKillSwitchActive(false);
    setTourStepIndex(null);
    setJourneyOverride(null);
    showToast('Demo dikembalikan ke kondisi awal.');
  };

  const handleSelectCreatorId = (creatorId: string) => {
    setSelectedCreatorId(creatorId);
    const brief = generateBriefForCreator(creatorId);
    const draft = generateDraftFromOption(brief, 0);
    setGeneratedBrief(brief);
    setSelectedOptionIndex(0);
    setDraftOutput(draft);
    setDraftScriptText(draft.scriptAndCaption);
  };

  const handleGenerateBrief = () => {
    if (killSwitchActive) return;
    const brief = generateBriefForCreator(selectedCreatorId);
    const draft = generateDraftFromOption(brief, 0);
    setGeneratedBrief(brief);
    setSelectedOptionIndex(0);
    setDraftOutput(draft);
    setDraftScriptText(draft.scriptAndCaption);
    showToast(`Brief untuk ${selectedCreatorId} sudah siap.`, 'Buka Draf', () => {
      handleSelectTab('draft');
    });
  };

  const handleCreateDraftFromBrief = (brief: GeneratedBrief) => {
    if (killSwitchActive) return;
    const draft = generateDraftFromOption(brief, selectedOptionIndex);
    setGeneratedBrief(brief);
    setDraftOutput(draft);
    setDraftScriptText(draft.scriptAndCaption);
    setActiveTab('draft');
    setJourneyOverride(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDraftOption = (idx: 0 | 1 | 2) => {
    setSelectedOptionIndex(idx);
    const output = generateDraftFromOption(generatedBrief, idx);
    setDraftOutput(output);
    setDraftScriptText(output.scriptAndCaption);
  };

  const handleGenerateDraft = () => {
    if (killSwitchActive) return;
    const output = generateDraftFromOption(generatedBrief, selectedOptionIndex);
    setDraftOutput(output);
    setDraftScriptText(output.scriptAndCaption);
    showToast(`Skrip dibuat untuk Opsi ${selectedOptionIndex + 1}.`);
  };

  const handleSendToApproval = () => {
    if (killSwitchActive || draftScriptText.trim().length === 0) return;

    const now = formatUtcTimestamp();
    const newId = `D-${String(persistedState.nextDraftNumber).padStart(3, '0')}`;
    const evaluation = evaluateCompliance(draftScriptText);

    const newItem: ApprovalQueueItem = {
      id: newId,
      creatorId: generatedBrief.creator.creator_id,
      audience: draftOutput.audience,
      platform: generatedBrief.creator.main_platform,
      promoCode: draftOutput.promoCode,
      hook: draftOutput.hook,
      format: draftOutput.format,
      offer: draftOutput.offer,
      scriptAndCaption: draftScriptText,
      videoPrompt: draftOutput.videoPrompt,
      status: 'Menunggu',
      createdAt: now,
      updatedAt: now,
      compliance: evaluation,
    };

    const complianceReason = evaluation.hasBlocking
      ? `Diblokir: ${evaluation.results
          .filter((r) => r.status === 'Memblokir')
          .map((r) => r.ruleId)
          .join(', ')}`
      : evaluation.hasWarning
        ? `Peringatan: ${evaluation.results
            .filter((r) => r.status === 'Peringatan')
            .map((r) => r.ruleId)
            .join(', ')}`
        : 'Semua pemeriksaan rulebook demo lolos';

    const newLogEntries: AuditLogEntry[] = [
      {
        id: `AUD-${Date.now()}-1`,
        timestamp: now,
        actor: role,
        action: 'Draf dibuat',
        item: `${newId} (${generatedBrief.creator.creator_id})`,
        reason: `Dikirim dari Draf (${draftOutput.hook} · ${draftOutput.format})`,
      },
      {
        id: `AUD-${Date.now()}-2`,
        timestamp: now,
        actor: 'Mesin Rulebook',
        action: 'Pemeriksaan kepatuhan',
        item: `${newId} (${generatedBrief.creator.creator_id})`,
        reason: complianceReason,
      },
    ];

    setPersistedState((prev) => ({
      queue: [newItem, ...prev.queue],
      auditLog: [...newLogEntries, ...prev.auditLog],
      nextDraftNumber: prev.nextDraftNumber + 1,
    }));

    setSelectedApprovalId(newId);
    setActiveTab('approval');
    setJourneyOverride(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Draf ${newId} ditambahkan ke antrean Persetujuan dengan status Menunggu.`);
  };

  const handleSaveApprovalEdit = (id: string, updatedScript: string) => {
    const now = formatUtcTimestamp();
    const evaluation = evaluateCompliance(updatedScript);

    const complianceReason = evaluation.hasBlocking
      ? `Diblokir: ${evaluation.results
          .filter((r) => r.status === 'Memblokir')
          .map((r) => r.ruleId)
          .join(', ')}`
      : evaluation.hasWarning
        ? `Peringatan: ${evaluation.results
            .filter((r) => r.status === 'Peringatan')
            .map((r) => r.ruleId)
            .join(', ')}`
        : 'Semua pemeriksaan rulebook demo lolos';

    setPersistedState((prev) => {
      const target = prev.queue.find((q) => q.id === id);
      if (!target || target.status !== 'Menunggu') return prev;

      const updatedQueue = prev.queue.map((item) =>
        item.id === id
          ? {
              ...item,
              scriptAndCaption: updatedScript,
              updatedAt: now,
              compliance: evaluation,
            }
          : item
      );

      const newLogs: AuditLogEntry[] = [
        {
          id: `AUD-${Date.now()}-E`,
          timestamp: now,
          actor: role,
          action: 'Draf diedit',
          item: `${target.id} (${target.creatorId})`,
          reason: 'Skrip diedit di tampilan Persetujuan dan kepatuhan diperiksa ulang',
        },
        {
          id: `AUD-${Date.now()}-C`,
          timestamp: now,
          actor: 'Mesin Rulebook',
          action: 'Pemeriksaan kepatuhan',
          item: `${target.id} (${target.creatorId})`,
          reason: complianceReason,
        },
      ];

      return {
        ...prev,
        queue: updatedQueue,
        auditLog: [...newLogs, ...prev.auditLog],
      };
    });

    if (evaluation.hasBlocking) {
      showToast(`${id} disimpan — klaim yang memblokir masih perlu diperbaiki sebelum tombol Setujui terbuka.`);
    } else {
      showToast(`${id} disimpan dan diperiksa ulang — tombol Setujui sekarang terbuka.`);
    }
  };

  const handleApproveItem = (id: string) => {
    if (killSwitchActive) return;
    const now = formatUtcTimestamp();

    setPersistedState((prev) => {
      const target = prev.queue.find((q) => q.id === id);
      if (!target || target.status !== 'Menunggu' || target.compliance.hasBlocking) {
        return prev;
      }

      const updatedQueue = prev.queue.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Disetujui' as const,
              updatedAt: now,
            }
          : item
      );

      const approveLog: AuditLogEntry = {
        id: `AUD-${Date.now()}-A`,
        timestamp: now,
        actor: role,
        action: 'Disetujui',
        item: `${target.id} (${target.creatorId})`,
        reason: target.compliance.hasWarning
          ? 'Disetujui manusia setelah penanda peringatan ditinjau'
          : 'Disetujui manusia setelah lolos semua pemeriksaan kepatuhan',
      };

      return {
        ...prev,
        queue: updatedQueue,
        auditLog: [approveLog, ...prev.auditLog],
      };
    });

    showToast(`Draf ${id} disetujui dan dicatat di log audit.`, 'Lihat log audit', () => {
      setJourneyOverride(5);
      scrollToTarget('audit-log');
    });
  };

  const handleRejectItem = (id: string, reason: RejectionReason) => {
    const now = formatUtcTimestamp();

    setPersistedState((prev) => {
      const target = prev.queue.find((q) => q.id === id);
      if (!target || target.status !== 'Menunggu') return prev;

      const updatedQueue = prev.queue.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Ditolak' as const,
              rejectionReason: reason,
              updatedAt: now,
            }
          : item
      );

      const rejectLog: AuditLogEntry = {
        id: `AUD-${Date.now()}-R`,
        timestamp: now,
        actor: role,
        action: 'Ditolak',
        item: `${target.id} (${target.creatorId})`,
        reason,
      };

      return {
        ...prev,
        queue: updatedQueue,
        auditLog: [rejectLog, ...prev.auditLog],
      };
    });

    showToast(`Draf ${id} ditolak (${reason}) dan dicatat.`, 'Lihat log audit', () => {
      setJourneyOverride(5);
      scrollToTarget('audit-log');
    });
  };

  const handleExportCsv = () => {
    exportAuditLogCsv(persistedState.auditLog);
    showToast('Log audit diekspor sebagai CSV.');
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F5F7FF] to-[#FFFFFF] text-[#0F172A] overflow-x-hidden">
        <TopBanner onOpenAbout={() => setAboutOpen(true)} />
        <Navbar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          pendingCount={pendingCount}
          onStartTour={handleStartTour}
          onOpenWelcome={() => setWelcomeOpen(true)}
          onResetDemo={handleResetDemo}
          role={role}
          onChangeRole={setRole}
          killSwitchActive={killSwitchActive}
          onToggleKillSwitch={() => setKillSwitchActive((prev) => !prev)}
        />
        <JourneyBar
          activeTab={activeTab}
          activeStep={activeJourneyStep}
          onSelectStep={handleJourneyStep}
        />

        {/* Red Kill Switch Banner (only when Administrator activates Kill Switch) */}
        {killSwitchActive && (
          <div
            role="alert"
            className="bg-[#DC2626] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold border-b border-red-700"
          >
            <div className="max-w-[1120px] mx-auto flex items-center justify-center gap-2 text-center">
              <OctagonAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                Kill switch Administrator AKTIF — pembuatan brief/draf dan persetujuan item dinonaktifkan.
              </span>
            </div>
          </div>
        )}

        <main className="flex-1 w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-8 sm:py-10 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'overview' && (
                <OverviewTab
                  onStartTour={handleStartTour}
                  onExplorePatterns={handleExplorePatterns}
                />
              )}
              {activeTab === 'patterns' && (
                <PatternsTab
                  tourHighlightedTarget={tourHighlightedTarget}
                  onNextBrief={() => handleSelectTab('brief')}
                />
              )}
              {activeTab === 'data' && (
                <DataAttributionTab onNextPatterns={handleExplorePatterns} />
              )}
              {activeTab === 'brief' && (
                <BriefTab
                  selectedCreatorId={selectedCreatorId}
                  onSelectCreatorId={handleSelectCreatorId}
                  generatedBrief={generatedBrief}
                  onGenerateBrief={handleGenerateBrief}
                  selectedOptionIndex={selectedOptionIndex}
                  onSelectOptionIndex={(idx) => handleSelectDraftOption(idx)}
                  onCreateDraftFromBrief={handleCreateDraftFromBrief}
                  killSwitchActive={killSwitchActive}
                  tourHighlightedTarget={tourHighlightedTarget}
                />
              )}
              {activeTab === 'draft' && (
                <DraftTab
                  activeBrief={generatedBrief}
                  selectedOptionIndex={selectedOptionIndex}
                  onSelectOptionIndex={handleSelectDraftOption}
                  draftOutput={draftOutput}
                  scriptText={draftScriptText}
                  onChangeScriptText={setDraftScriptText}
                  onGenerateDraft={handleGenerateDraft}
                  onSendToApproval={handleSendToApproval}
                  onGoToBrief={() => handleSelectTab('brief')}
                  onGoToApproval={() => handleSelectTab('approval')}
                  killSwitchActive={killSwitchActive}
                  tourHighlightedTarget={tourHighlightedTarget}
                />
              )}
              {activeTab === 'approval' && (
                <ApprovalTab
                  queue={persistedState.queue}
                  selectedItemId={selectedApprovalId}
                  onSelectItemId={setSelectedApprovalId}
                  onSaveEdit={handleSaveApprovalEdit}
                  onApprove={handleApproveItem}
                  onReject={handleRejectItem}
                  onExportCsv={handleExportCsv}
                  onReplayTour={handleStartTour}
                  auditLog={persistedState.auditLog}
                  killSwitchActive={killSwitchActive}
                  tourHighlightedTarget={tourHighlightedTarget}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <WelcomeModal
          isOpen={welcomeOpen}
          onStartTour={handleStartTour}
          onExplore={handleCloseWelcome}
        />

        <AboutDemoModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

        {tourStepIndex !== null && (
          <GuidedTour
            currentStepIndex={tourStepIndex}
            onNext={() => goToTourStep(Math.min(TOUR_STEPS.length - 1, tourStepIndex + 1))}
            onPrev={() => goToTourStep(Math.max(0, tourStepIndex - 1))}
            onReplay={() => goToTourStep(0)}
            onClose={() => setTourStepIndex(null)}
          />
        )}

        <Toast toast={toast} onDismiss={() => setToast(null)} />

        <Footer onOpenAbout={() => setAboutOpen(true)} />
      </div>
    </MotionConfig>
  );
}

