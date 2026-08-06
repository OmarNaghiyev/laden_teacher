import Image from "next/image";

import type { Dict } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

export function Hero({ dict }: { dict: Dict }) {
  const badges = [
    dict.hero.badges.online,
    dict.hero.badges.individual,
    dict.hero.badges.levels,
  ];

  return (
    <section id="about" className="scroll-mt-24 border-b border-line bg-paper-dark/40">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          {/* Фото */}
          <div className="mx-auto w-32 shrink-0 sm:w-40 md:mx-0 md:w-48">
            <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-paper-dark">
              {siteConfig.photo ? (
                <Image
                  src={siteConfig.photo}
                  alt={dict.teacherName}
                  width={192}
                  height={192}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-ink-faint">
                  {dict.teacherName.slice(0, 1)}
                </div>
              )}
            </div>
          </div>

          {/* Текст */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium uppercase tracking-wide text-accent">
              {dict.hero.role}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {dict.teacherName}
            </h1>
            <p className="mt-2 text-base text-ink-soft sm:text-lg">{dict.hero.subjects}</p>

            <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              <p>{dict.hero.intro}</p>
              <p>{dict.hero.intro2}</p>
            </div>

            <ul className="mt-5 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <li
                  key={badge}
                  className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink-soft"
                >
                  {badge}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#apply"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark sm:text-base"
              >
                {dict.hero.cta}
              </a>
              <a
                href="#schedule"
                className="inline-flex items-center justify-center rounded-lg border border-line bg-paper px-5 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent sm:text-base"
              >
                {dict.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
