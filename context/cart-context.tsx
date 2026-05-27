'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { CartItemWithMarketplace, MarketplacePlatform } from '@/lib/types';
import isEqual from 'lodash.isequal';

interface CartContentType {
  items: CartItemWithMarketplace[];
  addItem: (item: Omit<CartItemWithMarketplace, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  
  // New methods for marketplace checkout
  getItemsByStore: () => Map<string, CartItemWithMarketplace[]>;
  validateMarketplaceCheckout: (platform: MarketplacePlatform) => {
    valid: boolean;
    missingUrls: string[];
  };
  hasMultipleStores: () => boolean;
}

const CartContent = createContext<CartContentType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemWithMarketplace[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart: ', error);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (item: Omit<CartItemWithMarketplace, 'id'>) => {
    setItems(prev => {
      const existingItemIndex = prev.findIndex(
        i =>
          i.productId === item.productId &&
          isEqual(i.customization, item.customization)
      );

      if (existingItemIndex > -1) {
        const updated = [...prev];
        updated[existingItemIndex].quantity += item.quantity;
        return updated;
      }

      return [...prev, { ...item, id: Date.now().toString() }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /**
   * Groups cart items by store ID
   * Returns a Map where keys are store IDs and values are arrays of items from that store
   * **Validates: Requirements 5.1**
   */
  const getItemsByStore = useCallback((): Map<string, CartItemWithMarketplace[]> => {
    const grouped = new Map<string, CartItemWithMarketplace[]>();
    
    items.forEach(item => {
      const storeId = item.storeId || 'unknown';
      if (!grouped.has(storeId)) {
        grouped.set(storeId, []);
      }
      grouped.get(storeId)!.push(item);
    });
    
    return grouped;
  }, [items]);

  /**
   * Validates if all cart items have marketplace URLs for the selected platform
   * Returns validation result with list of products missing URLs
   * **Validates: Requirements 9.3, 9.4, 9.5**
   */
  const validateMarketplaceCheckout = useCallback((platform: MarketplacePlatform): {
    valid: boolean;
    missingUrls: string[];
  } => {
    const missingUrls: string[] = [];
    
    items.forEach(item => {
      let hasUrl = false;
      
      switch (platform) {
        case 'shopee':
          hasUrl = !!(item.shopeeUrl && item.shopeeUrl.trim() !== '');
          break;
        case 'tokopedia':
          hasUrl = !!(item.tokopediaUrl && item.tokopediaUrl.trim() !== '');
          break;
        case 'padiumkm':
          hasUrl = !!(item.padiumkmUrl && item.padiumkmUrl.trim() !== '');
          break;
      }
      
      if (!hasUrl) {
        missingUrls.push(item.productName);
      }
    });
    
    return {
      valid: missingUrls.length === 0,
      missingUrls
    };
  }, [items]);

  /**
   * Checks if cart contains items from multiple stores
   * Returns true if items belong to 2 or more different stores
   * **Validates: Requirements 5.4**
   */
  const hasMultipleStores = useCallback((): boolean => {
    const storeIds = new Set<string>();
    
    items.forEach(item => {
      const storeId = item.storeId || 'unknown';
      storeIds.add(storeId);
    });
    
    return storeIds.size > 1;
  }, [items]);

  return (
    <CartContent.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        getItemsByStore,
        validateMarketplaceCheckout,
        hasMultipleStores,
      }}
    >
      {children}
    </CartContent.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContent);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
