"use client";

import React, { useState } from 'react';
import { ApiTicket, ticketsService } from '@/lib/services/tickets.service';
import PaystackCheckout from './PaystackCheckout';
import { Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: ApiTicket;
  quantity: number;
  eventId: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  ticket,
  quantity,
  eventId
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = ticket.price * quantity;
  const isPaid = ticket.type.toLowerCase() === 'paid' && totalAmount > 0;

  const handleFreeCheckout = async () => {
    setLoading(true);
    setError(null);
    const res = await ticketsService.purchaseTicket({
      eventId,
      ticketId: ticket.id || ticket._id || '',
      quantity,
      buyerName,
      buyerEmail,
    });
    setLoading(false);

    if (res.error) {
      setError(res.error.message || 'Failed to register. Please try again.');
    } else {
      setSuccess(true);
    }
  };

  const handlePaystackSuccess = async (reference: any) => {
    setLoading(true);
    setError(null);
    const res = await ticketsService.purchaseTicket({
      eventId,
      ticketId: ticket.id || ticket._id || '',
      quantity,
      buyerName,
      buyerEmail,
      paymentReference: reference.reference,
    });
    setLoading(false);

    if (res.error) {
      setError(res.error.message || 'Payment successful, but failed to verify ticket with server.');
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Checkout</h2>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{ticket.name} x {quantity}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
              ✕
            </button>
          </div>

          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-lg font-black text-gray-900">Ticket Confirmed!</h3>
              <p className="text-sm text-gray-500">Your ticket has been sent to {buyerEmail}</p>
              <button 
                onClick={onClose}
                className="mt-6 w-full py-4 text-xs font-black uppercase tracking-widest bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full h-12 border border-gray-200 bg-gray-50 rounded-2xl px-4 focus:outline-none focus:ring-2 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full h-12 border border-gray-200 bg-gray-50 rounded-2xl px-4 focus:outline-none focus:ring-2 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Fees</span>
                  <span className="font-bold text-gray-900">$0.00</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-900 font-black uppercase tracking-wide">Total</span>
                  <span className="text-lg font-black text-[#EB5017]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <div className="pt-4 flex flex-col gap-3">
                {isPaid ? (
                  <PaystackCheckout
                    email={buyerEmail}
                    amount={totalAmount * 100} // Convert to lowest currency unit (e.g. kobo)
                    disabled={!buyerName || !buyerEmail || loading}
                    onSuccess={handlePaystackSuccess}
                    onClose={() => {}}
                    buttonText={`Pay $${totalAmount.toFixed(2)}`}
                  />
                ) : (
                  <button
                    onClick={handleFreeCheckout}
                    disabled={!buyerName || !buyerEmail || loading}
                    className="w-full bg-[#1B1818] text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-black/10"
                  >
                    {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                    Register for Free
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
