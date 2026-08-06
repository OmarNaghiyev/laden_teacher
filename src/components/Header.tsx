import Link from "next/link";

import { LangSwitcher } from "@/components/LangSwitcher";
import type { Dict, Lang } from "@/lib/i18n";

export function Header({ lang, dict }: { lang: Lang; dict: Dict }) {
  const links = [
    { href: "#about", label: dict.nav.about },
    { href: "#formats", label: dict.nav.formats },
    { href: "#schedule", label: dict.nav.schedule },
    { href: "#contacts", label: dict.nav.contacts },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-3">
          <Link
            href={`/${lang}`}
            className="shrink-0 text-base font-semibold tracking-tight text-ink"
          >
            {dict.teacherName}
            <span className="ml-2 hidden text-sm font-normal text-ink-faint sm:inline">
              · {dict.hero.role}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2.5 py-1.5 text-sm text-ink-soft transition-colors hover:bg-paper-dark hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <LangSwitcher lang={lang} dict={dict} />

            <a
              href="#apply"
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
            >
              {dict.nav.apply}
            </a>
          </div>
        </div>

        <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-md bg-paper-dark px-2.5 py-1 text-xs font-medium text-ink-soft"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
