// Fetch wrapper with an abortable timeout. Default 4 s per CLAUDE.md rule 9.
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 4000,
): Promise<Response> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(input, { ...init, signal: ac.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}
