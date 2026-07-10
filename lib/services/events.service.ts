
import axiosInstance from '@/lib/axios'

export interface ApiEvent {
  id: string
  title: string
  description?: string
  category?: string
  type?: string
  date: string
  status: string
}

export class EventsService {
  /**
   * Helper to map backend event to frontend format
   */
  private mapEvent(event: any) {
    if (!event) return null;
    return {
      ...event,
      _id: event.id || event._id,
      name: event.title,
      startDate: event.startDate, // Keep raw ISO for DatePicker
      endDate: event.endDate,     // Keep raw ISO for DatePicker
      startTime: event.startTime || 'N/A',
      endTime: event.endTime || 'N/A',
      is_published: event.status === 'Published',
      organizer_id: 'backend-user',
      userId: event.owner, // Map backend 'owner' field to frontend 'userId' so that dashboard filtering succeeds
      profiles: {
        full_name: "Event Organizer",
        avatar_url: null
      }
    }
  }

  /**
   * Get all published events
   */
  async getPublishedEvents(page = 1, limit = 20) {
    try {
      const response = await axiosInstance.get(`/api/event/published?page=${page}&limit=${limit}`)
      const rawResponseData = response.data?.data || response.data || [];
      const rawData = Array.isArray(rawResponseData) ? rawResponseData : [];
      const data = rawData.map((event: any) => this.mapEvent(event))
      return { data, pagination: response.data?.pagination, error: null }
    } catch (error: any) {
      const respData = error.response?.data;
      const respMsg = (typeof respData === 'string' ? respData : respData?.message) || '';
      
      // If the backend returns 404 or a "no events found" message, treat it as a successful empty response
      const isNotFoundError = error.response?.status === 404 || 
                            respMsg.toLowerCase().includes('no') ||
                            error.message?.toLowerCase().includes('map');

      if (isNotFoundError) {
        return { data: [], error: null }
      }
      
      console.error('Failed to fetch published events:', error)
      return { data: [], error: { message: respMsg || error.message || 'Failed to fetch events' } }
    }
  }

  /**
   * Get all draft events
   */
  async getDraftedEvents() {
    try {
      const response = await axiosInstance.get('/api/event/drafts')
      const rawData = Array.isArray(response.data) ? response.data : [];
      const data = rawData.map((event: any) => this.mapEvent(event))
      return { data, error: null }
    } catch (error: any) {
      const respData = error.response?.data;
      const respMsg = (typeof respData === 'string' ? respData : respData?.message) || '';

      // Handle "No drafts" case gracefully
      const isNotFoundError = error.response?.status === 404 || 
                            respMsg.toLowerCase().includes('no') ||
                            error.message?.toLowerCase().includes('map');

      if (isNotFoundError) {
        return { data: [], error: null }
      }
      
      console.error('Failed to fetch draft events:', error)
      return { data: [], error: { message: respMsg || error.message || 'Failed to fetch drafts' } }
    }
  }

  /**
   * Get all completed events
   */
  async getCompletedEvents() {
    try {
      const response = await axiosInstance.get('/api/event/completed')
      const rawData = Array.isArray(response.data) ? response.data : [];
      const data = rawData.map((event: any) => this.mapEvent(event))
      return { data, error: null }
    } catch (error: any) {
      const respData = error.response?.data;
      const respMsg = (typeof respData === 'string' ? respData : respData?.message) || '';

      // Handle "No completed events" case gracefully
      const isNotFoundError = error.response?.status === 404 || 
                            respMsg.toLowerCase().includes('no') ||
                            error.message?.toLowerCase().includes('map');

      if (isNotFoundError) {
        return { data: [], error: null }
      }
      
      console.error('Failed to fetch completed events:', error)
      return { data: [], error: { message: respMsg || error.message || 'Failed to fetch completed events' } }
    }
  }

  /**
   * Get featured events (Mocked as a subset of published)
   */
  async getFeaturedEvents(limit = 6) {
    const { data, error } = await this.getPublishedEvents()
    return { data: data?.slice(0, limit) || [], error }
  }

  /**
   * Create a new event
   */
  async createEvent(eventData: {
    title: string
    description: string
    category: string
    type: string
    startDate: string
    endDate?: string
    startTime: string
    endTime?: string
    location: string
    status?: string
    bannerImage?: string
    thumbnailImage?: string
    website?: string
    facebookUrl?: string
    instagramUrl?: string
    xUrl?: string
    recurrentEvent?: boolean
  }) {
    try {
      const response = await axiosInstance.post('/api/event/publish', {
        ...eventData,
        status: eventData.status || 'Published'
      })
      return { data: response.data, error: null }
    } catch (error: any) {
      console.error('Failed to create event:', error)
      return { data: null, error: error.response?.data || { message: 'Failed to create event' } }
    }
  }

  /**
   * Get event statistics for organizer
   */
  async getEventStats(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/attendee/event/${eventId}/stats`)
      return { data: response.data, error: null }
    } catch (error: any) {
      console.error('Failed to fetch event stats:', error)
      return { data: null, error: error.response?.data || { message: 'Failed to fetch stats' } }
    }
  }

  /**
   * Get event by ID
   */
  async getEventById(eventId: string) {
    try {
      const response = await axiosInstance.get(`/api/event/${eventId}`)
      const data = this.mapEvent(response.data)
      return { data, error: null }
    } catch (error: any) {
      console.error('Failed to fetch event by ID:', error)
      return { data: null, error: error.response?.data || { message: 'Failed to fetch event' } }
    }
  }

  /**
   * Publish a draft event
   */
  async publishDraft(eventId: string) {
    try {
      const response = await axiosInstance.post(`/api/event/drafttolive/${eventId}`)
      return { data: response.data, error: null }
    } catch (error: any) {
      console.error('Failed to publish draft:', error)
      return { data: null, error: error.response?.data || { message: 'Failed to publish draft' } }
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(eventId: string, payload: any) {
    try {
      const response = await axiosInstance.put(`/api/event/${eventId}`, payload);
      const data = this.mapEvent(response.data);
      return { data, error: null };
    } catch (error: any) {
      console.error('Failed to update event:', error);
      return { data: null, error: error.response?.data || { message: 'Failed to update event' } };
    }
  }

  /**
   * Get public event details by slug (Unauthenticated)
   */
  async getPublicEventBySlug(slug: string) {
    try {
      const response = await axiosInstance.get(`/api/event/public/${slug}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Failed to fetch public event by slug:', error);
      return { data: null, error: error.response?.data || { message: 'Event not found' } };
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string) {
    try {
      const response = await axiosInstance.delete(`/api/event/${eventId}`)
      return { data: response.data, error: null }
    } catch (error: any) {
      console.error('Failed to delete event:', error)
      return { data: null, error: error.response?.data || { message: 'Failed to delete event' } }
    }
  }
}

export const eventsService = new EventsService()

