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
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {dict.contacts.title}
        </h2>
        <p className="mt-3 text-[15px] text-ink-soft">{dict.contacts.lead}</p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3.5 transition-colors hover:border-accent"
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
