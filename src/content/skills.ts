import type { SkillGroup } from "./types";

// usedIn = project slugs (projects.ts) or role ids (experience.ts). The Skills app links them.
export const skills: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "Kotlin", usedIn: ["batelco"] },
      { name: "Java", usedIn: [] },
      { name: "Go", usedIn: ["real-time-forum"] },
      { name: "Python", usedIn: ["marbertv2", "gatekeep", "smartcool", "anchor"] },
      { name: "JavaScript", usedIn: ["anchor", "routemate", "real-time-forum", "reboot-shooter", "graphql-profile"] },
      { name: "TypeScript", usedIn: ["portfolio"] }, // this site
      { name: "C++ (Arduino)", usedIn: ["smartcool"] },
      { name: "SQL", usedIn: ["gatekeep", "real-time-forum"] },
      { name: "HTML / CSS", usedIn: ["reboot-shooter", "graphql-profile", "iscmun"] },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    skills: [
      { name: "Jetpack Compose", usedIn: ["batelco"] },
      { name: "Android Studio", usedIn: ["batelco"] },
      { name: "React Native", usedIn: ["routemate"] },
      { name: "Firebase (Auth, Firestore)", usedIn: ["routemate"] },
      { name: "Google Maps API", usedIn: ["routemate"] },
      { name: "RTL & localisation", usedIn: ["batelco", "anchor"] },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    skills: [
      { name: "PyTorch", usedIn: ["marbertv2"] },
      { name: "Hugging Face Transformers", usedIn: ["marbertv2"] },
      { name: "scikit-learn", usedIn: ["marbertv2"] },
      { name: "LLM apps & RAG (LlamaIndex, ChromaDB)", usedIn: ["anchor"] },
      { name: "Claude API", usedIn: ["anchor"] },
      { name: "Azure AI Vision (OCR)", usedIn: ["gatekeep"] },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    skills: [
      { name: "Microsoft Azure (Functions, App Service, SQL, Blob, Entra ID, VNet)", usedIn: ["gatekeep"] },
      { name: "Docker", usedIn: [] },
      { name: "Git & GitHub", usedIn: ["batelco", "anchor", "real-time-forum"] },
      { name: "Vercel", usedIn: ["portfolio"] },
    ],
  },
  {
    id: "web",
    label: "Web & Backend",
    skills: [
      { name: "React", usedIn: ["anchor"] },
      { name: "Next.js", usedIn: ["portfolio"] },
      { name: "Flask", usedIn: ["smartcool"] },
      { name: "FastAPI", usedIn: ["anchor"] },
      { name: "WebSockets", usedIn: ["real-time-forum"] },
      { name: "GraphQL", usedIn: ["graphql-profile"] },
      { name: "SQLite", usedIn: ["real-time-forum"] },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    skills: [
      { name: "Figma", usedIn: ["batelco"] },
      { name: "Confluence", usedIn: ["batelco"] },
      { name: "Claude Code & Cursor", usedIn: ["batelco"] },
      { name: "IoT: ESP32 & sensors", usedIn: ["smartcool"] },
    ],
  },
];

// Recruiter View uses these grouped lists (no ratings, no bars).
export const recruiterSkills = {
  Languages: "Kotlin, Java, Go, Python, JavaScript/TypeScript, C++ (Arduino), SQL, HTML/CSS",
  Mobile: "Jetpack Compose, Android Studio, React Native, Firebase, Google Maps API",
  "AI / ML": "PyTorch, Hugging Face Transformers, scikit-learn, RAG (LlamaIndex, ChromaDB), Claude API",
  "Cloud & Tools": "Microsoft Azure, Docker, Git, Figma, Confluence",
} as const;
