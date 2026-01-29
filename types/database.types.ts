export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone_number: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone_number?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone_number?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          organizer_id: string
          title: string
          description: string | null
          category: string | null
          event_type: string | null
          start_date: string
          end_date: string
          timezone: string
          venue_name: string | null
          venue_address: string | null
          venue_city: string | null
          venue_state: string | null
          venue_country: string | null
          venue_coordinates: Json | null
          virtual_link: string | null
          banner_image_url: string | null
          thumbnail_url: string | null
          max_attendees: number | null
          is_published: boolean
          is_featured: boolean
          tags: string[] | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organizer_id: string
          title: string
          description?: string | null
          category?: string | null
          event_type?: string | null
          start_date: string
          end_date: string
          timezone?: string
          venue_name?: string | null
          venue_address?: string | null
          venue_city?: string | null
          venue_state?: string | null
          venue_country?: string | null
          venue_coordinates?: Json | null
          virtual_link?: string | null
          banner_image_url?: string | null
          thumbnail_url?: string | null
          max_attendees?: number | null
          is_published?: boolean
          is_featured?: boolean
          tags?: string[] | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organizer_id?: string
          title?: string
          description?: string | null
          category?: string | null
          event_type?: string | null
          start_date?: string
          end_date?: string
          timezone?: string
          venue_name?: string | null
          venue_address?: string | null
          venue_city?: string | null
          venue_state?: string | null
          venue_country?: string | null
          venue_coordinates?: Json | null
          virtual_link?: string | null
          banner_image_url?: string | null
          thumbnail_url?: string | null
          max_attendees?: number | null
          is_published?: boolean
          is_featured?: boolean
          tags?: string[] | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          event_id: string
          name: string
          description: string | null
          price: number
          currency: string
          quantity_total: number
          quantity_sold: number
          quantity_available: number
          sale_start_date: string | null
          sale_end_date: string | null
          min_per_order: number
          max_per_order: number
          is_active: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          description?: string | null
          price?: number
          currency?: string
          quantity_total: number
          quantity_sold?: number
          sale_start_date?: string | null
          sale_end_date?: string | null
          min_per_order?: number
          max_per_order?: number
          is_active?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          quantity_total?: number
          quantity_sold?: number
          sale_start_date?: string | null
          sale_end_date?: string | null
          min_per_order?: number
          max_per_order?: number
          is_active?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          event_id: string
          order_number: string
          status: string
          total_amount: number
          currency: string
          payment_method: string | null
          payment_intent_id: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          order_number: string
          status?: string
          total_amount: number
          currency?: string
          payment_method?: string | null
          payment_intent_id?: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          order_number?: string
          status?: string
          total_amount?: number
          currency?: string
          payment_method?: string | null
          payment_intent_id?: string | null
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          ticket_id: string
          quantity: number
          unit_price: number
          total_price: number
          attendee_info: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          ticket_id: string
          quantity: number
          unit_price: number
          total_price: number
          attendee_info?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          ticket_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          attendee_info?: Json | null
          created_at?: string
        }
      }
      attendees: {
        Row: {
          id: string
          order_id: string
          ticket_id: string
          event_id: string
          attendee_name: string
          attendee_email: string
          attendee_phone: string | null
          qr_code: string
          checked_in: boolean
          checked_in_at: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          ticket_id: string
          event_id: string
          attendee_name: string
          attendee_email: string
          attendee_phone?: string | null
          qr_code: string
          checked_in?: boolean
          checked_in_at?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          ticket_id?: string
          event_id?: string
          attendee_name?: string
          attendee_email?: string
          attendee_phone?: string | null
          qr_code?: string
          checked_in?: boolean
          checked_in_at?: string | null
          metadata?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
