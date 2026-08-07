"use client";

import { Fragment, useMemo, useState } from "react";

import { t, type Dict } from "@/lib/i18n";
import type { ApplicationRow, ProcessingStatus } from "@/lib/supabase";

type Filter = "all" | "pending" | "processed";

export function ApplicationsTable({
  dict,
  initialRows,
}: {
  dict: Dict;
  initialRows: ApplicationRow[];
}) {
  const a = dict.admin.applications;
  const f = dict.form.fields;

  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState<Filter>("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const pendingCount = rows.filter((row) => row.processing_status === "pending").length;

  const visible = useMemo(
    () =>
      filter === "all" ? rows : rows.filter((row) => row.processing_status === filter),
    [rows, filter],
  );

  async function toggleStatus(row: ApplicationRow) {
    const next: ProcessingStatus =
      row.processing_status === "pending" ? "processed" : "pending";

    setSavingId(row.id);
    setError(null);

    try {
      const response = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, processing_status: next }),
      });

      if (!response.ok) {
        setError(a.saveError);
        return;
      }

      setRows((previous) =>
        previous.map((item) =>
          item.id === row.id ? { ...item, processing_status: next } : item,
        ),
      );
    } catch {
      setError(a.saveError);
    } finally {
      setSavingId(null);
    }
  }

  function describeWho(row: ApplicationRow): string {
    if (row.status === "pupil") {
      return `${f.status.options.pupil}, ${row.grade} ${f.grade.suffix}`;
    }
    return f.status.options[row.status];
  }

  function describeGoal(row: ApplicationRow): string {
    return row.goal === "other"
      ? `${f.goal.options.other}: ${row.goal_other ?? ""}`
      : f.goal.options[row.goal];
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: a.filterAll },
    { key: "pending", label: a.filterPending },
    { key: "processed", label: a.filterProcessed },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-ink">{a.title}</h1>
        <p className="text-sm text-ink-faint">
          {t(a.total, { count: rows.length })} · {t(a.pendingCount, { count: pendingCount })}
        </p>
      </div>

      <div className="mt-4 flex gap-1">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={`rounded-control px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === item.key
                ? "bg-accent text-white"
                : "border border-line text-ink-soft hover:border-accent"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-control bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="mt-6 rounded-block border border-dashed border-line p-8 text-center text-sm text-ink-faint">
          {a.empty}
        </p>
      ) : (
        <>
          {/* Карточки вместо таблицы: на телефоне таблица нечитаема. */}
          <ul className="mt-4 space-y-3 lg:hidden">
            {visible.map((row) => (
              <li
                key={row.id}
                className="rounded-block border border-line bg-paper p-4 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{row.name}</p>
                    <p className="mt-0.5 break-words text-ink-soft">{row.contact}</p>
                  </div>
                  <StatusBadge dict={dict} status={row.processing_status} />
                </div>

                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px]">
                  <Row label={a.columns.date} value={formatDate(row.created_at)} />
                  <Row label={a.columns.who} value={describeWho(row)} />
                  <Row label={a.columns.level} value={f.level.options[row.level]} />
                  <Row label={a.columns.goal} value={describeGoal(row)} />
                  <Row label={a.columns.format} value={f.format.options[row.format]} />
                  <Row
                    label={a.columns.experience}
                    value={
                      row.studied_before
                        ? `${a.studiedYes}: ${row.studied_details ?? ""}`
                        : a.studiedNo
                    }
                  />
                  {row.preferred_time && (
                    <Row label={a.columns.time} value={row.preferred_time} />
                  )}
                  {row.comment && <Row label={a.columns.comment} value={row.comment} />}
                </dl>

                <button
                  type="button"
                  onClick={() => toggleStatus(row)}
                  disabled={savingId === row.id}
                  className="mt-3 w-full rounded-control border border-accent px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white disabled:opacity-60"
                >
                  {savingId === row.id
                    ? a.saving
                    : row.processing_status === "pending"
                      ? a.markProcessed
                      : a.markPending}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 hidden overflow-x-auto rounded-block border border-line lg:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-paper-dark/60 text-left">
                  <Th>{a.columns.date}</Th>
                  <Th>{a.columns.name}</Th>
                  <Th>{a.columns.contact}</Th>
                  <Th>{a.columns.who}</Th>
                  <Th>{a.columns.level}</Th>
                  <Th>{a.columns.goal}</Th>
                  <Th>{a.columns.format}</Th>
                  <Th>{a.columns.time}</Th>
                  <Th>{a.columns.status}</Th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <Fragment key={row.id}>
                    <tr className="border-b border-line align-top">
                      <Td className="whitespace-nowrap text-ink-faint">
                        {formatDate(row.created_at)}
                      </Td>
                      <Td className="font-medium text-ink">{row.name}</Td>
                      <Td>{row.contact}</Td>
                      <Td>{describeWho(row)}</Td>
                      <Td>{f.level.options[row.level]}</Td>
                      <Td>{describeGoal(row)}</Td>
                      <Td>{f.format.options[row.format]}</Td>
                      <Td className="max-w-[14rem]">{row.preferred_time || "—"}</Td>
                      <Td>
                        <div className="flex flex-col items-start gap-1.5">
                          <StatusBadge dict={dict} status={row.processing_status} />
                          <button
                            type="button"
                            onClick={() => toggleStatus(row)}
                            disabled={savingId === row.id}
                            className="text-xs font-medium text-accent underline-offset-2 hover:underline disabled:opacity-60"
                          >
                            {savingId === row.id
                              ? a.saving
                              : row.processing_status === "pending"
                                ? a.markProcessed
                                : a.markPending}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setExpanded(expanded === row.id ? null : row.id)
                            }
                            className="text-xs text-ink-faint underline-offset-2 hover:underline"
                          >
                            {a.details}
                          </button>
                        </div>
                      </Td>
                    </tr>
                    {expanded === row.id && (
                      <tr className="border-b border-line">
                        <td colSpan={9} className="bg-paper-dark/30 px-3 py-3 text-[13px]">
                          <dl className="grid gap-1">
                            <Row
                              label={a.columns.experience}
                              value={
                                row.studied_before
                                  ? `${a.studiedYes}: ${row.studied_details ?? ""}`
                                  : a.studiedNo
                              }
                            />
                            <Row
                              label={a.columns.comment}
                              value={row.comment || "—"}
                            />
                          </dl>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-2.5 text-ink-soft ${className}`}>{children}</td>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-ink-faint">{label}</dt>
      <dd className="break-words text-ink-soft">{value}</dd>
    </>
  );
}

function StatusBadge({
  dict,
  status,
}: {
  dict: Dict;
  status: ProcessingStatus;
}) {
  const isPending = status === "pending";
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
        isPending
          ? "bg-amber-100 text-amber-800"
          : "bg-emerald-100 text-emerald-800"
      }`}
    >
      {isPending
        ? dict.admin.applications.statusPending
        : dict.admin.applications.statusProcessed}
    </span>
  );
}

/** timeZone задан явно: иначе UTC на сервере и локальный в браузере ломают гидратацию. */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Baku",
  });
}
