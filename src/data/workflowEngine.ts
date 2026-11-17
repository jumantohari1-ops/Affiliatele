import {
  AudienceType,
  Creator,
  FormatType,
  HookType,
  OfferType,
  Platform,
  PatternRow,
  SYNTHETIC_DATASET,
  analyzePatterns,
  shrunkConversion,
  wilsonInterval,
} from './syntheticData';

export type UserRole = 'Reviewer' | 'Approver kepatuhan' | 'Administrator';

export const USER_ROLES: UserRole[] = ['Reviewer', 'Approver kepatuhan', 'Administrator'];

export type RejectionReason = 'Klaim tidak diizinkan' | 'Nada tidak sesuai merek' | 'Perlu ditulis ulang';

export const REJECTION_REASONS: RejectionReason[] = [
  'Klaim tidak diizinkan',
  'Nada tidak sesuai merek',
  'Perlu ditulis ulang',
];

export interface SceneTiming {
  timing: string;
  section: string;
  direction: string;
}

export interface BriefHookOption {
  optionNumber: 1 | 2 | 3;
  hook: HookType;
  format: FormatType;
  offer: OfferType;
  audience: AudienceType;
  posts: number;
  rawConversion: number;
  ciLow: number;
  ciHigh: number;
  shrunkConversion: number;
}

export interface ExperimentSlot {
  hook: HookType;
  format: FormatType;
  offer: OfferType;
  audience: AudienceType;
  posts: number;
  rawConversion: number;
  label: string;
}

export interface GeneratedBrief {
  creator: Creator;
  promoCode: string;
  similarPostsCount: number;
  similarPostsScopeLabel: string;
  options: [BriefHookOption, BriefHookOption, BriefHookOption];
  scenes: SceneTiming[];
  offerCta: string;
  doList: string[];
  dontList: string[];
  experimentSlot: ExperimentSlot;
}

export interface ShotItem {
  timing: string;
  shot: string;
  visualNote: string;
}

export interface DraftTemplateOutput {
  optionNumber: 1 | 2 | 3;
  hook: HookType;
  format: FormatType;
  offer: OfferType;
  audience: AudienceType;
  promoCode: string;
  scriptAndCaption: string;
  videoPrompt: string;
  shotList: ShotItem[];
}

export type ComplianceStatus = 'Lolos' | 'Peringatan' | 'Memblokir';

export interface ComplianceRuleResult {
  ruleId: 'R1' | 'R2' | 'R3' | 'R4' | 'R5';
  severity: 'Memblokir' | 'Peringatan';
  title: string;
  status: ComplianceStatus;
  reason: string;
  matchedTerms?: string[];
}

export interface ComplianceEvaluation {
  results: ComplianceRuleResult[];
  hasBlocking: boolean;
  hasWarning: boolean;
  summary: string;
}

export type ApprovalStatus = 'Menunggu' | 'Disetujui' | 'Ditolak';

export interface ApprovalQueueItem {
  id: string;
  creatorId: string;
  audience: AudienceType;
  platform: Platform;
  promoCode: string;
  hook: HookType;
  format: FormatType;
  offer: OfferType;
  scriptAndCaption: string;
  videoPrompt: string;
  status: ApprovalStatus;
  rejectionReason?: RejectionReason;
  createdAt: string;
  updatedAt: string;
  compliance: ComplianceEvaluation;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  item: string;
  reason: string;
}

export interface PersistedDemoState {
  queue: ApprovalQueueItem[];
  auditLog: AuditLogEntry[];
  nextDraftNumber: number;
}

export const STORAGE_KEY = 'mas_gum_ai_demo_state_v2';

export function getCreatorPromoCode(creator: Creator): string {
  const suffix = creator.main_platform === 'TikTok Shop' ? 'TT' : 'SV';
  return `${creator.promo_code}-${suffix}`;
}

