import type { Project, ImageSlot } from "./types";

// All entries are status "draft": written by Claude from Hamza's résumé, LinkedIn, repos and reports.
// Hamza approves or edits each one, then flips it to "approved".
// Order of this array = order in the Projects folder.

const ph = (slug: string, file: string, alt: string, caption?: string): ImageSlot => ({
  src: `/images/projects/${slug}/${file}`,
  alt,
  placeholder: true,
  caption,
});

const gh = (slug: string, alt: string, caption?: string): ImageSlot => ({
  src: `/images/projects/${slug}/og.png`,
  alt,
  placeholder: false,
  caption,
});

export const projects: Project[] = [
  // ───────────────────────────────────────────────────────────────── Anchor
  {
    slug: "anchor",
    name: "Anchor",
    pitch:
      "An AI navigator that helps immigrant families get fair school placement in the U.S. — in their own language.",
    categories: ["AI/ML", "Web"],
    year: "2026",
    proof: { icon: "hackathon", text: "USAII Global AI Hackathon 2026" },
    cover: gh("anchor", "Anchor repository preview"),
    media: [
      ph("anchor", "01-language.webp", "Language picker with seven languages", "Families start in their own language"),
      ph("anchor", "02-intake.webp", "Step-by-step intake wizard", "Intake wizard: country, grade, district"),
      ph("anchor", "03-results.webp", "Results panel with curriculum gap and federal programmes", "Curriculum gap, rights and programmes"),
      ph("anchor", "04-chat.webp", "Contextual AI chat about the family's results", "Ask follow-up questions in context"),
    ],
    metrics: [
      { value: "7", label: "languages supported" },
      { value: "12", label: "home-country curricula mapped" },
      { value: "10", label: "federal rights indexed for retrieval" },
    ],
    problem:
      "Immigrant children in the U.S. are usually placed in school by age, not by what they already know, and their parents rarely know which programmes they qualify for or how to ask for a proper assessment.",
    built: [
      "Built the entire React + Vite frontend: a language selector, a multi-step intake wizard, a reasoning screen, the results panel and a contextual chat with the AI.",
      "Translated the whole interface into 7 languages (English, Spanish, Arabic, Chinese, French, Filipino and Vietnamese).",
      "Connected the UI to a FastAPI backend that combines a curriculum-gap classifier with a RAG pipeline (LlamaIndex + ChromaDB) over federal rights, district and tutoring data, reasoned over by Claude.",
      "Added a one-command setup so judges could run the full stack with `npm run dev`.",
    ],
    impact: [
      "Gives a parent, in their own language, the curriculum gap, the programmes their child likely qualifies for (Title I, ESL/ELL, IDEA, Head Start) and a plain-language script to request an assessment.",
      "Designed around responsible AI: it surfaces rights and options only, and parents and counsellors make every decision.",
    ],
    role: "Frontend lead — designed and built the full user interface and its integration with the AI backend",
    team: { todo: "Third teammate's name — team of 3: Hamza, Hana Wahban and ___" },
    timeline: "June 2026 · hackathon weekend",
    context: "USAII Global AI Hackathon 2026 · Undergraduate Track · Public Services challenge",
    stack: ["React", "Vite", "JavaScript", "FastAPI", "Python", "Claude API", "LlamaIndex", "ChromaDB", "RAG"],
    github: "https://github.com/backon74/anchor",
    demo: { todo: "Live demo URL or demo video (optional)" },
    status: "draft",
  },

  // ─────────────────────────────────────────────────────────────── SmartCool
  {
    slug: "smartcool",
    name: "SmartCool",
    pitch: "An occupancy-aware A/C controller that only cools the rooms people are actually in.",
    categories: ["AI/ML", "Systems"],
    year: "2026",
    proof: { icon: "award", text: "2nd Place / 250+ · GSR Hackathon 2026" },
    cover: ph("smartcool", "cover.webp", "SmartCool ESP32 prototype and its live dashboard"),
    media: [
      ph("smartcool", "01-prototype.webp", "ESP32 board wired to occupancy sensors", "The ESP32 prototype"),
      ph("smartcool", "02-dashboard.webp", "Flask dashboard showing live occupancy and A/C state", "Live Flask dashboard"),
      ph("smartcool", "03-award.webp", "Team receiving 2nd place in the Energy Track", "2nd place, Energy Track"),
    ],
    metrics: [
      { value: "2nd / 250+", label: "GSR Hackathon, Energy Track" },
      { value: "SAR 20,000", label: "prize" },
      { value: "~10%", label: "projected A/C energy savings" },
    ],
    problem:
      "In Gulf homes, air-conditioning runs in empty rooms for hours and is one of the biggest drivers of household electricity use.",
    built: [
      "An ESP32 controller (Arduino C++) that reads occupancy sensors and switches cooling per room.",
      "A live Flask dashboard that shows occupancy and A/C state in real time.",
      "Prediction models trained on data from 240 real homes, used to simulate savings in Saudi villas.",
    ],
    impact: [
      "Projected about 10% A/C energy savings in simulated Saudi villas.",
      "Won 2nd place and SAR 20,000 in the Energy Track at the GSR Hackathon 2026 at KFUPM.",
    ],
    role: { todo: "Your role on SmartCool (e.g. built the ML models / firmware / dashboard)" },
    team: { todo: "Team size and teammates" },
    timeline: { todo: "Month(s) in 2026" },
    context: "GSR Hackathon 2026 · KFUPM, Saudi Arabia · Energy Track",
    stack: ["ESP32", "Arduino C++", "Python", "Flask", "Machine Learning", "IoT sensors"],
    github: { todo: "GitHub link for SmartCool, or null if private" },
    demo: null,
    status: "draft",
  },

  // ──────────────────────────────────────────────────────────────── GateKeep
  {
    slug: "gatekeep",
    name: "GateKeep",
    pitch: "A serverless Azure system that reads licence plates at a campus gate and decides access automatically.",
    categories: ["Cloud", "AI/ML"],
    year: "2026",
    proof: { icon: "course", text: "100% validation success in testing" },
    cover: ph("gatekeep", "cover.webp", "GateKeep multi-tier Azure architecture diagram"),
    media: [
      {
        src: "/images/projects/gatekeep/architecture.jpg",
        alt: "Azure architecture: App Service, Functions, AI Vision, Blob Storage and SQL Database inside a VNet with app and data subnets, NSGs, Application Insights, Azure Monitor and Entra ID",
        placeholder: false, // provided — copy from the kit's assets folder
        caption: "Multi-tier architecture with VNet/NSG isolation",
      },
      {
        src: "/images/projects/gatekeep/workflow.jpg",
        alt: "Workflow: camera image to Blob Storage, which triggers a Function that calls AI Vision OCR, checks Azure SQL, then grants access or flags for review; results appear on the admin dashboard",
        placeholder: false,
        caption: "From camera to access decision",
      },
      ph("gatekeep", "03-dashboard.webp", "Admin dashboard listing gate entries", "Role-based admin dashboard"),
    ],
    metrics: [
      { value: "100%", label: "access-validation success in testing" },
      { value: "3.7 s", label: "warm latency (vs 30 s cold start)" },
      { value: "~$25.81", label: "estimated monthly cost" },
    ],
    problem:
      "University gates relied on manual security checks to verify vehicles — slow, inconsistent and hard to audit.",
    built: [
      "A multi-tier Azure architecture: App Service, Functions, Blob Storage, SQL Database, and a VNet with separate app and data subnets protected by NSGs.",
      "An end-to-end OCR pipeline: a gate-camera image in Blob Storage triggers an Azure Function, which reads the plate with Azure AI Vision and validates it against Azure SQL.",
      "Automatic decisions — access granted or flagged for review — all logged and visible in a role-based admin dashboard secured with Entra ID.",
      "A security layer (RBAC, encryption, network isolation), monitoring with Application Insights and Azure Monitor, plus performance testing and a full cost analysis.",
    ],
    impact: [
      "100% success rate on access validation in testing; deployed and fully functional.",
      "Benchmarked 3.7 s warm vs 30 s cold-start latency at about $25.81 per month.",
    ],
    role: { todo: "Your part of GateKeep (e.g. Functions + OCR pipeline, networking, dashboard)" },
    team: "3 (Hamza, Hana and Alya)",
    timeline: "Mar – Apr 2026",
    context: "Cloud Computing course · American University of Bahrain",
    stack: [
      "Python",
      "Azure Functions",
      "Azure AI Vision (OCR)",
      "Azure SQL Database",
      "Blob Storage",
      "App Service",
      "Entra ID (RBAC)",
      "VNet / NSG",
      "Application Insights",
    ],
    github: { todo: "GitHub link for GateKeep, or null if private" },
    demo: null,
    status: "draft",
  },

  // ─────────────────────────────────────────────────────────────── RouteMate
  {
    slug: "routemate",
    name: "RouteMate",
    pitch: "A carpooling app that lets university students post, find and book rides to campus.",
    categories: ["Mobile"],
    year: { todo: "Year, e.g. 2025 or 2026" },
    proof: { icon: "course", text: "SWEN360 · Agile Scrum team" },
    cover: ph("routemate", "cover.webp", "RouteMate app screens on a phone"),
    media: [
      ph("routemate", "01-home.webp", "RouteMate home with available rides", "Find a ride"),
      ph("routemate", "02-map.webp", "Route shown on Google Maps", "Route visualisation"),
      ph("routemate", "03-booking.webp", "Booking screen with seat availability", "Book a seat"),
      ph("routemate", "04-rating.webp", "Driver rating screen", "Rate your driver"),
    ],
    metrics: [
      { value: "5", label: "core flows: post, book, seats, notify, rate" },
      { value: "3", label: "design patterns: MVC, Observer, Repository" },
    ],
    problem:
      "Students travelling to the same campus at the same times had no easy or trusted way to share rides.",
    built: [
      "A React Native app for posting and booking rides, with live seat availability, notifications and driver ratings.",
      "An MVC architecture with Observer and Repository patterns to keep the app modular and maintainable.",
      "Firebase Authentication and Firestore for users and data, and the Google Maps API for route visualisation.",
      "Backend logic and secure ride-booking validation, built as part of an Agile Scrum team.",
    ],
    impact: [
      { todo: "Any outcome: grade, demo day, users tested, etc." },
    ],
    role: "Backend and booking-validation developer in an Agile Scrum team",
    team: { todo: "Team size" },
    timeline: { todo: "Semester, e.g. 'Spring 2026'" },
    context: "SWEN360 · American University of Bahrain",
    stack: ["React Native", "Firebase Auth", "Firestore", "Google Maps API", "JavaScript", "MVC"],
    github: { todo: "GitHub link for RouteMate" },
    demo: { todo: "Expo link or demo video (optional)" },
    status: "draft",
  },

  // ──────────────────────────────────────────────────────── MARBERTv2 paper
  {
    slug: "marbertv2",
    name: "Arabic Dialect ID (IEEE paper)",
    pitch: "Fine-tuned MARBERTv2 to identify four Arabic dialects at 89.8% accuracy — published at IEEE ETECOM 2026.",
    categories: ["AI/ML"],
    year: "2026",
    proof: { icon: "paper", text: "IEEE ETECOM 2026 · oral" },
    cover: { src: "/images/research/fig-accuracy-vs-cost.png", alt: "Accuracy versus training-time chart from the paper", placeholder: false },
    media: [],
    metrics: [
      { value: "89.83%", label: "accuracy (± 0.42)" },
      { value: "+4.15 pts", label: "over the best classical model" },
    ],
    problem: "See Research app.",
    built: [],
    impact: [],
    role: "Co-author",
    team: "3 authors",
    timeline: "2026",
    context: "IEEE ETECOM 2026 · Paris, France",
    stack: ["Python", "PyTorch", "Hugging Face Transformers", "scikit-learn"],
    github: "https://github.com/backon74/MARBERTv2-Arabic-Dialect-ID-IADD",
    demo: null,
    opensApp: "research",
    status: "draft",
  },

  // ──────────────────────────────────────────────────────── Real-Time Forum
  {
    slug: "real-time-forum",
    name: "Real-Time Forum",
    pitch: "A single-page forum with live private messaging — Go backend, WebSockets and no frameworks.",
    categories: ["Web", "Systems"],
    year: "2026",
    proof: { icon: "course", text: "Reboot01 · 01Edu programme" },
    cover: ph("real-time-forum", "cover.webp", "Forum feed with the online-users list and an open chat"),
    media: [
      ph("real-time-forum", "01-feed.webp", "Post feed with category filters", "Feed and categories"),
      ph("real-time-forum", "02-chat.webp", "Private chat with online presence", "Live private messages"),
      ph("real-time-forum", "03-auth.webp", "Register and log-in screen", "Register / log in"),
    ],
    metrics: [
      { value: "0", label: "frontend frameworks — vanilla JS SPA" },
      { value: "10", label: "messages per page, loaded on scroll" },
    ],
    problem:
      "Build a forum where people can post, comment and chat privately in real time, using only Go, SQLite and vanilla JavaScript.",
    built: [
      "A Go HTTP server with handlers for auth, posts, comments and messages, and a WebSocket hub for real-time delivery.",
      "Live online/offline presence and an always-visible user list ordered by most recent conversation, with unread notifications.",
      "Throttled, paginated chat history (10 messages at a time, loaded on scroll).",
      "Registration and login by nickname or email, with bcrypt-hashed passwords and session middleware.",
      "A single-page vanilla-JS frontend with client-side routing; the SQLite schema is created automatically on first start.",
    ],
    impact: ["Lead developer on a 3-person team — wrote most of the codebase."],
    role: "Lead developer (backend and real-time messaging)",
    team: "3",
    timeline: "May – Sep 2026",
    context: "Reboot Coding Institute · Full-Stack Development Program",
    stack: ["Go", "WebSockets", "SQLite", "JavaScript", "HTML/CSS", "bcrypt"],
    github: { todo: "Public GitHub mirror (the original lives on Reboot's private Gitea) — or null" },
    demo: null,
    status: "draft",
  },

  // ───────────────────────────────────────────────────────── Reboot Shooter
  {
    slug: "reboot-shooter",
    name: "Reboot Shooter",
    pitch: "A 60 FPS zombie-survival shooter built in plain HTML, CSS and JavaScript — no canvas, no frameworks.",
    categories: ["Web"],
    year: "2026",
    proof: { icon: "course", text: "Reboot01 · make-your-game" },
    cover: ph("reboot-shooter", "cover.webp", "Top-down city map with the player and zombies"),
    media: [
      ph("reboot-shooter", "01-menu.webp", "Difficulty selection menu", "Pick a difficulty"),
      ph("reboot-shooter", "02-gameplay.webp", "Gameplay with HUD, hearts and score", "Gameplay and HUD"),
      ph("reboot-shooter", "03-pause.webp", "Pause menu", "Pause menu"),
    ],
    metrics: [
      { value: "60 FPS", label: "requestAnimationFrame game loop" },
      { value: "3", label: "rendering layers for performance" },
      { value: "3", label: "difficulty levels with saved best scores" },
    ],
    problem:
      "Make a smooth, jank-free browser game using only the DOM — no canvas and no game engine.",
    built: [
      "A delta-time game loop at 60 FPS with a minimal 3-layer DOM rendering setup.",
      "Zombie waves with chase AI, collisions against a scaled 4541 × 2310 px city map, and continuous movement and aiming.",
      "A HUD with lives and score, a full pause menu, and per-difficulty best scores saved in localStorage.",
    ],
    impact: ["Playable, smooth arcade game that stays at 60 FPS on standard laptops."],
    role: { todo: "Your part of Reboot Shooter (e.g. zombie AI, collisions, HUD)" },
    team: "3 (Hamza, Shaikha and Qasim Alnashaba)",
    timeline: "Feb – Jun 2026",
    context: "Reboot Coding Institute · Full-Stack Development Program",
    stack: ["JavaScript", "HTML", "CSS", "DOM sprite sheets", "localStorage"],
    github: { todo: "Public GitHub mirror — or null" },
    demo: { todo: "GitHub Pages link if you publish it (recommended — it's playable!)" },
    status: "draft",
  },

  // ───────────────────────────────────────────────────────── GraphQL Profile
  {
    slug: "graphql-profile",
    name: "GraphQL Profile",
    pitch: "A live profile dashboard that logs in with JWT, queries GraphQL and draws its own SVG charts.",
    categories: ["Web"],
    year: "2026",
    proof: { icon: "live", text: "Live on GitHub Pages" },
    cover: gh("graphql-profile", "GraphQL profile repository preview"),
    media: [
      ph("graphql-profile", "01-login.webp", "Login screen", "JWT login"),
      ph("graphql-profile", "02-profile.webp", "Profile with XP and audits", "Profile and stats"),
      ph("graphql-profile", "03-graphs.webp", "Hand-drawn SVG graphs", "SVG graphs, no chart library"),
    ],
    metrics: [
      { value: "2", label: "SVG graphs drawn by hand from live data" },
      { value: "0", label: "frameworks or build steps" },
    ],
    problem:
      "Show a student's progress on the Reboot01 platform as a clear profile page using the platform's GraphQL API.",
    built: [
      "Login with username or email using JWT, with session persistence and logout.",
      "Normal, nested and argument-based GraphQL queries for identity, XP, audits and recent projects.",
      "Two SVG graphs — cumulative XP over time and audit ratio — drawn from query data without a chart library.",
    ],
    impact: ["Deployed and used live on GitHub Pages."],
    role: "Solo developer",
    team: "Solo",
    timeline: "Aug – Sep 2026",
    context: "Reboot Coding Institute · Full-Stack Development Program",
    stack: ["JavaScript (ES modules)", "GraphQL", "JWT", "SVG", "HTML/CSS"],
    github: "https://github.com/backon74/graphql",
    demo: "https://backon74.github.io/graphql/",
    status: "draft",
  },

  // ─────────────────────────────────────────────────────── ISCMUN II website
  {
    slug: "iscmun",
    name: "ISCMUN II Website",
    pitch: "The official website for a Model United Nations conference, built as its Head of IT.",
    categories: ["Web"],
    year: "2023",
    proof: { icon: "live", text: "5,000+ visits" },
    cover: ph("iscmun", "cover.webp", "ISCMUN II conference website home page"),
    media: [],
    metrics: [{ value: "5,000+", label: "visits" }],
    problem: "The conference needed one place for delegates to find committees, schedules and registration.",
    built: ["Designed and built the conference website as Head of IT for ISCMUN II."],
    impact: ["Reached more than 5,000 visits."],
    role: "Head of IT — designer and developer",
    team: { todo: "Solo or team?" },
    timeline: { todo: "Month/year, e.g. 'Early 2023'" },
    context: "International School of Choueifat · Model United Nations",
    stack: [{ todo: "Tech used, e.g. HTML/CSS/JS or Wix" }],
    github: null,
    demo: null,
    status: "draft",
  },
];
