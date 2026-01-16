export const CATEGORIES = {
  SONGKET_BALAPAK: {
    slug: 'songket-balapak',
    name: 'Songket Balapak',
  },
  SONGKET_BATABUA: {
    slug: 'songket-batabua',
    name: 'Songket Batabua',
  },
  SELENDANG: {
    slug: 'selendang',
    name: 'Selendang',
  },
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Menunggu Pembayaran',
  paid: 'Sudah Dibayar',
  in_production: 'Sedang Diproses',
  ready_for_pickup: 'Siap Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  returned: 'Dikembalikan'
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  in_production: 'bg-purple-100 text-purple-800',
  ready_for_pickup: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800'
};

export const PAYMENT_METHODS: Record<string, string> = {
  gopay: 'GoPay',
  qris: 'QRIS',
  credit_card: 'Kartu Kredit',
  bca_va: 'BCA Virtual Account',
  bni_va: 'BNI Virtual Account',
  bri_va: 'BRI Virtual Account',
  mandiri_va: 'Mandiri Virtual Account',
  permata_va: 'Permata Virtual Account',
  shopeepay: 'ShopeePay',
  dana: 'Dana',
};

export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

export const DEFAULT_LEAD_TIME_DAYS = 7;
export const SITE_NAME = 'Songket.id';
export const CONTACT_WHATSAPP = '6281234567890';
export const CONTACT_EMAIL = 'hello@songket.id';
export const COMPANY_ADDRESS = 'Silungkang, Sawahlunto, Sumatera Barat';

