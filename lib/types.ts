import { Database } from './supabase/database.types';

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert =
  Database['public']['Tables']['categories']['Insert'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Store = Database['public']['Tables']['stores']['Row'];
export type StoreInsert = Database['public']['Tables']['stores']['Insert'];
export type StoreUpdate = Database['public']['Tables']['stores']['Update'];

export type UserRole = Database['public']['Enums']['user_role'];
export type OrderStatus = Database['public']['Enums']['order_status'];
export type PaymentStatus = Database['public']['Enums']['payment_status'];

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface ProductImage {
  url: string;
}

export type ProductWithTypedImages = Product; 

export interface ProductSnapshot {
  name: string;
  price: number;
}

export type TypedOrderItem = Omit<OrderItem, 'product_snapshot'> & {
  product_snapshot: ProductSnapshot | null;
  custom?: boolean;
  designs?: any;
};

export type TypedPayment = Payment & {
  midtrans_token: string | null;
};

export interface AdminOrderItem extends TypedOrderItem {
  products: ProductWithTypedImages | null;
}

export interface OrderWithDetails extends Order {
  profiles: {
    full_name: string | null;
    phone: string | null;
    address: string | null;
  } | null;

  order_items: (TypedOrderItem & {
    products: ProductWithTypedImages | null;
  })[];
  
  pickup_date?: string | null;
  pickup_method?: string | null;


  payment: TypedPayment[] | null;
  
  stores?: Store | null;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
  storeId?: string;
  customization?: {
    categorySlug: string;
    additionalNotes: string;
    totalPrice: number;
  };
}

export interface ProductWithCategory extends Product {
  category: Category;
  stores?: Store | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'system';
  is_read?: string;
  related_id?: string;
  created_at: string;
}