import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']

export class EventsService {
  private supabase = createClient()

  /**
   * Get all published events
   */
  async getPublishedEvents(options?: {
    limit?: number
    offset?: number
    category?: string
    searchQuery?: string
  }) {
    let query = this.supabase
      .from('events')
      .select('*, profiles(full_name, avatar_url)')
      .eq('is_published', true)
      .order('start_date', { ascending: true })

    if (options?.category) {
      query = query.eq('category', options.category)
    }

    if (options?.searchQuery) {
      query = query.or(`title.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    return { data, error }
  }

  /**
   * Get featured events
   */
  async getFeaturedEvents(limit = 6) {
    const { data, error } = await this.supabase
      .from('events')
      .select('*, profiles(full_name, avatar_url)')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('start_date', { ascending: true })
      .limit(limit)

    return { data, error }
  }

  /**
   * Get event by ID
   */
  async getEventById(eventId: string) {
    const { data, error } = await this.supabase
      .from('events')
      .select('*, profiles(full_name, avatar_url, email), tickets(*)')
      .eq('id', eventId)
      .single()

    return { data, error }
  }

  /**
   * Get events created by a specific user
   */
  async getUserEvents(userId: string) {
    const { data, error } = await this.supabase
      .from('events')
      .select('*, tickets(count)')
      .eq('organizer_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  }

  /**
   * Create a new event
   */
  async createEvent(event: EventInsert) {
    const { data, error } = await this.supabase
      .from('events')
      .insert(event)
      .select()
      .single()

    return { data, error }
  }

  /**
   * Update an event
   */
  async updateEvent(eventId: string, updates: EventUpdate) {
    const { data, error } = await this.supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single()

    return { data, error }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string) {
    const { error } = await this.supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    return { error }
  }

  /**
   * Publish an event
   */
  async publishEvent(eventId: string) {
    return this.updateEvent(eventId, { is_published: true })
  }

  /**
   * Unpublish an event
   */
  async unpublishEvent(eventId: string) {
    return this.updateEvent(eventId, { is_published: false })
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit = 10) {
    const now = new Date().toISOString()

    const { data, error } = await this.supabase
      .from('events')
      .select('*, profiles(full_name, avatar_url)')
      .eq('is_published', true)
      .gte('start_date', now)
      .order('start_date', { ascending: true })
      .limit(limit)

    return { data, error }
  }

  /**
   * Get events by category
   */
  async getEventsByCategory(category: string, limit = 10) {
    const { data, error } = await this.supabase
      .from('events')
      .select('*, profiles(full_name, avatar_url)')
      .eq('is_published', true)
      .eq('category', category)
      .order('start_date', { ascending: true })
      .limit(limit)

    return { data, error }
  }

  /**
   * Search events
   */
  async searchEvents(query: string, limit = 20) {
    const { data, error } = await this.supabase
      .from('events')
      .select('*, profiles(full_name, avatar_url)')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      .order('start_date', { ascending: true })
      .limit(limit)

    return { data, error }
  }

  /**
   * Get event statistics for organizer
   */
  async getEventStats(eventId: string) {
    // Get total tickets sold
    const { data: tickets, error: ticketsError } = await this.supabase
      .from('tickets')
      .select('quantity_sold, quantity_total, price')
      .eq('event_id', eventId)

    if (ticketsError) {
      return { data: null, error: ticketsError }
    }

    const totalTicketsSold = tickets?.reduce((sum, t) => sum + t.quantity_sold, 0) || 0
    const totalTicketsAvailable = tickets?.reduce((sum, t) => sum + t.quantity_total, 0) || 0
    const totalRevenue = tickets?.reduce((sum, t) => sum + (t.quantity_sold * t.price), 0) || 0

    // Get total attendees
    const { count: attendeesCount, error: attendeesError } = await this.supabase
      .from('attendees')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)

    if (attendeesError) {
      return { data: null, error: attendeesError }
    }

    // Get checked-in count
    const { count: checkedInCount, error: checkedInError } = await this.supabase
      .from('attendees')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('checked_in', true)

    if (checkedInError) {
      return { data: null, error: checkedInError }
    }

    return {
      data: {
        totalTicketsSold,
        totalTicketsAvailable,
        totalRevenue,
        totalAttendees: attendeesCount || 0,
        checkedInCount: checkedInCount || 0,
      },
      error: null,
    }
  }
}

export const eventsService = new EventsService()
