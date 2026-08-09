import { SectionHeading } from "@/components/SectionHeading";
import { t, type Dict } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

export function Formats({ dict }: { dict: Dict }) {
  const { prices, trial } = siteConfig;

  // Сначала группа (дешевле), потом индивидуально: порядок от меньшей цены.
  const plans = [
    {
      title: dict.formats.group.title,
      description: dict.formats.group.description,
      priceLabel: dict.formats.group.priceLabel,
      price: prices.group,
    },
    {
      title: dict.formats.individual.title,
      description: dict.formats.individual.description,
      priceLabel: dict.formats.individual.priceLabel,
      price: prices.individual,
    },
  ];

  return (
    <section id="formats" className="scroll-mt-24 border-b border-line">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          title={dict.formats.title}
          lead={t(dict.formats.lead, {
            lessonsPerWeek: prices.lessonsPerWeek,
            lessonDuration: prices.lessonDuration,
            paymentPeriodWeeks: prices.paymentPeriodWeeks,
          })}
        />

        <div className="mt-8 rounded-block border border-accent/25 bg-accent-soft p-6 sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {dict.formats.trial.badge}
          </span>
          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h3 className="text-2xl font-bold text-ink sm:text-3xl">
              {t(dict.formats.trial.title, { minutes: trial.durationMinutes })}
            </h3>
            <p className="text-xl font-bold text-accent">
              {trial.isFree
                ? dict.formats.trial.free
                : t(dict.formats.trial.paid, { price: trial.price })}
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {dict.formats.trial.description}
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className="flex flex-col rounded-block border border-line bg-paper p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-xl font-bold text-ink">{plan.title}</h3>
                <p className="shrink-0 text-2xl font-bold text-accent">{plan.price}</p>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink-faint">
                {plan.priceLabel}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                {plan.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 border-l-2 border-accent/30 pl-4 text-sm leading-relaxed text-ink-soft">
          <span className="font-semibold text-ink">{dict.formats.modes.title}.</span>{" "}
          {dict.formats.modes.description}
        </p>
      </div>
    </section>
  );
}