export function getSceneStructure(format: FormatType): SceneTiming[] {
  if (format === 'Klip 15 dtk') {
    return [
      {
        timing: '0:00 – 0:03',
        section: 'Hook Pembuka',
        direction: 'Berbicara langsung ke kamera sambil memegang kemasan SunnieBooks setinggi mata.',
      },
      {
        timing: '0:03 – 0:10',
        section: 'Produk Digunakan & Penawaran',
        direction: 'Tuang atau sajikan SunnieBooks dingin/hangat di bawah cahaya alami dan sebutkan penawarannya dengan jelas.',
      },
      {
        timing: '0:10 – 0:15',
        section: 'CTA & Kartu Penutup Pengungkapan',
        direction: 'Tampilkan kode promo kreator di layar, arahkan ke keranjang belanja, dan sertakan #ad.',
      },
    ];
  }

  if (format === 'Demo 30 dtk') {
    return [
      {
        timing: '0:00 – 0:04',
        section: 'Hook Pembuka',
        direction: 'Sampaikan kalimat hook dalam 3 detik pertama dengan latar dapur atau ruang belajar yang nyata.',
      },
      {
        timing: '0:04 – 0:14',
        section: 'Demo Rutinitas Sehari-hari',
        direction: 'Tunjukkan cara menyiapkan SunnieBooks langkah demi langkah dengan kemasan produk asli yang terbaca jelas.',
      },
      {
        timing: '0:14 – 0:23',
        section: 'Rincian Penawaran',
        direction: 'Jelaskan mekanisme dan nilai penawaran tanpa membuat klaim kesehatan yang belum disetujui.',
      },
      {
        timing: '0:23 – 0:30',
        section: 'CTA, Kode Promo & Pengungkapan',
        direction: 'Tahan kartu penutup berisi penawaran dan kode promo kreator; pastikan #ad terlihat di caption.',
      },
    ];
  }

  return [
    {
      timing: '0:00 – 0:06',
      section: 'Hook Pembuka',
      direction: 'Langsung bangun momen yang dekat dengan penonton sebelum memperkenalkan produk.',
    },
    {
      timing: '0:06 – 0:22',
      section: 'Cerita Konteks Harian',
      direction: 'Ceritakan tantangan rutinitasnya (pagi yang terburu-buru, jeda belajar, atau camilan sepulang sekolah).',
    },
    {
      timing: '0:22 – 0:42',
      section: 'Produk Digunakan',
      direction: 'Siapkan SunnieBooks di depan kamera dengan pencahayaan alami; patuhi hanya fakta rasa dan rutinitas yang sudah disetujui.',
    },
    {
      timing: '0:42 – 0:53',
      section: 'Detail Penawaran',
      direction: 'Jelaskan nilai paket bundel atau voucher dengan jelas di layar.',
    },
    {
      timing: '0:53 – 1:00',
      section: 'CTA & Kartu Penutup',
      direction: 'Ulangi kode promo, arahkan penonton ke tautan toko resmi, dan tampilkan #ad.',
    },
  ];
}

