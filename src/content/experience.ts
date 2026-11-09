import type { Role } from "./types";

const logo = (id: string, alt: string) => ({ src: `/images/logos/${id}.webp`, alt, placeholder: true });

const roles: Omit<Role, "logo">[] = [
  {
    id: "batelco",
    title: "Mobile Development Intern (Industrial Trainee)",
    org: "Batelco by Beyon",
    orgShort: "Batelco",
    location: "Hamala, Bahrain",
    start: "Jul 2026",
    end: "Sep 2026",
    kind: "Internship",
    summary:
      "Android Development Team, Mobile Applications Development, IT Department — working on Batelco's customer self-service app during its major revamp.",
    bullets: [
      "Resolved 60 P1/P2 functional bugs and UI/UX enhancements across 10 feature areas of Batelco's customer-facing Android app (Kotlin, Jetpack Compose), contributing to the launch of the app's major revamp.",
      "Led a cross-platform localisation audit across Android, iOS and Confluence spanning thousands of keys, using AI-assisted tooling (Claude Code, Cursor) to script comparisons and resolve mismatches.",
      "Authored object-level API value-tracing documentation for the payment gateway across every purchasable flow, adopted directly by the team building the revamped app.",
      "Found deep links missing from the old Android app and implemented them in the revamped version.",
    ],
    skills: ["Kotlin", "Jetpack Compose", "Android Studio", "Git", "Figma", "Confluence", "RTL layouts", "API tracing"],
  },
  {
    id: "aubh-tutor",
    title: "Peer Tutor",
    org: "American University of Bahrain",
    orgShort: "AUBH",
    location: "Riffa, Bahrain",
    start: { todo: "Start date, e.g. Sep 2024" },
    end: "Present",
    kind: "Part-time",
    summary: "Tutoring fellow students in core first- and second-year courses.",
    bullets: [
      "Tutor for Data Structures & Programming, Calculus I–II, Physics, and Composition I–II.",
    ],
    skills: ["Teaching", "Data Structures", "Communication"],
  },
  {
    id: "iscmun",
    title: "Head of IT",
    org: "ISCMUN II (Model United Nations)",
    location: "Muharraq, Bahrain",
    start: { todo: "Start month/year" },
    end: "2023",
    kind: "Leadership",
    summary: "Led technology for the school's Model United Nations conference.",
    bullets: [
      "Designed and built the conference website, reaching 5,000+ visits.",
      "Senior Prefect of Technology at the International School of Choueifat.",
    ],
    skills: ["Web development", "Leadership"],
  },
  {
    id: "devfest",
    title: "Event Ambassador",
    org: "Google Developer Group — DevFest / Tech Olympiad",
    location: "Manama, Bahrain",
    start: "Nov 2024",
    end: "Nov 2024",
    kind: "Volunteer",
    summary: "Volunteered at GDG DevFest Manama.",
    bullets: ["Guided attendees, managed attendee flow and helped run event logistics."],
    skills: ["Coordination", "Communication"],
  },
  {
    id: "toy-drive",
    title: "Organiser, Charity Toy Drive",
    org: "International School of Choueifat × Royal Humanitarian Foundation",
    location: "Muharraq, Bahrain",
    start: "Apr 2023",
    end: "Apr 2023",
    kind: "Volunteer",
    summary: "Coordinated a toy-drive event for orphaned children.",
    bullets: [
      "Coordinated and ran a toy drive with the Royal Humanitarian Foundation, where children were invited to play games, share meals and receive donated toys.",
    ],
    skills: ["Event planning", "Organisation"],
  },
];

export const experience: Role[] = roles.map((r) => ({ ...r, logo: logo(r.id, `${r.org} logo`) }));
