import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Compass,
  HelpCircle,
  Layers,
  MoreHorizontal,
  OctagonAlert,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import { USER_ROLES, UserRole } from '../data/workflowEngine';

export type TabId = 'overview' | 'patterns' | 'data' | 'brief' | 'draft' | 'approval';

export interface TabDefinition {
  id: TabId;
  step: number;
  label: string;
}

export const TABS: TabDefinition[] = [
  { id: 'overview', step: 1, label: 'Ringkasan' },
  { id: 'patterns', step: 2, label: 'Pola' },
  { id: 'data', step: 3, label: 'Data & Atribusi' },
  { id: 'brief', step: 4, label: 'Brief' },
  { id: 'draft', step: 5, label: 'Draf' },
  { id: 'approval', step: 6, label: 'Persetujuan' },
];

interface NavbarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  pendingCount: number;
  onStartTour: () => void;
  onOpenWelcome: () => void;
  onResetDemo: () => void;
  role: UserRole;
  onChangeRole: (role: UserRole) => void;
  killSwitchActive: boolean;
  onToggleKillSwitch: () => void;
}

export function Navbar({
  activeTab,
  onSelectTab,
  pendingCount,
  onStartTour,
  onOpenWelcome,
  onResetDemo,
  role,
  onChangeRole,
  killSwitchActive,
  onToggleKillSwitch,
}: NavbarProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200/80 relative z-30">
      <div ref={menuRef} className="max-w-[1120px] mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 lg:gap-4 py-3 lg:py-0 lg:h-[72px]">
          {/* Left: Wordmark + Mobile Actions */}
          <div className="flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSelectTab('overview')}
              className="inline-flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-xl py-1"
            >
              <span className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center shadow-xs shrink-0">
                <Layers className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold tracking-tight text-[#0F172A] whitespace-nowrap">
                Mas_Gum_Ai
              </span>
            </button>

            <div className="flex lg:hidden items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onOpenWelcome}
                aria-label="Buka panduan selamat datang"
                title="Panduan selamat datang"
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#4F46E5] bg-[#EEF2FF] hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              >
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onStartTour}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              >
                <Compass className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Tur</span>
              </button>

              <button
                type="button"
                onClick={() => setMoreOpen((prev) => !prev)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                aria-label="Opsi lainnya"
                className="min-h-[44px] inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-[#0F172A] bg-white border border-slate-200 hover:border-indigo-300 rounded-xl transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              >
                <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                <span>Lainnya</span>
              </button>
            </div>
          </div>

          {/* Center: Numbered 6-Step Tab Bar */}
          <div className="relative min-w-0 flex-1 lg:flex lg:justify-center">
            <nav
              aria-label="Navigasi utama"
              className="flex items-center gap-1 overflow-x-auto no-scrollbar pr-8 lg:pr-0 py-0.5 bg-slate-100/80 border border-slate-200/80 rounded-xl p-1"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const displayLabel =
                  tab.id === 'approval' ? `Persetujuan (${pendingCount})` : tab.label;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onSelectTab(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-[13px] font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                      isActive
                        ? 'bg-white text-[#4F46E5] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/60'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-4 h-4 rounded-md text-[10px] font-mono font-bold tabular-nums ${
                        isActive
                          ? 'bg-[#EEF2FF] text-[#4F46E5]'
                          : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {tab.step}
                    </span>
                    <span className="tabular-nums">{displayLabel}</span>
                  </button>
                );
              })}
            </nav>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent lg:hidden rounded-r-xl"
            />
          </div>

          {/* Right: Desktop Help Button + Primary Tour CTA + More Menu */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenWelcome}
              aria-label="Buka panduan selamat datang"
              title="Panduan selamat datang"
              className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center text-sm font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onStartTour}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
            >
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Mulai tur terpandu</span>
            </button>

            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F172A] bg-white border border-slate-200 hover:border-indigo-300 rounded-xl transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              <span>Lainnya</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                  moreOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* More Dropdown Popover */}
        {moreOpen && (
          <div
            role="menu"
            aria-label="Kontrol demo dan pengalih peran"
            className="absolute right-4 sm:right-6 top-14 lg:top-[64px] w-72 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-lg p-3.5 z-50 space-y-3"
          >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 px-1 text-xs font-semibold text-[#0F172A]">
                    <UserCheck className="w-3.5 h-3.5 text-[#4F46E5]" aria-hidden="true" />
                    <span>Lihat sebagai</span>
                  </div>
                  <p className="px-1 text-[11px] text-[#64748B] leading-snug">
                    Peran simulasi sebagai ilustrasi, tanpa autentikasi sungguhan
                  </p>
                  <div className="grid grid-cols-1 gap-1 pt-0.5">
                    {USER_ROLES.map((r) => {
                      const active = role === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          role="menuitemradio"
                          aria-checked={active}
                          onClick={() => onChangeRole(r)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                            active
                              ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{r}</span>
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {role === 'Administrator' && (
                  <div className="pt-2.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onToggleKillSwitch}
                      aria-pressed={killSwitchActive}
                      className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                        killSwitchActive
                          ? 'bg-[#DC2626] text-white border-[#DC2626] hover:bg-red-700'
                          : 'bg-[#FEF2F2] text-[#DC2626] border-red-200 hover:bg-red-100'
                      }`}
                    >
                      <OctagonAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>
                        {killSwitchActive ? 'Kill switch: AKTIF (lanjutkan)' : 'Kill switch: NONAKTIF'}
                      </span>
                    </button>
                  </div>
                )}

                <div className="pt-2.5 border-t border-slate-100">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onResetDemo();
                      setMoreOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F172A] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
                    <span>Reset demo</span>
                  </button>
                </div>
              </div>
            )}
      </div>
    </header>
  );
}
