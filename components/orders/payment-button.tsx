/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { CreditCard, Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import {
  checkPaymentStatusAction,
  generatePaymentTokenAction,
} from '@/lib/actions/payment';
import { useRouter } from 'next/navigation';

interface PaymentButtonProps {
  orderId: string;
  orderNumber: string;
  paymentToken?: string;
  paymentStatus: string;
  orderStatus: string;
}

export default function PaymentButton({
  orderId,
  orderNumber,
  paymentToken: initialPaymentToken,
  paymentStatus,
  orderStatus,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [paymentToken, setPaymentToken] = useState(initialPaymentToken);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute(
      'data-client-key',
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );
    script.async = true;

    const existingScript = document.querySelector(
      `script[src="${script.src}"]`
    );
    if (!existingScript) {
      document.body.appendChild(script);
    }

    return () => {
      const scriptTag = document.querySelector(`script[src="${script.src}"]`);
      if (scriptTag) {
      }
    };
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    let token = paymentToken;

    if (!token) {
      toast.info('Membuat token pembayaran...');
      const result = await generatePaymentTokenAction(orderId);
      if (result.error || !result.paymentToken) {
        toast.error(result.error || 'Gagal membuat token pembayaran.');
        setIsLoading(false);
        return;
      }
      token = result.paymentToken;
      setPaymentToken(token);
    }

    if (typeof window.snap === 'undefined') {
      toast.error('Gagal memuat skrip pembayaran. Coba muat ulang halaman.');
      setIsLoading(false);
      return;
    }

    if (!token) {
      toast.error('Token pembayaran tidak tersedia.');
      setIsLoading(false);
      return;
    }

    window.snap.pay(token, {
      onSuccess: async () => {
        toast.success('Pembayaran berhasil!');
        await checkStatus();
      },
      onPending: () => {
        toast.info('Menunggu pembayaran...');
        router.refresh();
      },
      onError: () => {
        toast.error('Pembayaran gagal atau dibatalkan.');
        setIsLoading(false);
      },
      onClose: () => {
        if (paymentStatus !== 'success') {
          toast.info('Anda menutup pop-up pembayaran.');
        }
        setIsLoading(false);
      },
    });
  };

  const checkStatus = async () => {
    setIsChecking(true);
    const result = await checkPaymentStatusAction(orderId);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Status pembayaran diperbarui');
      router.refresh();
    }

    setIsChecking(false);
  };

  if (orderStatus !== 'pending_payment') {
    return null;
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={handlePayment}
        disabled={isLoading || isChecking}
        className="flex-1"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Bayar Sekarang
          </>
        )}
      </Button>

      <Button
        onClick={checkStatus}
        disabled={isChecking || isLoading}
        variant="outline"
        size="lg"
      >
        {isChecking ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <RefreshCcw className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
}
