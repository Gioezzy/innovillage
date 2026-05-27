/**
 * Example usage of marketplace logo icons
 * 
 * This file demonstrates how to use the ShopeeIcon and TokopediaIcon components
 * in various scenarios within the marketplace checkout flow.
 */

import { ShopeeIcon, TokopediaIcon } from './index';

// Example 1: Basic usage in marketplace selection buttons
export function MarketplaceSelectionExample() {
  return (
    <div className="space-y-4">
      <button className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50">
        <ShopeeIcon size={32} />
        <span className="font-medium">Checkout with Shopee</span>
      </button>
      
      <button className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50">
        <TokopediaIcon size={32} />
        <span className="font-medium">Checkout with Tokopedia</span>
      </button>
    </div>
  );
}

// Example 2: Product page marketplace links
export function ProductMarketplaceLinksExample() {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Available on Marketplaces:</h3>
      
      <a
        href="https://shopee.co.id/product/123"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <ShopeeIcon size={24} />
        <span>Buy on Shopee</span>
      </a>
      
      <a
        href="https://www.tokopedia.com/product/123"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <TokopediaIcon size={24} />
        <span>Buy on Tokopedia</span>
      </a>
    </div>
  );
}

// Example 3: Confirmation dialog with marketplace logo
export function MarketplaceConfirmationExample() {
  const selectedMarketplace = 'shopee'; // or 'tokopedia'
  
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        {selectedMarketplace === 'shopee' ? (
          <ShopeeIcon size={40} />
        ) : (
          <TokopediaIcon size={40} />
        )}
        <div>
          <h3 className="font-semibold text-lg">Confirm Marketplace Checkout</h3>
          <p className="text-sm text-gray-600">
            You will be redirected to {selectedMarketplace === 'shopee' ? 'Shopee' : 'Tokopedia'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Example 4: Order history with marketplace indicator
export function OrderMarketplaceIndicatorExample() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Purchased via:</span>
      <div className="flex items-center gap-1">
        <ShopeeIcon size={16} />
        <span className="text-sm font-medium">Shopee</span>
      </div>
    </div>
  );
}

// Example 5: Responsive sizing
export function ResponsiveSizingExample() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShopeeIcon size={16} />
        <span className="text-sm">Small (16px)</span>
      </div>
      
      <div className="flex items-center gap-2">
        <ShopeeIcon size={24} />
        <span className="text-base">Default (24px)</span>
      </div>
      
      <div className="flex items-center gap-2">
        <ShopeeIcon size={32} />
        <span className="text-lg">Medium (32px)</span>
      </div>
      
      <div className="flex items-center gap-2">
        <ShopeeIcon size={48} />
        <span className="text-xl">Large (48px)</span>
      </div>
    </div>
  );
}
