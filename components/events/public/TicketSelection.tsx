"use client";

import React, { useState, useEffect } from 'react';
import { ApiTicket, ticketsService } from '@/lib/services/tickets.service';
import CheckoutModal from './CheckoutModal';
import { Loader2 } from 'lucide-react';

interface TicketSelectionProps {
  eventId: string;
}

const TicketSelection: React.FC<TicketSelectionProps> = ({ eventId }) => {
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTicket, setSelectedTicket] = useState<ApiTicket | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const loadTickets = async () => {
      const res = await ticketsService.getTickets(eventId);
      if (res.data) {
        setTickets(res.data.filter(t => !t.soldOut)); // Only show available
      }
      setLoading(false);
    };
    loadTickets();
  }, [eventId]);

  const handleCheckoutClick = (ticket: ApiTicket) => {
    setSelectedTicket(ticket);
    setQuantity(1);
    setIsCheckoutOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#EB5017]" /></div>;
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
        <p className="text-gray-400 font-medium text-sm">Tickets are currently unavailable for this event.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Available Tickets</h3>
      
      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket.id || ticket._id} className="bg-white border border-gray-100 hover:border-[#EB5017]/30 rounded-2xl p-5 flex items-center justify-between transition-all hover:shadow-xl hover:shadow-[#EB5017]/5 group">
            <div className="space-y-1">
              <h4 className="font-bold text-gray-900">{ticket.name}</h4>
              <p className="text-xs text-gray-500 font-medium">{ticket.description || 'General Admission'}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-black text-[#EB5017] text-lg">
                  {ticket.price > 0 ? `$${ticket.price.toFixed(2)}` : 'FREE'}
                </p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{ticket.type}</p>
              </div>
              
              <button 
                onClick={() => handleCheckoutClick(ticket)}
                className="bg-gray-100 hover:bg-[#EB5017] text-gray-900 hover:text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors active:scale-95"
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTicket && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          ticket={selectedTicket} 
          quantity={quantity} 
          eventId={eventId} 
        />
      )}
    </div>
  );
};

export default TicketSelection;
