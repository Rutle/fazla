// equipmentTypes.ts

export interface Equipment {
  fits: Fits;
  image: string;
  misc: Misc;
  nationality: string;
  tiers: Tier[];
  type: EquipmentType;
  id: string;
  wikiUrl: string;
  category: string;
  names: Names;
}

export interface Fits {
  destroyer: string | null;
  lightCruiser: string | null;
  heavyCruiser: string | null;
  monitor: string | null;
  largeCruiser: string | null;
  battleship: string | null;
  battlecruiser: string | null;
  aviationBattleship: string | null;
  aircraftCarrier: string | null;
  lightCarrier: string | null;
  repairShip: string | null;
  munitionShip: string | null;
  submarine: string | null;
  submarineCarrier: string | null;
}

export interface Misc {
  blueprints: string;
  madeFrom: string[];
  notes: string;
  usedFor: string[];
  animation: string;
  obtainedFrom: string;
}

export interface Names {
  en: string;
  cn: string;
  jp: string;
  kr: string;
}

export interface Tier {
  tier: number;
  rarity: string;
  stars: Stars;
  stats: EqStats;
}

export interface Stars {
  stars: string;
  value: number;
}

export interface EqStats {
  firepower: Antiair;
  antiair: Antiair;
  damage: Coefficient;
  rateOfFire: Coefficient;
  spread: AmmoType;
  angle: AmmoType;
  range: Range;
  volley: Volley;
  volleyTime: AmmoType;
  coefficient: Coefficient;
  ammoType: AmmoType;
  characteristic: Antiair;
}

export interface AmmoType {
  type: string;
  value: string;
  unit: string;
  formatted: string;
}

export interface Antiair {
  type: string;
  formatted: string;
}

export interface Coefficient {
  type: string;
  min: string;
  max: string;
  formatted: string;
  multiplier?: string;
  per?: string;
}

export interface Range {
  type: string;
  firing: number;
  shell: number;
  formatted: string;
}

export interface Volley {
  type: string;
  multiplier: string;
  count: string;
  unit: string;
  formatted: string;
}

export interface EquipmentType {
  focus: string;
  name: string;
}
