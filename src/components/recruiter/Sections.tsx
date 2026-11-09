import Link from "next/link";
import { Download, Mail, ExternalLink, Code2 } from "lucide-react";
import { profile, links, atAGlance, recruiterFeatured } from "@/content/site";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { research } from "@/content/research";
import { recruiterSkills } from "@/content/skills";
import { education } from "@/content/education";
import { awards } from "@/content/about";
import { isTodo, type Maybe } from "@/content/types";

function orDash(v: Maybe<string>): string {
  return isTodo(v) ? "—" : v;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 text-[22px] font-semibold tracking-[-0.01em] text-[color:var(--color-ink)]">
      <span
        aria-hidden
        className="inline-block h-4 w-[3px] rounded-[1px] bg-[color:var(--color-accent)]"
      />
      {children}
    </h2>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-recruiter-section
      className="mt-10 first:mt-0"
      aria-labelledby={`${id}-h`}
    >
      <div id={`${id}-h`}>
        <SectionHeading>{title}</SectionHeading>
      </div>
      {children}
    </section>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────
export function Header() {
  const mailto = `mailto:${links.emailParts.user}@${links.emailParts.domain}`;
  return (
    <header data-recruiter-section className="pb-2">
      <h1 className="text-[40px] leading-[44px] font-bold tracking-[-0.02em] text-[color:var(--color-ink)]">
        {profile.name}
      </h1>
      <p className="mt-2 text-[17px] text-[color:var(--color-ink-2)]">
        {profile.roleLong}
      </p>
      <p className="mt-1 text-[15px] text-[color:var(--color-ink-2)]">
        {profile.location}
      </p>
      <p className="mt-1 text-[15px] text-[color:var(--color-ink-2)]">
        {profile.availability}
      </p>
      <div
        data-print-hide
        className="mt-5 flex flex-wrap gap-2"
      >
        <a
          href={links.resumePdf}
          download="Hamza_Alkhaldi_Resume.pdf"
          className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-[color:var(--color-accent)] px-4 text-[14px] font-semibold text-white hover:bg-[color:var(--color-accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/60"
        >
          <Download size={14} aria-hidden /> Download résumé
        </a>
        <a
          href={mailto}
          className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-hairline-strong)] bg-white px-4 text-[14px] font-semibold text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40"
        >
          <Mail size={14} aria-hidden /> Email
        </a>
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-hairline-strong)] bg-white px-4 text-[14px] font-semibold text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40"
        >
          <ExternalLink size={14} aria-hidden /> LinkedIn
        </a>
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-hairline-strong)] bg-white px-4 text-[14px] font-semibold text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40"
        >
          <Code2 size={14} aria-hidden /> GitHub
        </a>
      </div>
    </header>
  );
}

