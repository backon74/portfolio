import { NextResponse } from "next/server";

// /resume → the PDF file. 302 redirect as specified in PRD §2.
export function GET(req: Request) {
  return NextResponse.redirect(
    new URL("/resume/Hamza_Alkhaldi_Resume.pdf", req.url),
    302,
  );
}
