import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      <div className="backdrop-blur-xl bg-white/70 shadow-2xl border border-white/40 rounded-2xl p-10 max-w-xl w-full text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-300 rounded-full opacity-30 blur-3xl"></div>

        <div className="mb-8">
          <Image
            src="/images/404.svg"
            alt="Admin Not Found"
            width={260}
            height={200}
            className="mx-auto opacity-90 drop-shadow-lg"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
          Halaman admin yang Anda coba akses tidak tersedia atau telah
          dipindahkan. Pastikan URL sesuai atau kembali ke dashboard.
        </p>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
