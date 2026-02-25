import { getTrafficStats } from '@/lib/actions/traffic';
import StatsCard from '@/components/admin/stats-card';
import { Eye, TrendingUp, ShieldCheck, AlertCircle, ScanLine } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';
import { formatDateTime } from '@/lib/utils';

export const metadata = {
  title: 'Traffic Analytics - Super Admin',
};

export default async function TrafficPage() {
  const stats = await getTrafficStats();

  if (!stats) {
    return (
      <div className="p-8 text-center text-red-500">
        Anda tidak memiliki akses ke halaman ini.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Traffic & Quality Metrics
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor kapabilitas website dalam menangani pengunjung dan parameter kualitas layanan.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatsCard
            title="Total Kunjungan"
            value={stats.totalVisits}
            description="All time page views"
            icon={Eye}
            className="bg-card from-blue-500/5 to-transparent bg-gradient-to-br"
          />

          <StatsCard
            title="Kunjungan Bulan Ini"
            value={stats.monthVisits}
            description="Active users this month"
            icon={TrendingUp}
            className="bg-card from-green-500/5 to-transparent bg-gradient-to-br"
          />

          <StatsCard
            title="Total Upload Scan Motif"
            value={stats.totalMotifScans}
            description="Semua waktu, dari Smart Lens"
            icon={ScanLine}
            className="bg-card from-purple-500/5 to-transparent bg-gradient-to-br"
          />

          <StatsCard
            title="Scan Motif Bulan Ini"
            value={stats.monthMotifScans}
            description="Upload scan di bulan ini"
            icon={ScanLine}
            className="bg-card from-orange-500/5 to-transparent bg-gradient-to-br"
          />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <FadeIn delay={0.2}>
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border/50">
                    <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Log Kunjungan Terbaru
                    </h2>
                    </div>
                    <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Halaman</th>
                            <th className="px-6 py-3 text-right font-medium text-muted-foreground">Waktu</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                        {stats.recentTraffic.map((log: any, index: number) => (
                            <tr key={index} className="hover:bg-muted/30">
                            <td className="px-6 py-3 text-foreground font-medium">{log.path}</td>
                            <td className="px-6 py-3 text-right text-muted-foreground">
                                {formatDateTime(log.created_at)}
                            </td>
                            </tr>
                        ))}
                        {stats.recentTraffic.length === 0 && (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground">Belum ada data traffic.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </FadeIn>
        </div>

        <div className="space-y-6">
            <FadeIn delay={0.3}>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">Quality & Legal Parameter</h3>
                            <p className="text-sm text-blue-800 leading-relaxed mb-4">
                                Data traffic ini digunakan sebagai parameter untuk mengukur <strong>Kualitas Layanan (QoS)</strong> dan <strong>Kapabilitas Website</strong>.
                            </p>
                            <ul className="text-sm text-blue-800 list-disc pl-4 space-y-1">
                                <li><strong>Legalitas:</strong> Monitoring ini legal karena data dianonimkan (IP Hash) dan bertujuan untuk pemeliharaan sistem.</li>
                                <li><strong>Audit:</strong> Gunakan data "Total Kunjungan" sebagai bukti traksi saat audit Kominfo atau investor.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
      </div>
    </div>
  );
}
