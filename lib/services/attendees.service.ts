import axiosInstance from '@/lib/axios';

export interface ApiAttendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  isCheckedIn: boolean;
  status: string;
  createdAt?: string;
}

export class AttendeesService {
  /**
   * List all attendees for a specific event
   */
  async getAttendees(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/attendee/event/${eventId}`);
      return { data: response.data as ApiAttendee[], error: null };
    } catch (error: any) {
      console.error('Failed to fetch attendees:', error);
      return { data: [], error: error.response?.data || { message: 'Failed to fetch attendees' } };
    }
  }

  /**
   * Create a new attendee (Register for event)
   */
  async createAttendee(payload: { eventId: string; name: string; email: string; status?: string }) {
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
      console.error('Failed to fetch attendee stats:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to fetch stats' } };
    }
  }
}

export const attendeesService = new AttendeesService();
