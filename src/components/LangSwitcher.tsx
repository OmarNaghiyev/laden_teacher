import Link from "next/link";

import { otherLang, type Dict, type Lang } from "@/lib/i18n";

/** Показывает флаг текущего языка, ведёт на другой. */
export function LangSwitcher({ lang, dict }: { lang: Lang; dict: Dict }) {
  const other = otherLang(lang);

  return (
    <Link
      href={`/${other}`}
      hrefLang={other}
      // scroll={false}: иначе Next при смене роута прокручивает страницу,
      // а из-за scroll-behavior: smooth это выглядит как рывок.
      scroll={false}
      aria-label={dict.nav.switchLang}
      title={dict.nav.switchLang}
      className="block shrink-0 rounded-full ring-1 ring-line transition-shadow hover:ring-2 hover:ring-accent"
    >
      <span className="block h-7 w-7 overflow-hidden rounded-full">
        {lang === "ru" ? <FlagRu /> : <FlagAz />}
      </span>
    </Link>
  );
}

function FlagRu() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <rect width="24" height="8" fill="#ffffff" />
      <rect y="8" width="24" height="8" fill="#0039a6" />
      <rect y="16" width="24" height="8" fill="#d52b1e" />
    </svg>
  );
}

function FlagAz() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <rect width="24" height="8" fill="#0092bc" />
      <rect y="8" width="24" height="8" fill="#e8112d" />
      <rect y="16" width="24" height="8" fill="#00af66" />
      <circle cx="11.2" cy="12" r="3.4" fill="#ffffff" />
      <circle cx="12.5" cy="12" r="2.9" fill="#e8112d" />
      <polygon
        fill="#ffffff"
        points="17.25,12 16.14,12.31 16.71,13.31 15.71,12.74 15.4,13.85 15.09,12.74 14.09,13.31 14.66,12.31 13.55,12 14.66,11.69 14.09,10.69 15.09,11.26 15.4,10.15 15.71,11.26 16.71,10.69 16.14,11.69"
      />
    </svg>
  );
}
