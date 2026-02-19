import { Metadata } from 'next';
import BackButton from '@/components/layout/back-button';
import FadeIn from '@/components/animations/fade-in';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - Innovillage',
  description:
    'Kebijakan Privasi Innovillage tentang bagaimana kami mengelola data Anda sesuai dengan UU PDP.',
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
                Komitmen kami untuk melindungi data pribadi Anda sesuai UU Perlindungan Data Pribadi (PDP).
              </p>
            </div>

            <div className="p-8 md:p-12">
              <BackButton className="mb-8" />

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="lead text-lg text-muted-foreground">
                  Di Innovillage ("Kami"), privasi Anda adalah prioritas utama. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, memproses, dan melindungi Data Pribadi Anda saat menggunakan platform kami, sesuai dengan peraturan perundang-undangan yang berlaku di Indonesia.
                </p>

                <div className="space-y-10 mt-8">
                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      1. Pengendali Data
                    </h2>
                    <p className="text-muted-foreground">
                      Pengendali Data Pribadi Anda adalah <strong>PT Innovillage Indonesia</strong>. Jika Anda memiliki pertanyaan mengenai pemrosesan data, Anda dapat menghubungi Petugas Perlindungan Data (Data Protection Officer) kami di:
                    </p>
                    <p className="mt-2 font-medium">Email: support@songket.id</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      2. Data yang Kami Kumpulkan
                    </h2>
                    <p className="text-muted-foreground">
                      Kami mengumpulkan data berikut untuk memproses layanan:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                      <li><strong>Data Identitas:</strong> Nama lengkap, NIK (jika dperlukan untuk verifikasi penjual).</li>
                      <li><strong>Data Kontak:</strong> Alamat email, nomor telepon, alamat pengiriman/penjemputan.</li>
                      <li><strong>Data Transaksi:</strong> Rincian pesanan, riwayat pembelian, dan metode pembayaran.</li>
                      <li><strong>Data Teknis:</strong> Alamat IP, jenis perangkat, dan data log aktivitas (cookies).</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      3. Tujuan Pemrosesan Data
                    </h2>
                    <p className="text-muted-foreground">
                      Data Anda diproses untuk tujuan:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                      <li>Memproses dan mengirimkan pesanan Anda.</li>
                      <li>Memverifikasi identitas dan mencegah penipuan.</li>
                      <li>Meningkatkan layanan melalui analisis penggunaan (AI Smart Lens).</li>
                      <li>Mengirimkan informasi terkait transaksi atau pembaruan layanan.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      4. Hak Subjek Data
                    </h2>
                    <p className="text-muted-foreground">
                      Sesuai dengan UU PDP, Anda memiliki hak untuk:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                      <li><strong>Hak Akses:</strong> Meminta salinan data pribadi yang kami miliki tentang Anda.</li>
                      <li><strong>Hak Koreksi:</strong> Meminta perbaikan data yang tidak akurat.</li>
                      <li><strong>Hak Penghapusan:</strong> Meminta penghapusan data Anda (tertakluk pada kewajiban hukum retensi data).</li>
                      <li><strong>Hak Penarikan Persetujuan:</strong> Menarik persetujuan pemrosesan data kapan saja.</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      Untuk menggunakan hak-hak ini, silakan hubungi kami melalui email layanan pelanggan.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      5. Penyimpanan & Keamanan Data
                    </h2>
                    <p className="text-muted-foreground">
                      Kami menyimpan data Anda selama akun Anda aktif atau selama diperlukan untuk memenuhi kewajiban hukum (minimal 5 tahun untuk data transaksi keuangan).
                      Kami menggunakan enkripsi standar industri (SSL/TLS) dan membatasi akses data hanya kepada karyawan yang berwenang.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-foreground font-heading mb-3">
                      6. Pengungkapan kepada Pihak Ketiga
                    </h2>
                    <p className="text-muted-foreground">
                      Kami dapat membagikan data Anda kepada:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                      <li><strong>Mitra Logistik:</strong> Untuk pengiriman barang (JNE, J&T, dll).</li>
                      <li><strong>Payment Gateway:</strong> Untuk memproses pembayaran (Midtrans).</li>
                      <li><strong>Penegak Hukum:</strong> Jika diwajibkan oleh perintah pengadilan atau undang-undang.</li>
                    </ul>
                  </section>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6 text-center text-sm text-muted-foreground border-t border-border/50">
              <p>Terakhir diperbarui: 19 Februari 2026</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
