"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Dict } from "@/lib/i18n";

export function LoginForm({ dict }: { dict: Dict }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.replace("/admin");
        return;
      }

      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setError(
        body.error === "not_configured"
          ? dict.admin.notConfigured
          : dict.admin.wrongPassword,
      );
    } catch {
      setError(dict.admin.wrongPassword);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-block border border-line bg-paper p-5"
    >
      <label htmlFor="password" className="text-sm font-medium text-ink">
        {dict.admin.password}
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="mt-1.5 block w-full rounded-control border border-line bg-paper px-3 py-2.5 text-[15px] text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || password.length === 0}
        className="mt-4 w-full rounded-control bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? dict.admin.loggingIn : dict.admin.login}
      </button>
    </form>
  );
}
