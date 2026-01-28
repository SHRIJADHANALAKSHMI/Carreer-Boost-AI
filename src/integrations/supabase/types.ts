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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      career_analyses: {
        Row: {
          ai_insights: Json
          career_domain: Database["public"]["Enums"]["career_domain"]
          created_at: string
          extracted_skills: Json
          github_url: string | null
          id: string
          linkedin_url: string | null
          matched_skills: Json
          missing_skills: Json
          readiness_score: number
          readiness_status: Database["public"]["Enums"]["readiness_status"]
          resume_text: string | null
          roadmap: Json
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_insights?: Json
          career_domain: Database["public"]["Enums"]["career_domain"]
          created_at?: string
          extracted_skills?: Json
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          matched_skills?: Json
          missing_skills?: Json
          readiness_score: number
          readiness_status: Database["public"]["Enums"]["readiness_status"]
          resume_text?: string | null
          roadmap?: Json
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_insights?: Json
          career_domain?: Database["public"]["Enums"]["career_domain"]
          created_at?: string
          extracted_skills?: Json
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          matched_skills?: Json
          missing_skills?: Json
          readiness_score?: number
          readiness_status?: Database["public"]["Enums"]["readiness_status"]
          resume_text?: string | null
          roadmap?: Json
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_session_id: { Args: never; Returns: string }
    }
    Enums: {
      career_domain:
        | "frontend_developer"
        | "backend_developer"
        | "fullstack_developer"
        | "data_scientist"
        | "data_analyst"
        | "ml_engineer"
        | "ai_engineer"
        | "cybersecurity_analyst"
        | "cloud_devops_engineer"
        | "mobile_developer"
        | "ui_ux_designer"
        | "product_manager"
        | "business_analyst"
        | "digital_marketing"
        | "finance_analyst"
        | "mechanical_engineer"
        | "electrical_engineer"
        | "civil_engineer"
        | "mba_management"
        | "hr_professional"
        | "operations_manager"
        | "consultant"
        | "healthcare_professional"
        | "educator"
        | "legal_professional"
      readiness_status: "not_ready" | "partially_ready" | "job_ready"
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
    Enums: {
      career_domain: [
        "frontend_developer",
        "backend_developer",
        "fullstack_developer",
        "data_scientist",
        "data_analyst",
        "ml_engineer",
        "ai_engineer",
        "cybersecurity_analyst",
        "cloud_devops_engineer",
        "mobile_developer",
        "ui_ux_designer",
        "product_manager",
        "business_analyst",
        "digital_marketing",
        "finance_analyst",
        "mechanical_engineer",
        "electrical_engineer",
        "civil_engineer",
        "mba_management",
        "hr_professional",
        "operations_manager",
        "consultant",
        "healthcare_professional",
        "educator",
        "legal_professional",
      ],
      readiness_status: ["not_ready", "partially_ready", "job_ready"],
    },
  },
} as const
