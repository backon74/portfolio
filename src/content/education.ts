import type { School } from "./types";

const logo = (id: string, alt: string) => ({ src: `/images/logos/${id}.webp`, alt, placeholder: true });

export const education: School[] = [
  {
    id: "aubh",
    name: "American University of Bahrain",
    short: "AUBH",
    location: "Riffa, Bahrain",
    start: "Sep 2023",
    end: "Present", // TODO(hamza): replace with expected graduation once confirmed in site.ts
    credential: "B.S. in Computer Science · College of Computing & Engineering",
    grade: "cGPA 3.5",
    highlights: [
      "Peer Tutor for Data Structures & Programming, Calculus I–II, Physics and Composition I–II.",
      "Co-authored an IEEE ETECOM 2026 paper on Arabic dialect identification with AUBH faculty.",
      "Internship: Batelco by Beyon, Android development (Jul – Sep 2026).",
      // TODO(hamza): confirm Dean's List status (old CV said "every semester") before adding it back.
    ],
    logo: logo("aubh", "American University of Bahrain logo"),
  },
  {
    id: "reboot",
    name: "Reboot Coding Institute",
    short: "Reboot01",
    location: "Seef, Bahrain",
    start: "Apr 2025",
    end: "Present",
    credential: "Full-Stack Development Program (01Edu diploma)",
    highlights: [
      "Selective, project-based and peer-to-peer programme in full-stack development, networking and databases (Go, JavaScript, Rust).",
      "Built a real-time forum, a 60 FPS browser game, a GraphQL profile app, a TCP chat server and more — all reviewed by peers.",
    ],
    logo: logo("reboot", "Reboot Coding Institute logo"),
  },
  {
    id: "choueifat",
    name: "International School of Choueifat",
    short: "ISC",
    location: "Muharraq, Bahrain",
    start: "2009",
    end: "Jun 2023",
    credential: "High school",
    grade: "Cumulative 90%",
    highlights: [
      "IELTS Band 8.0 · A in IGCSE Computer Science.",
      "Senior Prefect of Technology and Head of IT for ISCMUN II.",
      "4× Best Delegate and 2× Best Speaker at Model United Nations conferences in Bahrain.",
    ],
    logo: logo("choueifat", "International School of Choueifat logo"),
  },
];
