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
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          county?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_lawyer?: boolean
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
          status: string
          is_anonymous: boolean
          assigned_to: string | null
          created_at: string
          updated_at: string
          latitude: number | null
          longitude: number | null
          location_accuracy: number | null
        }
        Insert: {
          id?: string
          case_number?: string
          user_id: string
          category: string
          incident_type?: string | null
          incident_date?: string | null
          incident_time?: string | null
          location?: string | null
          description: string
          involved_description?: string | null
          victim_self?: boolean
          has_witnesses?: boolean
          police_reported?: string | null
          legal_representation?: string | null
          preferred_language?: string | null
          additional_context?: string | null
          status?: string
          is_anonymous?: boolean
          assigned_to?: string | null
          latitude?: number | null
          longitude?: number | null
          location_accuracy?: number | null
        }
        Update: {
          id?: string
          case_number?: string
          user_id?: string
          category?: string
          incident_type?: string | null
          incident_date?: string | null
          incident_time?: string | null
          location?: string | null
          description?: string
          involved_description?: string | null
          victim_self?: boolean
          has_witnesses?: boolean
          police_reported?: string | null
          legal_representation?: string | null
          preferred_language?: string
          additional_context?: string | null
          status?: string
          is_anonymous?: boolean
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          latitude?: number | null
          longitude?: number | null
          location_accuracy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Insert: {
          id?: string
          case_id: string
          user_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          file_hash?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          case_id?: string
          user_id?: string
          file_name?: string
          file_url?: string
          file_type?: string
          file_size?: number
          file_hash?: string | null
          description?: string | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          support_type: string
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          support_type?: 'platform' | 'legal' | 'ai'
          title?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          support_type?: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      conversation_messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          sender_type: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          sender_type?: 'user' | 'support' | 'ai'
          content: string
          is_read?: boolean
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          sender_type?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          relationship?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          relationship?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trusted_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Insert: {
          id?: string
          user_id: string
          bar_number: string
          specializations: string[]
          counties: string[]
          languages: string[]
          experience_years: number
          bio?: string | null
          is_available: boolean
          offers_pro_bono: boolean
          hourly_rate?: number | null
          rating: number
          review_count: number
          verified: boolean
        }
        Update: {
          id?: string
          user_id?: string
          bar_number?: string
          specializations?: string[]
          counties?: string[]
          languages?: string[]
          experience_years?: number
          bio?: string | null
          is_available?: boolean
          offers_pro_bono?: boolean
          hourly_rate?: number | null
          rating?: number
          review_count?: number
          verified?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lawyers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}