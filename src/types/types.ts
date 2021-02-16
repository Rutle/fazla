// types.ts

// expose electron api from preload.ts
declare global {
  interface Window {
    api: {
      electronIpcSend: (channel: string) => void;
      electronCheckResources: (channel: string) => Promise<BasicResponse>;
      electronDownloadShipData: (channel: string) => Promise<BasicResponse>;
      electronShell: (str: string) => Promise<void>;
      electronSaveData: (channel: string, ...arg: unknown[]) => Promise<BasicResponse>;
      electronRemoveAFormation: (channel: string, ...arg: unknown[]) => Promise<BasicResponse>;
      electronRenameFormation: (channel: string, ...arg: unknown[]) => Promise<BasicResponse>;
      /**
       * Fetch app data from harddrive.
       */
      electronInitData: (
        channel: string
      ) => Promise<
        {
          shipData: Ship[];
          config: AppConfig;
          ownedShips: string[];
          formations: Formation[];
        } & BasicResponse
      >;
    };
  }
}
export type AppConfig = {
  jsonURL: string;
  themeColor: 'dark' | 'light';
  firstTime: boolean;
  formHelpTooltip: boolean;
  isToast: boolean;
  isEdit?: boolean;
  updateDate: string;
};

export interface BasicResponse {
  isOk: boolean;
  msg: string;
  updateDate?: string;
  code?: string;
}
export interface BooleanSearchParam {
  [key: string]: boolean;
}

export type SearchParams = {
  [key: string]: any;
  name: string;
  hullTypeArr: string[];
  nationalityArr: string[];
  rarityArr: string[];
  hullType: BooleanSearchParam;
  nationality: BooleanSearchParam;
  rarity: BooleanSearchParam;
  fleet: 'ALL' | 'VANGUARD' | 'MAIN';
};

export type Formation = {
  data: string[]; // array of IDs.
} & MiscInformation;

interface MiscInformation {
  name: string; // Name displayed on the dropdown list
}

// Generated by https://quicktype.io
export interface ShipData {
  ships: Ship[];
}

export interface ShipDataSimple {
  ships: ShipSimple[];
}

export interface ShipSimple {
  id: string;
  index: number;
}

export interface Ship {
  wikiUrl?: string;
  id: string;
  names: ShipNames;
  class: string;
  nationality: string;
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
