export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          county: string | null
          bio: string | null
          avatar_url: string | null
          is_lawyer: boolean
          is_anonymous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          county?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_lawyer?: boolean
          is_anonymous?: boolean
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      cases: {
        Row: {
          id: string
          case_number: string
          user_id: string
          category: string
          incident_type: string | null
          incident_date: string | null
          incident_time: string | null
          location: string | null
          description: string
          involved_description: string | null
          victim_self: boolean
          has_witnesses: boolean
          police_reported: string | null
          legal_representation: string | null
          preferred_language: string
          additional_context: string | null
          status: 'submitted' | 'evidence_uploaded' | 'under_review' | 'investigation' | 'referred' | 'in_court' | 'resolved' | 'closed'
          is_anonymous: boolean
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['cases']['Row'], 'id' | 'case_number' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['cases']['Row']>
      }
      evidence: {
        Row: {
          id: string
          case_id: string
          user_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          file_hash: string | null
          description: string | null
          uploaded_at: string
        }
        Insert: Omit<Database['public']['Tables']['evidence']['Row'], 'id' | 'uploaded_at'>
        Update: Partial<Database['public']['Tables']['evidence']['Row']>
      }
      messages: {
        Row: {
          id: string
          case_id: string | null
          sender_id: string
          receiver_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Row']>
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          support_type: 'platform' | 'legal' | 'ai'
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['conversations']['Row']>
      }
      conversation_messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          sender_type: 'user' | 'support' | 'ai'
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['conversation_messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['conversation_messages']['Row']>
      }
      trusted_contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          relationship: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['trusted_contacts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['trusted_contacts']['Row']>
      }
      lawyers: {
        Row: {
          id: string
          user_id: string
          bar_number: string
          specializations: string[]
          counties: string[]
          languages: string[]
          experience_years: number
          bio: string | null
          is_available: boolean
          offers_pro_bono: boolean
          hourly_rate: number | null
          rating: number
          review_count: number
          verified: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['lawyers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['lawyers']['Row']>
      }
    }
  }
}
