import { Metadata } from 'next';
import BackButton from '@/components/layout/back-button';
import FadeIn from '@/components/animations/fade-in';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - Innovillage',
  description:
    'Kebijakan Privasi Innovillage tentang bagaimana kami mengelola data Anda.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <FadeIn>
          <div className="bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
            <div className="bg-primary/5 p-8 md:p-12 text-center border-b border-border/50">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-heading mb-2">
                Kebijakan Privasi
              </h1>
              <p className="text-muted-foreground">
                Komitmen kami untuk melindungi data pribadi dan kepercayaan Anda.
              </p>
            </div>

            <div className="p-8 md:p-12">
              <BackButton className="mb-8" />

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="lead text-lg text-muted-foreground">
                  Di Innovillage, privasi Anda adalah prioritas kami. Dokumen
                  ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
                  melindungi informasi pribadi Anda saat menggunakan platform marketplace kami.
                </p>

                <div className="space-y-10 mt-8">
                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      1. Informasi yang Kami Kumpulkan
                    </h2>
                    <p className="text-muted-foreground">
                      Kami mengumpulkan informasi yang Anda berikan saat
                      mendaftar sebagai pembeli atau penjual:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                      <li>Nama lengkap, alamat email, dan nomor kontak.</li>
                      <li>Alamat pengiriman (untuk pembeli) dan alamat toko (untuk penjual).</li>
                      <li>Riwayat transaksi dan data produk.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      2. Bagaimana Kami Menggunakan Data Anda
                    </h2>
                    <p className="text-muted-foreground">
                      Data Anda digunakan untuk:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                      <li>Memfasilitasi transaksi jual beli yang aman.</li>
                      <li>Mengelola pesanan dan pengiriman logistik.</li>
                      <li>
                        Menghubungkan pembeli dengan penjual UMKM desa.
                      </li>
                      <li>Meningkatkan layanan dan rekomendasi produk.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      3. Keamanan Data
                    </h2>
                    <p className="text-muted-foreground">
                      Kami menerapkan enkripsi dan langkah-langkah keamanan teknis standar industri untuk
                      melindungi data Anda dari akses yang tidak sah. Informasi pembayaran diproses melalui gateway yang aman.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      4. Berbagi Informasi
                    </h2>
                    <p className="text-muted-foreground">
                      Kami <strong>tidak</strong> menjual informasi
                      pribadi Anda. Kami hanya membagikan
                      data yang diperlukan kepada:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                        <li>Penjual (untuk memproses pesanan Anda).</li>
                        <li>Mitra logistik (untuk pengiriman).</li>
                        <li>Pihak berwenang (jika diwajibkan oleh hukum).</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      5. Kontrol Pengguna
                    </h2>
                    <p className="text-muted-foreground">
                      Anda dapat mengakses, memperbarui, atau menghapus akun Anda kapan saja melalui pengaturan profil.
                    </p>
                  </section>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6 text-center text-sm text-muted-foreground border-t border-border/50">
              <p>Terakhir diperbarui: 16 Januari 2026</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
