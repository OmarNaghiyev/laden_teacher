import type {
  ApplicationStatus,
  AvailabilityMode,
  KnowledgeLevel,
  LearningGoal,
  LessonFormat,
} from "@/lib/supabase";
import { isLang, type Lang } from "@/lib/i18n";

export const STATUSES: ApplicationStatus[] = ["pupil", "student", "adult", "other"];
export const LEVELS: KnowledgeLevel[] = ["beginner", "intermediate", "advanced"];
export const GOALS: LearningGoal[] = ["school", "exam", "self", "other"];
export const FORMATS: LessonFormat[] = [
  "individual_offline",
  "individual_online",
  "group_offline",
  "group_online",
];
export const MODES: AvailabilityMode[] = ["online", "offline", "both"];
export const GRADES = Array.from({ length: 11 }, (_, i) => i + 1);

const MAX_SHORT = 200;
const MAX_LONG = 1000;

export type ApplicationInput = {
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
  lang: Lang;
};

/** Ключи совпадают с dict.form.errors. */
export type FieldError =
  | "name"
  | "contact"
  | "status"
  | "grade"
  | "level"
  | "goal"
  | "goalOther"
  | "format"
  | "studiedDetails"
  | "tooLong";

export type ValidationResult =
  | { ok: true; data: ApplicationInput }
  | { ok: false; errors: Partial<Record<string, FieldError>> };

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nullableStr(value: unknown, max: number): string | null {
  const text = str(value);
  if (!text) return null;
  return text.slice(0, max);
}

/** Серверная валидация — источник истины. Клиентская в форме дублирует её только ради быстрой обратной связи. */
export function validateApplication(body: unknown): ValidationResult {
  const errors: Partial<Record<string, FieldError>> = {};
  const input = (body ?? {}) as Record<string, unknown>;

  const name = str(input.name);
  if (!name) errors.name = "name";
  else if (name.length > MAX_SHORT) errors.name = "tooLong";

  const contact = str(input.contact);
  if (!contact) errors.contact = "contact";
  else if (contact.length > MAX_SHORT) errors.contact = "tooLong";

  const statusRaw = str(input.status) as ApplicationStatus;
  if (!STATUSES.includes(statusRaw)) errors.status = "status";

  let grade: number | null = null;
  if (statusRaw === "pupil") {
    const parsed = Number(input.grade);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 11) {
      errors.grade = "grade";
    } else {
      grade = parsed;
    }
  }

  const studiedBefore = input.studied_before === true || input.studied_before === "true";
  let studiedDetails: string | null = null;
  if (studiedBefore) {
    const details = str(input.studied_details);
    if (!details) errors.studied_details = "studiedDetails";
    else studiedDetails = details.slice(0, MAX_LONG);
  }

  const levelRaw = str(input.level) as KnowledgeLevel;
  if (!LEVELS.includes(levelRaw)) errors.level = "level";

  const goalRaw = str(input.goal) as LearningGoal;
  if (!GOALS.includes(goalRaw)) errors.goal = "goal";

  let goalOther: string | null = null;
  if (goalRaw === "other") {
    const other = str(input.goal_other);
    if (!other) errors.goal_other = "goalOther";
    else goalOther = other.slice(0, MAX_LONG);
  }

  const formatRaw = str(input.format) as LessonFormat;
  if (!FORMATS.includes(formatRaw)) errors.format = "format";

  const langRaw = str(input.lang);
  const lang: Lang = isLang(langRaw) ? langRaw : "ru";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name: name.slice(0, MAX_SHORT),
      contact: contact.slice(0, MAX_SHORT),
      status: statusRaw,
      grade,
      studied_before: studiedBefore,
      studied_details: studiedDetails,
      level: levelRaw,
      goal: goalRaw,
      goal_other: goalOther,
      format: formatRaw,
      preferred_time: nullableStr(input.preferred_time, MAX_LONG),
      comment: nullableStr(input.comment, MAX_LONG),
      lang,
    },
  };
}

export type AvailabilityInput = {
  weekday: number;
  start_time: string;
  end_time: string;
  mode: AvailabilityMode;
  note: string | null;
};

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function validateAvailability(
  body: unknown,
): { ok: true; data: AvailabilityInput } | { ok: false; error: string } {
  const input = (body ?? {}) as Record<string, unknown>;

  const weekday = Number(input.weekday);
  if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7) {
    return { ok: false, error: "weekday" };
  }

  const start = str(input.start_time);
  const end = str(input.end_time);
  if (!TIME_RE.test(start) || !TIME_RE.test(end)) {
    return { ok: false, error: "time" };
  }
  if (end <= start) return { ok: false, error: "range" };

  const mode = str(input.mode) as AvailabilityMode;
  if (!MODES.includes(mode)) return { ok: false, error: "mode" };

  return {
    ok: true,
    data: {
      weekday,
      start_time: start,
      end_time: end,
      mode,
      note: nullableStr(input.note, MAX_SHORT),
    },
  };
}

/** "16:00:00" -> "16:00" */
export function formatTime(value: string): string {
  return value.slice(0, 5);
}
