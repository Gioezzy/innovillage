import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z
  .object({
    full_name: z.string().min(3, 'Nama minimal 3 karakter.'),
    email: z.string().email('Email tidak valid.'),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Nomor telepon tidak valid.'),
    password: z.string().min(6, 'Password minimal 6 karakter.'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password tidak cocok.',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid.')
})

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password minimal 6 karakter.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword']
})

export const profileSchema = z.object({
  full_name: z.string().min(3, 'Nama minimal 3 karakter.'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Nomor telepon tidak valid.'),
  address: z.string().min(10, 'Alamat minimal 10 karakter.'),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama produk minimal 3 karakter.')
    .max(100, 'Nama produk maksimal 100 karakter.'),
  sku: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive('Harga harus lebih dari 0.'),
  lead_time_days: z.number().int().min(1, 'Lead time minimmal 1 hari.'),
  is_active: z.boolean().default(true),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.string().uuid().optional(),
        custom: z.boolean().default(false),
        custom_description: z.string().optional(),
        design_id: z.string().uuid().optional(),
        quantity: z.number().int().positive(),
        unit_price: z.number().positive(),
      })
    )
    .min(1, 'Minimal ada 1 item dalam pesanan.'),
  pickup_method: z.enum(['in_store', 'delivery']),
  pickup_date: z.string().optional(),
  note: z.string().optional(),
});

export const designUploadSchema = z.object({
  file_url: z.string().url(),
  file_name: z.string(),
  file_metadata: z
    .object({
      width: z.number().optional(),
      height: z.number().optional(),
      size: z.number().optional(),
      format: z.number().optional(),
    })
    .optional(),
});
