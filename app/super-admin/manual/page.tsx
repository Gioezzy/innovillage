import { FileText, Shield, Users, Store, Banknote, BarChart3, Settings, FolderOpen, HelpCircle, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Buku Panduan Super Admin - Songket.id',
};

export default function SuperAdminManualPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <FadeIn>
        <div className="border-b border-border/50 pb-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
              Buku Panduan Super Admin
            </h1>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 font-semibold">
              Platform Manager
            </Badge>
          </div>
          <p className="text-muted-foreground text-base">
            Dokumentasi lengkap tata cara pengelolaan platform, verifikasi pengajuan toko, pencairan dana, pembersihan toko nonaktif, dan manajemen kategori.
          </p>
        </div>
      </FadeIn>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto p-1.5 bg-muted/80 rounded-xl border border-border/50 shadow-inner">
          <TabsTrigger value="requests" className="py-3 text-sm font-bold">
            Pengajuan Toko
          </TabsTrigger>
          <TabsTrigger value="stores" className="py-3 text-sm font-bold">
            Kelola Toko
          </TabsTrigger>
          <TabsTrigger value="payouts" className="py-3 text-sm font-bold">
            Pencairan Dana
          </TabsTrigger>
          <TabsTrigger value="categories" className="py-3 text-sm font-bold">
            Kategori
          </TabsTrigger>
          <TabsTrigger value="traffic" className="py-3 text-sm font-bold">
            Traffic Log
          </TabsTrigger>
          <TabsTrigger value="faq" className="py-3 text-sm font-bold">
            FAQ Admin
          </TabsTrigger>
        </TabsList>

        {/* TAB PENGAJUAN TOKO */}
        <TabsContent value="requests" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <Store className="w-5 h-5 text-primary" />
                Verifikasi Pengajuan Toko Baru (Store Requests)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <p className="text-sm text-muted-foreground">
                Setiap pengguna yang mengajukan pendaftaran toko melalui menu <em>Buka Toko</em> akan masuk ke antrean verifikasi Super Admin di menu <strong>Store Requests</strong>:
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    1. Menyetujui Pengajuan (ACC)
                  </h3>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 text-muted-foreground">
                    <li>Klik tombol <strong>Approve / ACC</strong> pada baris pengajuan.</li>
                    <li>Sistem otomatis membuat record toko baru di tabel `stores`.</li>
                    <li>Sistem otomatis memperbarui role pemohon menjadi <strong>`admin`</strong> dan menghubungkan `store_id`.</li>
                    <li>Saat pemohon login kembali, mereka langsung diarahkan ke Dashboard Admin Toko (`/admin`).</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/5 space-y-3">
                  <h3 className="font-bold text-lg text-red-900 dark:text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    2. Menolak Pengajuan (Reject)
                  </h3>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 text-muted-foreground">
                    <li>Klik tombol <strong>Reject / Tolak</strong> jika nama atau deskripsi toko tidak sesuai kriteria platform.</li>
                    <li>Masukkan alasan penolakan agar pemohon dapat memperbaiki data pengajuan mereka.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB KELOLA TOKO & HAPUS TOKO */}
        <TabsContent value="stores" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <Store className="w-5 h-5 text-primary" />
                Manajemen Toko & Penghapusan Toko Nonaktif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-border/50 bg-card space-y-2">
                  <h3 className="font-bold text-lg text-foreground">Monitoring Status Toko</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Super Admin dapat memantau seluruh toko terdaftar di menu <strong>Manajemen Toko</strong>. Setiap toko menampilkan badge status operasional (<strong>Aktif</strong> atau <strong>Nonaktif/Tutup</strong>) yang diatur oleh Admin Toko masing-masing.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/5 space-y-3">
                  <h3 className="font-bold text-lg text-red-900 dark:text-red-300 flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    Penghapusan Toko yang Sudah Nonaktif
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tombol merah <strong>"Hapus"</strong> secara otomatis tersedia khusus pada toko yang berstatus <strong>Nonaktif / Tutup</strong>.
                  </p>
                  <div className="bg-card p-4 rounded-lg border border-red-200 text-sm space-y-2">
                    <strong className="text-red-700 font-bold">Penyesuaian Otomatis Saat Toko Dihapus:</strong>
                    <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                      <li><strong>Pembersihan Katalog Produk:</strong> Seluruh produk milik toko tersebut dihapus bersih dari database platform.</li>
                      <li><strong>Penyesuaian Role Akun Pengguna:</strong> Akun Pemilik Toko & Staff yang terdaftar di toko tersebut <strong>TIDAK terhapus</strong>, melainkan secara otomatis di-reset menjadi akun <strong>Pelanggan biasa (Role: Customer)</strong> dan relasi `store_id` dikosongkan.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB PENCAIRAN DANA */}
        <TabsContent value="payouts" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <Banknote className="w-5 h-5 text-primary" />
                Pencairan Saldo Toko (Payouts)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <p className="text-sm text-muted-foreground">
                Semua permohonan penarikan saldo toko diproses di menu <strong>Pencairan Dana (Payouts)</strong>:
              </p>

              <div className="space-y-3 border p-5 rounded-xl bg-card">
                <h4 className="font-bold text-base text-foreground">Proses Transfer & Verifikasi Payout</h4>
                <ol className="list-decimal pl-5 text-sm space-y-2 text-muted-foreground">
                  <li>Periksa permohonan penarikan saldo berstatus <strong>Pending</strong>.</li>
                  <li>Cek detail Nomor Rekening, Nama Bank, dan Atas Nama rekening tujuan toko.</li>
                  <li>Lakukan transfer bank manual sesuai nominal yang diajukan.</li>
                  <li>Unggah bukti struk/screenshot transfer dan klik <strong>Konfirmasi Transfer</strong>.</li>
                  <li>Status penarikan otomatis berubah menjadi <strong>Completed</strong> dan saldo toko diperbarui.</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB KATEGORI */}
        <TabsContent value="categories" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <FolderOpen className="w-5 h-5 text-primary" />
                Manajemen Kategori Songket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <p className="text-sm text-muted-foreground">
                Super Admin memiliki akses penuh untuk menambah, mengedit, dan menghapus kategori songket platform di menu <strong>Kategori</strong>.
              </p>
              <div className="bg-amber-500/10 text-amber-900 dark:text-amber-200 p-4 rounded-xl text-sm border border-amber-500/20">
                <strong className="font-bold">Ketentuan Hapus Kategori:</strong> Kategori hanya dapat dihapus jika tidak ada produk aktif yang sedang menggunakan kategori tersebut.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB TRAFFIC LOG */}
        <TabsContent value="traffic" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <BarChart3 className="w-5 h-5 text-primary" />
                Monitoring Traffic & Log Akses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm pt-6">
              <p className="text-muted-foreground leading-relaxed">
                Halaman <strong>Traffic Analytics</strong> mencatat jumlah statistik kunjungan pengguna platform secara real-time. Untuk mematuhi undang-undang Perlindungan Data Pribadi (UU PDP), alamat IP pengunjung disimpan dalam bentuk <strong>Hash Terenkripsi (IP Hash)</strong>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB FAQ SUPER ADMIN */}
        <TabsContent value="faq" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <HelpCircle className="w-5 h-5 text-primary" />
                FAQ & Panduan Penanganan Kendala Platform
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm pt-6">
              <div className="space-y-2 border-b border-border/50 pb-4">
                <h4 className="font-bold text-foreground text-base">Q: Apa yang terjadi jika Super Admin menghapus toko yang sudah tutup/nonaktif?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  A: Produk toko tersebut otomatis dibersihkan dari database, dan akun pemilik/staff di-reset menjadi akun Pelanggan biasa (Role: Customer).
                </p>
              </div>

              <div className="space-y-2 border-b border-border/50 pb-4">
                <h4 className="font-bold text-foreground text-base">Q: Bagaimana jika pengguna baru yang di-approve toko tokonya belum bisa masuk ke /admin?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  A: Sistem telah dilengkapi fitur <strong>Auto-Heal</strong> saat login. Minta pengguna untuk logout dan login kembali, sistem akan otomatis menyesuaikan role mereka menjadi Admin Toko.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
