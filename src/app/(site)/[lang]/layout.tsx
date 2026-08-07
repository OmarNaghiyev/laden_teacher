import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { ptSerif } from "@/lib/fonts";
import { LANGS, getDict, isLang } from "@/lib/i18n";
import "../../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};

  const dict = getDict(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: {
        ru: "/ru",
        az: "/az",
      },
    },
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html lang={lang} className={ptSerif.variable}>
      <body>{children}</body>
    </html>
  );
}
