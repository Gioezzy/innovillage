import React from 'react';

interface TokopediaIconProps {
  size?: number;
  className?: string;
}

/**
 * Tokopedia logo SVG component
 * Uses official Tokopedia brand colors: #42B549 (green)
 */
export default function TokopediaIcon({ size = 24, className = '' }: TokopediaIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Tokopedia logo"
    >
      <rect width="24" height="24" rx="4" fill="#42B549" />
      <path
        d="M12 6C12 6 9 6.5 9 9.5V12M12 6C12 6 15 6.5 15 9.5V12M12 6V18M9 12H15M9 12C9 12 8.5 12.5 8.5 14C8.5 15.5 9 16 9 16M15 12C15 12 15.5 12.5 15.5 14C15.5 15.5 15 16 15 16M9 16H15M9 16V17.5M15 16V17.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