export function generateBriefForCreator(creatorId: string): GeneratedBrief {
  const creator =
    SYNTHETIC_DATASET.creators.find((c) => c.creator_id === creatorId) ??
    SYNTHETIC_DATASET.creators[0];

  const promoCode = getCreatorPromoCode(creator);

  // Similar posts: same audience and platform; if < 60, fall back to same audience only
  const sameAudienceAndPlatform = SYNTHETIC_DATASET.posts.filter(
    (p) => p.audience_segment === creator.audience && p.platform === creator.main_platform
  );

  const useFallback = sameAudienceAndPlatform.length < 60;
  const similarPosts = useFallback
    ? SYNTHETIC_DATASET.posts.filter((p) => p.audience_segment === creator.audience)
    : sameAudienceAndPlatform;

  const similarPostsScopeLabel = useFallback
    ? `${creator.audience} (semua platform)`
    : `${creator.audience} · ${creator.main_platform}`;

  // Pull ranked combinations from the exact same Pattern Table data
  const platformAnalysis = analyzePatterns(
    SYNTHETIC_DATASET.posts,
    useFallback ? 'Semua' : creator.main_platform
  );

  // Reconstruct all pattern table rows (>= 3 posts) for the selected audience from the same platform dataset
  const audiencePosts = (
    useFallback
      ? SYNTHETIC_DATASET.posts
      : SYNTHETIC_DATASET.posts.filter((p) => p.platform === creator.main_platform)
  ).filter((p) => p.audience_segment === creator.audience);

  const overallConv = platformAnalysis.kpis.conversion;
  const comboMap = new Map<
    string,
    {
      hook: HookType;
      format: FormatType;
      offer: OfferType;
      audience: AudienceType;
      posts: number;
      clicks: number;
      orders: number;
    }
  >();

  for (const post of audiencePosts) {
    const key = `${post.hook_type}||${post.format}||${post.offer}`;
    const existing = comboMap.get(key);
    if (existing) {
      existing.posts += 1;
      existing.clicks += post.clicks;
      existing.orders += post.orders;
    } else {
      comboMap.set(key, {
        hook: post.hook_type,
        format: post.format,
        offer: post.offer,
        audience: post.audience_segment,
        posts: 1,
        clicks: post.clicks,
        orders: post.orders,
      });
    }
  }

  const allObservedCombos: PatternRow[] = [];
  for (const item of comboMap.values()) {
    const rawConversion = item.clicks > 0 ? item.orders / item.clicks : 0;
    const ci = wilsonInterval(item.orders, item.clicks);
    const shrunk = shrunkConversion(item.orders, item.clicks, overallConv);
    allObservedCombos.push({
      rank: 0,
      hook: item.hook,
      format: item.format,
      offer: item.offer,
      audience: item.audience,
      posts: item.posts,
      clicks: item.clicks,
      orders: item.orders,
      rawConversion,
      ciLow: ci.low,
      ciHigh: ci.high,
      shrunkConversion: shrunk,
      lowSample: item.posts < 10,
    });
  }

  // Eligible combos (>= 3 posts) matching Pattern Table criteria, sorted by shrunk conversion desc
  const eligible = allObservedCombos
    .filter((c) => c.posts >= 3)
    .sort((a, b) => {
      if (b.shrunkConversion !== a.shrunkConversion) {
        return b.shrunkConversion - a.shrunkConversion;
      }
      return `${a.hook}|${a.format}|${a.offer}`.localeCompare(`${b.hook}|${b.format}|${b.offer}`);
    });

  // Pick 3 options with DIFFERENT hook types, ranked by shrunk conversion
  const pickedHooks = new Set<HookType>();
  const topThree: BriefHookOption[] = [];
  for (const row of eligible) {
    if (!pickedHooks.has(row.hook)) {
      pickedHooks.add(row.hook);
      topThree.push({
        optionNumber: (topThree.length + 1) as 1 | 2 | 3,
        hook: row.hook,
        format: row.format,
        offer: row.offer,
        audience: row.audience,
        posts: row.posts,
        rawConversion: row.rawConversion,
        ciLow: row.ciLow,
        ciHigh: row.ciHigh,
        shrunkConversion: row.shrunkConversion,
      });
      if (topThree.length === 3) break;
    }
  }

  // Experiment slot: combination with the fewest posts so far (deterministic tie-break)
  const sortedByFewest = [...allObservedCombos].sort((a, b) => {
    if (a.posts !== b.posts) return a.posts - b.posts;
    if (a.clicks !== b.clicks) return a.clicks - b.clicks;
    return `${a.hook}|${a.format}|${a.offer}`.localeCompare(`${b.hook}|${b.format}|${b.offer}`);
  });

  const exp = sortedByFewest[0];
  const experimentSlot: ExperimentSlot = {
    hook: exp.hook,
    format: exp.format,
    offer: exp.offer,
    audience: exp.audience,
    posts: exp.posts,
    rawConversion: exp.rawConversion,
    label: `Uji coba dengan bukti minim (${exp.posts} postingan sejauh ini)`,
  };

  const optionOne = topThree[0];

  return {
    creator,
    promoCode,
    similarPostsCount: similarPosts.length,
    similarPostsScopeLabel,
    options: [topThree[0], topThree[1], topThree[2]],
    scenes: getSceneStructure(optionOne.format),
    offerCta: `Tonjolkan “${optionOne.offer}” di ${creator.main_platform} dan arahkan penonton untuk menukarkan kode ${promoCode} saat checkout di toko resmi SunnieBooks (SKU ilustratif).`,
    doList: [
      'Tunjukkan produk asli yang sedang digunakan selama demonstrasi.',
      'Gunakan hanya klaim rasa, rutinitas, dan kepraktisan yang sudah disetujui.',
      'Cantumkan pengungkapan sponsor (#ad) dengan jelas di caption dan kartu penutup.',
    ],
    dontList: [
      'Tanpa klaim kesehatan atau kekebalan (misalnya imunitas, kekebalan tubuh, menambah tinggi badan, meningkatkan IQ, meningkatkan kecerdasan).',
      'Tanpa perbandingan dengan merek lain (misalnya lebih baik dari, mengalahkan, lebih buruk dari).',
      'Hindari kata absolut atau tanpa bukti seperti “terbaik” atau “dijamin”.',
    ],
    experimentSlot,
  };
}

