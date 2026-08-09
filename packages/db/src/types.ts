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
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_usage: {
        Row: {
          cohort_id: string | null
          cost_paise: number
          created_at: string
          enrollment_id: string | null
          function_name: string
          id: string
          input_tokens: number
          model: string
          output_tokens: number
        }
        Insert: {
          cohort_id?: string | null
          cost_paise: number
          created_at?: string
          enrollment_id?: string | null
          function_name: string
          id?: string
          input_tokens: number
          model: string
          output_tokens: number
        }
        Update: {
          cohort_id?: string | null
          cost_paise?: number
          created_at?: string
          enrollment_id?: string | null
          function_name?: string
          id?: string
          input_tokens?: number
          model?: string
          output_tokens?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_usage_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_answer_keys: {
        Row: {
          assignment_id: string
          expected: Json
          order_matters: boolean
          reference_sql: string
          setup: string
        }
        Insert: {
          assignment_id: string
          expected: Json
          order_matters?: boolean
          reference_sql: string
          setup: string
        }
        Update: {
          assignment_id?: string
          expected?: Json
          order_matters?: boolean
          reference_sql?: string
          setup?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_answer_keys_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: true
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          id: string
          kind: string
          module_id: string
          rubric_id: string | null
          spec: Json
          weight: number
        }
        Insert: {
          id?: string
          kind: string
          module_id: string
          rubric_id?: string | null
          spec: Json
          weight?: number
        }
        Update: {
          id?: string
          kind?: string
          module_id?: string
          rubric_id?: string | null
          spec?: Json
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_rubric_id_fkey"
            columns: ["rubric_id"]
            isOneToOne: false
            referencedRelation: "rubrics"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          diff: Json | null
          entity: string
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_guards: {
        Row: {
          ceiling_paise: number
          id: string
          period_start: string
          scope: string
          scope_id: string | null
          spent_paise: number
        }
        Insert: {
          ceiling_paise: number
          id?: string
          period_start?: string
          scope: string
          scope_id?: string | null
          spent_paise?: number
        }
        Update: {
          ceiling_paise?: number
          id?: string
          period_start?: string
          scope?: string
          scope_id?: string | null
          spent_paise?: number
        }
        Relationships: []
      }
      cohorts: {
        Row: {
          capacity: number
          college_id: string | null
          created_at: string
          ends_on: string
          id: string
          mode: string
          path_id: string
          starts_on: string
          status: string
        }
        Insert: {
          capacity: number
          college_id?: string | null
          created_at?: string
          ends_on: string
          id?: string
          mode: string
          path_id: string
          starts_on: string
          status?: string
        }
        Update: {
          capacity?: number
          college_id?: string | null
          created_at?: string
          ends_on?: string
          id?: string
          mode?: string
          path_id?: string
          starts_on?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohorts_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohorts_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "public_colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohorts_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          city: string
          created_at: string
          id: string
          name: string
          state: string
          tier: string | null
          tpo_name: string | null
          tpo_phone: string | null
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          name: string
          state: string
          tier?: string | null
          tpo_name?: string | null
          tpo_phone?: string | null
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          name?: string
          state?: string
          tier?: string | null
          tpo_name?: string | null
          tpo_phone?: string | null
        }
        Relationships: []
      }
      consents: {
        Row: {
          granted_at: string
          id: string
          notice_version: string
          purpose: string
          user_id: string
          withdrawn_at: string | null
        }
        Insert: {
          granted_at?: string
          id?: string
          notice_version: string
          purpose: string
          user_id: string
          withdrawn_at?: string | null
        }
        Update: {
          granted_at?: string
          id?: string
          notice_version?: string
          purpose?: string
          user_id?: string
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          cohort_id: string
          completed_at: string | null
          id: string
          joined_at: string
          status: string
          user_id: string
        }
        Insert: {
          cohort_id: string
          completed_at?: string | null
          id?: string
          joined_at?: string
          status?: string
          user_id: string
        }
        Update: {
          cohort_id?: string
          completed_at?: string | null
          id?: string
          joined_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gradings: {
        Row: {
          cost_paise: number
          created_at: string
          feedback: string | null
          grader_type: string
          id: string
          model: string | null
          scores: Json
          submission_id: string
          total: number
        }
        Insert: {
          cost_paise?: number
          created_at?: string
          feedback?: string | null
          grader_type: string
          id?: string
          model?: string | null
          scores: Json
          submission_id: string
          total: number
        }
        Update: {
          cost_paise?: number
          created_at?: string
          feedback?: string | null
          grader_type?: string
          id?: string
          model?: string | null
          scores?: Json
          submission_id?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "gradings_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "peer_review_queue"
            referencedColumns: ["submission_id"]
          },
          {
            foreignKeyName: "gradings_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      link_health_checks: {
        Row: {
          checked_at: string
          id: string
          ok: boolean
          resource_id: string
          status_code: number | null
        }
        Insert: {
          checked_at?: string
          id?: string
          ok: boolean
          resource_id: string
          status_code?: number | null
        }
        Update: {
          checked_at?: string
          id?: string
          ok?: boolean
          resource_id?: string
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "link_health_checks_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          id: string
          objective: string
          path_id: string
          title: string
          week_no: number
        }
        Insert: {
          id?: string
          objective: string
          path_id: string
          title: string
          week_no: number
        }
        Update: {
          id?: string
          objective?: string
          path_id?: string
          title?: string
          week_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "modules_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          channel: string
          cost_paise: number
          created_at: string
          id: string
          payload: Json
          sent_at: string | null
          status: string
          template: string
          user_id: string
        }
        Insert: {
          channel: string
          cost_paise?: number
          created_at?: string
          id?: string
          payload?: Json
          sent_at?: string | null
          status?: string
          template: string
          user_id: string
        }
        Update: {
          channel?: string
          cost_paise?: number
          created_at?: string
          id?: string
          payload?: Json
          sent_at?: string | null
          status?: string
          template?: string
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
      orders: {
        Row: {
          amount_paise: number
          cohort_id: string
          created_at: string
          id: string
          provider: string
          provider_order_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount_paise: number
          cohort_id: string
          created_at?: string
          id?: string
          provider?: string
          provider_order_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount_paise?: number
          cohort_id?: string
          created_at?: string
          id?: string
          provider?: string
          provider_order_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      outcomes: {
        Row: {
          company: string | null
          enrollment_id: string
          event: string
          id: string
          publish_consent_at: string | null
          reported_at: string
          role: string | null
          source: string
        }
        Insert: {
          company?: string | null
          enrollment_id: string
          event: string
          id?: string
          publish_consent_at?: string | null
          reported_at?: string
          role?: string | null
          source: string
        }
        Update: {
          company?: string | null
          enrollment_id?: string
          event?: string
          id?: string
          publish_consent_at?: string | null
          reported_at?: string
          role?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "outcomes_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      paths: {
        Row: {
          created_at: string
          id: string
          published_at: string | null
          status: string
          track_id: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          published_at?: string | null
          status?: string
          track_id: string
          version: number
        }
        Update: {
          created_at?: string
          id?: string
          published_at?: string | null
          status?: string
          track_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "paths_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      peer_reviews: {
        Row: {
          due_at: string
          feedback: string | null
          id: string
          reviewer_enrollment_id: string
          scores: Json | null
          status: string
          submission_id: string
        }
        Insert: {
          due_at: string
          feedback?: string | null
          id?: string
          reviewer_enrollment_id: string
          scores?: Json | null
          status?: string
          submission_id: string
        }
        Update: {
          due_at?: string
          feedback?: string | null
          id?: string
          reviewer_enrollment_id?: string
          scores?: Json | null
          status?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "peer_reviews_reviewer_enrollment_id_fkey"
            columns: ["reviewer_enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peer_reviews_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "peer_review_queue"
            referencedColumns: ["submission_id"]
          },
          {
            foreignKeyName: "peer_reviews_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          batch_year: number | null
          college_id: string | null
          created_at: string
          full_name: string | null
          id: string
          is_adult_confirmed: boolean
          phone: string
        }
        Insert: {
          batch_year?: number | null
          college_id?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_adult_confirmed?: boolean
          phone: string
        }
        Update: {
          batch_year?: number | null
          college_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_adult_confirmed?: boolean
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "public_colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      public_profiles: {
        Row: {
          enrollment_id: string
          headline: string | null
          published_at: string | null
          slug: string
          visibility: string
        }
        Insert: {
          enrollment_id: string
          headline?: string | null
          published_at?: string | null
          slug: string
          visibility?: string
        }
        Update: {
          enrollment_id?: string
          headline?: string | null
          published_at?: string | null
          slug?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_profiles_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      readiness_scores: {
        Row: {
          breakdown: Json
          computed_at: string
          enrollment_id: string
          id: string
          overall: number
        }
        Insert: {
          breakdown: Json
          computed_at?: string
          enrollment_id: string
          id?: string
          overall: number
        }
        Update: {
          breakdown?: Json
          computed_at?: string
          enrollment_id?: string
          id?: string
          overall?: number
        }
        Relationships: [
          {
            foreignKeyName: "readiness_scores_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          duration_sec: number | null
          external_url: string
          health: string
          id: string
          kind: string
          last_checked_at: string | null
          module_id: string
          position: number
          provider: string
          title: string
          youtube_video_id: string | null
        }
        Insert: {
          duration_sec?: number | null
          external_url: string
          health?: string
          id?: string
          kind: string
          last_checked_at?: string | null
          module_id: string
          position: number
          provider: string
          title: string
          youtube_video_id?: string | null
        }
        Update: {
          duration_sec?: number | null
          external_url?: string
          health?: string
          id?: string
          kind?: string
          last_checked_at?: string | null
          module_id?: string
          position?: number
          provider?: string
          title?: string
          youtube_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      rubrics: {
        Row: {
          criteria: Json
          id: string
          max_score: number
          name: string
        }
        Insert: {
          criteria: Json
          id?: string
          max_score: number
          name: string
        }
        Update: {
          criteria?: Json
          id?: string
          max_score?: number
          name?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          assignment_id: string
          enrollment_id: string
          id: string
          payload: Json
          status: string
          submitted_at: string
          week_no: number
        }
        Insert: {
          assignment_id: string
          enrollment_id: string
          id?: string
          payload: Json
          status?: string
          submitted_at?: string
          week_no: number
        }
        Update: {
          assignment_id?: string
          enrollment_id?: string
          id?: string
          payload?: Json
          status?: string
          submitted_at?: string
          week_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          slug: string
          summary: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          slug: string
          summary: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          slug?: string
          summary?: string
          title?: string
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          college_name: string | null
          consent_contact: boolean
          consent_whatsapp: boolean
          created_at: string
          full_name: string | null
          id: string
          is_adult_confirmed: boolean
          notice_version: string
          phone: string
          source: string | null
        }
        Insert: {
          college_name?: string | null
          consent_contact?: boolean
          consent_whatsapp?: boolean
          created_at?: string
          full_name?: string | null
          id?: string
          is_adult_confirmed?: boolean
          notice_version: string
          phone: string
          source?: string | null
        }
        Update: {
          college_name?: string | null
          consent_contact?: boolean
          consent_whatsapp?: boolean
          created_at?: string
          full_name?: string | null
          id?: string
          is_adult_confirmed?: boolean
          notice_version?: string
          phone?: string
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      peer_review_queue: {
        Row: {
          assignment_id: string | null
          due_at: string | null
          payload: Json | null
          peer_review_id: string | null
          status: string | null
          submission_id: string | null
          week_no: number | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      public_colleges: {
        Row: {
          city: string | null
          id: string | null
          name: string | null
          state: string | null
          tier: string | null
        }
        Insert: {
          city?: string | null
          id?: string | null
          name?: string | null
          state?: string | null
          tier?: string | null
        }
        Update: {
          city?: string | null
          id?: string | null
          name?: string | null
          state?: string | null
          tier?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      allocate_peer_reviews: {
        Args: {
          p_assignment_id: string
          p_reviewers?: number
          p_window?: string
        }
        Returns: number
      }
      compute_cohort_readiness: {
        Args: { p_cohort_id: string }
        Returns: number
      }
      compute_readiness: { Args: { p_enrollment_id: string }; Returns: number }
      roll_cohorts: {
        Args: never
        Returns: {
          cohort_id: string
          from_status: string
          to_status: string
        }[]
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
