/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: any[];
  defaultImageUrl: string;
  altText: string;
}

export default function ProductImageGallery({
  images,
  defaultImageUrl,
  altText,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(defaultImageUrl);

  const normalizedImages = images.map((img, idx) => {
    if (typeof img === 'string') {
      return { url: img, id: `img-${idx}` };
    }
    return { url: img.url, id: img.id || `img-${idx}` };
  });

  const allImages = [
    { url: defaultImageUrl, id: 'default' },
    ...normalizedImages.filter(img => img.url !== defaultImageUrl),
  ];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border">
        <Image
          src={selectedImage}
          alt={altText}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>

      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {allImages.map((img: any, idx: number) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedImage(img.url)}
              className={cn(
                'relative aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition-colors',
                selectedImage === img.url
                  ? 'border-gray-900'
                  : 'border-transparent hover:border-gray-400'
              )}
            >
              <Image
                src={img.url}
                alt={`${altText} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
