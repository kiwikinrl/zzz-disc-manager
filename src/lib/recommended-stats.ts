import statsData from "../resources/stats.json";
import { getRecommendations } from "./recommend";
import type { Recommendation } from "./types";
import type { DiscStatKeepResult } from "./stat-utils";
import { DISC_KEEP_SLOT_KEYS, resolveStat, splitStatTokens } from "./stat-utils";

interface StatsFile {
  main?: Record<string, string[]>;
  subs?: string[];
  canonical?: Record<string, string>;
}

const stats = statsData as unknown as StatsFile;
const recommendations = getRecommendations();

// Constant attribute DMG bonus key, used alongside element:<name> keys.
export const ATTRIBUTE_DMG_KEY = "attributedmg";

/**
 * Gather the union of stats across all characters that have "Stats Required by Characters" entries.
 * Returns the "Recommend to Keep" lists per disc slot and sub stats.
 */
export function getKeepStats(recs: Recommendation[] = recommendations): DiscStatKeepResult {
  const keepBySlot: Record<string, string[]> = {};
  for (const slot of DISC_KEEP_SLOT_KEYS) keepBySlot[slot] = [];
  const keepSubs: string[] = [];

  for (const recommendation of recs) {
    const discStat = recommendation["disc-stat"];
    if (!discStat) continue;

    for (const slot of DISC_KEEP_SLOT_KEYS) {
      const raw = discStat[slot];
      if (typeof raw !== "string") continue;
      const list = keepBySlot[slot];
      for (const token of splitStatTokens(raw)) {
        const display = resolveStat(token).display;
        if (!list.includes(display)) list.push(display);
      }
    }

    if (typeof discStat.subs === "string") {
      for (const token of splitStatTokens(discStat.subs)) {
        const display = resolveStat(token).display;
        if (!keepSubs.includes(display)) keepSubs.push(display);
      }
    }
  }

  return {
    slot4: keepBySlot.slot4,
    slot5: keepBySlot.slot5,
    slot6: keepBySlot.slot6,
    subs: keepSubs,
  };
}

function computeSlotDismantle(slot: string, keepList: string[]): string[] {
  const baseList = getSelectableMainStatKeys(slot);
  const keepKeys = new Set(keepList.map((stat) => resolveStat(stat).key));
  const keepHasElementDmg = [...keepKeys].some((key) => key.startsWith("element:"));

  const result: string[] = [];
  for (const stat of baseList) {
    const { key } = resolveStat(stat);
    let wanted = keepKeys.has(key);
    // Element based DMG% ("Fire DMG%", "Ice DMG%", ...) is the selectable DMG stat,
    // e.g. the generic "Attribute DMG Bonus%" offered for the slot. The generic stat is
    // only wanted (i.e. kept) when characters actually require an element based DMG%.
    if (!wanted && key === ATTRIBUTE_DMG_KEY) {
      wanted = keepHasElementDmg;
    }
    if (wanted) continue;
    if (!result.includes(stat)) result.push(stat);
  }
  return result;
}

/**
 * Compute the "Recommend for Dismantle" lists by subtracting the
 * "Recommend to Keep" lists from the selectable stats base in stats.json.
 */
export function getDismantleStats(keep: DiscStatKeepResult): DiscStatKeepResult {
  const dismantle: DiscStatKeepResult = { slot4: [], slot5: [], slot6: [], subs: [] };

  dismantle.slot4 = computeSlotDismantle("slot4", keep.slot4);
  dismantle.slot5 = computeSlotDismantle("slot5", keep.slot5);
  dismantle.slot6 = computeSlotDismantle("slot6", keep.slot6);

  const keepSubKeys = new Set(keep.subs.map((stat) => resolveStat(stat).key));
  const subBase = getSelectableSubStatKeys();
  for (const stat of subBase) {
    const { key } = resolveStat(stat);
    if (keepSubKeys.has(key)) continue;
    if (!dismantle.subs.includes(stat)) dismantle.subs.push(stat);
  }

  return dismantle;
}

/** Main-stat selectable list per disc slot (from stats.json), as display names. */
export function getSelectableMainStatKeys(slot: string): string[] {
  const list = stats.main?.[slot] ?? [];
  return list.map((stat) => resolveStat(stat).display);
}

/** Sub-stat selectable list (from stats.json), as display names. */
export function getSelectableSubStatKeys(): string[] {
  const list = stats.subs ?? [];
  return list.map((stat) => resolveStat(stat).display);
}