// Per-value deterministic templates for Hook (4), Format (3), and Offer (3)
const HOOK_OPENERS: Record<HookType, Record<AudienceType, string>> = {
  
  Pertanyaan: {
    'Orang tua muda':
      'Mencari minuman cokelat malt sore yang praktis dan selalu dihabiskan anak-anak Anda sebelum mengerjakan PR?',
    Pelajar:
      'Butuh penyegar cokelat malt cepat di sela kuliah sore tanpa mengganggu jadwal belajar Anda?',
    'Anak aktif':
      'Apa yang langsung masuk ke tas camilan setelah latihan olahraga sekolah, saat semua orang ingin sesuatu yang dingin dan berasa cokelat?',
  },
  'Masalah-solusi': {
    'Orang tua muda':
      'Pagi hari sekolah yang sibuk nyaris tidak menyisakan waktu menyiapkan camilan — menyetok kemasan siap saji SunnieBooks mengatasi kerepotan itu dalam hitungan detik.',
    Pelajar:
      'Hari kuliah yang panjang membuat rasa lapar sore sulit direncanakan — memasukkan kemasan SunnieBooks dingin ke ransel membuat persiapan jadi simpel.',
    'Anak aktif':
      'Pulang dalam keadaan lapar setelah latihan olahraga bisa membuat dapur kacau — kemasan SunnieBooks dingin sudah siap begitu mereka melangkah masuk.',
  },
  'Bukti sosial': {
    'Orang tua muda':
      'Begitu banyak orang tua di komunitas kami menyimpan satu karton penuh SunnieBooks untuk rutinitas sekolah hari kerja — inilah alasan SunnieBooks selalu ada di lemari dapur kami.',
    Pelajar:
      'Separuh kelompok belajar saya menaruh kemasan SunnieBooks ini di meja saat pekan ujian, jadi saya menyetok paket bundel dari toko resmi.',
    'Anak aktif':
      'Orang tua di tim akhir pekan kami terus bertanya apa yang kami bawa di cooler setelah latihan — selalu SunnieBooks dingin.',
  },
  
  'Rasa penasaran': {
    'Orang tua muda':
      'Inilah rutinitas lemari dapur 10 detik yang mengubah cara kami menangani waktu camilan sepulang sekolah di rumah.',
    Pelajar:
      'Tunggu sampai Anda lihat betapa mudahnya menyetok camilan pekan belajar dengan satu paket bundel dari toko resmi.',
    'Anak aktif':
      'Inilah satu rutinitas cokelat malt dingin yang tidak pernah kami lewatkan sebelum berangkat latihan sore.',
  },
};

const FORMAT_MIDDLES: Record<FormatType, string> = {
  'Klip 15 dtk':
    'Cek rutinitas cepat 15 detik: buka kemasan, tuang di atas es, dan pastikan karton SunnieBooks terlihat jelas di frame sambil menunjukkan betapa cepatnya ia masuk ke hari Anda.',
  'Demo 30 dtk':
    'Demo 30 detik langkah demi langkah: kocok dan dinginkan kemasan SunnieBooks, tuang ke gelas bening di bawah cahaya siang alami, dan tunjukkan label kemasan dengan jelas di atas meja.',
  'Cerita 60 dtk':
    'Cerita harian 60 detik penuh: ikuti momen nyata dari persiapan yang sibuk hingga duduk dengan segelas SunnieBooks dingin, menampilkan kemasan asli yang digunakan dari awal sampai akhir.',
};

