export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Jelajahi Katalog',
      description: 'Temukan ragam motif Songket Silungkang dari berbagai pengrajin lokal',
    },
    {
      number: '2',
      title: 'Pilih Produk',
      description: 'Pilih kain songket yang Anda inginkan atau lakukan pemesanan custom',
    },
    {
      number: '3',
      title: 'Bayar & Proses',
      description: 'Lakukan pembayaran aman dan pengrajin akan menyiapkan pesanan Anda',
    },
    {
      number: '4',
      title: 'Kirim & Terima',
      description: 'Pesanan dikirim langsung dari Sawahlunto ke alamat Anda',
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3-xl font-bold text-center mb-12">
          Cara Pemesanan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map(step => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
