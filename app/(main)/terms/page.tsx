import { Metadata } from 'next';
import BackButton from '@/components/layout/back-button';
import FadeIn from '@/components/animations/fade-in';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan - Innovillage',
  description: 'Syarat dan Ketentuan Penggunaan Layanan Innovillage.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <FadeIn>
          <div className="bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
            <div className="bg-secondary/10 p-8 md:p-12 text-center border-b border-border/50">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-heading mb-2">
                Syarat & Ketentuan
              </h1>
              <p className="text-muted-foreground">
                Terakhir diperbarui: 19 Februari 2026
              </p>
            </div>

            <div className="p-8 md:p-12">
              <BackButton className="mb-8" />

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="lead text-lg text-muted-foreground">
                  Selamat datang di Innovillage. Dengan mengakses platform kami, Anda menyetujui syarat dan ketentuan berikut sesuai dengan Peraturan Pemerintah No. 80 Tahun 2019 tentang PMSE.
                </p>

                <div className="space-y-12 mt-8">
                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        1
                      </span>
                      Definisi & Akun
                    </h2>
                    <ul className="mt-4 list-disc pl-5 space-y-2 text-muted-foreground">
                      <li><strong>Pengguna:</strong> Pihak yang menggunakan layanan Innovillage, termasuk Pembeli dan Penjual (UMKM).</li>
                      <li><strong>Akun:</strong> Anda bertanggung jawab penuh atas keamanan akun dan kata sandi Anda. Kami berhak menangguhkan akun yang terindikasi melakukan pelanggaran hukum atau penipuan.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        2
                      </span>
                      Transaksi & Pembayaran
                    </h2>
                    <div className="mt-4 space-y-2 text-muted-foreground">
                      <p>2.1. Harga yang tertera adalah harga final, belum termasuk ongkos kirim kecuali disebutkan lain.</p>
                      <p>2.2. Pembayaran wajib dilakukan melalui metode resmi yang tersedia di Platform (Midtrans). Kami tidak bertanggung jawab atas transaksi di luar platform.</p>
                      <p>2.3. Dana akan diteruskan ke Penjual setelah Pesanan Dikonfirmasi Diterima oleh Pembeli atau 2x24 jam setelah barang sampai.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        3
                      </span>
                      Barang Terlarang
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                      Penjual dilarang menawarkan barang yang: (a) Melanggar Hak Kekayaan Intelektual; (b) Barang ilegal/narkotika; (c) Barang yang mengandung unsur SARA atau pornografi; (d) Barang lain yang dilarang oleh hukum Indonesia.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        4
                      </span>
                      Kebijakan Pengembalian (Refund)
                    </h2>
                    <div className="mt-4 p-4 bg-muted rounded-lg border border-border/50 text-muted-foreground text-sm">
                      <p className="font-semibold mb-2">Syarat Pengajuan Komplain:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Wajib menyertakan Video Unboxing tanpa jeda.</li>
                        <li>Barang tidak sesuai deskripsi, rusak, atau kurang jumlah.</li>
                        <li>Pengajuan maksimal 1x24 jam setelah status barang diterima.</li>
                      </ul>
                      <p className="mt-2">Dana akan dikembalikan ke saldo dompet pengguna atau limit kartu kredit sesuai kebijakan bank penerbit.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        5
                      </span>
                      Penyelesaian Sengketa
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                      Setiap perselisihan akan diselesaikan secara musyawarah mufakat. Jika tidak tercapai kesepakatan, para pihak sepakat untuk menyelesaikannya melalui BPSK (Badan Penyelesaian Sengketa Konsumen) atau Pengadilan di wilayah hukum Republik Indonesia.
                    </p>
                  </section>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6 text-center text-sm text-muted-foreground border-t border-border/50">
              <p>
                Jika ada pertanyaan lebih lanjut, silakan hubungi <a href="mailto:support@songket.id" className="text-primary hover:underline">support@songket.id</a>
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

