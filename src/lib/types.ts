export interface Character {
  character: string;
  img: string;
  faction: string;
  attribute: string;
  specialty: string;
  rarity: string;
}

export interface Disc {
  set: string;
  img: string;
  "2piece": string;
  "4piece": string;
  default?: string;
}

export interface DiscStat {
  slot4: string;
  slot5: string;
  slot6: string;
  subs: string;
}

export interface DiscOption {
  "4piece": string;
  "recommend-2piece": string[];
  "other-2piece": string[];
}

export interface Recommendation {
  character: string;
  engine: string[];
  disc: DiscOption[];
  "disc-stat": DiscStat;
  target: string[];
  importantSubStats?: string[];
}

export interface SubStat {
  type: string;
  value: number;
  rolls: number;
}

export interface MainStat {
  type: string;
  value: number;
}

export interface EquippedDisc {
  uid: string;
  slot: string;
  set: string;
  rarity: string;
  level: number;
  mainStat: MainStat;
  subStats: SubStat[];
  equippedBy: string;
  lock: boolean;
}

export interface CalculatedStats {
  hp: number;
  hppercent: number;
  atk: number;
  atkpercent: number;
  def: number;
  defpercent: number;
  impact: number;
  impactpercent: number;
  flatImpact: number;
  anomalyMastery: number;
  anomalyMasteryPercent: number;
  critRate: number;
  critDmg: number;
  anomalyProficiency: number;
  pen: number;
  penRatio: number;
  energyRegen: number;
  energyRegenPercent: number;
  sheerForce: number;
}

export interface WEngineEffectProperty {
  name: string;
  type: string;
  values?: Record<string, number>;
}

export interface WEngineEffect {
  name: string;
  description: string;
  properties?: WEngineEffectProperty[];
}

export interface WEngine {
  id: string;
  name: string;
  rarity: string;
  specialty: string;
  baseAtk: number;
  baseStatType: string;
  subStat: SubStat;
  effect: WEngineEffect;
  icon: string;
}

export interface Build {
  id: string;
  agentId: string;
  name: string;
  element: string;
  specialty: string;
  level: number;
  mindscapeLevel: number;
  wEngineRefinement: number;
  equippedDiscs: Record<string, EquippedDisc>;
  enabledDiscs: Record<string, boolean>;
  calculatedStats: CalculatedStats;
  score: number;
  createdAt: string;
  updatedAt: string;
  includeWEngineBonuses: boolean;
  includeMindscapeBonuses: boolean;
  includePassiveBonuses: boolean;
  equippedWEngine: WEngine;
}

export interface DatabaseShape {
  version: string;
  collections: {
    characters: Character[];
    discs: Disc[];
    recommendations: Recommendation[];
    builds: Build[];
  };
}
