import Link from "next/link";

import type { Dict } from "@/lib/i18n";

export function Footer({ dict }: { dict: Dict }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {year} · {dict.footer.rights}
        </p>
        <Link href="/admin" className="hover:text-accent">
          {dict.footer.adminLink}
        </Link>
      </div>
    </footer>
  );
}
