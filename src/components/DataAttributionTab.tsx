import { useMemo, useState } from 'react';
import { ChevronDown, Database, GitMerge, Scale, Search } from 'lucide-react';
import {
  SYNTHETIC_DATASET,
  computeWeeklyReconciliation,
} from '../data/syntheticData';
import { InfoTooltip } from './InfoTooltip';
import { TabGuideCallout } from './TabGuideCallout';

interface SchemaField {
  field: string;
  description: string;
  example: string;
}

const samplePost = SYNTHETIC_DATASET.posts[0];
const sampleBuy2Post =
  SYNTHETIC_DATASET.posts.find((p) => p.offer === 'Beli 2 gratis 1') ?? samplePost;

const DATA_SCHEMA: SchemaField[] = [
  {
    field: 'post_id',
    description: 'Pengenal unik untuk satu postingan kreator yang dipublikasikan.',
    example: samplePost.post_id,
  },
  {
    field: 'creator_id',
    description: 'Pengenal kreator berpseudonim (C-001 sampai C-030).',
    example: samplePost.creator_id,
  },
  {
    field: 'platform',
    description: 'Kanal video commerce afiliasi tempat postingan tayang.',
    example: samplePost.platform,
  },
  {
    field: 'post_datetime',
    description: 'Cap waktu saat postingan afiliasi dipublikasikan (UTC).',
    example: samplePost.post_datetime,
  },
  {
    field: 'hook_type',
    description: 'Tag taksonomi hook kreatif pembuka.',
    example: samplePost.hook_type,
  },
  {
    field: 'format',
    description: 'Durasi video dan struktur narasi.',
    example: samplePost.format,
  },
  {
    field: 'offer',
    description: 'Mekanisme promosi yang ditampilkan di postingan.',
    example: sampleBuy2Post.offer,
  },
  {
    field: 'audience_segment',
    description: 'Segmen pembeli yang disasar oleh materi kreatif.',
    example: samplePost.audience_segment,
  },
  {
    field: 'sku',
    description: 'SKU produk ilustratif yang dipromosikan di postingan (SKU ilustratif SunnieBooks).',
    example: sampleBuy2Post.sku,
  },
  {
    field: 'promo_code / utm',
    description: 'Kode unik per kreator & platform ditambah tautan UTM terlacak.',
    example: `${samplePost.promo_code} · ${samplePost.utm_link}`,
  },
  {
    field: 'impressions',
    description: 'Total tayangan video / impresi yang tercatat di platform.',
    example: samplePost.impressions.toLocaleString('id-ID'),
  },
  {
    field: 'clicks',
    description: 'Klik kartu produk atau tautan afiliasi yang terlacak.',
    example: samplePost.clicks.toLocaleString('id-ID'),
  },
  {
    field: 'orders',
    description: 'Pesanan teratribusi tanpa duplikat yang dikreditkan ke kode atau tautan.',
    example: samplePost.orders.toLocaleString('id-ID'),
  },
  {
    field: 'units',
    description: 'Total unit SKU terjual dari seluruh pesanan teratribusi.',
    example: samplePost.units.toLocaleString('id-ID'),
  },
  {
    field: 'revenue',
    description: 'Pendapatan kotor pesanan teratribusi dalam VND.',
    example: `${samplePost.revenue.toLocaleString('id-ID')} VND`,
  },
  {
    field: 'sales_channel',
    description: 'Kanal toko resmi yang menerima pesanan.',
    example: samplePost.sales_channel,
  },
  {
    field: 'region',
    description: 'Wilayah pemenuhan pesanan atau pasar pembeli.',
    example: samplePost.region,
  },
  {
    field: 'store_id',
    description: 'Pengenal toko merchant yang digunakan untuk pencocokan ekspor mingguan.',
    example: samplePost.store_id,
  },
];

