import type { EquippedDisc } from "./types";

export interface DisposalContext {
  recommendedFourPiece: string;
  recommendedTwoPiece: string[];
  importantSubStats: string[];
}

export function getDisposalCandidates(
  equippedDiscs: Record<string, EquippedDisc>,
  context: DisposalContext,
): EquippedDisc[] {
  const discList = Object.values(equippedDiscs);
  const copiesBySet = new Map<string, number>();
  for (const disc of discList) {
    copiesBySet.set(disc.set, (copiesBySet.get(disc.set) ?? 0) + 1);
  }

  const recommendedCopiesBySet = new Map<string, number>();
  if (context.recommendedFourPiece) {
    recommendedCopiesBySet.set(context.recommendedFourPiece, 4);
  }
  for (const set of context.recommendedTwoPiece) {
    recommendedCopiesBySet.set(set, 2);
  }

  const surplusBySet = new Map<string, number>();
  for (const [set, copies] of copiesBySet) {
    surplusBySet.set(set, Math.max(0, copies - (recommendedCopiesBySet.get(set) ?? 0)));
  }

  const candidates: EquippedDisc[] = [];
  for (const disc of discList) {
    const surplus = surplusBySet.get(disc.set) ?? 0;
    const hasUnimportantSubStat = disc.subStats.some((s) => !context.importantSubStats.includes(s.type));
    if (surplus > 0 || hasUnimportantSubStat) candidates.push(disc);
  }
  return candidates;
}
