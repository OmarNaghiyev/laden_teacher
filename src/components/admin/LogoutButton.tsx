"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ label }: { label: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-control border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
    >
      {label}
    </button>
  );
}