const OFFER_DETAILS: Record<OfferType, (promoCode: string) => string> = {
  'Beli 2 gratis 1': (promoCode) =>
    `Penawaran hari ini: Beli 2 gratis 1 untuk SunnieBooks (SKU ilustratif) saat Anda mengetuk tautan toko resmi dan memasukkan kode ${promoCode} saat checkout.`,
  'Voucher diskon': (promoCode) =>
    `Gunakan voucher diskon toko resmi bersama kode ${promoCode} saat checkout untuk berhemat pada pesanan SunnieBooks (SKU ilustratif) Anda.`,
  'Hadiah gratis': (promoCode) =>
    `Dapatkan penawaran paket hadiah gratis di tautan toko resmi dan masukkan kode ${promoCode} saat checkout selama stok masih ada.`,
};

const FORMAT_SHOT_LISTS: Record<FormatType, (promoCode: string, offer: OfferType) => ShotItem[]> = {
  'Klip 15 dtk': (promoCode, offer) => [
    {
      timing: '0:00 – 0:03',
      shot: 'Hook presenter close-up',
      visualNote: 'Pegang kemasan SunnieBooks setinggi dada di bawah cahaya jendela alami; tanpa klaim kesehatan di layar.',
    },
    {
      timing: '0:03 – 0:10',
      shot: 'Tuang produk & frame bundel',
      visualNote: `Tampilkan produk dengan jelas di frame vertikal 9:16; teks overlay menyebut “${offer}”.`,
    },
    {
      timing: '0:10 – 0:15',
      shot: 'Kartu penutup penawaran & promo',
      visualNote: `Kartu penutup bersih yang menampilkan “${offer}” dan kode “${promoCode}” beserta #ad.`,
    },
  ],
  'Demo 30 dtk': (promoCode, offer) => [
    {
      timing: '0:00 – 0:04',
      shot: 'Hook langsung ke kamera',
      visualNote: 'Framing vertikal 9:16, cahaya siang alami, karton SunnieBooks terlihat jelas di meja.',
    },
    {
      timing: '0:04 – 0:14',
      shot: 'Demo persiapan langsung',
      visualNote: 'Tuang SunnieBooks di atas es ke gelas bening; jaga agar kemasan tidak terhalang.',
    },
    {
      timing: '0:14 – 0:23',
      shot: 'Penjelasan penawaran',
      visualNote: `Tunjukkan jumlah multipack yang sesuai dengan “${offer}” dengan teks overlay netral yang bersih.`,
    },
    {
      timing: '0:23 – 0:30',
      shot: 'Kartu penutup & CTA',
      visualNote: `Kartu penutup berisi “${offer}”, kode promo “${promoCode}”, dan pengungkapan #ad.`,
    },
  ],
  'Cerita 60 dtk': (promoCode, offer) => [
    {
      timing: '0:00 – 0:06',
      shot: 'Hook di situasi nyata',
      visualNote: 'Bidikan dapur atau meja dengan cahaya alami yang memperkenalkan momen sehari-hari.',
    },
    {
      timing: '0:06 – 0:22',
      shot: 'B-roll konteks rutinitas',
      visualNote: 'Tunjukkan menyiapkan tas atau persiapan camilan sore tanpa perbandingan merek.',
    },
    {
      timing: '0:22 – 0:42',
      shot: 'Urutan produk digunakan',
      visualNote: 'Sajikan SunnieBooks di depan kamera dengan label produk tajam dan tanpa klaim kesehatan di layar.',
    },
    {
      timing: '0:42 – 0:53',
      shot: 'Penjelasan penawaran',
      visualNote: `Tunjuk ikon keranjang dan sebutkan “${offer}” dengan jelas di toko resmi.`,
    },
    {
      timing: '0:53 – 1:00',
      shot: 'Kartu penutup kode promo',
      visualNote: `Tahan kartu penutup 9:16 berisi “${offer}”, kode “${promoCode}”, dan #ad.`,
    },
  ],
};

