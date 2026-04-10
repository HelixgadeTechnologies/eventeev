import axiosInstance from '@/lib/axios';

export interface ApiTicket {
  id: string;
  _id?: string; // Backend identifier
  name: string;
  price: number;
  quantity: number;
  type: string; // 'paid', 'free', 'donation'
  soldOut: boolean;
  eventId: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  description?: string;
  status?: string;
}

export class TicketsService {
  /**
   * Get all tickets (tiers) for an event
   */
  async getTickets(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/ticket/event/${eventId}`);
      const tickets = (response.data as any[]).map(t => ({
        ...t,
        id: t.id || t._id // Ensure id is always populated for frontend consistency
      }));
      return { data: tickets as ApiTicket[], error: null };
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
    endDate?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
  }) {
    try {
      // Ensure numeric values are valid numbers (never NaN)
      const cleanPrice = isNaN(payload.price) ? 0 : payload.price;
      const cleanQuantity = isNaN(payload.quantity) ? 0 : payload.quantity;

      // Align exactly with the backend's expected structure:
      // - type: Capitalized ("Paid", "Free", "Donation")
      // - status: "Active"
      // - endDate/endTime: naming convention
      const apiPayload = {
        eventId: payload.eventId,
        name: payload.name,
        type: payload.type.charAt(0).toUpperCase() + payload.type.slice(1),
        price: cleanPrice,
        quantity: cleanQuantity,
        startDate: payload.startDate,
        startTime: payload.startTime,
        endDate: payload.endDate,
        endTime: payload.endTime,
        description: payload.description || `Ticket tier for your event.`,
        status: "Active"
      };

      // Diagnostic logging for development/debugging
      console.log('[TicketsService] Sending aligned payload to /api/ticket/create:', apiPayload);

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
