/** Единый заголовок секции: штрих-шкала, крупный serif, вводный абзац. */
export function SectionHeading({ title, lead }: { title: string; lead?: string }) {
  return (
    <div>
      <span className="timescale block h-2.5 w-16 opacity-30" aria-hidden="true" />
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {lead && (
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{lead}</p>
      )}
    </div>
  );
}
