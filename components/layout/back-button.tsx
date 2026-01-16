'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

import Link from 'next/link';

interface BackButtonProps extends ButtonProps {
  href?: string;
}

export default function BackButton({
  className,
  href,
  onClick,
  ...props
}: BackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Button
        variant="ghost"
        className={cn(
          'mb-6 pl-0 hover:pl-2 transition-all duration-300 hover:bg-transparent hover:text-primary group',
          className
        )}
        asChild
        {...props}
      >
        <Link href={href}>
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Kembali
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={onClick || (() => router.back())}
      className={cn(
        'mb-6 pl-0 hover:pl-2 transition-all duration-300 hover:bg-transparent hover:text-primary group',
        className
      )}
      {...props}
    >
      <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
      Kembali
    </Button>
  );
}
