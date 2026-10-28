import charactersData from "../resources/characters.json";
import discsData from "../resources/discs.json";
import imagesData from "../resources/images.json";
import recommendationsData from "../resources/recommend.json";
import type { Character, Disc, Recommendation } from "./types";

interface ResourceMeta {
  last_updated?: string;
  Contributors?: string[];
  Note?: string;
}

interface ImageEntry {
  name: string;
  img: string;
}

interface ImagesFile extends ResourceMeta {
  faction?: ImageEntry[];
  attribute?: ImageEntry[];
  specialty?: ImageEntry[];
}

interface CharactersFile extends ResourceMeta {
  characters: Character[];
}

interface DiscsFile extends ResourceMeta {
  discs: Disc[];
}

interface RecommendationsFile extends ResourceMeta {
  recommend: Recommendation[];
}

const characters = (charactersData as unknown as CharactersFile).characters;
const discs = (discsData as unknown as DiscsFile).discs;
const recommendations = (recommendationsData as unknown as RecommendationsFile).recommend;
const images = imagesData as unknown as ImagesFile;

export function getCharacters(): Character[] {
  return characters;
}

export function getDiscs(): Disc[] {
  return discs;
}

export function getDiscImage(disc: Disc | null | undefined): string {
  const path = disc?.img || disc?.default || "";
  if (!path) return "";
  if (/^(https?|data|blob):/i.test(path)) return path;
  const base = import.meta.env.BASE_URL || "/";
  const normalized = path.replace(/^\/+/, "");
  return `${base}${normalized}`;
}

export function getDiscBySet(set: string): Disc | undefined {
  return discs.find((d) => d.set === set);
}

export function getCharacterByName(name: string): Character | undefined {
  return characters.find((c) => c.character === name);
}

export function getRecommendations(): Recommendation[] {
  return recommendations;
}

export function getRecommendationsByCharacter(characterName: string): Recommendation[] {
  return recommendations.filter((r) => r.character.toLowerCase() === characterName.toLowerCase());
}

export function getImageForCategory(
  category: "faction" | "attribute" | "specialty",
  name: string,
): string {
  const entries = images[category] ?? [];
  const entry = entries.find((e) => e.name.toLowerCase() === name.toLowerCase());
  return entry?.img ?? "";
}

export interface RecommendedSets {
  fourPiece: string;
  twoPiece: string[];
  otherTwoPiece: string[];
}

export function getRecommendedSets(recommendation: Recommendation): RecommendedSets[] | null {
  const options = recommendation.disc ?? [];
  const sets = options
    .map((o) => ({
      fourPiece: o["4piece"],
      twoPiece: o["recommend-2piece"] ?? [],
      otherTwoPiece: o["other-2piece"] ?? [],
    }))
    .filter((s) => s.fourPiece);
  return sets.length > 0 ? sets : null;
}

export function getEngineNames(recommendation: Recommendation): string[] {
  return recommendation.engine ?? [];
}

