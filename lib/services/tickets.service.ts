import axiosInstance from '@/lib/axios';

export interface ApiTicket {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: string; // 'paid', 'free', 'donation'
  soldOut: boolean;
  eventId: string;
}

export class TicketsService {
  /**
   * Get all tickets (tiers) for an event
   */
  async getTickets(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/ticket/event/${eventId}`);
      return { data: response.data as ApiTicket[], error: null };
    } catch (error: any) {
      console.error('Failed to fetch tickets:', error);
      return { data: [], error: error.response?.data || { message: 'Failed to fetch tickets' } };
    }
  }

  /**
   * Get attendees for a specific ticket tier
   */
  async getTicketAttendees(ticketId: string) {
    try {
      const response = await axiosInstance.get(`/api/ticket/attendees/${ticketId}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to fetch ticket attendees:', error);
      return { data: [], error: error.response?.data || { message: 'Failed to fetch ticket attendees' } };
    }
  }

  /**
   * Create a new ticket tier
   */
  async createTicket(payload: {
    eventId: string;
    name: string;
    type: string;
    price: number;
    quantity: number;
    status: string;
  }) {
    try {
      const response = await axiosInstance.post('/api/ticket/create', payload);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to create ticket:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to create ticket' } };
    }
  }
}

export const ticketsService = new TicketsService();