export function generateDraftFromOption(
  brief: GeneratedBrief,
  optionIndex: 0 | 1 | 2
): DraftTemplateOutput {
  const option = brief.options[optionIndex] ?? brief.options[0];
  const opener = HOOK_OPENERS[option.hook][option.audience];
  const middle = FORMAT_MIDDLES[option.format];
  const offerLine = OFFER_DETAILS[option.offer](brief.promoCode);

  const scriptAndCaption = [
    `[Skrip]`,
    opener,
    middle,
    offerLine,
    ``,
    `[Caption]`,
    `${option.offer} untuk SunnieBooks (SKU ilustratif) lewat tautan ${brief.creator.main_platform} resmi. Gunakan kode ${brief.promoCode} saat checkout. #ad #SunnieBooks`,
  ].join('\n');

  const videoPrompt = `Video vertikal 9:16 untuk ${brief.creator.main_platform} dengan target ${option.audience}. Ambil gambar dengan cahaya alami dan produk SunnieBooks (SKU ilustratif) terlihat jelas di frame sepanjang format ${option.format}. Gunakan pembuka bergaya ${option.hook.toLowerCase()}, tunjukkan persiapan nyata di suasana sehari-hari, tanpa klaim kesehatan di layar, dan tutup dengan kartu penutup bersih yang menampilkan “${option.offer}” dan kode promo “${brief.promoCode}”.`;

  const shotList = FORMAT_SHOT_LISTS[option.format](brief.promoCode, option.offer);

  return {
    optionNumber: option.optionNumber,
    hook: option.hook,
    format: option.format,
    offer: option.offer,
    audience: option.audience,
    promoCode: brief.promoCode,
    scriptAndCaption,
    videoPrompt,
    shotList,
  };
}

function findMatches(text: string, patterns: RegExp[]): string[] {
  const matched: string[] = [];
  for (const regex of patterns) {
    const m = text.match(regex);
    if (m && m[0]) {
      matched.push(m[0]);
    }
  }
  return matched;
}