// ─── At a glance ─────────────────────────────────────────────────────────
export function AtAGlance() {
  return (
    <Section id="at-a-glance" title="At a glance">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {atAGlance.map((t) => (
          <div
            key={t.label}
            data-recruiter-card
            className="rounded-[12px] bg-[color:var(--color-surface-2)] p-4"
          >
            <div className="text-[11px] font-semibold tracking-[0.04em] text-[color:var(--color-ink-3)] uppercase">
              {t.label}
            </div>
            <div className="mt-1 text-[15px] font-semibold text-[color:var(--color-ink)]">
              {t.value}
            </div>
            <div className="mt-0.5 text-[13px] text-[color:var(--color-ink-2)]">
              {t.sub}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── Experience ──────────────────────────────────────────────────────────
export function Experience() {
  // Per PRD §4 §3: Experience lists paid/academic roles (Batelco first, then tutoring).
  // Leadership & activities carries the rest (MUN, GDG ambassador, charity).
  const workIds = ["batelco", "aubh-tutor"];
  const ordered = workIds
    .map((id) => experience.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => !!r);
  return (
    <Section id="experience" title="Experience">
      <ul className="flex flex-col gap-6">
        {ordered.map((r) => (
          <li key={r.id} data-recruiter-card>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-[15px] font-semibold text-[color:var(--color-ink)]">
                {r.title}
              </div>
              <div className="text-[13px] text-[color:var(--color-ink-3)]">
                {orDash(r.start)} – {r.end}
              </div>
            </div>
            <div className="text-[14px] text-[color:var(--color-ink-2)]">
              {r.org} · {r.location}
            </div>
            {r.bullets.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-6 text-[color:var(--color-ink)]">
                {r.bullets.slice(0, 3).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ─── Featured projects ───────────────────────────────────────────────────
export function FeaturedProjects() {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const featured = recruiterFeatured
    .map((slug) => bySlug.get(slug))
    .filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <Section id="projects" title="Featured projects">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {featured.map((p) => {
          const firstProof =
            p.metrics[0] ??
            (p.proof ? { value: p.proof.text, label: "" } : null);
          const stack = p.stack
            .map((s) => (isTodo(s) ? "" : s))
            .filter(Boolean)
            .slice(0, 6)
            .join(" · ");
          const github = isTodo(p.github) || p.github === null ? null : p.github;
          const demo = isTodo(p.demo) || p.demo === null ? null : p.demo;
          return (
            <article
              key={p.slug}
              data-recruiter-card
              className="rounded-[12px] border border-[color:var(--color-hairline)] bg-white p-4"
            >
              <div className="text-[15px] font-semibold text-[color:var(--color-ink)]">
                {p.name}
              </div>
              <p className="mt-1 text-[14px] text-[color:var(--color-ink-2)]">
                {p.pitch}
              </p>
              {stack && (
                <p className="mt-2 text-[12px] text-[color:var(--color-ink-3)]">
                  {stack}
                </p>
              )}
              {firstProof && (
                <p className="mt-2 text-[13px] text-[color:var(--color-ink)]">
                  <span className="font-semibold">{firstProof.value}</span>
                  {firstProof.label ? (
                    <span className="text-[color:var(--color-ink-2)]">
                      {" "}
                      — {firstProof.label}
                    </span>
                  ) : null}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--color-accent)] hover:underline"
                  >
                    GitHub ↗
                  </a>
                )}
                {demo && (
                  <a
                    href={demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--color-accent)] hover:underline"
                  >
                    Demo ↗
                  </a>
                )}
                <Link
                  href={`/?open=project:${p.slug}`}
                  className="text-[color:var(--color-accent)] hover:underline"
                >
                  Case study ↗
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

// ─── Research ────────────────────────────────────────────────────────────
export function Research() {
  const firstResult = research.keyResults[0];
  const code = research.links.code;
  return (
    <Section id="research" title="Research">
      <p className="text-[14px] text-[color:var(--color-ink)]">
        <span className="italic">{research.title}</span>{" "}
        <span className="text-[color:var(--color-ink-2)]">
          · {research.authors.join(", ")} · {research.venueShort},{" "}
          {research.location}
        </span>
      </p>
      {firstResult && (
        <p className="mt-2 text-[14px] text-[color:var(--color-ink)]">
          <span className="font-semibold">{firstResult.value}</span>{" "}
          <span className="text-[color:var(--color-ink-2)]">
            {firstResult.label}.
          </span>
        </p>
      )}
      {code && (
        <p className="mt-2 text-[13px]">
          <a
            href={code}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--color-accent)] hover:underline"
          >
            Code ↗
          </a>
        </p>
      )}
    </Section>
  );
}

// ─── Skills ──────────────────────────────────────────────────────────────
export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <dl className="space-y-2 text-[14px]">
        {Object.entries(recruiterSkills).map(([group, list]) => (
          <div
            key={group}
            className="flex flex-col gap-0.5 sm:flex-row sm:gap-3"
          >
            <dt className="min-w-[140px] font-semibold text-[color:var(--color-ink)]">
              {group}
            </dt>
            <dd className="text-[color:var(--color-ink-2)]">{list}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

// ─── Education ───────────────────────────────────────────────────────────
export function Education() {
  // AUBH first, then Reboot (then others, per PRD).
  const order = ["aubh", "reboot"];
  const ordered = [
    ...order
      .map((id) => education.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => !!e),
    ...education.filter((e) => !order.includes(e.id)),
  ];
  return (
    <Section id="education" title="Education">
      <ul className="flex flex-col gap-4">
        {ordered.map((e) => (
          <li key={e.id} data-recruiter-card>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-[15px] font-semibold text-[color:var(--color-ink)]">
                {e.name}
              </div>
              <div className="text-[13px] text-[color:var(--color-ink-3)]">
                {e.start} – {e.end}
              </div>
            </div>
            <div className="text-[14px] text-[color:var(--color-ink-2)]">
              {e.credential}
              {e.grade ? ` · ${e.grade}` : ""}
            </div>
            {e.highlights.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-6 text-[color:var(--color-ink)]">
                {e.highlights.slice(0, 2).map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ─── Leadership & activities ─────────────────────────────────────────────
export function Leadership() {
  // Non-internship, non-tutor roles from experience, plus awards summary.
  const lead = experience.filter((r) =>
    ["iscmun", "devfest", "toy-drive"].includes(r.id),
  );
  return (
    <Section id="leadership" title="Leadership & activities">
      <ul className="list-disc space-y-1 pl-5 text-[14px] leading-6 text-[color:var(--color-ink)]">
        {lead.map((r) => (
          <li key={r.id}>
            <span className="font-semibold">{r.title}</span>
            <span className="text-[color:var(--color-ink-2)]">
              {" "}
              — {r.org} ({r.end})
            </span>
          </li>
        ))}
        {awards.map((a) => (
          <li key={a.id}>
            <span className="font-semibold">{a.title}</span>
            <span className="text-[color:var(--color-ink-2)]">
              {" "}
              — {a.org}
              {a.detail ? ` · ${a.detail}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer
      data-recruiter-section
      className="mt-12 border-t border-[color:var(--color-hairline)] pt-6 text-[13px] text-[color:var(--color-ink-2)]"
    >
      Prefer the full experience?{" "}
      <Link
        href="/"
        className="text-[color:var(--color-accent)] hover:underline"
      >
        Open HamzaOS →
      </Link>
    </footer>
  );
}
