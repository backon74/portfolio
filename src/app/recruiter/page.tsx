import type { Metadata } from "next";
import { profile, links } from "@/content/site";
import { education } from "@/content/education";
import { RecruiterBar } from "@/components/recruiter/RecruiterBar";
import { RecruiterAnalytics } from "@/components/recruiter/RecruiterAnalytics";
import {
  Header,
  AtAGlance,
  Experience,
  FeaturedProjects,
  Research,
  Skills,
  Education,
  Leadership,
  Footer,
} from "@/components/recruiter/Sections";

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
  robots: { index: true, follow: true },
  alternates: { canonical: "/recruiter" },
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    url: "/recruiter",
    type: "profile",
  },
};

/**
 * Recruiter View (`/recruiter`).
 *
 * MUST remain a Server Component with zero client JS:
 *   - no "use client" anywhere in its subtree,
 *   - no Motion, no widgets, no audio, no client-side data fetching,
 *   - static at build time, Lighthouse perf ≥ 95 / a11y 100.
 * Section order is fixed by PRD §4.
 */
export default function RecruiterPage() {
  const aubh = education.find((e) => e.id === "aubh");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.roleLong,
    description: profile.tagline,
    url: "/recruiter",
    alumniOf: aubh
      ? {
          "@type": "CollegeOrUniversity",
          name: aubh.name,
          location: aubh.location,
        }
      : undefined,
    sameAs: [links.linkedin, links.github],
    // Privacy (CLAUDE.md rule 2): no phone, address or DOB.
  };

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: "var(--color-bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Animated gradient backdrop — CSS only, no client JS */}
      <div
        aria-hidden="true"
        data-print-hide
        className="pointer-events-none absolute inset-0 recruiter-aurora"
      />
      <div
        aria-hidden="true"
        data-print-hide
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(10,30,60,.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.4,
          maskImage: "radial-gradient(ellipse at 50% 30%, black 50%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 50%, transparent 85%)",
        }}
      />
      <RecruiterBar />
      <RecruiterAnalytics />
      <div className="relative mx-auto w-full max-w-[760px] px-5 pt-8 pb-16 md:px-10">
        <div
          data-recruiter-paper
          className="rounded-[20px] p-6 md:p-12"
          style={{
            background: "rgba(255,255,255,.82)",
            backdropFilter: "blur(20px) saturate(150%)",
            WebkitBackdropFilter: "blur(20px) saturate(150%)",
            boxShadow:
              "0 0 0 0.5px rgba(10,30,60,.14), 0 20px 60px -20px rgba(10,30,60,.35), 0 0 60px -20px rgba(34,211,255,.25)",
          }}
        >
          <Header />
          <AtAGlance />
          <Experience />
          <FeaturedProjects />
          <Research />
          <Skills />
          <Education />
          <Leadership />
          <Footer />
        </div>
      </div>
    </main>
  );
}
