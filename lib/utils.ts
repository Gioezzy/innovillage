/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Change price to Indonesian Rupiah format
 * @param price number
 * @returns string
 */

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Change date to Indonesian format
 * @param date Date
 * @returns string
 */

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
  }).format(new Date(date));
}

/**
 * Change date and time to Indonesian format
 * @param date Date
 * @returns string
 */

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(date));
}

/**
 * Generate a random string
 * @param length number
 * @returns string
 */

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');

  return `NB${year}${month}${day}-${random}`;
}

/**
 * Calculate estimated pickup date
 * @param leadTimeDays number
 * @returns Date
 */

export function calculatePickupDate(leadTimeDays: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + leadTimeDays);
  return date;
}

export function truncate(str: string, length: number):string {
  if(str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getProductImage(images: any): string {
  if (!images || !Array.isArray(images) || images.length === 0){
    return '/images/placeholder-product.png'
  }

  if (typeof images[0] === 'string') {
    return images[0];
  }

  const primaryImage = images.find((img:any) => img.is_primary)
  return primaryImage?.url || images[0]?.url || '/images/placeholder-product.png'
}

/**
 * Validate file upload
 * @param file File
 * @param maxSizeMB number
 * @returns { valid: boolean; error?: string }
 */

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File terlalu besar. Maksimal 5MB.' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Format file tidak didukung.' };
  }

  return { valid: true };
}
