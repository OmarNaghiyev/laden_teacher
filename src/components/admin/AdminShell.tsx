import Link from "next/link";

import { LogoutButton } from "@/components/admin/LogoutButton";
import type { Dict } from "@/lib/i18n";

export function AdminShell({
  dict,
  active,
  children,
}: {
  dict: Dict;
  active: "applications" | "availability";
  children: React.ReactNode;
}) {
  const tabs = [
    { key: "applications", href: "/admin", label: dict.admin.tabs.applications },
    {
      key: "availability",
      href: "/admin/availability",
      label: dict.admin.tabs.availability,
    },
  ] as const;

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="text-sm font-semibold text-ink">
            {dict.teacherName}
            <span className="ml-2 font-normal text-ink-faint">
              · {dict.admin.tabs[active].toLowerCase()}
            </span>
          </p>
          <LogoutButton label={dict.admin.logout} />
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 px-4 pb-2 sm:px-6">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active === tab.key
                  ? "bg-accent text-white"
                  : "text-ink-soft hover:bg-paper-dark"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
