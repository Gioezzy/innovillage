import { Package, ShoppingBag, Banknote, Settings, HelpCircle, Store, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Buku Panduan Mitra Toko & Staff - Songket.id',
};

export default function StoreManualPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <FadeIn>
        <div className="border-b border-border/50 pb-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
              Buku Panduan Mitra Toko & Staff
            </h1>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 font-semibold">
              Versi Terkini
            </Badge>
          </div>
          <p className="text-muted-foreground text-base">
            Panduan operasional lengkap pengelolaan produk, alur pesanan, staf toko, status operasional, dan keuangan untuk <strong>Admin Toko</strong> dan <strong>Staff (Artisan)</strong>.
          </p>
        </div>
      </FadeIn>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto p-1.5 bg-muted/80 rounded-xl border border-border/50 shadow-inner">
          <TabsTrigger value="products" className="py-3 text-sm font-bold">
            Produk
          </TabsTrigger>
          <TabsTrigger value="orders" className="py-3 text-sm font-bold">
            Pesanan
          </TabsTrigger>
          <TabsTrigger value="finance" className="py-3 text-sm font-bold">
            Keuangan
          </TabsTrigger>
          <TabsTrigger value="settings" className="py-3 text-sm font-bold">
            Pengaturan
          </TabsTrigger>
          <TabsTrigger value="staff" className="py-3 text-sm font-bold">
            Staf Toko
          </TabsTrigger>
          <TabsTrigger value="faq" className="py-3 text-sm font-bold">
            Masalah
          </TabsTrigger>
        </TabsList>

        {/* TAB PRODUK */}
        <TabsContent value="products" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <Package className="w-5 h-5 text-primary" />
                Manajemen Produk & Katalog Tenun
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3 bg-card p-5 rounded-xl border border-border/50">
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">1</span>
                    Menambah & Mengedit Produk
                  </h3>
                  <ul className="list-disc pl-5 text-sm space-y-2 text-muted-foreground">
                    <li>Masuk ke menu <strong>Produk</strong> &rarr; Klik <strong>Tambah Produk Baru</strong>.</li>
                    <li>Isi <strong>Nama Produk</strong> secara spesifik (Contoh: <em>Songket Pandai Sikek Motif Bintang Ngarai - Merah Maroon</em>).</li>
                    <li>Upload foto produk berkualitas (Format JPG/PNG, ukuran maks 5MB per foto).</li>
                    <li>Pilih <strong>Kategori Songket</strong> yang sesuai agar mudah ditemukan pembeli.</li>
                  </ul>
                </div>

                <div className="space-y-3 bg-card p-5 rounded-xl border border-border/50">
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">2</span>
                    Stok & Varian Edisi Terbatas
                  </h3>
                  <ul className="list-disc pl-5 text-sm space-y-2 text-muted-foreground">
                    <li>Selalu perbarui jumlah stok secara berkala. Produk dengan stok 0 otomatis tidak dapat dibeli.</li>
                    <li>Aktifkan opsi <strong>"Is Limited"</strong> untuk kain songket langka / koleksi terbatas.</li>
                    <li>Produk edisi terbatas akan mendapat badge khusus yang meningkatkan daya tarik pembeli.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 text-primary-foreground p-4 rounded-xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-foreground/90">
                  <strong className="text-primary font-bold">Integrasi AI Smart Lens:</strong> Pembeli dapat mencari produk Anda dengan mengunggah foto kain melalui fitur AI Smart Lens. Pastikan pola dan motif kain terlihat sangat jelas pada foto utama produk Anda.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB PESANAN */}
        <TabsContent value="orders" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Alur & Manajemen Status Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <p className="text-sm text-muted-foreground">
                Setiap transaksi pesanan pembeli memiliki 4 tahapan status resmi di platform Songket.id:
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-xl bg-amber-500/5 border-amber-500/20">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0">1</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground">Pesanan Masuk (Paid)</h4>
                    <p className="text-sm text-muted-foreground">Pembeli telah melakukan pembayaran terverifikasi. Segera siapkan barang atau jadwalkan penenunan kain.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-xl bg-blue-500/5 border-blue-500/20">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0">2</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground">Diproses / Ditenun (In Weaving / Process)</h4>
                    <p className="text-sm text-muted-foreground">Ubah status pesanan ke 'In Weaving' jika pesanan membutuhkan waktu pembuatan/penenunan khusus, atau langsung kemas barang ready stock.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-xl bg-purple-500/5 border-purple-500/20">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shrink-0">3</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground">Siap Dikirim / Diambil (Ready for Pickup)</h4>
                    <p className="text-sm text-muted-foreground">Paket barang sudah rapi dan siap diserahkan ke kurir pengiriman atau diambil langsung oleh pelanggan.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-xl bg-emerald-500/10 border-emerald-500/30">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">4</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Selesai (Completed)</h4>
                    <p className="text-sm text-muted-foreground">Pelanggan telah menerima pesanan. Dana transaksi akan otomatis diteruskan ke Saldo Tersedia toko Anda.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB KEUANGAN */}
        <TabsContent value="finance" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <Banknote className="w-5 h-5 text-primary" />
                Keuangan & Pencairan Saldo (Payouts)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="bg-blue-500/10 text-blue-900 dark:text-blue-200 p-4 rounded-xl text-sm border border-blue-500/20">
                <strong className="font-bold">Sistem Rekening Bersama (Escrow):</strong> Seluruh pembayaran transaksi pembeli ditampung aman oleh sistem Innovillage hingga pesanan dinyatakan selesai. Setelah pesanan selesai, saldo masuk ke <strong>Saldo Tersedia</strong> toko (potongan komisi operasional 1%).
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3 bg-card p-5 rounded-xl border border-border/50">
                  <h3 className="font-bold text-lg text-foreground">1. Pengaturan Rekening Bank</h3>
                  <p className="text-sm text-muted-foreground">Sebelum mengajukan penarikan dana, daftarkan rekening bank utama toko:</p>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 text-muted-foreground">
                    <li>Buka menu <strong>Keuangan</strong> &rarr; Pilih tab <strong>Rekening Bank</strong>.</li>
                    <li>Isi Nama Bank, Nomor Rekening, dan Nama Pemilik (Wajib sesuai buku tabungan).</li>
                    <li>Simpan perubahan data rekening.</li>
                  </ul>
                </div>

                <div className="space-y-3 bg-card p-5 rounded-xl border border-border/50">
                  <h3 className="font-bold text-lg text-foreground">2. Pengajuan Penarikan Saldo</h3>
                  <p className="text-sm text-muted-foreground">Batas minimal penarikan saldo toko adalah <strong>Rp 10.000</strong>.</p>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 text-muted-foreground">
                    <li>Buka menu <strong>Keuangan</strong> &rarr; Pilih tab <strong>Tarik Saldo</strong>.</li>
                    <li>Masukkan nominal saldo yang ingin dicairkan.</li>
                    <li>Klik <strong>Ajukan Pencairan</strong>.</li>
                    <li>Status pencairan akan bertanda <em>Pending</em> hingga ditransfer oleh Super Admin.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB PENGATURAN TOKO */}
        <TabsContent value="settings" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <Store className="w-5 h-5 text-primary" />
                Pengaturan Profil & Status Operasional Toko
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3 bg-card p-5 rounded-xl border border-border/50">
                  <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Buka / Tutup Toko (Status Operasional)
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Admin Toko maupun Staff dapat mengatur ketersediaan toko secara mandiri di menu <strong>Pengaturan Toko</strong>. Jika switch <strong>"Toko Buka/Aktif"</strong> dimatikan, toko akan berstatus tutup dan seluruh produk toko Anda disembunyikan sementara dari pencarian pembeli tanpa menghapus data produk.
                  </p>
                </div>

                <div className="space-y-3 bg-card p-5 rounded-xl border border-border/50">
                  <h4 className="font-bold text-lg text-foreground">Profil & Banner Visual Toko</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Perbarui Logo Toko, Foto Banner Header, serta Deskripsi Sejarah Pengrajin secara berkala untuk membangun rasa percaya calon pembeli terhadap kualitas hasil tenun Anda.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB STAF TOKO */}
        <TabsContent value="staff" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <Users className="w-5 h-5 text-primary" />
                Manajemen Karyawan / Staff (Artisan)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <p className="text-sm text-muted-foreground">
                Platform menyediakan pemisahan hak akses antara <strong>Admin Toko (Pemilik)</strong> dan <strong>Staff (Artisan/Karyawan)</strong> untuk menjaga kerahasiaan keuangan toko:
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                  <Badge className="bg-primary text-primary-foreground font-bold">Admin Toko (Pemilik)</Badge>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 text-foreground/80 pt-2">
                    <li>Akses penuh ke seluruh menu toko.</li>
                    <li>Dapat menambah & mengelola akun Staff (Artisan).</li>
                    <li>Akses penuh ke Laporan Keuangan & Penarikan Saldo.</li>
                    <li>Mengubah profil dan rekening bank toko.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl border border-border bg-card space-y-2">
                  <Badge variant="secondary" className="font-bold">Staff Toko (Artisan)</Badge>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 text-muted-foreground pt-2">
                    <li>Dapat menambah, mengedit, dan mengelola Produk.</li>
                    <li>Dapat memproses status Pesanan pembeli.</li>
                    <li>Dapat mengatur switch Buka/Tutup Toko.</li>
                    <li><strong>TIDAK BISA</strong> mengakses Laporan Keuangan & Pencairan Saldo.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 text-sm space-y-1">
                <strong className="font-bold text-foreground">Cara Menambahkan Staff:</strong>
                <p className="text-muted-foreground">
                  Masuk ke menu <strong>Staff</strong> (khusus Admin Toko) &rarr; Klik <strong>Tambah Staff Baru</strong> &rarr; Isi Nama, Email, dan Password akun staff. Akun staff akan otomatis langsung muncul di daftar manajemen staff toko Anda.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB BANTUAN & MASALAH */}
        <TabsContent value="faq" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-heading">
                <HelpCircle className="w-5 h-5 text-primary" />
                Pusat Bantuan & Pertanyaan Umum (FAQ)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm pt-6">
              <div className="space-y-2 border-b border-border/50 pb-4">
                <h4 className="font-bold text-foreground text-base">Q: Pembeli mengajukan komplain barang rusak / cacat?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  A: Minta pembeli melampirkan video unboxing tanpa terputus. Jika terbukti terjadi cacat saat pembuatan atau pengemasan, komunikasikan opsi penggantian barang atau koordinasikan dengan Super Admin untuk proses resolusi retur.
                </p>
              </div>

              <div className="space-y-2 border-b border-border/50 pb-4">
                <h4 className="font-bold text-foreground text-base">Q: Mengapa toko saya tidak muncul di pencarian publik?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  A: Cek kembali status toko di menu <strong>Pengaturan Toko</strong>. Apabila status switch dalam keadaan 'Tutup / Nonaktif', toko Anda otomatis disembunyikan sementara dari etalase direktori toko.
                </p>
              </div>

              <div className="space-y-2 bg-primary/5 p-4 rounded-xl border border-primary/20">
                <h4 className="font-bold text-primary text-base">Bantuan Teknis Mendesak</h4>
                <p className="text-muted-foreground">
                  Apabila Anda mengalami kendala teknis pada sistem transaksi, hubungi Tim Operational Innovillage via WhatsApp Support: <a href="https://wa.me/6289530124209" target="_blank" rel="noopener noreferrer" className="text-foreground font-bold hover:underline">+62 895-3012-4209</a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
