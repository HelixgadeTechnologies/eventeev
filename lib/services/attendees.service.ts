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
  async getAttendees(eventId: string, page = 1, limit = 50) {
    try {
      const response = await axiosInstance.get(`/api/attendee/event/${eventId}?page=${page}&limit=${limit}`);
      const rawData = response.data?.data || response.data || [];
      const mappedData = (Array.isArray(rawData) ? rawData : []).map(a => ({
        ...a,
        id: a.id || a._id
      }));
      return { data: mappedData as ApiAttendee[], pagination: response.data?.pagination, error: null };
    } catch (error: any) {
      if (error.response?.status !== 403) {
        console.error('Failed to fetch attendees:', error);
      }
      return { data: [], error: error.response?.data || { message: 'Failed to fetch attendees' } };
    }
  }

  /**
   * Get a single attendee by ID with direct endpoint and event fallback
   */
  async getAttendeeById(eventId: string, attendeeId: string) {
    // 1. Try direct attendee lookup
    try {
      const response = await axiosInstance.get(`/api/attendee/${attendeeId}`);
      const raw = response.data?.data || response.data;
      if (raw && (raw.id === attendeeId || raw._id === attendeeId)) {
        return {
          data: { ...raw, id: raw.id || raw._id } as ApiAttendee,
          error: null,
        };
      }
    } catch {
      // Direct endpoint may not be implemented on some backend versions; fall back
    }

    // 2. Fallback: Search in event attendees list
    const { data: attendees, error } = await this.getAttendees(eventId, 1, 500);
    if (error) {
      return { data: null, error };
    }
    const found = attendees.find((a) => a.id === attendeeId);
    if (!found) {
      return { data: null, error: { message: 'Attendee not found in this event' } };
    }
    return { data: found, error: null };
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

  private inFlightCheckIns = new Set<string>();

  /**
   * Check-in an attendee
   */
  async checkInAttendee(attendeeId: string) {
    if (this.inFlightCheckIns.has(attendeeId)) {
      return { data: null, error: { message: 'Check-in already in progress' } };
    }
    this.inFlightCheckIns.add(attendeeId);
    try {
      const response = await axiosInstance.patch(`/api/attendee/${attendeeId}/check-in`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to check-in attendee:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to check-in attendee' } };
    } finally {
      this.inFlightCheckIns.delete(attendeeId);
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
