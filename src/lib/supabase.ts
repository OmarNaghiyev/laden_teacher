import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase-клиент. Используется ТОЛЬКО на сервере — ключи никогда не попадают
 * в клиентский бандл (нет префикса NEXT_PUBLIC_).
 *
 * Если задан SUPABASE_SERVICE_ROLE_KEY, он используется в приоритете:
 * он обходит RLS, что нужно для админки, и позволяет держать anon-ключ
 * максимально ограниченным.
 */

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase не настроен: задайте SUPABASE_URL и SUPABASE_ANON_KEY (или SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY),
  );
}

// ---------- Типы строк БД ----------

export type ApplicationStatus = "pupil" | "student" | "adult";
export type KnowledgeLevel = "beginner" | "intermediate" | "advanced";
export type LearningGoal = "school" | "exam" | "self" | "other";
export type LessonFormat = "individual" | "group";
export type ProcessingStatus = "pending" | "processed";
export type AvailabilityMode = "online" | "offline" | "both";

export type ApplicationRow = {
  id: string;
  created_at: string;
  name: string;
  contact: string;
  status: ApplicationStatus;
  grade: number | null;
  studied_before: boolean;
  studied_details: string | null;
  level: KnowledgeLevel;
  goal: LearningGoal;
  goal_other: string | null;
  format: LessonFormat;
  preferred_time: string | null;
  comment: string | null;
  processing_status: ProcessingStatus;
  lang: string;
};

export type AvailabilityRow = {
  id: string;
  weekday: number; // 1 = Пн ... 7 = Вс
  start_time: string; // "16:00:00"
  end_time: string;
  mode: AvailabilityMode;
  note: string | null;
  created_at: string;
};
