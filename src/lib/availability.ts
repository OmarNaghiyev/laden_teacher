import {
  getSupabase,
  isSupabaseConfigured,
  type AvailabilityRow,
} from "@/lib/supabase";

/** При ошибке возвращает пустой список: публичная страница должна открыться всё равно. */
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

/** Индекс 0 = понедельник ... 6 = воскресенье. */
export function groupByWeekday(rows: AvailabilityRow[]): AvailabilityRow[][] {
  const days: AvailabilityRow[][] = [[], [], [], [], [], [], []];
  for (const row of rows) {
    const index = row.weekday - 1;
    if (index >= 0 && index < 7) days[index].push(row);
  }
  return days;
}