const ATTRIBUTION_RULES = [
  {
    title: 'Kode promo unik per kreator dan platform (kunci utama)',
    detail:
      'Setiap kreator menerima kode khusus kanal (misalnya SUNNIEBOOKS-C014-TT di TikTok Shop dan SUNNIEBOOKS-C014-SV di Shopee Video) sehingga pesanan dapat dipetakan dengan jelas ke satu kreator dan satu kanal.',
  },
  {
    title: 'Tautan terlacak dengan parameter UTM',
    detail:
      'Tautan produk afiliasi membawa parameter utm_source, utm_medium, utm_campaign, dan utm_content yang terkait dengan post_id untuk atribusi klik saat tidak ada kode promo yang dimasukkan.',
  },
  {
    title: 'Laporan afiliasi platform diserap sebagai ekspor terjadwal',
    detail:
      'Ekspor terjadwal dari pusat afiliasi TikTok Shop dan Shopee Video diserap dengan ritme tetap, bukan di-scrape secara ad-hoc.',
  },
  {
    title: 'Pesanan dikreditkan berdasarkan kode atau tautan; duplikat dihapus',
    detail:
      'Saat sebuah pesanan memiliki klik tautan terlacak sekaligus kode promo kreator, rekonsiliasi menghapus duplikat ID pesanan sehingga dihitung satu kali.',
  },
];

type AccordionKey = 'fields' | 'attribution' | 'reconciliation';

interface DataAttributionTabProps {
  onNextPatterns: () => void;
}

