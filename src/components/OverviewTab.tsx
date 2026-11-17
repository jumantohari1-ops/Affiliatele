import { useMemo } from 'react';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Compass,
  FileText,
  Layers,
  ShieldCheck,
  Store,
  Users,
} from 'lucide-react';
import { SYNTHETIC_DATASET } from '../data/syntheticData';
import { InfoTooltip } from './InfoTooltip';
import { TabGuideCallout } from './TabGuideCallout';

interface OverviewTabProps {
  onStartTour: () => void;
  onExplorePatterns: () => void;
}

const HOW_IT_WORKS_CARDS = [
  {
    step: '01',
    title: 'Belajar',
    sentence:
      'Mengurutkan hook kreatif, format video, penawaran, dan audiens dengan penyusutan statistik agar noise tidak pernah menyamar sebagai pemenang.',
    icon: BarChart3,
    cardClass: 'border-[#DDD6FE] bg-gradient-to-br from-[#EDE9FE]/60 via-white to-white',
    tileClass: 'bg-[#EDE9FE] text-[#6D28D9]',
    stepClass: 'text-[#6D28D9]',
  },
  {
    step: '02',
    title: 'Brief',
    sentence:
      'Mengubah pola berkinerja terbaik menjadi brief kreator deterministik lengkap dengan adegan berwaktu, kode promo, dan slot eksperimen berisiko rendah.',
    icon: FileText,
    cardClass: 'border-[#BAE6FD] bg-gradient-to-br from-[#E0F2FE]/60 via-white to-white',
    tileClass: 'bg-[#E0F2FE] text-[#0284C7]',
    stepClass: 'text-[#0284C7]',
  },
  {
    step: '03',
    title: 'Draf & Setujui',
    sentence:
      'Memeriksa setiap skrip kreator terhadap rulebook kepatuhan yang transparan dan menahannya di gerbang persetujuan manusia yang wajib.',
    icon: ShieldCheck,
    cardClass: 'border-[#99F6E4] bg-gradient-to-br from-[#CCFBF1]/60 via-white to-white',
    tileClass: 'bg-[#CCFBF1] text-[#0D9488]',
    stepClass: 'text-[#0D9488]',
  },
];

const LOOP_TIMELINE = [
  { name: 'Belajar', role: 'Pisahkan sinyal', isGate: false },
  { name: 'Brief', role: 'Pilih hook & penawaran', isGate: false },
  { name: 'Draf', role: 'Skrip & daftar shot', isGate: false },
  { name: 'Setujui', role: 'Gerbang Persetujuan Manusia', isGate: true },
  { name: 'Publikasi', role: 'Kode & UTM aktif', isGate: false },
  { name: 'Ukur', role: 'Rekonsiliasi pesanan', isGate: false },
];

