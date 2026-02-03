
import { publishedEvents, draftedEvents, completedEvents } from '@/lib/demo-data/events'

export class EventsService {
  /**
   * Get all published events
   */
  async getPublishedEvents(options?: {
    limit?: number
    offset?: number
    category?: string
    searchQuery?: string
  }) {
    let data = [...publishedEvents].map(event => ({
      ...event,
      id: event._id,
      title: event.name,
      is_published: event.status === 'published',
      organizer_id: event.userId,
      profiles: {
        full_name: "Demo Organizer",
        avatar_url: null
      }
    }))

    if (options?.category) {
      data = data.filter(e => e.category === options.category)
    }

    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase()
      data = data.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q)
      )
    }

    if (options?.offset !== undefined && options?.limit !== undefined) {
      data = data.slice(options.offset, options.offset + options.limit)
    } else if (options?.limit) {
      data = data.slice(0, options.limit)
    }

    return { data, error: null }
  }

  /**
   * Get featured events
   */
  async getFeaturedEvents(limit = 6) {
    const { data } = await this.getPublishedEvents({ limit })
    return { data, error: null }
  }

  /**
   * Get event by ID
   */
  async getEventById(eventId: string) {
    const allEvents = [...publishedEvents, ...draftedEvents, ...completedEvents]
    const event = allEvents.find(e => e._id === eventId)

    if (!event) {
      return { data: null, error: { message: "Event not found" } }
    }

    const mappedEvent = {
      ...event,
      id: event._id,
      title: event.name,
      is_published: event.status === 'published',
      organizer_id: event.userId,
      profiles: {
        full_name: "Demo Organizer",
        avatar_url: null,
        email: "organizer@demo.com"
      },
      tickets: [] // Mock tickets
    }

    return { data: mappedEvent, error: null }
  }

  /**
   * Get events created by a specific user
   */
  async getUserEvents(userId: string) {
    const allEvents = [...publishedEvents, ...draftedEvents, ...completedEvents]
    const userEvents = allEvents
      .filter(e => e.userId === userId)
      .map(event => ({
        ...event,
        id: event._id,
        title: event.name,
        is_published: event.status === 'published',
        organizer_id: event.userId,
        tickets: { count: 0 }
      }))

    return { data: userEvents, error: null }
  }

  /**
   * Create a new event (Mock)
   */
  async createEvent(event: Record<string, unknown>) {
    const newEvent = {
      ...event,
      id: "mock-new-id",
      created_at: new Date().toISOString()
    }
    return { data: newEvent, error: null }
  }

  /**
   * Update an event (Mock)
   */
  async updateEvent(eventId: string, updates: Record<string, unknown>) {
    return { data: { id: eventId, ...updates }, error: null }
  }

  /**
   * Delete an event (Mock)
   */
  async deleteEvent() {
    return { error: null }
  }

  /**
   * Publish an event (Mock)
   */
  async publishEvent(eventId: string) {
    return this.updateEvent(eventId, { is_published: true })
  }

  /**
   * Unpublish an event (Mock)
   */
  async unpublishEvent(eventId: string) {
    return this.updateEvent(eventId, { is_published: false })
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit = 10) {
    return this.getPublishedEvents({ limit })
  }

  /**
   * Get events by category
   */
  async getEventsByCategory(category: string, limit = 10) {
    return this.getPublishedEvents({ category, limit })
  }

  /**
   * Search events
   */
  async searchEvents(query: string, limit = 20) {
    return this.getPublishedEvents({ searchQuery: query, limit })
  }

  /**
   * Get event statistics for organizer (Mock)
   */
  async getEventStats(_eventId: string) {
    return {
      data: {
        totalTicketsSold: 120,
        totalTicketsAvailable: 500,
        totalRevenue: 4500,
        totalAttendees: 115,
        checkedInCount: 98,
      },
      error: null,
    }
  }
}

export const eventsService = new EventsService()

