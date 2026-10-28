import statsData from "../resources/stats.json";

interface StatsCanonical {
  canonical?: Record<string, string>;
}

const stats = statsData as unknown as StatsCanonical;

/** Canonical display name for each normalized stat key. Sourced from stats.json. */
export const STAT_CANONICAL_BY_KEY: Record<string, string> = stats.canonical ?? {};

/** Reverse lookup built from the canonical map: normalized display slug -> canonical key. */
export const STAT_KEY_BY_SLUG: Record<string, string> = {};
for (const [key, display] of Object.entries(STAT_CANONICAL_BY_KEY)) {
  STAT_KEY_BY_SLUG[display.trim().toLowerCase().replace(/[^a-z0-9]/g, "")] = key;
}

/** Attribute name for the generic "Attribute DMG Bonus%". */
export const ATTRIBUTE_DMG_KEY = "attributedmg";

/** Element attribute names that may appear before "DMG%" (case-insensitive). */
export const ELEMENT_DMG_PATTERN = /^(fire|ice|electric|wind|ether|physical)\s*dmg$/i;

export interface ResolvedStat {
  key: string;
  display: string;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function statSlug(display: string): string {
  return display.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function toCompactKey(words: string[], isPercent: boolean): string {
  const camel = words.map((w) => capitalize(w)).join("");
  const compact = camel.toLowerCase();
  return isPercent ? `${compact}%` : compact;
}

/** Default set of slots whose keep lists are computed for each disc. */
export const DISC_KEEP_SLOT_KEYS = ["slot4", "slot5", "slot6"] as const;

export interface DiscStatKeepResult {
  slot4: string[];
  slot5: string[];
  slot6: string[];
  subs: string[];
}

function canonicalize(display: string, fallbackKey: string): { key: string; display: string } {
  const key = STAT_KEY_BY_SLUG[statSlug(display)] ?? fallbackKey;
  const canonicalDisplay = Object.prototype.hasOwnProperty.call(STAT_CANONICAL_BY_KEY, key) ? STAT_CANONICAL_BY_KEY[key] : display;
  return { key, display: canonicalDisplay };
}

/**
 * Resolve a raw stat token into a comparable key + canonical display name.
 * - "Flat ATK"      -> { key: "flat:atk",        display: "Flat ATK" }
 * - "ATK"           -> { key: "flat:atk",        display: "Flat ATK" }
 * - "ATK%"          -> { key: "atkpct",           display: "ATK%" }
 * - "CRIT Rate%"    -> { key: "critrate",        display: "CRIT Rate%" }
 * - "Fire DMG%"     -> { key: "element:fire",    display: "Fire DMG%" }
 * - "Attribute DMG Bonus%" -> { key: "attributedmg", display: "Attribute DMG Bonus%" }
 */
export function resolveStat(raw: string): ResolvedStat {
  const token = (raw ?? "").trim().toLowerCase();

  const flatMatch = token.match(/^flat[\s_]+(.+)$/);
  if (flatMatch) {
    const base = flatMatch[1].trim().toLowerCase();
    const words = base.split(/[\s_\-]+/).filter((w) => w.length > 0);
    const display = `Flat ${words.map((w) => w.toUpperCase()).join(" ")}`;
    return { key: `flat:${base}`, display };
  }

  const isPercent = token.endsWith("%");
  const base = (isPercent ? token.slice(0, -1) : token).trim();
  const words = base.split(/[\s_\-]+/).filter((w) => w.length > 0);

  const elementMatch = base.match(ELEMENT_DMG_PATTERN);
  if (elementMatch) {
    const element = elementMatch[1].toLowerCase();
    // Element based DMG% (Fire/Ice/Ether/... DMG%) is kept as its own distinct stat,
    // e.g. "Fire DMG%" keyed via `element:fire`, while still referring to the
    // "Attribute DMG Bonus%" concept for the character's attribute.
    return { key: `element:${element}`, display: `${capitalize(element)} DMG%` };
  }

  const isAttributeDmg = words[0] === "attribute" || (words[0] !== "crit" && /dmg/i.test(token));
  if (isAttributeDmg) {
    // Generic attribute based DMG bonus, e.g. "Attribute DMG Bonus%".
    // Element based DMG% stats already resolved to their `element:<name>` key above,
    // so they never reach this branch. Any other DMG% keyword stat (e.g. bare "DMG%")
    // also refers to the attribute based DMG bonus.
    return { key: ATTRIBUTE_DMG_KEY, display: "Attribute DMG Bonus%" };
  }

  // A bare stat name without a value (e.g. "ATK", "PEN") refers to the flat variant.
  if (!isPercent && ["atk", "hp", "def", "pen"].includes(words.join(""))) {
    const display = `Flat ${words.map((w) => w.toUpperCase()).join(" ")}`;
    return { key: `flat:${words.join("")}`, display };
  }

  const compact = toCompactKey(words, isPercent);
  const candidateDisplay = `${words.map((w) => capitalize(w)).join("")}${isPercent ? "%" : ""}`;
  const resolved = canonicalize(candidateDisplay, compact);
  return { key: resolved.key, display: resolved.display };
}

/** Token separator for splitting requirement strings, with punctuation. */
export const STAT_TOKEN_SEPARATOR = /\(|\)|>=|<=|==|>>>|>>|>|=|</g;

export function splitStatTokens(raw: string): string[] {
  return raw
    .replace(/\(.*?\)/g, " ")
    .split(STAT_TOKEN_SEPARATOR)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}