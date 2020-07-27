import shipData from '../data/ships.json';

// Generated by https://quicktype.io

export interface ShipData {
  ships: Ship[];
}

export interface ShipDataSimple {
  ships: ShipSimple[];
}

export interface ShipSimple {
  name: string;
  id: string;
  class: string;
  rarity?: string;
  hullType?: string;
  nationality?: string;
}

export interface Ship {
  wikiUrl?: string;
  id: string;
  names: ShipNames;
  class: string;
  nationality?: string;
  hullType?: string;
  thumbnail?: string;
  rarity?: string;
  stars?: Stars;
  stats?: Stats;
  slots?: { [key: string]: Slot };
  enhanceValue?: EnhanceValue;
  scrapValue?: ScrapValue;
  skills?: Skill[];
  limitBreaks?: Array<string[]>;
  fleetTech?: FleetTech;
  retrofit?: boolean;
  retrofitId?: string;
  retrofitProjects?: RetrofitProjects;
  construction?: Construction;
  obtainedFrom?: ObtainedFrom;
  misc?: Misc;
  skins?: Skin[];
  gallery?: Gallery[];
}

export interface Construction {
  constructionTime: string;
  availableIn: AvailableIn;
}

export interface AvailableIn {
  light: boolean;
  heavy: boolean;
  aviation: boolean;
  limited: boolean;
  exchange: boolean;
}

export interface EnhanceValue {
  firepower: number;
  torpedo: number;
  aviation: number;
  reload: number;
}

export interface FleetTech {
  statsBonus: StatsBonus;
  techPoints: TechPoints;
}

export interface StatsBonus {
  collection: Collection;
  maxLevel: Collection;
}

export interface Collection {
  applicable: string[];
  stat: string;
  bonus: string;
}

export interface TechPoints {
  collection: number;
  maxLimitBreak: number;
  maxLevel: number;
  total: number;
}

export interface Gallery {
  description: string;
  url: string;
}

export interface Misc {
  artist: string;
  web: Pixiv;
  pixiv: Pixiv;
  twitter: Pixiv;
  voice: Pixiv;
}

export interface Pixiv {
  name: string;
  url: string;
}

export interface ShipNames {
  en: string;
  code: string;
  cn: string;
  jp: string;
  kr: string;
}

export interface ObtainedFrom {
  fromMaps: string[];
}

export interface RetrofitProjects {
  A: A;
  B: A;
  C: A;
  D: A;
  E: A;
  F: A;
  G: A;
  H: A;
  I: A;
  J: A;
  K: A;
  L: A;
}

export interface A {
  name: string;
  attributes: string[];
  materials: string[];
  coins: number;
  level: number;
  levelBreakLevel: number;
  levelBreakStars: string;
  recurrence: number;
  require: string[];
}

export interface ScrapValue {
  coin: number;
  oil: number;
  medal: number;
}

export interface Skill {
  icon: string;
  names: SkillNames;
  description: string;
  color: string;
}

export interface SkillNames {
  en: string;
  cn: string;
  jp: string;
}

export interface Skin {
  name: string;
  image: string;
  background: string;
  chibi: string;
  info: Info;
}

export interface Info {
  obtainedFrom: string;
  live2dModel: boolean;
  enClient?: string;
  cnClient?: string;
  jpClient?: string;
  cost?: string;
}

export interface Slot {
  type: string;
  minEfficiency: number;
  maxEfficiency: number;
  kaiEfficiency: number;
}

export interface Stars {
  stars: string;
  value: number;
}

export interface Stats {
  level120Retrofit: { [key: string]: string };
  level120: { [key: string]: string };
  level100Retrofit: { [key: string]: string };
  level100: { [key: string]: string };
  baseStats: { [key: string]: string };
}

export const getShipsFull = (name: string): Ship[] => {
  // const t: ShipData = { ships: [] };
  let t: Ship[] = [];
  /*
  if (name === '') {
    t = Object.assign(Object.keys(shipData).map((key) => (shipData as any)[key]));
    return t;
  }*/
  /* (shipData as any)[id];
Object.keys(shipData).forEach((element) => {
  const obj = (shipData as any)[element];
  if (obj.names.code.includes(name)) t.ships.push(obj as Ship);
});
*/
  t = Object.assign(
    Object.keys(shipData)
      .filter((e) => {
        // const ce: string = (shipData as any)[e].names.code.toLowerCase();
        if ((shipData as any)[e].names.en.toLowerCase().includes(name.toLowerCase())) return true;
      })
      .map((key) => (shipData as any)[key]),
  );
  return t;
};

export const getShipsSimple = (name: string): ShipSimple[] => {
  // const t: ShipData = { ships: [] };
  let t: ShipSimple[] = [];
  /*
  if (name === '') {
    t = Object.assign(
      Object.keys(shipData).map((key) => ({
        name: (shipData as any)[key].names.code,
        id: (shipData as any)[key].id,
        class: (shipData as any)[key].class,
        rarity: (shipData as any)[key].rarity,
        hullType: (shipData as any)[key].hullType,
      })),
    );
    return t;
  }*/
  /*
  Object.keys(shipData).forEach((element) => {
    const obj = (shipData as any)[element];
    if (obj.names.code.includes(name)) t.ships.push(obj as Ship);
  });
  */
  t = Object.assign(
    Object.keys(shipData)
      .filter((e) => {
        // const ce: string = (shipData as any)[e].names.code.toLowerCase();
        if ((shipData as any)[e].names.code.toLowerCase().includes(name.toLowerCase())) return true;
      })
      .map((key) => ({
        name: (shipData as any)[key].names.en,
        id: (shipData as any)[key].id,
        class: (shipData as any)[key].class,
        rarity: (shipData as any)[key].rarity,
        hullType: (shipData as any)[key].hullType,
        nationality: (shipData as any)[key].nationality,
      })),
  );
  console.log('shipdata, ', t.length);
  return t;
};

export const getShipById = (id: string): Ship => (shipData as never)[id];