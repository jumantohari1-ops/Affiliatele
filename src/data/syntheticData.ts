export type Platform = 'TikTok Shop' | 'Shopee Video';
export type PlatformFilter = 'Semua' | Platform;

export type HookType = 'Pertanyaan' | 'Masalah-solusi' | 'Bukti sosial' | 'Rasa penasaran';
export type FormatType = 'Klip 15 dtk' | 'Demo 30 dtk' | 'Cerita 60 dtk';
export type OfferType = 'Beli 2 gratis 1' | 'Voucher diskon' | 'Hadiah gratis';
export type AudienceType = 'Orang tua muda' | 'Pelajar' | 'Anak aktif';

export const PLATFORMS: Platform[] = ['TikTok Shop', 'Shopee Video'];
export const HOOKS: HookType[] = ['Pertanyaan', 'Masalah-solusi', 'Bukti sosial', 'Rasa penasaran'];
export const FORMATS: FormatType[] = ['Klip 15 dtk', 'Demo 30 dtk', 'Cerita 60 dtk'];
export const OFFERS: OfferType[] = ['Beli 2 gratis 1', 'Voucher diskon', 'Hadiah gratis'];
export const AUDIENCES: AudienceType[] = ['Orang tua muda', 'Pelajar', 'Anak aktif'];

export const PLANTED_WINNERS = {
  hook: 'Pertanyaan' as HookType,
  format: 'Demo 30 dtk' as FormatType,
  offer: 'Beli 2 gratis 1' as OfferType,
  audience: 'Orang tua muda' as AudienceType,
} as const;

export const SHRUNK_PRIOR_CLICKS = 2000;

export interface Creator {
  creator_id: string;
  audience: AudienceType;
  main_platform: Platform;
  size_factor: number;
  creator_factor: number;
  promo_code: string;
}

export interface Post {
  post_id: string;
  creator_id: string;
  platform: Platform;
  post_datetime: string;
  day_index: number;
  hook_type: HookType;
  format: FormatType;
  offer: OfferType;
  audience_segment: AudienceType;
  sku: string;
  promo_code: string;
  utm_link: string;
  impressions: number;
  clicks: number;
  orders: number;
  units: number;
  revenue: number;
  sales_channel: string;
  region: string;
  store_id: string;
}

export interface DimensionValueStat {
  value: string;
  posts: number;
  clicks: number;
  orders: number;
  conversion: number;
  ciLow: number;
  ciHigh: number;
  isPlantedWinner: boolean;
}

export interface DimensionSummary {
  key: 'hook' | 'format' | 'offer' | 'audience';
  label: string;
  values: DimensionValueStat[];
}

export interface PatternRow {
  rank: number;
  hook: HookType;
  format: FormatType;
  offer: OfferType;
  audience: AudienceType;
  posts: number;
  clicks: number;
  orders: number;
  rawConversion: number;
  ciLow: number;
  ciHigh: number;
  shrunkConversion: number;
  lowSample: boolean;
}

export interface RecoveryCheckRow {
  dimension: string;
  plantedWinner: string;
  recoveredWinner: string;
  winnerConversion: number;
  restConversion: number;
  liftVsRest: number;
  match: boolean;
}

export interface PlatformSummary {
  platform: Platform;
  posts: number;
  clicks: number;
  orders: number;
  conversion: number;
  revenue: number;
}

export interface WeeklyReconciliationRow {
  weekLabel: string;
  dateRange: string;
  ourOrders: number;
  platformOrders: number;
  ourRevenue: number;
  platformRevenue: number;
  gapOrders: number;
  gapPercent: number;
  unattributedSalesPct: number;
}

export interface PatternAnalysis {
  kpis: {
    posts: number;
    clicks: number;
    orders: number;
    conversion: number;
    revenue: number;
  };
  dimensions: DimensionSummary[];
  topPatterns: PatternRow[];
  totalEligibleCombos: number;
  recoveryRows: RecoveryCheckRow[];
  topComboPlantedMatches: number;
  topCombo: PatternRow | null;
}

/**
 * Mulberry32 deterministic PRNG so seed 42 yields identical data on every reload.
 */
