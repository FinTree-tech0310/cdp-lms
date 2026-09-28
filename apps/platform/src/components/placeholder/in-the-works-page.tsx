import Link from "next/link";

import type { LucideIcon } from "lucide-react";

interface InTheWorksPageProps {
  /** Small gold chip above the title. */
  eyebrow: string;
  title: string;
  intro: string;
  icon: LucideIcon;
  /** Heading of the dashed placeholder card. */
  heading: string;
  body: string;
  /** Where the reader should go meanwhile. */
  cta: { href: string; label: string };
}

/**
 * Shell for sidebar tabs whose content hasn't shipped yet — the same dashed
 * "in the works" card the careers page uses for unwritten syllabi, promoted
 * to a full page. No fake content: it says what's coming and points at what
 * already works.
 */
export function InTheWorksPage({
  eyebrow,
  title,
  intro,
  icon: Icon,
  heading,
  body,
  cta,
}: InTheWorksPageProps) {
  return (
    <div className="animate-rise-in">
      <section className="rounded-[28px] border-2 border-[#0e0e0e] bg-white p-6 shadow-[6px_6px_0_rgba(14,14,14,0.12)] sm:p-9">
        <span className="inline-block rounded-md bg-[#f8dc03] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0e0e0e]">
          {eyebrow}
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
          {title}
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-[#5a5f58] sm:text-base">
          {intro}
        </p>

        <div className="mt-7 rounded-2xl border border-dashed border-black/20 bg-[#f6f7f4] p-6 text-center sm:p-8">
          <Icon className="mx-auto h-6 w-6 text-[#1ed2f4]" aria-hidden="true" />

          <h2 className="mt-3 text-lg font-bold tracking-[-0.02em]">
            {heading}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5a5f58]">
            {body}
          </p>

          <Link
            href={cta.href}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f8dc03] px-5 py-3 text-sm font-semibold text-[#0e0e0e] transition hover:bg-[#ffe14a]"
          >
            {cta.label}
          </Link>
        </div>
      </section>
    </div>
  );
}
