export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      boost_products: {
        Row: {
          code: string
          created_at: string
          description: string | null
          duration_hours: number
          expected_lift: Json | null
          id: string
          is_active: boolean | null
          placement: Database["public"]["Enums"]["boost_placement"]
          price_credits: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          duration_hours: number
          expected_lift?: Json | null
          id?: string
          is_active?: boolean | null
          placement: Database["public"]["Enums"]["boost_placement"]
          price_credits: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          duration_hours?: number
          expected_lift?: Json | null
          id?: string
          is_active?: boolean | null
          placement?: Database["public"]["Enums"]["boost_placement"]
          price_credits?: number
          updated_at?: string
        }
        Relationships: []
      }
      boost_purchases: {
        Row: {
          boost_product_id: string
          buyer_id: string
          created_at: string
          end_at: string
          form_id: string
          id: string
          start_at: string
          status: Database["public"]["Enums"]["promotion_status"]
        }
        Insert: {
          boost_product_id: string
          buyer_id: string
          created_at?: string
          end_at: string
          form_id: string
          id?: string
          start_at: string
          status?: Database["public"]["Enums"]["promotion_status"]
        }
        Update: {
          boost_product_id?: string
          buyer_id?: string
          created_at?: string
          end_at?: string
          form_id?: string
          id?: string
          start_at?: string
          status?: Database["public"]["Enums"]["promotion_status"]
        }
        Relationships: [
          {
            foreignKeyName: "boost_purchases_boost_product_id_fkey"
            columns: ["boost_product_id"]
            isOneToOne: false
            referencedRelation: "boost_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boost_purchases_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boost_purchases_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      credits_ledger: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          related_form_id: string | null
          related_response_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason: string
          related_form_id?: string | null
          related_response_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          related_form_id?: string | null
          related_response_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_ledger_related_form_id_fkey"
            columns: ["related_form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_ledger_related_response_id_fkey"
            columns: ["related_response_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_events: {
        Row: {
          created_at: string
          event_type: Database["public"]["Enums"]["form_event_type"]
          form_id: string
          id: number
          metadata: Json | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: Database["public"]["Enums"]["form_event_type"]
          form_id: string
          id?: number
          metadata?: Json | null
          session_id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: Database["public"]["Enums"]["form_event_type"]
          form_id?: string
          id?: number
          metadata?: Json | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_events_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_questions: {
        Row: {
          created_at: string
          description: string | null
          form_id: string
          id: string
          logic: Json | null
          options: Json | null
          order_index: number
          required: boolean | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          form_id: string
          id?: string
          logic?: Json | null
          options?: Json | null
          order_index: number
          required?: boolean | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          form_id?: string
          id?: string
          logic?: Json | null
          options?: Json | null
          order_index?: number
          required?: boolean | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_questions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_saves: {
        Row: {
          created_at: string
          form_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          form_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_saves_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_saves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_shares: {
        Row: {
          channel: string | null
          created_at: string
          form_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          channel?: string | null
          created_at?: string
          form_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          channel?: string | null
          created_at?: string
          form_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_shares_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          ai_prompt: string | null
          analytics_snapshot: Json | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          owner_id: string
          primary_language: string
          published_at: string | null
          settings: Json | null
          status: Database["public"]["Enums"]["form_status"]
          target_responses: number | null
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["form_visibility"]
        }
        Insert: {
          ai_prompt?: string | null
          analytics_snapshot?: Json | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          owner_id: string
          primary_language?: string
          published_at?: string | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["form_status"]
          target_responses?: number | null
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["form_visibility"]
        }
        Update: {
          ai_prompt?: string | null
          analytics_snapshot?: Json | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string
          primary_language?: string
          published_at?: string | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["form_status"]
          target_responses?: number | null
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["form_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "forms_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_flags: {
        Row: {
          created_at: string
          form_id: string | null
          id: string
          metadata: Json | null
          reason: string
          response_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          form_id?: string | null
          id?: string
          metadata?: Json | null
          reason: string
          response_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          form_id?: string | null
          id?: string
          metadata?: Json | null
          reason?: string
          response_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_flags_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_flags_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_flags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_orders: {
        Row: {
          buyer_id: string
          cost_credits: number
          created_at: string
          filters: Json | null
          form_id: string
          id: string
          status: string
          target_count: number
        }
        Insert: {
          buyer_id: string
          cost_credits: number
          created_at?: string
          filters?: Json | null
          form_id: string
          id?: string
          status?: string
          target_count: number
        }
        Update: {
          buyer_id?: string
          cost_credits?: number
          created_at?: string
          filters?: Json | null
          form_id?: string
          id?: string
          status?: string
          target_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_orders_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          country_code: string | null
          created_at: string
          credits_balance: number | null
          full_name: string | null
          id: string
          interests: string[] | null
          language: string | null
          respondent_score: number | null
          timezone: string | null
          username: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          credits_balance?: number | null
          full_name?: string | null
          id: string
          interests?: string[] | null
          language?: string | null
          respondent_score?: number | null
          timezone?: string | null
          username?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string
          credits_balance?: number | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          language?: string | null
          respondent_score?: number | null
          timezone?: string | null
          username?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          budget_credits: number
          created_at: string
          end_at: string
          form_id: string
          id: string
          owner_id: string
          start_at: string
          status: Database["public"]["Enums"]["promotion_status"]
        }
        Insert: {
          budget_credits: number
          created_at?: string
          end_at: string
          form_id: string
          id?: string
          owner_id: string
          start_at: string
          status?: Database["public"]["Enums"]["promotion_status"]
        }
        Update: {
          budget_credits?: number
          created_at?: string
          end_at?: string
          form_id?: string
          id?: string
          owner_id?: string
          start_at?: string
          status?: Database["public"]["Enums"]["promotion_status"]
        }
        Relationships: [
          {
            foreignKeyName: "promotions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      respondent_reputation: {
        Row: {
          completes_count: number
          fraud_flags_count: number
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completes_count?: number
          fraud_flags_count?: number
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completes_count?: number
          fraud_flags_count?: number
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "respondent_reputation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      response_answers: {
        Row: {
          answer: Json
          created_at: string
          id: string
          question_id: string
          response_id: string
        }
        Insert: {
          answer: Json
          created_at?: string
          id?: string
          question_id: string
          response_id: string
        }
        Update: {
          answer?: Json
          created_at?: string
          id?: string
          question_id?: string
          response_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "response_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "form_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "response_answers_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          duration_sec: number | null
          form_id: string
          id: string
          is_anonymous: boolean | null
          quality_score: number | null
          respondent_id: string | null
          started_at: string
          submitted_at: string | null
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          duration_sec?: number | null
          form_id: string
          id?: string
          is_anonymous?: boolean | null
          quality_score?: number | null
          respondent_id?: string | null
          started_at?: string
          submitted_at?: string | null
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          duration_sec?: number | null
          form_id?: string
          id?: string
          is_anonymous?: boolean | null
          quality_score?: number | null
          respondent_id?: string | null
          started_at?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      boost_placement: "needs_responses" | "for_you" | "pin"
      form_event_type: "impression" | "view" | "start" | "submit"
      form_status: "draft" | "published" | "archived"
      form_visibility: "public" | "unlisted" | "private"
      promotion_status:
        | "draft"
        | "scheduled"
        | "running"
        | "completed"
        | "cancelled"
        | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

// Helper types for common use
export type Form = Tables<'forms'>
export type FormInsert = TablesInsert<'forms'>
export type FormUpdate = TablesUpdate<'forms'>

export type FormQuestion = Tables<'form_questions'>
export type FormQuestionInsert = TablesInsert<'form_questions'>

export type Response = Tables<'responses'>
export type ResponseAnswer = Tables<'response_answers'>

export type Profile = Tables<'profiles'>
export type CreditsLedger = Tables<'credits_ledger'>

export type FormStatus = Enums<'form_status'>
export type FormVisibility = Enums<'form_visibility'>
export type FormEventType = Enums<'form_event_type'>


