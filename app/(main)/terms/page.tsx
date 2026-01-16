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
                Terakhir diperbarui: 16 Januari 2026
              </p>
            </div>

            <div className="p-8 md:p-12">
              <BackButton className="mb-8" />

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="lead text-lg text-muted-foreground">
                  Selamat datang di Innovillage. Dengan mengakses platform kami, Anda menyetujui syarat dan ketentuan berikut.
                </p>

                <div className="space-y-12 mt-8">
                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        1
                      </span>
                      Definisi
                    </h2>
                    <ul className="mt-4 list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>
                        <strong>&quot;Layanan&quot;</strong>: Platform marketplace
                        Innovillage dan fitur-fitur terkait.
                      </li>
                      <li>
                        <strong>&quot;Pengguna&quot;</strong>:
                        Pembeli, Penjual (Mitra UMKM), dan pengunjung situs.
                      </li>
                      <li>
                        <strong>&quot;Penjual&quot;</strong>: Pihak UMKM Desa yang membuka toko di platform.
                      </li>
                      <li>
                        <strong>&quot;Produk&quot;</strong>: Barang kerajinan, pangan, atau produk desa lainnya yang dijual oleh Penjual.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        2
                      </span>
                      Akun Pengguna
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                      Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Kami berhak menangguhkan akun yang melanggar kebijakan komunitas atau melakukan aktivitas penipuan.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        3
                      </span>
                      Transaksi & Pembayaran
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                      Pembayaran dilakukan melalui gateway resmi Innovillage. Dana akan diteruskan ke Penjual setelah pesanan dikonfirmasi diterima oleh Pembeli.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        4
                      </span>
                      Ketentuan Penjual
                    </h2>
                    <div className="mt-4 p-4 bg-muted rounded-lg border border-border/50 text-muted-foreground text-sm">
                      Penjual wajib menjamin bahwa produk yang dijual adalah asli, legal, dan sesuai dengan deskripsi. Penjual dilarang menjual barang terlarang sesuai hukum Indonesia.
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-foreground font-heading flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                        5
                      </span>
                      Kebijakan Pengembalian (Refund)
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                      Pengajuan komplain atau refund dapat dilakukan melalui pusat resolusi jika barang tidak sesuai pesanan atau rusak. Keputusan refund akan dimediasi oleh tim Innovillage berdasarkan bukti yang valid.
                    </p>
                  </section>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6 text-center text-sm text-muted-foreground border-t border-border/50">
              <p>
                Jika ada pertanyaan lebih lanjut, silakan hubungi tim support
                kami.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