function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pad3(n: number): string {
  return String(n).padStart(3, '0');
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

const REGIONS = ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Can Tho', 'Hai Phong'];
const ILLUSTRATIVE_SKUS = [
  'SUNNIEBOOKS-ACT-180ML-4P',
  'SUNNIEBOOKS-ACT-180ML-24P',
  'SUNNIEBOOKS-PRO-210ML-4P',
];

function buildSyntheticDataset(seed = 42): { creators: Creator[]; posts: Post[] } {
  const rng = createSeededRng(seed);
  const creators: Creator[] = [];

  for (let i = 1; i <= 30; i++) {
    const idNum = pad3(i);
    const creator_id = `C-${idNum}`;
    const audience = AUDIENCES[(i - 1) % AUDIENCES.length];
    const main_platform = PLATFORMS[(i - 1) % PLATFORMS.length];
    const size_factor = Number((0.6 + rng() * 1.6).toFixed(3)); // 0.6 to 2.2
    const creator_factor = Number((0.85 + rng() * 0.3).toFixed(4)); // 0.85 to 1.15
    const promo_code = `SUNNIEBOOKS-C${idNum}`;

    creators.push({
      creator_id,
      audience,
      main_platform,
      size_factor,
      creator_factor,
      promo_code,
    });
  }

  // Fixed 90-day window starting 2026-08-01 UTC
  const startEpochMs = Date.UTC(2026, 7, 1, 0, 0, 0);
  const posts: Post[] = [];
  let postCounter = 1;

  for (const creator of creators) {
    for (let p = 0; p < 30; p++) {
      const post_id = `P-${String(postCounter).padStart(4, '0')}`;
      postCounter++;

      // Spread 30 posts roughly evenly across the 90-day window with jitter
      const day_index = Math.min(89, Math.floor(p * 3 + rng() * 3));
      const hour = Math.floor(8 + rng() * 14);
      const minute = Math.floor(rng() * 60);
      const postDate = new Date(startEpochMs + day_index * 86400_000 + hour * 3600_000 + minute * 60_000);
      const post_datetime = `${postDate.getUTCFullYear()}-${pad2(postDate.getUTCMonth() + 1)}-${pad2(
        postDate.getUTCDate()
      )} ${pad2(postDate.getUTCHours())}:${pad2(postDate.getUTCMinutes())}`;

      // 75% on main platform, 25% on secondary platform
      const platform: Platform =
        rng() < 0.75
          ? creator.main_platform
          : creator.main_platform === 'TikTok Shop'
            ? 'Shopee Video'
            : 'TikTok Shop';

      const hook_type = HOOKS[Math.floor(rng() * HOOKS.length)];
      const format = FORMATS[Math.floor(rng() * FORMATS.length)];
      const offer = OFFERS[Math.floor(rng() * OFFERS.length)];
      // Primarily creator's audience (65%), with 35% cross-segment tests for combination coverage
      const audience_segment: AudienceType =
        rng() < 0.65 ? creator.audience : AUDIENCES[Math.floor(rng() * AUDIENCES.length)];

      const baseClicks = 150 + rng() * 900; // 150 to 1050
      const clicks = Math.max(50, Math.round(baseClicks * creator.size_factor));
      const ctr = 0.022 + rng() * 0.022; // 2.2% to 4.4% CTR
      const impressions = Math.max(clicks, Math.round(clicks / ctr));

      // Base conversion 4% multiplied by planted lifts + creator factor
      const hookLift = hook_type === 'Pertanyaan' ? 1.25 : 1.0;
      const formatLift = format === 'Demo 30 dtk' ? 1.2 : 1.0;
      const offerLift = offer === 'Beli 2 gratis 1' ? 1.3 : 1.0;
      const audienceLift = audience_segment === 'Orang tua muda' ? 1.15 : 1.0;
      const platformLift = platform === 'Shopee Video' ? 1.05 : 1.0;

      const convProb = Math.min(
        0.5,
        0.04 * hookLift * formatLift * offerLift * audienceLift * platformLift * creator.creator_factor
      );

      // Exact binomial draw across `clicks` trials
      let orders = 0;
      for (let t = 0; t < clicks; t++) {
        if (rng() < convProb) {
          orders++;
        }
      }

      const revenuePerOrder = offer === 'Beli 2 gratis 1' ? 240_000 : 150_000;
      const revenue = orders * revenuePerOrder;
      const units = offer === 'Beli 2 gratis 1' ? orders * 3 : orders;

      const platformSlug = platform === 'TikTok Shop' ? 'tiktok_shop' : 'shopee_video';
      const platformSuffix = platform === 'TikTok Shop' ? 'TT' : 'SV';
      const promo_code = `${creator.promo_code}-${platformSuffix}`;
      const utm_link = `?utm_source=${platformSlug}&utm_medium=affiliate&utm_campaign=${creator.creator_id.toLowerCase()}&utm_content=${post_id.toLowerCase()}`;

      const sku =
        offer === 'Beli 2 gratis 1'
          ? ILLUSTRATIVE_SKUS[1]
          : ILLUSTRATIVE_SKUS[Math.floor(rng() * ILLUSTRATIVE_SKUS.length)];
      const region = REGIONS[Math.floor(rng() * REGIONS.length)];
      const sales_channel = platform === 'TikTok Shop' ? 'TikTok Shop Official' : 'Shopee Mall Video';
      const store_id = platform === 'TikTok Shop' ? 'STR-TT-VN01' : 'STR-SP-VN02';

      posts.push({
        post_id,
        creator_id: creator.creator_id,
        platform,
        post_datetime,
        day_index,
        hook_type,
        format,
        offer,
        audience_segment,
        sku,
        promo_code,
        utm_link,
        impressions,
        clicks,
        orders,
        units,
        revenue,
        sales_channel,
        region,
        store_id,
      });
    }
  }

  return { creators, posts };
}

export const SYNTHETIC_DATASET = buildSyntheticDataset(42);

/**
 * 95% Wilson score confidence interval treating clicks as trials.
 */
export function wilsonInterval(successes: number, trials: number): { low: number; high: number } {
  if (trials <= 0) {
    return { low: 0, high: 0 };
  }
  const z = 1.959963984540054;
  const z2 = z * z;
  const p = successes / trials;
  const denom = 1 + z2 / trials;
  const center = (p + z2 / (2 * trials)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / trials + z2 / (4 * trials * trials))) / denom;
  return {
    low: Math.max(0, center - half),
    high: Math.min(1, center + half),
  };
}

