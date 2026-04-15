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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          flutterwave_reference: string | null
          flutterwave_transaction_id: string | null
          id: string
          payment_gateway: string | null
          paystack_reference: string | null
          paystack_transaction_id: string | null
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          flutterwave_reference?: string | null
          flutterwave_transaction_id?: string | null
          id?: string
          payment_gateway?: string | null
          paystack_reference?: string | null
          paystack_transaction_id?: string | null
          status: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          flutterwave_reference?: string | null
          flutterwave_transaction_id?: string | null
          id?: string
          payment_gateway?: string | null
          paystack_reference?: string | null
          paystack_transaction_id?: string | null
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          annual_price: number
          audit_limit_monthly: number | null
          created_at: string | null
          features: Json
          id: string
          is_active: boolean | null
          matter_limit: number | null
          monthly_price: number
          name: string
          slug: string
          storage_limit_gb: number | null
          team_member_limit: number | null
          trial_prep_limit_monthly: number | null
        }
        Insert: {
          annual_price: number
          audit_limit_monthly?: number | null
          created_at?: string | null
          features: Json
          id?: string
          is_active?: boolean | null
          matter_limit?: number | null
          monthly_price: number
          name: string
          slug: string
          storage_limit_gb?: number | null
          team_member_limit?: number | null
          trial_prep_limit_monthly?: number | null
        }
        Update: {
          annual_price?: number
          audit_limit_monthly?: number | null
          created_at?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          matter_limit?: number | null
          monthly_price?: number
          name?: string
          slug?: string
          storage_limit_gb?: number | null
          team_member_limit?: number | null
          trial_prep_limit_monthly?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bar_number: string | null
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          practice_name: string | null
          preferred_courts: string[] | null
          primary_practice_area: string | null
          regulatory_interests: string[] | null
          role: string | null
          updated_at: string
          years_of_practice: string | null
        }
        Insert: {
          avatar_url?: string | null
          bar_number?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          practice_name?: string | null
          preferred_courts?: string[] | null
          primary_practice_area?: string | null
          regulatory_interests?: string[] | null
          role?: string | null
          updated_at?: string
          years_of_practice?: string | null
        }
        Update: {
          avatar_url?: string | null
          bar_number?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          practice_name?: string | null
          preferred_courts?: string[] | null
          primary_practice_area?: string | null
          regulatory_interests?: string[] | null
          role?: string | null
          updated_at?: string
          years_of_practice?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          cancelled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          flutterwave_customer_id: string | null
          flutterwave_subscription_id: string | null
          flutterwave_tx_ref: string | null
          id: string
          payment_gateway: string | null
          paystack_customer_code: string | null
          paystack_email_token: string | null
          paystack_subscription_code: string | null
          plan_id: string
          status: string
          trial_end: string | null
          user_id: string
        }
        Insert: {
          billing_cycle?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          flutterwave_customer_id?: string | null
          flutterwave_subscription_id?: string | null
          flutterwave_tx_ref?: string | null
          id?: string
          payment_gateway?: string | null
          paystack_customer_code?: string | null
          paystack_email_token?: string | null
          paystack_subscription_code?: string | null
          plan_id: string
          status?: string
          trial_end?: string | null
          user_id: string
        }
        Update: {
          billing_cycle?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          flutterwave_customer_id?: string | null
          flutterwave_subscription_id?: string | null
          flutterwave_tx_ref?: string | null
          id?: string
          payment_gateway?: string | null
          paystack_customer_code?: string | null
          paystack_email_token?: string | null
          paystack_subscription_code?: string | null
          plan_id?: string
          status?: string
          trial_end?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string | null
          firm_id: string
          id: string
          invited_email: string | null
          joined_at: string | null
          member_id: string
          role: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          firm_id: string
          id?: string
          invited_email?: string | null
          joined_at?: string | null
          member_id: string
          role?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          firm_id?: string
          id?: string
          invited_email?: string | null
          joined_at?: string | null
          member_id?: string
          role?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_tracking: {
        Row: {
          contract_audits_used: number | null
          id: string
          month_year: string
          storage_used_mb: number | null
          trial_prep_used: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contract_audits_used?: number | null
          id?: string
          month_year: string
          storage_used_mb?: number | null
          trial_prep_used?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contract_audits_used?: number | null
          id?: string
          month_year?: string
          storage_used_mb?: number | null
          trial_prep_used?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          firm_name: string | null
          id: string
          interest: string | null
          name: string | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          firm_name?: string | null
          id?: string
          interest?: string | null
          name?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          firm_name?: string | null
          id?: string
          interest?: string | null
          name?: string | null
          source?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
