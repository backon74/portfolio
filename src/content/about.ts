import type { ImageSlot } from "./types";

const ph = (path: string, alt: string): ImageSlot => ({ src: `/images/${path}`, alt, placeholder: true });

// ── Hamza app ───────────────────────────────────────────────────────────────
// DRAFT: written by Claude from your CVs, report and paper. Hobby blurbs are tone suggestions — rewrite in your own words.
export const bio = {
  short:
    "I'm a Bahraini-Moroccan software engineer in my final year of Computer Science at AUBH. I like building things people actually use — from Batelco's Android app to an AI that helps immigrant families navigate U.S. schools.",
  paragraphs: [
    "I grew up in Muharraq, Bahrain, with Moroccan roots, and I've been building for the web since school, when I made the website for our Model United Nations conference and watched it pass 5,000 visits.",
    "At the American University of Bahrain I study Computer Science, tutor other students in programming, maths, physics and writing, and co-authored a paper on Arabic dialect identification that I presented at IEEE ETECOM 2026 in Paris. Alongside my degree, I'm in Reboot01's project-based full-stack programme, writing Go, JavaScript and Rust.",
    "This summer I interned on Batelco's Android team. I learned Kotlin and Jetpack Compose from scratch, then shipped fixes to their production app during its major revamp. That's where I found what I enjoy most: mobile and front-end engineering, where a design decision becomes something people hold in their hands.",
    "Next, I'm looking for a graduate software engineering role — ideally in mobile — and later I'd like to do a Master's in AI/ML.",
  ],
  quickFacts: [
    { k: "Based in", v: "Muharraq, Bahrain 🇧🇭" },
    { k: "Roots", v: "Morocco 🇲🇦" },
    { k: "Studying", v: "B.S. Computer Science, AUBH (senior year)" },
    { k: "Languages", v: "English (IELTS 8.0), Arabic" }, // TODO(hamza): add French/Darija or others if you speak them
    { k: "Looking for", v: "Graduate software engineering roles · mobile" },
    { k: "Next goal", v: "Master's in AI / Machine Learning" },
  ],
} as const;

export const hobbies = [
  {
    id: "game-design",
    title: "Game design & scripting",
    text: "I design and script games for fun — and at Reboot01 I co-built a 60 FPS zombie shooter with no game engine at all.",
    image: ph("hobbies/game-design.webp", "Game design work"),
  },
  {
    id: "fashion",
    title: "Fashion design & sewing",
    text: "I design and sew my own pieces. It's the same loop as coding: sketch, build, test the fit, iterate.",
    image: ph("hobbies/fashion.webp", "A garment Hamza designed and sewed"),
  },
  {
    id: "weightlifting",
    title: "Weightlifting",
    text: "Lifting keeps me disciplined — small, consistent progress beats occasional big efforts.",
    image: ph("hobbies/weightlifting.webp", "Weightlifting"),
  },
  {
    id: "mun",
    title: "Model UN & debate",
    text: "Years of Model United Nations taught me to research fast, argue clearly and speak in front of a room.",
    image: ph("hobbies/mun.webp", "Hamza speaking at a Model United Nations conference"),
  },
] as const;

export const awards = [
  {
    id: "gsr",
    title: "2nd Place, Energy Track — GSR Hackathon 2026",
    org: "KFUPM, Saudi Arabia",
    detail: "SmartCool · out of 250+ · SAR 20,000 prize", // TODO(hamza): 250+ teams or participants?
    image: ph("awards/gsr-2026.webp", "GSR Hackathon 2026 award"),
  },
  {
    id: "etecom",
    title: "Oral presentation — IEEE ETECOM 2026",
    org: "Paris, France",
    detail: "Certificate of appreciation as an author",
    image: ph("awards/etecom-2026.webp", "ETECOM 2026 certificate"),
  },
  {
    id: "mun-delegate",
    title: "4× Best Delegate",
    org: "Model United Nations conferences, Bahrain",
    detail: "",
    image: ph("awards/best-delegate.webp", "Best Delegate award"),
  },
  {
    id: "mun-speaker",
    title: "2× Best Speaker",
    org: "Model United Nations conferences, Bahrain",
    detail: "",
    image: ph("awards/best-speaker.webp", "Best Speaker award"),
  },
] as const;

// ── Trips & Photos ──────────────────────────────────────────────────────────
// TODO(hamza): replace with your real trips. Each album id is a folder under /public/images/photos/<id>/
export const albums = [
  {
    id: "paris-2026",
    title: "Paris",
    subtitle: "Oct 2026 · ETECOM", // TODO(hamza): only keep if you were there in person
    cover: ph("photos/paris-2026/cover.webp", "Paris"),
    photos: [1, 2, 3, 4, 5, 6].map((n) => ph(`photos/paris-2026/${n}.webp`, `Paris photo ${n}`)),
  },
  {
    id: "morocco",
    title: "Morocco",
    subtitle: "Family roots",
    cover: ph("photos/morocco/cover.webp", "Morocco"),
    photos: [1, 2, 3, 4, 5, 6].map((n) => ph(`photos/morocco/${n}.webp`, `Morocco photo ${n}`)),
  },
  {
    id: "trip-3",
    title: "Trip 3",
    subtitle: "TODO(hamza)",
    cover: ph("photos/trip-3/cover.webp", "Trip 3"),
    photos: [1, 2, 3, 4].map((n) => ph(`photos/trip-3/${n}.webp`, `Trip 3 photo ${n}`)),
  },
] as const;