function HeroLoopIllustration() {
  return (
    <svg
      viewBox="0 0 440 310"
      className="w-full h-auto max-w-[440px] mx-auto"
      role="img"
      aria-label="Ilustrasi lingkaran tertutup: Kreator ke Postingan ke Pesanan, kembali ke kartu Brief melalui perisai Gerbang Persetujuan Manusia"
    >
      {/* Soft backdrop plate */}
      <rect x="8" y="8" width="424" height="294" rx="20" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Dashed Loop Track */}
      <rect
        x="58"
        y="52"
        width="324"
        height="204"
        rx="28"
        fill="none"
        stroke="#C7D2FE"
        strokeWidth="2.5"
        strokeDasharray="6 6"
      />

      {/* Loop Arrows */}
      {/* Creators -> Posts */}
      <line x1="168" y1="52" x2="262" y2="52" stroke="#4F46E5" strokeWidth="2.5" />
      <polygon points="270,52 260,46 260,58" fill="#4F46E5" />

      {/* Posts -> Orders */}
      <line x1="382" y1="92" x2="382" y2="210" stroke="#0284C7" strokeWidth="2.5" />
      <polygon points="382,218 376,208 388,208" fill="#0284C7" />

      {/* Orders -> Brief */}
      <line x1="272" y1="256" x2="178" y2="256" stroke="#DB2777" strokeWidth="2.5" />
      <polygon points="170,256 180,250 180,262" fill="#DB2777" />

      {/* Brief -> Shield Gate -> Creators */}
      <line x1="58" y1="216" x2="58" y2="100" stroke="#0D9488" strokeWidth="2.5" />
      <polygon points="58,92 52,102 64,102" fill="#0D9488" />

      {/* Node 1: Creators (Violet) */}
      <g transform="translate(24, 24)">
        <rect width="144" height="58" rx="14" fill="#FFFFFF" stroke="#DDD6FE" strokeWidth="1.75" />
        <rect x="12" y="13" width="32" height="32" rx="10" fill="#EDE9FE" />
        <circle cx="28" cy="25" r="4.5" fill="#6D28D9" />
        <path d="M20 37c1.8-4 14.2-4 16 0" fill="none" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" />
        <text x="54" y="27" fontSize="13" fontWeight="700" fill="#0F172A">
          Kreator
        </text>
        <text x="54" y="43" fontSize="10.5" fill="#64748B">
          30 pseudonim
        </text>
      </g>

      {/* Node 2: Posts (Sky) */}
      <g transform="translate(272, 24)">
        <rect width="144" height="58" rx="14" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="1.75" />
        <rect x="12" y="13" width="32" height="32" rx="10" fill="#E0F2FE" />
        <polygon points="24,22 24,36 35,29" fill="#0284C7" />
        <text x="54" y="27" fontSize="13" fontWeight="700" fill="#0F172A">
          Postingan
        </text>
        <text x="54" y="43" fontSize="10.5" fill="#64748B">
          TikTok &amp; Shopee
        </text>
      </g>

      {/* Node 3: Orders (Pink) */}
      <g transform="translate(272, 224)">
        <rect width="144" height="58" rx="14" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="1.75" />
        <rect x="12" y="13" width="32" height="32" rx="10" fill="#FCE7F3" />
        <path d="M20 35l5-5 4 3 7-9" fill="none" stroke="#DB2777" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="54" y="27" fontSize="13" fontWeight="700" fill="#0F172A">
          Pesanan
        </text>
        <text x="54" y="43" fontSize="10.5" fill="#64748B">
          Kode &amp; UTM terlacak
        </text>
      </g>

      {/* Node 4: Brief (Teal) */}
      <g transform="translate(24, 224)">
        <rect width="144" height="58" rx="14" fill="#FFFFFF" stroke="#99F6E4" strokeWidth="1.75" />
        <rect x="12" y="13" width="32" height="32" rx="10" fill="#CCFBF1" />
        <line x1="21" y1="23" x2="35" y2="23" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
        <line x1="21" y1="29" x2="35" y2="29" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
        <line x1="21" y1="35" x2="30" y2="35" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
        <text x="54" y="27" fontSize="13" fontWeight="700" fill="#0F172A">
          Brief
        </text>
        <text x="54" y="43" fontSize="10.5" fill="#64748B">
          Opsi berperingkat
        </text>
      </g>

      {/* Center / Gate Shield Card */}
      <g transform="translate(106, 122)">
        <rect width="228" height="64" rx="16" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
        <rect x="14" y="14" width="36" height="36" rx="10" fill="#4F46E5" />
        <path
          d="M32 21 l8 3.5 v6 c0 5-3.4 9.2-8 10.7 -4.6-1.5-8-5.7-8-10.7 v-6 z"
          fill="#FFFFFF"
        />
        <path
          d="M28.5 31.5 l2.5 2.5 4.8-4.8"
          fill="none"
          stroke="#16A34A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="60" y="30" fontSize="12.5" fontWeight="700" fill="#0F172A">
          Gerbang Persetujuan Manusia
        </text>
        <text x="60" y="46" fontSize="10.5" fill="#4338CA">
          Cek rulebook + persetujuan manusia
        </text>
      </g>
    </svg>
  );
}

