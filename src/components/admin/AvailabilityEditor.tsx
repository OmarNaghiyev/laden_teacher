"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Dict } from "@/lib/i18n";
import type { AvailabilityMode, AvailabilityRow } from "@/lib/supabase";
import { formatTime } from "@/lib/validation";

const MODES: AvailabilityMode[] = ["online", "offline", "both"];

export function AvailabilityEditor({
  dict,
  initialRows,
}: {
  dict: Dict;
  initialRows: AvailabilityRow[];
}) {
  const v = dict.admin.availability;
  const router = useRouter();

  const [rows, setRows] = useState(initialRows);
  const [weekday, setWeekday] = useState("1");
  const [start, setStart] = useState("16:00");
  const [end, setEnd] = useState("18:00");
  const [mode, setMode] = useState<AvailabilityMode>("both");
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (end <= start) {
      setError(v.errorRange);
      return;
    }

    setAdding(true);
    try {
      const response = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekday: Number(weekday),
          start_time: start,
          end_time: end,
          mode,
          note,
        }),
      });

      if (!response.ok) {
        setError(response.status === 422 ? v.errorRange : v.errorGeneric);
        return;
      }

      const body = (await response.json()) as { row?: AvailabilityRow };
      if (!body.row) {
        setError(v.errorGeneric);
        return;
      }

      setNote("");
      setRows((previous) => [...previous, body.row as AvailabilityRow]);
      router.refresh();
    } catch {
      setError(v.errorGeneric);
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(id: string) {
    setError(null);
    setRemovingId(id);
    try {
      const response = await fetch("/api/admin/availability", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        setError(v.errorGeneric);
        return;
      }

      setRows((previous) => previous.filter((row) => row.id !== id));
      router.refresh();
    } catch {
      setError(v.errorGeneric);
    } finally {
      setRemovingId(null);
    }
  }

  const sorted = [...rows].sort(
    (a, b) => a.weekday - b.weekday || a.start_time.localeCompare(b.start_time),
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-ink">{v.title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{v.lead}</p>

      <form
        onSubmit={handleAdd}
        className="mt-6 rounded-xl border border-line bg-paper p-4 sm:p-5"
      >
        <h2 className="text-sm font-semibold text-ink">{v.addTitle}</h2>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block">
            <span className="text-xs font-medium text-ink-faint">{v.weekday}</span>
            <select
              value={weekday}
              onChange={(event) => setWeekday(event.target.value)}
              className={fieldClass}
            >
              {dict.schedule.weekdaysLong.map((day, index) => (
                <option key={day} value={index + 1}>
                  {day}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-ink-faint">{v.from}</span>
            <input
              type="time"
              value={start}
              onChange={(event) => setStart(event.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-ink-faint">{v.to}</span>
            <input
              type="time"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-ink-faint">{v.mode}</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as AvailabilityMode)}
              className={fieldClass}
            >
              {MODES.map((option) => (
                <option key={option} value={option}>
                  {v.modes[option]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-ink-faint">{v.note}</span>
            <input
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={v.notePlaceholder}
              className={fieldClass}
            />
          </label>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={adding}
          className="mt-4 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          {adding ? v.adding : v.add}
        </button>
      </form>

      {sorted.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-faint">
          {v.empty}
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {sorted.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper px-4 py-3 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">
                  {dict.schedule.weekdaysLong[row.weekday - 1]}
                  <span className="ml-2 tabular-nums text-ink-soft">
                    {formatTime(row.start_time)}-{formatTime(row.end_time)}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-ink-faint">
                  {v.modes[row.mode]}
                  {row.note ? ` · ${row.note}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(row.id)}
                disabled={removingId === row.id}
                className="shrink-0 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-red-400 hover:text-red-700 disabled:opacity-50"
              >
                {removingId === row.id ? v.removing : v.remove}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const fieldClass =
  "mt-1 block w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