export function evaluateCompliance(scriptText: string): ComplianceEvaluation {
  const text = scriptText || '';

  const r1Matches = findMatches(text, [
    /\bcures?\b/i,
    /\bguarante(?:e|ed)\b/i,
    /\bmiracle\b/i,
    /\bmenyembuhkan\b/i,
    /\bdijamin\b/i,
    /\bgaransi\b/i,
    /\bajaib\b/i,
    /\bmukjizat\b/i,
  ]);
  const r2Matches = findMatches(text, [
    /\bimmunity\b/i,
    /\bimmune\b/i,
    /\bgrow taller\b/i,
    /\bboosts?\s+iq\b/i,
    /\bboosts?\s+brain\b/i,
    /\bimunitas\b/i,
    /\bkekebalan(?:\s+tubuh)?\b/i,
    /\bmenambah\s+tinggi(?:\s+badan)?\b/i,
    /\bmeningkatkan\s+iq\b/i,
    /\bmeningkatkan\s+(?:kecerdasan|otak)\b/i,
  ]);
  const r3Matches = findMatches(text, [
    /\bbetter than\b/i,
    /\bbeats\b/i,
    /\bworse than\b/i,
    /\blebih\s+baik\s+dari(?:pada)?\b/i,
    /\bmengalahkan\b/i,
    /\blebih\s+buruk\s+dari(?:pada)?\b/i,
  ]);
  const r4Matches = findMatches(text, [
    /\bbest\b/i,
    /\bno\.?\s*1\b/i,
    /\bnumber one\b/i,
    /\bterbaik\b/i,
    /\bnomor\s+(?:1|satu)\b/i,
  ]);
  const hasAdDisclosure = /(?:^|\s)#ad(?:\b|\s|$)/i.test(text);

  const results: ComplianceRuleResult[] = [
    {
      ruleId: 'R1',
      severity: 'Memblokir',
      title: 'Klaim absolut atau medis',
      status: r1Matches.length > 0 ? 'Memblokir' : 'Lolos',
      reason:
        r1Matches.length > 0
          ? `Mengandung istilah terlarang: "${r1Matches.join('", "')}".`
          : 'Tidak ada klaim absolut atau medis yang terdeteksi.',
      matchedTerms: r1Matches,
    },
    {
      ruleId: 'R2',
      severity: 'Memblokir',
      title: 'Klaim kesehatan yang belum disetujui',
      status: r2Matches.length > 0 ? 'Memblokir' : 'Lolos',
      reason:
        r2Matches.length > 0
          ? `Mengandung klaim kesehatan yang belum disetujui: "${r2Matches.join('", "')}".`
          : 'Tidak ada klaim kesehatan yang belum disetujui yang terdeteksi.',
      matchedTerms: r2Matches,
    },
    {
      ruleId: 'R3',
      severity: 'Memblokir',
      title: 'Klaim perbandingan merek',
      status: r3Matches.length > 0 ? 'Memblokir' : 'Lolos',
      reason:
        r3Matches.length > 0
          ? `Mengandung frasa perbandingan: "${r3Matches.join('", "')}".`
          : 'Tidak ada perbandingan dengan merek lain yang terdeteksi.',
      matchedTerms: r3Matches,
    },
    {
      ruleId: 'R4',
      severity: 'Peringatan',
      title: 'Superlatif tanpa bukti',
      status: r4Matches.length > 0 ? 'Peringatan' : 'Lolos',
      reason:
        r4Matches.length > 0
          ? `Superlatif memerlukan bukti: "${r4Matches.join('", "')}".`
          : 'Tidak ada superlatif tanpa bukti yang terdeteksi.',
      matchedTerms: r4Matches,
    },
    {
      ruleId: 'R5',
      severity: 'Peringatan',
      title: 'Pengungkapan sponsor (#ad)',
      status: hasAdDisclosure ? 'Lolos' : 'Peringatan',
      reason: hasAdDisclosure
        ? 'Menyertakan pengungkapan “#ad” yang diwajibkan.'
        : 'Pengungkapan sponsor “#ad” tidak ada.',
      matchedTerms: [],
    },
  ];

  const hasBlocking = results.some((r) => r.status === 'Memblokir');
  const hasWarning = results.some((r) => r.status === 'Peringatan');

  const summary = hasBlocking
    ? 'Diblokir: selesaikan aturan pemblokir sebelum persetujuan.'
    : hasWarning
      ? 'Ada peringatan: tinjau sebelum persetujuan.'
      : 'Semua pemeriksaan rulebook demo lolos.';

  return { results, hasBlocking, hasWarning, summary };
}

