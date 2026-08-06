import { t, type Dict } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

export function Formats({ dict }: { dict: Dict }) {
  const { prices, trial } = siteConfig;

  const cards = [
    {
      title: dict.formats.individual.title,
      description: dict.formats.individual.description,
      priceLabel: dict.formats.individual.priceLabel,
      price: prices.individual,
    },
    {
      title: dict.formats.group.title,
      description: dict.formats.group.description,
      priceLabel: dict.formats.group.priceLabel,
      price: prices.group,
    },
    {
      title: dict.formats.modes.title,
      description: dict.formats.modes.description,
      priceLabel: null,
      price: null,
    },
  ];

  return (
    <section id="formats" className="scroll-mt-24 border-b border-line">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {dict.formats.title}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
          {t(dict.formats.lead, {
            lessonsPerWeek: prices.lessonsPerWeek,
            lessonDuration: prices.lessonDuration,
            paymentPeriodWeeks: prices.paymentPeriodWeeks,
          })}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-xl border border-line bg-paper p-5"
            >
              <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                {card.description}
              </p>
              {card.price && (
                <div className="mt-4 border-t border-line pt-3">
                  <p className="text-xs uppercase tracking-wide text-ink-faint">
                    {card.priceLabel}
                  </p>
                  <p className="mt-0.5 text-xl font-semibold text-accent">{card.price}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-accent/25 bg-accent-soft p-5 sm:p-6">
          <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            {dict.formats.trial.badge}
          </span>
          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h3 className="text-xl font-bold text-ink sm:text-2xl">
              {t(dict.formats.trial.title, { minutes: trial.durationMinutes })}
            </h3>
            <p className="text-lg font-semibold text-accent">
              {trial.isFree
                ? dict.formats.trial.free
                : t(dict.formats.trial.paid, { price: trial.price })}
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {dict.formats.trial.description}
          </p>
          <p className="mt-2 text-xs text-ink-faint">{dict.formats.trial.note}</p>
        </div>
      </div>
    </section>
  );
}
