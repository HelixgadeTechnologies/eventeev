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
    startDate?: string;
    stopDate?: string;
    startTime?: string;
    stopTime?: string;
  }) {
    try {
      // Ensure numeric values are valid numbers (never NaN)
      const cleanPrice = isNaN(payload.price) ? 0 : payload.price;
      const cleanQuantity = isNaN(payload.quantity) ? 0 : payload.quantity;

      // Create a payload that supports both naming conventions for robustness
      const apiPayload = {
        ...payload,
        price: cleanPrice,
        quantity: cleanQuantity,
        event_id: payload.eventId,
        quantity_total: cleanQuantity,
        currency: "USD",
        min_per_order: 1,
        max_per_order: 10,
        is_active: true,
        sale_start_date: payload.startDate ? `${payload.startDate}T${payload.startTime || '00:00'}:00` : undefined,
        sale_end_date: payload.stopDate ? `${payload.stopDate}T${payload.stopTime || '23:59'}:00` : undefined,
      };

      // Diagnostic logging for development/debugging
      console.log('[TicketsService] Sending payload to /api/ticket/create:', apiPayload);

      const response = await axiosInstance.post('/api/ticket/create', apiPayload);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to create ticket:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to create ticket' } };
    }
  }

  /**
   * Update an existing ticket
   */
  async updateTicket(ticketId: string, payload: Partial<ApiTicket>) {
    try {
      const response = await axiosInstance.put(`/api/ticket/edit/${ticketId}`, payload);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to update ticket:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to update ticket' } };
    }
  }

  /**
   * Delete a ticket tier
   */
  async deleteTicket(ticketId: string) {
    try {
      const response = await axiosInstance.delete(`/api/ticket/${ticketId}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to delete ticket:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to delete ticket' } };
    }
  }

  /**
   * Update ticket status (e.g., Active, Paused)
   */
  async updateTicketStatus(ticketId: string, status: string) {
    try {
      const response = await axiosInstance.patch(`/api/ticket/${ticketId}/status`, { status });
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to update ticket status:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to update ticket status' } };
    }
  }
}

export const ticketsService = new TicketsService();
