import { groupByWeekday } from "@/lib/availability";
import type { Dict } from "@/lib/i18n";
import type { AvailabilityRow } from "@/lib/supabase";
import { formatTime } from "@/lib/validation";

/** Только для просмотра: не бронирование, интервалы не кликабельны. */
export function AvailabilityCalendar({
  dict,
  rows,
}: {
  dict: Dict;
  rows: AvailabilityRow[];
}) {
  const days = groupByWeekday(rows);
  const hasAny = rows.length > 0;

  return (
    <section id="schedule" className="scroll-mt-24 border-b border-line bg-paper-dark/40">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {dict.schedule.title}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          {dict.schedule.lead}
        </p>

        {!hasAny ? (
          <p className="mt-6 rounded-xl border border-dashed border-line bg-paper p-6 text-center text-sm text-ink-faint">
            {dict.schedule.empty}
          </p>
        ) : (
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-7 lg:gap-2">
            {days.map((intervals, index) => {
              const isEmpty = intervals.length === 0;
              return (
                <div
                  key={index}
                  className={`rounded-xl border p-3 ${
                    isEmpty
                      ? "border-line bg-paper/50"
                      : "border-accent/20 bg-paper"
                  }`}
                >
                  <p className="text-sm font-semibold text-ink lg:text-center">
                    <span className="lg:hidden">{dict.schedule.weekdaysLong[index]}</span>
                    <span className="hidden lg:inline">
                      {dict.schedule.weekdaysShort[index]}
                    </span>
                  </p>

                  {isEmpty ? (
                    <p className="mt-2 text-sm text-ink-faint lg:text-center">
                      {dict.schedule.noTime}
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-1.5">
                      {intervals.map((interval) => (
                        <li
                          key={interval.id}
                          className="rounded-lg bg-accent-soft px-2 py-1.5 text-center"
                        >
                          <span className="block text-sm font-medium tabular-nums text-accent">
                            {formatTime(interval.start_time)}–{formatTime(interval.end_time)}
                          </span>
                          <span className="block text-[11px] text-ink-faint">
                            {dict.schedule.modes[interval.mode]}
                          </span>
                          {interval.note && (
                            <span className="mt-0.5 block text-[11px] text-ink-faint">
                              {interval.note}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
