import { SectionHeading } from "@/components/SectionHeading";
import type { Dict } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

export function Contacts({ dict }: { dict: Dict }) {
  const { contacts } = siteConfig;

  const items = [
    {
      label: dict.contacts.phone,
      value: contacts.phone,
      href: `tel:${contacts.phone.replace(/[^\d+]/g, "")}`,
      action: dict.contacts.call,
    },
    {
      label: dict.contacts.telegram,
      value: `@${contacts.telegram}`,
      href: `https://t.me/${contacts.telegram}`,
      action: dict.contacts.write,
    },
    {
      label: dict.contacts.whatsapp,
      value: `+${contacts.whatsapp}`,
      href: `https://wa.me/${contacts.whatsapp}`,
      action: dict.contacts.write,
    },
    {
      label: dict.contacts.email,
      value: contacts.email,
      href: `mailto:${contacts.email}`,
      action: dict.contacts.write,
    },
  ];

  return (
    <section id="contacts" className="scroll-mt-24 bg-paper-dark/40">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading title={dict.contacts.title} lead={dict.contacts.lead} />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center justify-between gap-3 rounded-block border border-line bg-paper px-4 py-3.5 transition-colors hover:border-accent"
              >
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wide text-ink-faint">
                    {item.label}
                  </span>
                  <span className="block truncate text-[15px] font-medium text-ink">
                    {item.value}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-medium text-accent">
                  {item.action} →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
