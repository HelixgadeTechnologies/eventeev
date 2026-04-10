
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
    return {
      ...event,
      _id: event.id || event._id,
      name: event.title,
      startDate: event.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A',
      startTime: event.startTime || 'N/A',
      is_published: event.status === 'Published',
      organizer_id: 'backend-user',
      profiles: {
        full_name: "Event Organizer",
        avatar_url: null
      }
    }
  }

  /**
   * Get all published events
   */
  async getPublishedEvents() {
    try {
      const response = await axiosInstance.get('/api/event/published')
      const data = response.data.map((event: any) => this.mapEvent(event))
      return { data, error: null }
    } catch (error: any) {
      console.error('Failed to fetch published events:', error)
      return { data: [], error: error.response?.data || { message: 'Failed to fetch events' } }
    }
  }

  /**
   * Get all draft events
   */
  async getDraftedEvents() {
    try {
      const response = await axiosInstance.get('/api/event/drafts')
      const data = response.data.map((event: any) => this.mapEvent(event))
      return { data, error: null }
    } catch (error: any) {
      console.error('Failed to fetch draft events:', error)
      return { data: [], error: error.response?.data || { message: 'Failed to fetch drafts' } }
    }
  }

  /**
   * Get all completed events
   */
  async getCompletedEvents() {
    try {
      const response = await axiosInstance.get('/api/event/completed')
      const data = response.data.map((event: any) => this.mapEvent(event))
      return { data, error: null }
    } catch (error: any) {
      console.error('Failed to fetch completed events:', error)
      return { data: [], error: error.response?.data || { message: 'Failed to fetch completed events' } }
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
   * Get event by ID (Falling back to local search if no direct endpoint)
   */
  async getEventById(eventId: string) {
    // If there was a GET /api/event/{id}, we'd use it. For now, check categories.
    const { data: published } = await this.getPublishedEvents()
    const { data: drafts } = await this.getDraftedEvents()
    const { data: completed } = await this.getCompletedEvents()
    
    const event = [...published, ...drafts, ...completed].find(e => e._id === eventId)
    
    if (!event) {
       return { data: null, error: { message: "Event not found" } }
    }
    
    return { data: event, error: null }
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