export function DataAttributionTab({ onNextPatterns }: DataAttributionTabProps) {
  const [openSections, setOpenSections] = useState<Record<AccordionKey, boolean>>({
    fields: true,
    attribution: false,
    reconciliation: false,
  });
  const [schemaQuery, setSchemaQuery] = useState('');

  const toggleSection = (key: AccordionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredSchema = useMemo(() => {
    const q = schemaQuery.trim().toLowerCase();
    if (!q) return DATA_SCHEMA;
    return DATA_SCHEMA.filter(
      (item) =>
        item.field.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q)
    );
  }, [schemaQuery]);

  const weeklyRows = useMemo(
    () => computeWeeklyReconciliation(SYNTHETIC_DATASET.posts),
    []
  );

  return (
    <div className="space-y-6">
      <TabGuideCallout
        lookingAt="Bidang persis yang dikumpulkan untuk setiap postingan kreator, cara penjualan dicocokkan kembali tanpa penghitungan ganda, dan total mingguan."
        whatToTry="Cari 18 bidang data atau buka bagian di bawah untuk melihat bagaimana kode promo dan tautan mencegah kredit ganda."
        nextLabel="Berikutnya: lihat pola pemenang"
        onNext={onNextPatterns}
      />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] flex flex-wrap items-center gap-2">
          <span>Skema data &amp; aturan atribusi</span>
          <InfoTooltip term="attribution" />
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-1">
          Bidang data tingkat postingan, aturan sederhana untuk mencocokkan penjualan, dan pemeriksaan kanal mingguan.
        </p>
      </div>

      {/* Accordion 1: Data Fields (Open by Default) */}
      <section className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('fields')}
          aria-expanded={openSections.fields}
          className="w-full px-5 sm:px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4F46E5]"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#6D28D9] flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[#0F172A]">Bidang data</h2>
              <p className="text-xs sm:text-sm text-[#64748B] truncate">
                18 bidang baku tingkat postingan dengan contoh dari dataset sintetis seed-42
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-[#64748B] shrink-0 transition-transform duration-200 ${
              openSections.fields ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {openSections.fields && (
          <div className="border-t border-slate-200">
            <div className="p-4 sm:px-6 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-xs font-medium text-[#64748B] font-mono tabular-nums">
                Menampilkan {filteredSchema.length} dari {DATA_SCHEMA.length} bidang
              </span>
              <div className="relative w-full sm:w-64">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={schemaQuery}
                  onChange={(e) => setSchemaQuery(e.target.value)}
                  placeholder="Filter bidang skema..."
                  aria-label="Filter bidang skema"
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-xl text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
              </div>
            </div>

            {filteredSchema.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-[#64748B] mb-3">
                  Tidak ada bidang skema yang cocok dengan &ldquo;{schemaQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setSchemaQuery('')}
                  className="min-h-[44px] px-4 py-2 text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  Hapus filter
                </button>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-[#64748B]">
                      <th className="py-3 pl-5 sm:pl-6 pr-3 whitespace-nowrap">Bidang</th>
                      <th className="py-3 px-3 whitespace-nowrap">Deskripsi</th>
                      <th className="py-3 pl-3 pr-5 sm:pr-6 whitespace-nowrap">Contoh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSchema.map((row) => (
                      <tr key={row.field} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 pl-5 sm:pl-6 pr-3 font-mono text-xs font-semibold text-[#4F46E5] whitespace-nowrap">
                          {row.field}
                        </td>
                        <td className="py-3 px-3 text-slate-700">{row.description}</td>
                        <td className="py-3 pl-3 pr-5 sm:pr-6 font-mono text-xs text-[#64748B] max-w-xs truncate">
                          <span title={row.example}>{row.example}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Accordion 2: How Sales Are Attributed */}
      <section className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('attribution')}
          aria-expanded={openSections.attribution}
          className="w-full px-5 sm:px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4F46E5]"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
              <GitMerge className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[#0F172A]">Cara penjualan diatribusikan</h2>
              <p className="text-xs sm:text-sm text-[#64748B] truncate">
                Empat aturan deterministik yang mengatur kode promo, UTM, ekspor terjadwal, dan penghapusan duplikat
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-[#64748B] shrink-0 transition-transform duration-200 ${
              openSections.attribution ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {openSections.attribution && (
          <div className="p-5 sm:p-6 border-t border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-[#0F172A]">Atribusi</span>
                <InfoTooltip term="attribution" />
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-[#0F172A]">Kode promo</span>
                <InfoTooltip term="promoCode" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ATTRIBUTION_RULES.map((rule, idx) => (
                <div
                  key={rule.title}
                  className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50/60"
                >
                  <p className="font-mono text-xs font-bold text-[#0284C7] mb-1.5 tabular-nums">
                    0{idx + 1}
                  </p>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">{rule.title}</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{rule.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Accordion 3: Weekly Reconciliation */}
      <section className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('reconciliation')}
          aria-expanded={openSections.reconciliation}
          className="w-full px-5 sm:px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4F46E5]"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[#0F172A]">Rekonsiliasi mingguan</h2>
              <p className="text-xs sm:text-sm text-[#64748B] truncate">
                Total kami tanpa duplikat vs total platform dan penjualan tanpa atribusi yang dilaporkan
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-[#64748B] shrink-0 transition-transform duration-200 ${
              openSections.reconciliation ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {openSections.reconciliation && (
          <div className="border-t border-slate-200">
            <div className="px-5 sm:px-6 py-4 bg-slate-50/60 border-b border-slate-200 text-xs sm:text-sm text-[#64748B]">
              Perbandingan mingguan sintetis antara total mesin tanpa duplikat dan ekspor platform terjadwal. Penjualan tanpa atribusi ditampilkan sebagaimana dilaporkan platform, tidak ditebak atau dialokasikan kembali ke kreator.
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-[#64748B]">
                    <th className="py-3 pl-5 sm:pl-6 pr-3 whitespace-nowrap">Minggu</th>
                    <th className="py-3 px-3 whitespace-nowrap">Tanggal</th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">Total kami (pesanan)</th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">
                      Total platform (pesanan)
                    </th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">Pendapatan kami (VND)</th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">
                      Pendapatan platform (VND)
                    </th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">Selisih</th>
                    <th className="py-3 pl-3 pr-5 sm:pr-6 text-right whitespace-nowrap">
                      Penjualan tanpa atribusi (dilaporkan)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {weeklyRows.map((row) => (
                    <tr key={row.weekLabel} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 pl-5 sm:pl-6 pr-3 font-semibold text-[#0F172A] whitespace-nowrap">
                        {row.weekLabel}
                      </td>
                      <td className="py-3 px-3 text-[#64748B] whitespace-nowrap">{row.dateRange}</td>
                      <td className="py-3 px-3 text-right font-mono text-[#0F172A] tabular-nums whitespace-nowrap">
                        {row.ourOrders.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                        {row.platformOrders.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#0F172A] tabular-nums whitespace-nowrap">
                        {row.ourRevenue.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                        {row.platformRevenue.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                        -{row.gapOrders.toLocaleString('id-ID')} ({(row.gapPercent * 100).toFixed(1).replace('.', ',')}%)
                      </td>
                      <td className="py-3 pl-3 pr-5 sm:pr-6 text-right font-mono font-semibold text-[#0F172A] tabular-nums whitespace-nowrap">
                        {row.unattributedSalesPct.toFixed(1).replace('.', ',')}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
