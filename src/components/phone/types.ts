export type PhoneAppId =
  | "welcome"
  | "files"
  | "caseStudy"
  | "research"
  | "skills"
  | "hamza"
  | "photos"
  | "resume"
  | "mail";

export type PhoneRoute =
  | { kind: "home" }
  | {
      kind: "app";
      appId: PhoneAppId;
      title: string;
      payload?: Record<string, unknown>;
      iconId?: string; // for shared layout id (home grid item id)
    };
