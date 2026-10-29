import charactersData from "../resources/characters.json";
import discsData from "../resources/discs.json";
import recommendationsData from "../resources/recommend.json";
import type { Build, Character, DatabaseShape, Disc, Recommendation } from "./types";

const DATABASE_KEY = "zzz-disc-manager:database";
const DATABASE_VERSION = "26.10.6 (alpha)";

interface CharactersFile {
  characters: Character[];
}

interface DiscsFile {
  discs: Disc[];
}

interface RecommendationsFile {
  recommend: Recommendation[];
}

export function createEmptyDatabase(): DatabaseShape {
  return {
    version: DATABASE_VERSION,
    collections: {
      characters: [],
      discs: [],
      recommendations: [],
      builds: [],
    },
  };
}

export function seedDatabase(): DatabaseShape {
  const database = createEmptyDatabase();
  database.collections.characters = (charactersData as unknown as CharactersFile).characters;
  database.collections.discs = (discsData as unknown as DiscsFile).discs;
  database.collections.recommendations = (recommendationsData as unknown as RecommendationsFile).recommend;
  return database;
}

export function loadDatabase(): DatabaseShape {
  const raw = localStorage.getItem(DATABASE_KEY);
  const database = createEmptyDatabase();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as DatabaseShape;
      if (parsed && parsed.collections) {
        database.version = parsed.version ?? DATABASE_VERSION;
        database.collections = {
          ...database.collections,
          ...parsed.collections,
        };
      }
    } catch {
      return seedDatabase();
    }
  }
  if (database.collections.builds.length === 0) {
    return seedDatabase();
  }
  return database;
}

export function saveDatabase(database: DatabaseShape): void {
  localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
}

export function upsertBuild(builds: Build[], build: Build): Build[] {
  const next = [...builds];
  const index = next.findIndex((b) => b.id === build.id);
  if (index >= 0) next[index] = build;
  else next.push(build);
  return next;
}

export function deleteBuild(builds: Build[], id: string): Build[] {
  return builds.filter((b) => b.id !== id);
}
