import { Package, ShoppingBag, Banknote, Settings, HelpCircle, Store } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: 'Panduan Toko - Admin',
};

export default function StoreManualPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <FadeIn>
        <div className="border-b border-border/50 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Buku Panduan Mitra Toko
          </h1>
          <p className="text-muted-foreground mt-2">
            Panduan lengkap pengelolaan toko, produk, dan pesanan untuk Mitra Innovillage.
          </p>
        </div>
      </FadeIn>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
             <TabsTrigger value="products" className="py-2.5">Produk</TabsTrigger>
             <TabsTrigger value="orders" className="py-2.5">Pesanan</TabsTrigger>
             <TabsTrigger value="finance" className="py-2.5">Keuangan</TabsTrigger>
             <TabsTrigger value="settings" className="py-2.5">Pengaturan</TabsTrigger>
             <TabsTrigger value="faq" className="py-2.5">Masalah</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        Manajemen Produk
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">1. Menambah Produk Baru</h3>
                            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground mt-2">
                                <li>Masuk ke menu <strong>Products</strong> &rarr; Klik <strong>Add New</strong>.</li>
                                <li>Isi nama produk dengan jelas (Contoh: "Songket Pandai Sikek Warna Merah").</li>
                                <li>Upload minimal 1 foto berkualitas tinggi (Format JPG/PNG, maks 5MB).</li>
                                <li>Pilih Kategori yang sesuai agar mudah ditemukan pembeli.</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">2. Stok & Varian</h3>
                            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground mt-2">
                                <li>Selalu update stok secara berkala. Jika stok habis, produk otomatis tidak bisa dibeli.</li>
                                <li>Gunakan fitur "Is Limited" untuk produk edisi terbatas agar menarik pembeli.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm border border-blue-100">
                        <strong>Tips Foto Produk:</strong> Gunakan pencahayaan alami dan latar belakang polos agar motif Songket terlihat jelas.
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        Proses Pesanan
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 border rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">1</div>
                            <div>
                                <h4 className="font-semibold">Pesanan Masuk (Paid)</h4>
                                <p className="text-sm text-muted-foreground">Pembeli sudah membayar. Segera siapkan barang.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 border rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                            <div>
                                <h4 className="font-semibold">Proses/Kemas (In Weaving/Process)</h4>
                                <p className="text-sm text-muted-foreground">Ubah status menjadi 'In Weaving' jika barang sedang dibuat, atau langsung kemas jika ready stock.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 border rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">3</div>
                            <div>
                                <h4 className="font-semibold">Siap Diambil/Dikirim (Ready for Pickup)</h4>
                                <p className="text-sm text-muted-foreground">Barang sudah siap. Kurir akan menjemput atau pembeli akan mengambil (jika COD).</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4 p-4 border rounded-lg bg-green-50/50">
                            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">4</div>
                            <div>
                                <h4 className="font-semibold">Selesai (Completed)</h4>
                                <p className="text-sm text-muted-foreground">Barang diterima pembeli. Dana akan masuk ke saldo toko.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-primary" />
                        Laporan Keuangan & Pencairan Dana
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm border border-blue-100 mb-4">
                            <strong>Sistem Escrow:</strong> Dana pembelian akan ditahan oleh Innovillage (Super Admin) hingga pesanan selesai. Setelah itu, dana masuk ke "Saldo Tersedia" toko Anda (dikurangi 1% biaya layanan).
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                             <div className="space-y-2">
                                <h3 className="font-semibold text-lg">1. Mengatur Rekening Bank</h3>
                                <p className="text-sm text-muted-foreground">Sebelum menarik dana, Anda wajib mendaftarkan rekening tujuan:</p>
                                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground mt-2">
                                    <li>Buka menu <strong>Keuangan</strong> &rarr; Tab <strong>Pengaturan Rekening</strong>.</li>
                                    <li>Isi Nama Bank, Nomor Rekening, dan Atas Nama (Wajib sesuai buku tabungan).</li>
                                    <li>Klik <strong>Simpan Rekening</strong>.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">2. Cara Tarik Data (Payout)</h3>
                                <p className="text-sm text-muted-foreground">Minimal penarikan adalah Rp 10.000.</p>
                                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground mt-2">
                                    <li>Buka menu <strong>Keuangan</strong> &rarr; Tab <strong>Tarik Saldo</strong>.</li>
                                    <li>Masukkan nominal yang ingin dicairkan.</li>
                                    <li>Klik <strong>Ajukan Penarikan</strong>.</li>
                                    <li>Status akan berubah menjadi <i>Pending</i> hingga disetujui Super Admin.</li>
                                </ul>
                            </div>
                        </div>

                         <div className="border p-4 rounded-lg bg-muted/30">
                            <h3 className="font-semibold text-sm mb-2">Status Penarikan:</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> <strong>Pending:</strong> Menunggu persetujuan admin.</li>
                                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> <strong>Berhasil:</strong> Dana sudah ditransfer.</li>
                                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> <strong>Ditolak:</strong> Ada kesalahan data (cek catatan).</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        Pengaturan Toko
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="border p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Profil Toko</h4>
                            <p className="text-sm text-muted-foreground">Ganti foto profil dan banner toko secara berkala untuk menarik pembeli. Tulis deskripsi yang menceritakan sejarah Tenun/Songket Anda.</p>
                        </div>
                         <div className="border p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Staf Toko (Artisan)</h4>
                            <p className="text-sm text-muted-foreground">Anda bisa menambahkan karyawan (Artisan) untuk membantu mengelola pesanan tanpa memberikan akses penuh ke keuangan.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

         <TabsContent value="faq" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        Bantuan & Masalah
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="space-y-2 border-b pb-4">
                        <h4 className="font-semibold">Q: Pembeli komplain barang rusak, apa yang harus saya lakukan?</h4>
                        <p className="text-muted-foreground">A: Minta pembeli mengirimkan video unboxing. Jika terbukti kesalahan toko, setujui pengembalian dana atau kirim barang pengganti. Jaga reputasi toko Anda.</p>
                    </div>
                    <div className="space-y-2 border-b pb-4">
                        <h4 className="font-semibold">Q: Bagaimana cara mengubah status "Toko Tutup"?</h4>
                        <p className="text-muted-foreground">A: Masuk ke Pengaturan Toko, matikan switch "Toko Buka/Aktif". Produk Anda akan disembunyikan sementara.</p>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-semibold">Butuh Bantuan Mendesak?</h4>
                        <p className="text-muted-foreground">Hubungi Tim Support Innovillage via WhatsApp Admin: <strong>+62 812-3456-7890</strong></p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
