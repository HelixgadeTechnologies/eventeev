"use client";

import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Loader2 } from 'lucide-react';

interface PaystackCheckoutProps {
  email: string;
  amount: number; // in NGN or equivalent minor units (Kobo)
  currency?: string;
  metadata?: any;
  onSuccess: (reference: any) => void;
  onClose: () => void;
  buttonText?: string;
  disabled?: boolean;
}

const PaystackCheckout: React.FC<PaystackCheckoutProps> = ({
  email,
  amount,
  currency = 'NGN',
  metadata,
  onSuccess,
  onClose,
  buttonText = 'Pay Now',
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

  const config = {
    reference: (new Date()).getTime().toString(),
    email,
    amount,
    currency,
    publicKey,
    metadata,
  };

  const initializePayment = usePaystackPayment(config as any);

  const handlePayment = () => {
    setLoading(true);
    initializePayment({
      onSuccess: (reference: any) => {
        setLoading(false);
        onSuccess(reference);
      },
      onClose: () => {
        setLoading(false);
        onClose();
      }
    } as any);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading || !publicKey}
      className="flex-1 bg-[#EB5017] text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#EB5017]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="w-3 h-3 animate-spin" />}
      {!publicKey ? 'Paystack Key Missing' : buttonText}
    </button>
  );
};

export default PaystackCheckout;
