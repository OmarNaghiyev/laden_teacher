import { notFound } from "next/navigation";

import { ApplicationForm } from "@/components/ApplicationForm";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { Contacts } from "@/components/Contacts";
import { Footer } from "@/components/Footer";
import { Formats } from "@/components/Formats";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { fetchAvailability } from "@/lib/availability";
import { getDict, isLang } from "@/lib/i18n";

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const dict = getDict(lang);
  const availability = await fetchAvailability();

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main>
        <Hero dict={dict} />
        <Formats dict={dict} />
        <AvailabilityCalendar dict={dict} rows={availability} />
        <ApplicationForm form={dict.form} lang={lang} />
        <Contacts dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
