import React from 'react';

interface ShopeeIconProps {
  size?: number;
  className?: string;
}

/**
 * Shopee logo SVG component
 * Uses official Shopee brand colors: #EE4D2D (orange-red)
 */
export default function ShopeeIcon({ size = 24, className = '' }: ShopeeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Shopee logo"
    >
      <rect width="24" height="24" rx="4" fill="#EE4D2D" />
      <path
        d="M7.5 8.5C7.5 8.5 8 7 9.5 7C11 7 11.5 8.5 11.5 8.5M12.5 8.5C12.5 8.5 13 7 14.5 7C16 7 16.5 8.5 16.5 8.5M7 11C7 11 7.5 13 9.5 13C11.5 13 12 11 12 11M12 11C12 11 12.5 13 14.5 13C16.5 13 17 11 17 11M9.5 15.5C9.5 15.5 10.5 17 12 17C13.5 17 14.5 15.5 14.5 15.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
