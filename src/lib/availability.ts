import {
  getSupabase,
  isSupabaseConfigured,
  type AvailabilityRow,
} from "@/lib/supabase";

/**
 * Все интервалы свободного времени, отсортированные по дню недели и началу.
 * Если БД не настроена или запрос упал, возвращаем пустой список — публичная
 * страница должна открываться в любом случае.
 */
export async function fetchAvailability(): Promise<AvailabilityRow[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await getSupabase()
      .from("availability")
      .select("*")
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("[availability] Ошибка чтения:", error.message);
      return [];
    }

    return (data ?? []) as AvailabilityRow[];
  } catch (error) {
    console.error("[availability] Ошибка чтения:", error);
    return [];
  }
}

/** Группировка по дням недели: индекс 0 = понедельник ... 6 = воскресенье. */
export function groupByWeekday(rows: AvailabilityRow[]): AvailabilityRow[][] {
  const days: AvailabilityRow[][] = [[], [], [], [], [], [], []];
  for (const row of rows) {
    const index = row.weekday - 1;
    if (index >= 0 && index < 7) days[index].push(row);
  }
  return days;
}
