import type { ImageSlot, Maybe } from "./types";

// ── Identity ────────────────────────────────────────────────────────────────
// PRIVACY: never add phone, home address or date of birth here.
export const profile = {
  name: "Hamza Alkhaldi",
  firstName: "Hamza",
  role: "Software Engineer · Mobile",
  roleLong: "Software Engineer · Mobile (Android / iOS)",
  tagline:
    "Senior CS student at AUBH building mobile apps, cloud systems and NLP research — looking for graduate software engineering roles.",
  location: "Muharraq, Bahrain",
  heritage: "Bahraini 🇧🇭 with Moroccan roots 🇲🇦",
  graduation: { todo: "Expected graduation month and year, e.g. 'June 2027'" } as Maybe<string>,
  availability: "Open to graduate software engineering roles in the GCC and abroad",
  photo: {
    src: "/images/profile/hamza.jpg",
    alt: "Portrait of Hamza Alkhaldi",
    placeholder: false,
  } satisfies ImageSlot,
} as const;

// ── Links ───────────────────────────────────────────────────────────────────
export const links = {
  github: "https://github.com/backon74",
  githubUser: "backon74",
  linkedin: "https://www.linkedin.com/in/hamza-alkhaldi-a89a10338/",
  // Assembled at runtime by the Mail app / mailto helper so it is not plain text in the HTML.
  emailParts: { user: "alkhaldihamza06", domain: "gmail.com" },
  resumePdf: "/resume/Hamza_Alkhaldi_Resume.pdf",
  sourceRepo: "https://github.com/backon74/portfolio",
} as const;

// ── Welcome.txt ─────────────────────────────────────────────────────────────
export const welcome = {
  title: "Welcome.txt",
  heading: "Hi, I'm Hamza 👋",
  lines: [
    "I'm a senior Computer Science student at the American University of Bahrain and a mobile developer — most recently on Batelco's Android app.",
    "This is HamzaOS, my portfolio as a little operating system. Everything opens with a single click: try the Projects folder, my Research paper, or the Hamza app to see who I am outside of code.",
    "Short on time? Recruiter View gives you my whole résumé on one fast page.",
  ],
  primary: "Explore the desktop",
  secondary: "Open Recruiter View",
  hint: "Tip: everything opens with a single click.",
} as const;

// ── Widgets ─────────────────────────────────────────────────────────────────
export const song = {
  title: "Workin' Day and Night",
  artist: "Michael Jackson",
  album: "Off the Wall",
  searchTerm: "workin day and night michael jackson off the wall",
} as const;

export const weatherCities = [
  { id: "muharraq", name: "Muharraq", flag: "🇧🇭", lat: 26.2572, lon: 50.6119, tz: "Asia/Bahrain" },
  { id: "marrakech", name: "Marrakech", flag: "🇲🇦", lat: 31.6295, lon: -7.9811, tz: "Africa/Casablanca" },
] as const;

// ── Recruiter View ──────────────────────────────────────────────────────────
export const atAGlance = [
  { label: "Degree", value: "B.S. Computer Science", sub: "AUBH · cGPA 3.5" },
  { label: "Internship", value: "Batelco by Beyon", sub: "Mobile Development Intern · Android" },
  { label: "Publication", value: "IEEE ETECOM 2026", sub: "Oral presentation · Paris" },
  { label: "Award", value: "2nd Place / 250+", sub: "GSR Hackathon 2026 · KFUPM" },
] as const;

// Order of project cards in Recruiter View (slugs from projects.ts)
export const recruiterFeatured = ["anchor", "smartcool", "gatekeep", "routemate"] as const;

// "About this machine" card in the Skills app
export const systemInfo = [
  { k: "Model", v: "HamzaOS 1.0 — Hamza Alkhaldi" },
  { k: "Processor", v: "B.S. Computer Science, American University of Bahrain" },
  { k: "Co-processor", v: "Full-Stack Development Program, Reboot Coding Institute (01Edu)" },
  { k: "Graphics", v: "Kotlin · Jetpack Compose · React Native" },
  { k: "Storage", v: "8 projects · 1 IEEE conference paper" },
  { k: "Network", v: "Bahrain 🇧🇭 · Morocco 🇲🇦 · open to relocate" },
] as const;
