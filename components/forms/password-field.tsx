'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface PasswordFieldProps {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  showForgotPassword?: boolean;
}

export default function PasswordField({
  id,
  name,
  label = 'Password',
  required = false,
  disabled = false,
  showForgotPassword = true,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {showForgotPassword && (
          <Link
            href="/forgot-password"
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors"
          >
            Lupa Password?
          </Link>
        )}
      </div>

      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••"
          required={required}
          disabled={disabled}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