export function shrunkConversion(
  orders: number,
  clicks: number,
  overallConversion: number,
  priorClicks = SHRUNK_PRIOR_CLICKS
): number {
  if (clicks + priorClicks <= 0) return 0;
  return (orders + priorClicks * overallConversion) / (clicks + priorClicks);
}

export function analyzePatterns(posts: Post[], platformFilter: PlatformFilter): PatternAnalysis {
  const filtered =
    platformFilter === 'Semua' ? posts : posts.filter((post) => post.platform === platformFilter);

  let totalClicks = 0;
  let totalOrders = 0;
  let totalRevenue = 0;

  for (const post of filtered) {
    totalClicks += post.clicks;
    totalOrders += post.orders;
    totalRevenue += post.revenue;
  }

  const overallConversion = totalClicks > 0 ? totalOrders / totalClicks : 0;

  // Dimension summaries
  const dimensionConfigs: Array<{
    key: 'hook' | 'format' | 'offer' | 'audience';
    label: string;
    values: readonly string[];
    planted: string;
    accessor: (p: Post) => string;
  }> = [
    {
      key: 'hook',
      label: 'Hook',
      values: HOOKS,
      planted: PLANTED_WINNERS.hook,
      accessor: (p) => p.hook_type,
    },
    {
      key: 'format',
      label: 'Format',
      values: FORMATS,
      planted: PLANTED_WINNERS.format,
      accessor: (p) => p.format,
    },
    {
      key: 'offer',
      label: 'Penawaran',
      values: OFFERS,
      planted: PLANTED_WINNERS.offer,
      accessor: (p) => p.offer,
    },
    {
      key: 'audience',
      label: 'Audiens',
      values: AUDIENCES,
      planted: PLANTED_WINNERS.audience,
      accessor: (p) => p.audience_segment,
    },
  ];

  const dimensions: DimensionSummary[] = [];
  const recoveryRows: RecoveryCheckRow[] = [];

  for (const dim of dimensionConfigs) {
    const bucket = new Map<string, { posts: number; clicks: number; orders: number }>();
    for (const v of dim.values) {
      bucket.set(v, { posts: 0, clicks: 0, orders: 0 });
    }
    for (const post of filtered) {
      const val = dim.accessor(post);
      const entry = bucket.get(val);
      if (entry) {
        entry.posts += 1;
        entry.clicks += post.clicks;
        entry.orders += post.orders;
      }
    }

    const stats: DimensionValueStat[] = dim.values.map((val) => {
      const entry = bucket.get(val)!;
      const conversion = entry.clicks > 0 ? entry.orders / entry.clicks : 0;
      const ci = wilsonInterval(entry.orders, entry.clicks);
      return {
        value: val,
        posts: entry.posts,
        clicks: entry.clicks,
        orders: entry.orders,
        conversion,
        ciLow: ci.low,
        ciHigh: ci.high,
        isPlantedWinner: val === dim.planted,
      };
    });

    stats.sort((a, b) => b.conversion - a.conversion);
    dimensions.push({
      key: dim.key,
      label: dim.label,
      values: stats,
    });

    const recovered = stats[0];
    const restClicks = totalClicks - recovered.clicks;
    const restOrders = totalOrders - recovered.orders;
    const restConversion = restClicks > 0 ? restOrders / restClicks : 0;
    const liftVsRest = restConversion > 0 ? recovered.conversion / restConversion - 1 : 0;

    recoveryRows.push({
      dimension: dim.label,
      plantedWinner: dim.planted,
      recoveredWinner: recovered.value,
      winnerConversion: recovered.conversion,
      restConversion,
      liftVsRest,
      match: recovered.value === dim.planted,
    });
  }

  // Combination table: hook x format x offer x audience
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

  for (const post of filtered) {
    const key = `${post.hook_type}||${post.format}||${post.offer}||${post.audience_segment}`;
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

  const eligiblePatterns: PatternRow[] = [];
  for (const item of comboMap.values()) {
    if (item.posts < 3) continue;
    const rawConversion = item.clicks > 0 ? item.orders / item.clicks : 0;
    const ci = wilsonInterval(item.orders, item.clicks);
    const shrunk = shrunkConversion(item.orders, item.clicks, overallConversion, SHRUNK_PRIOR_CLICKS);
    eligiblePatterns.push({
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

  eligiblePatterns.sort((a, b) => b.shrunkConversion - a.shrunkConversion);
  const topPatterns = eligiblePatterns.slice(0, 10).map((row, idx) => ({
    ...row,
    rank: idx + 1,
  }));

  const topCombo = topPatterns[0] ?? null;
  let topComboPlantedMatches = 0;
  if (topCombo) {
    if (topCombo.hook === PLANTED_WINNERS.hook) topComboPlantedMatches++;
    if (topCombo.format === PLANTED_WINNERS.format) topComboPlantedMatches++;
    if (topCombo.offer === PLANTED_WINNERS.offer) topComboPlantedMatches++;
    if (topCombo.audience === PLANTED_WINNERS.audience) topComboPlantedMatches++;
  }

  return {
    kpis: {
      posts: filtered.length,
      clicks: totalClicks,
      orders: totalOrders,
      conversion: overallConversion,
      revenue: totalRevenue,
    },
    dimensions,
    topPatterns,
    totalEligibleCombos: eligiblePatterns.length,
    recoveryRows,
    topComboPlantedMatches,
    topCombo,
  };
}

export function computePlatformSummaries(posts: Post[]): PlatformSummary[] {
  return PLATFORMS.map((platform) => {
    const subset = posts.filter((p) => p.platform === platform);
    let clicks = 0;
    let orders = 0;
    let revenue = 0;
    for (const p of subset) {
      clicks += p.clicks;
      orders += p.orders;
      revenue += p.revenue;
    }
    return {
      platform,
      posts: subset.length,
      clicks,
      orders,
      conversion: clicks > 0 ? orders / clicks : 0,
      revenue,
    };
  });
}

export function computeWeeklyReconciliation(posts: Post[]): WeeklyReconciliationRow[] {
  // Take the last 6 full weeks (days 48..89) from the 90-day synthetic dataset
  const rng = createSeededRng(4242);
  const startEpochMs = Date.UTC(2026, 7, 1, 0, 0, 0);
  const rows: WeeklyReconciliationRow[] = [];

  for (let w = 0; w < 6; w++) {
    const dayStart = 48 + w * 7;
    const dayEnd = dayStart + 6;
    const weekPosts = posts.filter((p) => p.day_index >= dayStart && p.day_index <= dayEnd);

    let ourOrders = 0;
    let ourRevenue = 0;
    for (const p of weekPosts) {
      ourOrders += p.orders;
      ourRevenue += p.revenue;
    }

    // Synthetic platform-reported total includes a modest attribution timing/dedup variance
    const varianceFactor = 1.012 + rng() * 0.024; // +1.2% to +3.6% platform gross before dedup
    const platformOrders = Math.round(ourOrders * varianceFactor);
    const avgOrderValue = ourOrders > 0 ? ourRevenue / ourOrders : 175_000;
    const platformRevenue = Math.round((platformOrders * avgOrderValue) / 1000) * 1000;
    const gapOrders = platformOrders - ourOrders;
    const gapPercent = platformOrders > 0 ? gapOrders / platformOrders : 0;
    const unattributedSalesPct = Number((4.8 + rng() * 3.1).toFixed(1)); // Reported by channel export

    const d1 = new Date(startEpochMs + dayStart * 86400_000);
    const d2 = new Date(startEpochMs + dayEnd * 86400_000);
    const fmt = (d: Date) =>
      `${d.getUTCDate()} ${d.toLocaleString('id-ID', { month: 'short', timeZone: 'UTC' })}`;

    rows.push({
      weekLabel: `Minggu ${w + 8}`,
      dateRange: `${fmt(d1)} – ${fmt(d2)}`,
      ourOrders,
      platformOrders,
      ourRevenue,
      platformRevenue,
      gapOrders,
      gapPercent,
      unattributedSalesPct,
    });
  }

  return rows;
}
