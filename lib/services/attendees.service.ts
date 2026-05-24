import axiosInstance from '@/lib/axios';

export interface ApiAttendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  isCheckedIn: boolean;
  status: string;
  registrationDate?: string;
  createdAt?: string;
}

export class AttendeesService {
  /**
   * List all attendees for a specific event
   */
  async getAttendees(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/attendee/event/${eventId}`);
      const mappedData = (response.data as any[]).map(a => ({
        ...a,
        id: a.id || a._id
      }));
      return { data: mappedData as ApiAttendee[], error: null };
    } catch (error: any) {
      if (error.response?.status !== 403) {
        console.error('Failed to fetch attendees:', error);
      }
      return { data: [], error: error.response?.data || { message: 'Failed to fetch attendees' } };
    }
  }

  /**
   * Public registration for an event (Unauthenticated)
   */
  async publicRegister(payload: { eventId: string; name: string; email: string; ticketId?: string }) {
    try {
      const response = await axiosInstance.post('/api/attendee/register', payload);
      return { data: response.data as ApiAttendee, error: null };
    } catch (error: any) {
      console.error('Public registration failed:', error);
      return { data: null, error: error.response?.data || { message: 'Registration failed' } };
    }
  }

  /**
   * Create a new attendee (Manual registration via Admin)
   */
  async createAttendee(payload: { eventId: string; name: string; email: string; ticketId?: string; status?: string }) {
    try {
      const response = await axiosInstance.post('/api/attendee/create', payload);
      return { data: response.data as ApiAttendee, error: null };
    } catch (error: any) {
      console.error('Failed to create attendee:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to create attendee' } };
    }
  }

  /**
   * Check-in an attendee
   */
  async checkInAttendee(attendeeId: string) {
    try {
      const response = await axiosInstance.patch(`/api/attendee/${attendeeId}/check-in`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to check-in attendee:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to check-in attendee' } };
    }
  }

  /**
   * Delete an attendee
   */
  async deleteAttendee(attendeeId: string) {
    try {
      const response = await axiosInstance.delete(`/api/attendee/${attendeeId}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to delete attendee:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to delete attendee' } };
    }
  }

  /**
   * Get attendee statistics for an event
   */
  async getAttendeeStats(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/attendee/event/${eventId}/stats`);
      return { data: response.data, error: null };
    } catch (error: any) {
      if (error.response?.status !== 403) {
        console.error('Failed to fetch attendee stats:', error);
      }
      return { data: null, error: error.response?.data || { message: 'Failed to fetch stats' } };
    }
  }
}

export const attendeesService = new AttendeesService();
