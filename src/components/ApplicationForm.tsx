"use client";

import { useState } from "react";

import type { Dict, Lang } from "@/lib/i18n";
import { GRADES } from "@/lib/validation";

type Errors = Record<string, string>;

// Только раздел form, а не весь словарь: пропсы клиентских компонентов
// сериализуются в HTML страницы.
type FormDict = Dict["form"];

const initialState = {
  name: "",
  contact: "",
  status: "" as "" | "pupil" | "student" | "adult",
  grade: "",
  studied_before: "no" as "yes" | "no",
  studied_details: "",
  level: "",
  goal: "",
  goal_other: "",
  format: "",
  preferred_time: "",
  comment: "",
};

type FormState = typeof initialState;

export function ApplicationForm({ form, lang }: { form: FormDict; lang: Lang }) {
  const f = form.fields;
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!(key in previous)) return previous;
      const next = { ...previous };
      delete next[key as string];
      return next;
    });
  }

  /** Дублирует серверные правила — только для быстрой обратной связи. */
  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = form.errors.name;
    if (!values.contact.trim()) next.contact = form.errors.contact;
    if (!values.status) next.status = form.errors.status;
    if (values.status === "pupil" && !values.grade) next.grade = form.errors.grade;
    if (values.studied_before === "yes" && !values.studied_details.trim()) {
      next.studied_details = form.errors.studiedDetails;
    }
    if (!values.level) next.level = form.errors.level;
    if (!values.goal) next.goal = form.errors.goal;
    if (values.goal === "other" && !values.goal_other.trim()) {
      next.goal_other = form.errors.goalOther;
    }
    if (!values.format) next.format = form.errors.format;
    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailed(false);

    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          contact: values.contact,
          status: values.status,
          grade: values.status === "pupil" ? Number(values.grade) : null,
          studied_before: values.studied_before === "yes",
          studied_details:
            values.studied_before === "yes" ? values.studied_details : null,
          level: values.level,
          goal: values.goal,
          goal_other: values.goal === "other" ? values.goal_other : null,
          format: values.format,
          preferred_time: values.preferred_time,
          comment: values.comment,
          lang,
        }),
      });

      if (!response.ok) {
        if (response.status === 422) {
          const body = (await response.json()) as { fields?: Record<string, string> };
          const mapped: Errors = {};
          for (const [field, key] of Object.entries(body.fields ?? {})) {
            mapped[field] =
              form.errors[key as keyof typeof form.errors] ??
              form.errorGeneric;
          }
          setErrors(mapped);
        } else {
          setFailed(true);
        }
        return;
      }

      setValues(initialState);
      setErrors({});
      setDone(true);
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section id="apply" className="scroll-mt-24 border-b border-line">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="rounded-xl border border-accent/25 bg-accent-soft p-6 text-center sm:p-10">
            <h2 className="text-2xl font-bold text-ink">{form.successTitle}</h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
              {form.successText}
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-6 rounded-lg border border-accent bg-paper px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
            >
              {form.successAgain}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="scroll-mt-24 border-b border-line">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {form.title}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{form.lead}</p>

        <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
          <Field label={f.name.label} error={errors.name} htmlFor="name" required>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder={f.name.placeholder}
              className={inputClass(!!errors.name)}
            />
          </Field>

          <Field
            label={f.contact.label}
            hint={f.contact.hint}
            error={errors.contact}
            htmlFor="contact"
            required
          >
            <input
              id="contact"
              name="contact"
              type="text"
              value={values.contact}
              onChange={(event) => set("contact", event.target.value)}
              placeholder={f.contact.placeholder}
              className={inputClass(!!errors.contact)}
            />
          </Field>

          <fieldset>
            <legend className="text-sm font-medium text-ink">
              {f.status.label} <RequiredMark />
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(["pupil", "student", "adult"] as const).map((option) => (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                    values.status === option
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line bg-paper text-ink-soft hover:border-accent/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option}
                    checked={values.status === option}
                    onChange={() => set("status", option)}
                    className="accent-accent"
                  />
                  {f.status.options[option]}
                </label>
              ))}
            </div>
            <ErrorText message={errors.status} />
          </fieldset>

          {values.status === "pupil" && (
            <Field label={f.grade.label} error={errors.grade} htmlFor="grade" required>
              <select
                id="grade"
                name="grade"
                value={values.grade}
                onChange={(event) => set("grade", event.target.value)}
                className={inputClass(!!errors.grade)}
              >
                <option value="">{f.grade.placeholder}</option>
                {GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade} {f.grade.suffix}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <fieldset>
            <legend className="text-sm font-medium text-ink">
              {f.studiedBefore.label}
            </legend>
            <div className="mt-2 flex gap-2">
              {(["yes", "no"] as const).map((option) => (
                <label
                  key={option}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors sm:flex-none sm:px-6 ${
                    values.studied_before === option
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line bg-paper text-ink-soft hover:border-accent/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="studied_before"
                    value={option}
                    checked={values.studied_before === option}
                    onChange={() => set("studied_before", option)}
                    className="accent-accent"
                  />
                  {option === "yes" ? f.studiedBefore.yes : f.studiedBefore.no}
                </label>
              ))}
            </div>
          </fieldset>

          {values.studied_before === "yes" && (
            <Field
              label={f.studiedDetails.label}
              error={errors.studied_details}
              htmlFor="studied_details"
              required
            >
              <textarea
                id="studied_details"
                name="studied_details"
                rows={3}
                value={values.studied_details}
                onChange={(event) => set("studied_details", event.target.value)}
                placeholder={f.studiedDetails.placeholder}
                className={inputClass(!!errors.studied_details)}
              />
            </Field>
          )}

          <Field label={f.level.label} error={errors.level} htmlFor="level" required>
            <select
              id="level"
              name="level"
              value={values.level}
              onChange={(event) => set("level", event.target.value)}
              className={inputClass(!!errors.level)}
            >
              <option value="">{f.level.placeholder}</option>
              {(["beginner", "intermediate", "advanced"] as const).map((option) => (
                <option key={option} value={option}>
                  {f.level.options[option]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={f.goal.label} error={errors.goal} htmlFor="goal" required>
            <select
              id="goal"
              name="goal"
              value={values.goal}
              onChange={(event) => set("goal", event.target.value)}
              className={inputClass(!!errors.goal)}
            >
              <option value="">{f.goal.placeholder}</option>
              {(["school", "exam", "self", "other"] as const).map((option) => (
                <option key={option} value={option}>
                  {f.goal.options[option]}
                </option>
              ))}
            </select>
          </Field>

          {values.goal === "other" && (
            <Field
              label={f.goalOther.label}
              error={errors.goal_other}
              htmlFor="goal_other"
              required
            >
              <input
                id="goal_other"
                name="goal_other"
                type="text"
                value={values.goal_other}
                onChange={(event) => set("goal_other", event.target.value)}
                placeholder={f.goalOther.placeholder}
                className={inputClass(!!errors.goal_other)}
              />
            </Field>
          )}

          <Field label={f.format.label} error={errors.format} htmlFor="format" required>
            <select
              id="format"
              name="format"
              value={values.format}
              onChange={(event) => set("format", event.target.value)}
              className={inputClass(!!errors.format)}
            >
              <option value="">{f.format.placeholder}</option>
              {(["individual", "group"] as const).map((option) => (
                <option key={option} value={option}>
                  {f.format.options[option]}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label={f.preferredTime.label}
            hint={f.preferredTime.hint}
            htmlFor="preferred_time"
          >
            <textarea
              id="preferred_time"
              name="preferred_time"
              rows={2}
              value={values.preferred_time}
              onChange={(event) => set("preferred_time", event.target.value)}
              placeholder={f.preferredTime.placeholder}
              className={inputClass(false)}
            />
          </Field>

          <Field label={f.comment.label} htmlFor="comment" optionalLabel={form.optional}>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              value={values.comment}
              onChange={(event) => set("comment", event.target.value)}
              placeholder={f.comment.placeholder}
              className={inputClass(false)}
            />
          </Field>

          {failed && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              <p className="font-semibold">{form.errorTitle}</p>
              <p className="mt-1">{form.errorGeneric}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
          >
            {submitting ? form.submitting : form.submit}
          </button>
        </form>
      </div>
    </section>
  );
}

function inputClass(hasError: boolean): string {
  return [
    "mt-1.5 block w-full rounded-lg border bg-paper px-3 py-2.5 text-[15px] text-ink",
    "placeholder:text-ink-faint/70 focus:outline-none focus:ring-2 focus:ring-accent/30",
    hasError ? "border-red-400 focus:border-red-500" : "border-line focus:border-accent",
  ].join(" ");
}

function RequiredMark() {
  return <span className="text-red-600">*</span>;
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-700">{message}</p>;
}

function Field({
  label,
  hint,
  error,
  htmlFor,
  required,
  optionalLabel,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  required?: boolean;
  optionalLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label} {required && <RequiredMark />}
        {optionalLabel && (
          <span className="font-normal text-ink-faint"> ({optionalLabel})</span>
        )}
      </label>
      {hint && <p className="mt-0.5 text-xs text-ink-faint">{hint}</p>}
      {children}
      <ErrorText message={error} />
    </div>
  );
}
