// Content types for HamzaOS. Every piece of copy on the site comes from files in this folder.
// `TODO` marks a value Hamza still has to supply. Render it as a placeholder; never invent a value.

export type TODO = { todo: string }; // e.g. { todo: "GitHub link for SmartCool" }
export const isTodo = (v: unknown): v is TODO =>
  typeof v === "object" && v !== null && "todo" in v;

export type Maybe<T> = T | TODO;

export type ImageSlot = {
  src: string; // path under /public, e.g. "/images/projects/anchor/cover.webp"
  alt: string;
  placeholder: boolean; // true until Hamza drops in the real file (see docs/ASSETS.md)
  caption?: string;
};

export type Link = { label: string; href: string };

export type ProjectCategory = "Mobile" | "AI/ML" | "Cloud" | "Web" | "Systems";

export type Metric = { value: string; label: string };

export type Project = {
  slug: string;
  name: string;
  pitch: string; // one line, ≤ 110 chars
  categories: ProjectCategory[]; // first = primary
  year: Maybe<string>;
  proof?: { icon: "award" | "paper" | "live" | "industry" | "course" | "hackathon"; text: string };
  cover: ImageSlot;
  media: ImageSlot[];
  metrics: Metric[]; // 1–3, factual only
  problem: string;
  built: string[]; // "What I built" bullets
  impact: Maybe<string>[];
  role: Maybe<string>;
  team: Maybe<string>;
  timeline: Maybe<string>;
  context: string; // course / hackathon / programme
  stack: Maybe<string>[];
  github: Maybe<string> | null; // null = intentionally no public repo
  demo: Maybe<string> | null;
  opensApp?: "research"; // tile opens another app instead of a case study
  status: "approved" | "draft"; // draft = written by Claude from Hamza's materials, awaiting his approval
};

export type Role = {
  id: string;
  title: string;
  org: string;
  orgShort?: string;
  location: string;
  start: Maybe<string>; // "Jul 2026"
  end: string; // "Sep 2026" | "Present"
  kind: "Internship" | "Part-time" | "Leadership" | "Volunteer";
  summary: string;
  bullets: string[];
  skills: string[];
  logo: ImageSlot;
  link?: Link;
};

export type School = {
  id: string;
  name: string;
  short: string;
  location: string;
  start: string;
  end: string;
  credential: string;
  grade?: string;
  highlights: string[];
  logo: ImageSlot;
};

export type SkillGroup = {
  id: string;
  label: string;
  skills: { name: string; usedIn: string[] /* project slugs or role ids */ }[];
};
