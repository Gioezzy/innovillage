import { FileText, Shield, Users, Store, Banknote, BarChart3, Settings } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: 'Manual Book - Super Admin',
};

export default function ManualPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <FadeIn>
        <div className="border-b border-border/50 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Panduan Super Admin
          </h1>
          <p className="text-muted-foreground mt-2">
            Dokumentasi lengkap fitur dan cara penggunaan sistem untuk peran Super Admin (Platform Owner).
          </p>
        </div>
      </FadeIn>

      <Tabs defaultValue="stores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="stores" className="py-2.5">Kelola Toko</TabsTrigger>
            <TabsTrigger value="users" className="py-2.5">Kelola User</TabsTrigger>
            <TabsTrigger value="finance" className="py-2.5">Keuangan & Payout</TabsTrigger>
            <TabsTrigger value="traffic" className="py-2.5">Traffic & QoS</TabsTrigger>
            <TabsTrigger value="compliance" className="py-2.5">Legal & Audit</TabsTrigger>
            <TabsTrigger value="faq" className="py-2.5">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Store className="w-5 h-5 text-primary" />
                        Manajemen Toko & Mitra UKM
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">1. Verifikasi Toko Baru</h3>
                            <p className="text-sm text-muted-foreground">Setiap pendaftar toko baru akan masuk dengan status 'Pending'. Super Admin wajib memverifikasi:</p>
                            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground mt-2">
                                <li>Validitas nama toko dan deskripsi (tidak melanggar SARA).</li>
                                <li>Lokasi desa sesuai dengan cakupan Innovillage.</li>
                            </ul>
                            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-xs mt-2 border border-yellow-100">
                                <strong>Aksi:</strong> Buka menu "Manage Stores" &rarr; Klik tombol "Verify" pada toko baru.
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">2. Penutupan Toko (Banned)</h3>
                            <p className="text-sm text-muted-foreground">Jika mitra melakukan pelanggaran berat (penipuan, barang ilegal):</p>
                            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground mt-2">
                                <li>Nonaktifkan status toko menjadi 'Inactive'.</li>
                                <li>Produk dari toko tersebut otomatis tidak akan muncul di katalog.</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Manajemen Pengguna & Role
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">Innovillage memiliki 3 tingkatan akses pengguna:</p>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="border p-4 rounded-lg bg-card">
                            <div className="font-bold text-primary mb-1">Super Admin</div>
                            <p className="text-xs text-muted-foreground">Akses penuh ke seluruh sistem, legalitas, dan semua toko.</p>
                        </div>
                        <div className="border p-4 rounded-lg bg-card">
                            <div className="font-bold text-foreground mb-1">Admin (Store Owner)</div>
                            <p className="text-xs text-muted-foreground">Pemilik toko. Bisa mengelola produk, pesanan, dan keuangan toko sendiri.</p>
                        </div>
                        <div className="border p-4 rounded-lg bg-card">
                            <div className="font-bold text-muted-foreground mb-1">Artisan (Staff)</div>
                            <p className="text-xs text-muted-foreground">Karyawan toko. Hanya bisa memproses pesanan dan update stok, tidak bisa akses keuangan.</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm border border-blue-100">
                        <strong>Tips:</strong> Untuk mengangkat Super Admin baru, silakan hubungi tim database administrator karena akses ini sangat krusial.
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-primary" />
                        Keuangan & Pencairan Dana (Payouts)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                        Innovillage menggunakan sistem <strong>Platform-Centric Payment</strong>. Semua dana pembeli masuk ke rekening Super Admin terlebih dahulu.
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">1. Potongan Platform (Fee)</h3>
                            <p className="text-sm text-muted-foreground">Setiap transaksi otomatis dikenakan potongan <strong>1%</strong> untuk operasional website.</p>
                            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground mt-2">
                                <li>Contoh Transaksi: Rp 100.000</li>
                                <li>Masuk ke Saldo Toko: Rp 99.000</li>
                                <li>Masuk ke Pendapatan Innovillage: Rp 1.000</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">2. Proses Pencairan Dana</h3>
                            <p className="text-sm text-muted-foreground">Toko akan mengajukan penarikan dana melalui dashboard mereka.</p>
                            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground mt-2">
                                <li>Buka menu <strong>Pencairan Dana</strong>.</li>
                                <li>Cek request yang statusnya <strong>Pending</strong>.</li>
                                <li>Transfer manual ke rekening toko (lihat detail di baris tabel).</li>
                                <li>Upload bukti transfer (Screenshot/Foto Struk) ke image hosting.</li>
                                <li>Klik <strong>Proses</strong> &rarr; Masukkan Link Bukti &rarr; Pilih <strong>Konfirmasi Transfer</strong>.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm border border-red-100">
                        <strong>Perhatian:</strong> Jangan pernah menyetujui request "Pending" sebelum Anda benar-benar melakukan transfer bank. Aksi ini tidak dapat dibatalkan.
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Traffic & Quality Monitoring
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Halaman <strong>Traffic Analytics</strong> dirancang untuk memenuhi standar Quality Assurance (QA). Gunakan data ini untuk:
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-2 text-muted-foreground">
                        <li>
                            <strong>Kapasitas Server:</strong> Jika "Kunjungan Bulan Ini" melonjak drastis, pertimbangkan upgrade server database.
                        </li>
                        <li>
                            <strong>Deteksi Anomali:</strong> Jika ada ribuan request dari IP yang sama dalam waktu singkat, sistem mungkin sedang diserang (DDoS) atau di-crawl bot jahat. Hubungi tim teknis.
                        </li>
                        <li>
                            <strong>Laporan Investor/Pemerintah:</strong> Gunakan angka "Total Visits" sebagai metrik traksi digital UKM.
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Legalitas & Audit (PSE & PDP)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                        <p>Sebagai platform E-Commerce, Innovillage wajib mematuhi:</p>
                        <ol>
                            <li><strong>PP 80/2019 (PMSE):</strong> Izin usaha platform digital.</li>
                            <li><strong>UU PDP (Pelindungan Data Pribadi):</strong> Keamanan data pengguna.</li>
                        </ol>
                        
                        <h4 className="font-semibold text-foreground mt-4">Checklist Audit Berkala:</h4>
                        <ul className="list-disc pl-5">
                            <li>Pastikan halaman <code>Privacy Policy</code> dan <code>Terms of Service</code> selalu bisa diakses di footer.</li>
                            <li>Cek apakah banner <strong>Cookie Consent</strong> muncul untuk pengguna baru.</li>
                            <li>Pastikan tidak ada data sensitif (NIK, No. Kartu Kredit) yang bocor di log sistem.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

         <TabsContent value="faq" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        FAQ & Troubleshooting
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="space-y-2 border-b pb-4">
                        <h4 className="font-semibold">Q: Bagaimana jika ada transaksi sengketa (Refund)?</h4>
                        <p className="text-muted-foreground">A: Arahkan pengguna ke Pusat Resolusi. Anda sebagai Super Admin bertindak sebagai mediator. Cek bukti video unboxing sebelum menyetujui refund dana via Dashboard Midtrans.</p>
                    </div>
                    <div className="space-y-2 border-b pb-4">
                        <h4 className="font-semibold">Q: Mengapa AI Smart Lens tidak mendeteksi motif?</h4>
                        <p className="text-muted-foreground">A: Pastikan foto jelas dan pencahayaan cukup. Jika masih gagal, kemungkinan motif tersebut belum ada di database <code>motifs</code>. Tambahkan data motif baru di menu Master Data.</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold">Q: Apa itu "IP Hash" di Traffic Log?</h4>
                        <p className="text-muted-foreground">A: Itu adalah identitas anonim pengunjung. Kita tidak menyimpan Alamat IP asli demi kepatuhan terhadap privasi pengguna.</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
