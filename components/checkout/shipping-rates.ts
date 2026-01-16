export const SHIPPING_RATES: Record<string, number> = {
  'Sumatera Barat': 12000,
  
  'Aceh': 25000,
  'Sumatera Utara': 25000,
  'Riau': 20000,
  'Jambi': 22000,
  'Sumatera Selatan': 25000,
  'Bengkulu': 25000,
  'Lampung': 28000,
  'Kepulauan Riau': 28000,
  'Kepulauan Bangka Belitung': 25000,

  'DKI Jakarta': 35000,
  'Jawa Barat': 35000,
  'Jawa Tengah': 38000,
  'DI Yogyakarta': 38000,
  'Jawa Timur': 40000,
  'Banten': 35000,
  'Bali': 42000,

  'Nusa Tenggara Barat': 50000,
  'Nusa Tenggara Timur': 55000,

  'Kalimantan Barat': 55000,
  'Kalimantan Tengah': 55000,
  'Kalimantan Selatan': 55000,
  'Kalimantan Timur': 60000,
  'Kalimantan Utara': 65000,

  'Sulawesi Utara': 60000,
  'Sulawesi Tengah': 60000,
  'Sulawesi Selatan': 55000,
  'Sulawesi Tenggara': 60000,
  'Gorontalo': 65000,
  'Sulawesi Barat': 60000,

  'Maluku': 75000,
  'Maluku Utara': 75000,
  'Papua': 90000,
  'Papua Barat': 90000,
  'Papua Selatan': 90000,
  'Papua Tengah': 90000,
  'Papua Pegunungan': 90000,
  'Papua Barat Daya': 90000,
};

export const PROVINCES = Object.keys(SHIPPING_RATES).sort();
