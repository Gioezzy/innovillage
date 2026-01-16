/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface ProductFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const handleApplyFilters = () => {
    onFilterChange({
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      sortBy,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="font-semibold text-lg">Filter & Sort</h3>

      <div className="space-y-3">
        <Label>Rentang Harga</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className='space-y-3'>
        <Label>Urutkan</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name'>Nama (A-Z)</SelectItem>
            <SelectItem value='price_asc'>Harga: Rendah ke Tinggi</SelectItem>
            <SelectItem value='price_desc'>Harga: Tinggi ke Rendah</SelectItem>
            <SelectItem value='newest'>Terbaru</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleApplyFilters} className='w-full'>
        Terapkan Filter
      </Button>
    </div>
  );
}
