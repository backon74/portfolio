"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { AppId } from "./store";

export type AppPayload = Record<string, unknown> | undefined;

export type AppComponent = ComponentType<{ payload?: AppPayload }>;

export type AppRegistryEntry = {
  id: AppId;
  title: string;
  component: AppComponent;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  singleInstance: boolean;
};

const WelcomeApp = dynamic(() => import("@/components/apps/Welcome"), { ssr: false });
const FilesApp = dynamic(() => import("@/components/apps/Files"), { ssr: false });
const CaseStudyApp = dynamic(() => import("@/components/apps/CaseStudy"), { ssr: false });
const ResearchApp = dynamic(() => import("@/components/apps/Research"), { ssr: false });
const SkillsApp = dynamic(() => import("@/components/apps/Skills"), { ssr: false });
const HamzaApp = dynamic(() => import("@/components/apps/Hamza"), { ssr: false });
const PhotosApp = dynamic(() => import("@/components/apps/Photos"), { ssr: false });
const ResumeApp = dynamic(() => import("@/components/apps/Resume"), { ssr: false });
const MailApp = dynamic(() => import("@/components/apps/Mail"), { ssr: false });
const AboutOsApp = dynamic(() => import("@/components/apps/AboutOs"), { ssr: false });
const ShortcutsApp = dynamic(() => import("@/components/apps/Shortcuts"), { ssr: false });

export const APPS: Record<AppId, AppRegistryEntry> = {
  welcome: {
    id: "welcome",
    title: "Welcome.txt",
    component: WelcomeApp,
    defaultSize: { w: 560, h: 420 },
    minSize: { w: 360, h: 280 },
    singleInstance: true,
  },
  files: {
    id: "files",
    title: "Files",
    component: FilesApp,
    defaultSize: { w: 960, h: 620 },
    minSize: { w: 640, h: 420 },
    singleInstance: true,
  },
  caseStudy: {
    id: "caseStudy",
    title: "Case Study",
    component: CaseStudyApp,
    defaultSize: { w: 860, h: 700 },
    minSize: { w: 560, h: 440 },
    singleInstance: false,
  },
  research: {
    id: "research",
    title: "Research",
    component: ResearchApp,
    defaultSize: { w: 900, h: 700 },
    minSize: { w: 600, h: 460 },
    singleInstance: true,
  },
  skills: {
    id: "skills",
    title: "Skills",
    component: SkillsApp,
    defaultSize: { w: 720, h: 560 },
    minSize: { w: 520, h: 400 },
    singleInstance: true,
  },
  hamza: {
    id: "hamza",
    title: "Hamza",
    component: HamzaApp,
    defaultSize: { w: 820, h: 620 },
    minSize: { w: 540, h: 440 },
    singleInstance: true,
  },
  photos: {
    id: "photos",
    title: "Photos",
    component: PhotosApp,
    defaultSize: { w: 900, h: 620 },
    minSize: { w: 560, h: 420 },
    singleInstance: true,
  },
  resume: {
    id: "resume",
    title: "Résumé.pdf",
    component: ResumeApp,
    defaultSize: { w: 760, h: 860 },
    minSize: { w: 500, h: 500 },
    singleInstance: true,
  },
  mail: {
    id: "mail",
    title: "Mail",
    component: MailApp,
    defaultSize: { w: 600, h: 520 },
    minSize: { w: 440, h: 400 },
    singleInstance: true,
  },
  aboutOs: {
    id: "aboutOs",
    title: "About HamzaOS",
    component: AboutOsApp,
    defaultSize: { w: 420, h: 300 },
    minSize: { w: 360, h: 260 },
    singleInstance: true,
  },
  shortcuts: {
    id: "shortcuts",
    title: "Keyboard shortcuts",
    component: ShortcutsApp,
    defaultSize: { w: 460, h: 440 },
    minSize: { w: 360, h: 320 },
    singleInstance: true,
  },
};

export function getApp(id: AppId): AppRegistryEntry {
  return APPS[id];
}