export function OverviewTab({ onStartTour, onExplorePatterns }: OverviewTabProps) {
  const datasetStats = useMemo(() => {
    const posts = SYNTHETIC_DATASET.posts;
    const creatorsCount = SYNTHETIC_DATASET.creators.length;
    const postsCount = posts.length;
    let minDay = Infinity;
    let maxDay = -Infinity;
    const platformSet = new Set<string>();
    for (const post of posts) {
      if (post.day_index < minDay) minDay = post.day_index;
      if (post.day_index > maxDay) maxDay = post.day_index;
      platformSet.add(post.platform);
    }
    const daysCount = postsCount > 0 ? maxDay - minDay + 1 : 0;
    const platformsCount = platformSet.size;
    return {
      creatorsCount,
      postsCount,
      daysCount,
      platformsCount,
      platformList: Array.from(platformSet).join(' · '),
    };
  }, []);

  const statCards = [
    {
      label: 'Kreator',
      value: String(datasetStats.creatorsCount),
      subtext: 'Pseudonim C-001 sampai C-030',
      icon: Users,
      tileClass: 'bg-[#EDE9FE] text-[#6D28D9]',
    },
    {
      label: 'Postingan',
      value: datasetStats.postsCount.toLocaleString('id-ID'),
      subtext: 'Rekaman sintetis seed-42',
      icon: Layers,
      tileClass: 'bg-[#E0F2FE] text-[#0284C7]',
    },
    {
      label: 'Hari',
      value: String(datasetStats.daysCount),
      subtext: 'Rentang 90 hari berkelanjutan',
      icon: CalendarDays,
      tileClass: 'bg-[#FCE7F3] text-[#DB2777]',
    },
    {
      label: 'Platform',
      value: String(datasetStats.platformsCount),
      subtext: datasetStats.platformList,
      icon: Store,
      tileClass: 'bg-[#CCFBF1] text-[#0D9488]',
    },
  ];

  return (
    <div className="space-y-10">
      <TabGuideCallout
        lookingAt="Gambaran singkat bagaimana mesin belajar dari postingan kreator sebelumnya, menulis brief, memeriksa draf, dan menunggu manusia menyetujuinya."
        whatToTry="Ikuti tur 2 menit atau klik Berikutnya untuk melihat kombinasi video mana yang benar-benar mendorong pesanan."
        nextLabel="Berikutnya: lihat pola pemenang"
        onNext={onExplorePatterns}
      />

      {/* Two-Column Hero with Faint Gradient-Mesh Blob */}
      <section className="relative overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-[#EEF2FF] via-white to-[#F5F3FF] shadow-sm p-6 sm:p-10">
        {/* Faint decorative gradient-mesh blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-300/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-12 w-80 h-80 rounded-full bg-pink-200/25 blur-3xl"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-[#4F46E5] mb-3">
              SunnieBooks (SKU ilustratif) <span aria-hidden="true">·</span> Prototipe data sintetis
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#0F172A] leading-[1.12] text-balance mb-4">
              AI yang belajar apa yang membuat kreator berjualan
            </h1>
            <p className="text-base text-[#64748B] leading-relaxed mb-7 max-w-xl">
              Temukan pola kreatif mana yang mendorong pesanan teratribusi, ubah menjadi brief terstruktur, dan terapkan persetujuan kepatuhan oleh manusia sebelum apa pun tayang.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStartTour}
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl shadow-xs transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
              >
                <Compass className="w-4 h-4" aria-hidden="true" />
                <span>Mulai tur terpandu</span>
              </button>
              <button
                type="button"
                onClick={onExplorePatterns}
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#0F172A] bg-white border border-slate-200 hover:border-indigo-300 hover:bg-[#EEF2FF]/40 rounded-xl transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
              >
                <span>Jelajahi pola</span>
                <ArrowRight className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 min-w-0">
            <HeroLoopIllustration />
          </div>
        </div>
      </section>

      {/* How It Works: Three Large Coloured Cards */}
      <section aria-labelledby="how-it-works-heading" className="space-y-4">
        <div>
          <h2 id="how-it-works-heading" className="text-2xl font-bold text-[#0F172A]">
            Cara kerjanya
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            Tiga lapisan yang saling terhubung mengubah data tingkat postingan menjadi brief kreator yang patuh aturan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {HOW_IT_WORKS_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className={`rounded-2xl border p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${card.cardClass}`}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.tileClass}`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className={`font-mono text-xs font-bold tabular-nums ${card.stepClass}`}>
                    {card.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">{card.title}</h3>
                <p className="text-sm sm:text-[15px] text-[#64748B] leading-relaxed">
                  {card.sentence}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Six-Step Loop Horizontal Timeline */}
      <section
        aria-labelledby="loop-timeline-heading"
        className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
          <h2 id="loop-timeline-heading" className="text-xl font-bold text-[#0F172A]">
            Lingkaran tertutup enam langkah
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] inline-flex items-center gap-1">
            <span>Persetujuan manusia berada tepat sebelum publikasi</span>
            <InfoTooltip term="humanInTheLoop" />
          </p>
        </div>

        <div className="relative">
          {/* Horizontal timeline rail on desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-6 left-8 right-8 h-0.5 bg-indigo-100"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {LOOP_TIMELINE.map((step, idx) => (
              <div
                key={step.name}
                className={`rounded-2xl p-4 border transition-all duration-200 ${
                  step.isGate
                    ? 'bg-[#EEF2FF] border-[#4F46E5] shadow-sm'
                    : 'bg-slate-50/70 border-slate-200/90 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center tabular-nums ${
                      step.isGate
                        ? 'bg-[#4F46E5] text-white'
                        : 'bg-white border border-slate-200 text-[#0F172A]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  {step.isGate && (
                    <ShieldCheck className="w-4 h-4 text-[#4F46E5] shrink-0" aria-hidden="true" />
                  )}
                </div>
                <p
                  className={`text-sm font-bold ${
                    step.isGate ? 'text-[#4F46E5]' : 'text-[#0F172A]'
                  }`}
                >
                  {step.name}
                </p>
                <p
                  className={`text-xs mt-0.5 leading-snug ${
                    step.isGate ? 'text-[#4338CA] font-semibold' : 'text-[#64748B]'
                  }`}
                >
                  {step.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Stat Cards */}
      <section aria-label="Metrik ringkasan dataset" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-[#64748B]">{stat.label}</span>
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stat.tileClass}`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-mono tabular-nums">
                {stat.value}
              </p>
              <p className="text-xs text-[#64748B] mt-1 truncate" title={stat.subtext}>
                {stat.subtext}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