export function createInitialDemoState(): PersistedDemoState {
  const c003 = SYNTHETIC_DATASET.creators.find((c) => c.creator_id === 'C-003')!;
  const c008 = SYNTHETIC_DATASET.creators.find((c) => c.creator_id === 'C-008')!;

  const d001Script = [
    `[Script]`,
    `Para orang tua, mencari minuman cokelat malt harian yang meningkatkan imunitas anak Anda, dijamin? Simpan SunnieBooks (SKU ilustratif) untuk pagi sekolah yang sibuk dan tukarkan Beli 2 gratis 1 dengan kode SUNNIEBOOKS-C003-TT.`,
    ``,
    `[Caption]`,
    `Beli 2 gratis 1 untuk SunnieBooks (SKU ilustratif) lewat tautan TikTok Shop resmi. Gunakan kode SUNNIEBOOKS-C003-TT saat checkout. #ad #SunnieBooks`,
  ].join('\n');

  const d002Script = [
    `[Script]`,
    `Hari kuliah yang panjang membuat rasa lapar sore sulit direncanakan — menyiapkan SunnieBooks (SKU ilustratif) dingin di tas Anda menghemat waktu di antara kelas. Dapatkan voucher diskon di Shopee Video dengan kode SUNNIEBOOKS-C008-SV.`,
    ``,
    `[Caption]`,
    `Voucher diskon untuk SunnieBooks (SKU ilustratif) lewat tautan Shopee Video resmi. Gunakan kode SUNNIEBOOKS-C008-SV saat checkout. #SunnieBooks`,
  ].join('\n');

  const d001Eval = evaluateCompliance(d001Script);
  const d002Eval = evaluateCompliance(d002Script);

  const d001: ApprovalQueueItem = {
    id: 'D-001',
    creatorId: c003.creator_id,
    audience: c003.audience,
    platform: c003.main_platform,
    promoCode: getCreatorPromoCode(c003),
    hook: 'Pertanyaan',
    format: 'Demo 30 dtk',
    offer: 'Beli 2 gratis 1',
    scriptAndCaption: d001Script,
    videoPrompt:
      'Video vertikal 9:16 untuk TikTok Shop dengan target Anak aktif. Cahaya alami, produk terlihat jelas di frame, tanpa klaim kesehatan di layar, kartu penutup berisi Beli 2 gratis 1 dan SUNNIEBOOKS-C003-TT.',
    status: 'Menunggu',
    createdAt: '2026-10-30 09:00:00 UTC',
    updatedAt: '2026-10-30 09:00:00 UTC',
    compliance: d001Eval,
  };

  const d002: ApprovalQueueItem = {
    id: 'D-002',
    creatorId: c008.creator_id,
    audience: c008.audience,
    platform: c008.main_platform,
    promoCode: getCreatorPromoCode(c008),
    hook: 'Masalah-solusi',
    format: 'Demo 30 dtk',
    offer: 'Voucher diskon',
    scriptAndCaption: d002Script,
    videoPrompt:
      'Video vertikal 9:16 untuk Shopee Video dengan target Pelajar. Cahaya alami, produk terlihat jelas di frame, tanpa klaim kesehatan di layar, kartu penutup berisi Voucher diskon dan SUNNIEBOOKS-C008-SV.',
    status: 'Menunggu',
    createdAt: '2026-10-30 09:05:00 UTC',
    updatedAt: '2026-10-30 09:05:00 UTC',
    compliance: d002Eval,
  };

  const auditLog: AuditLogEntry[] = [
    {
      id: 'AUD-001',
      timestamp: '2026-10-30 09:00:00 UTC',
      actor: 'Sistem (Seed)',
      action: 'Draf dibuat',
      item: 'D-001 (C-003)',
      reason: 'Draf yang sudah disiapkan antre untuk ditinjau',
    },
    {
      id: 'AUD-002',
      timestamp: '2026-10-30 09:00:01 UTC',
      actor: 'Mesin Rulebook',
      action: 'Pemeriksaan kepatuhan',
      item: 'D-001 (C-003)',
      reason: 'Diblokir oleh R1 (dijamin) dan R2 (imunitas)',
    },
    {
      id: 'AUD-003',
      timestamp: '2026-10-30 09:05:00 UTC',
      actor: 'Sistem (Seed)',
      action: 'Draf dibuat',
      item: 'D-002 (C-008)',
      reason: 'Draf yang sudah disiapkan antre untuk ditinjau',
    },
    {
      id: 'AUD-004',
      timestamp: '2026-10-30 09:05:01 UTC',
      actor: 'Mesin Rulebook',
      action: 'Pemeriksaan kepatuhan',
      item: 'D-002 (C-008)',
      reason: 'Peringatan R5 (“#ad” tidak ada); tidak ada penanda pemblokir',
    },
  ];

  return {
    queue: [d001, d002],
    auditLog,
    nextDraftNumber: 3,
  };
}

export function loadPersistedDemoState(): PersistedDemoState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialDemoState();
    const parsed = JSON.parse(raw) as PersistedDemoState;
    if (!parsed || !Array.isArray(parsed.queue) || !Array.isArray(parsed.auditLog)) {
      return createInitialDemoState();
    }
    return parsed;
  } catch {
    return createInitialDemoState();
  }
}

export function savePersistedDemoState(state: PersistedDemoState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted iframe environments
  }
}

export function formatUtcTimestamp(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(
    date.getUTCHours()
  )}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
}

export function exportAuditLogCsv(entries: AuditLogEntry[]): void {
  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const headers = ['Waktu', 'Aktor', 'Tindakan', 'Item', 'Alasan'];
  const lines = [
    headers.map(escape).join(','),
    ...entries.map((e) =>
      [e.timestamp, e.actor, e.action, e.item, e.reason].map(escape).join(',')
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'mas_gum_ai_audit_log.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
