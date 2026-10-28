import type { Build } from "./types";

const SOURCE_VERSION = "3.0";

export function exportBuildsToJson(builds: Build[]): string {
  return JSON.stringify(
    {
      version: SOURCE_VERSION,
      exportedAt: new Date().toISOString(),
      builds,
    },
    null,
    2,
  );
}

export function importBuildsFromJson(raw: string): Build[] {
  const parsed: unknown = JSON.parse(raw);
  const list: unknown[] = Array.isArray(parsed)
    ? parsed
    : ((parsed as { builds?: unknown[] })?.builds ?? []);
  const builds: Build[] = [];
  for (const entry of list) {
    const candidate = entry as Build;
    if (candidate && typeof candidate.id === "string") builds.push(candidate);
  }
  return builds;
}
