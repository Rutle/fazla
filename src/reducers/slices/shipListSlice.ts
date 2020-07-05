import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ShipData {
  ships: Ship[];
}

export interface Ship {
  wikiUrl: string;
  id: string;
  names: ShipNames;
  class: string;
  nationality: string;
  hullType: string;
  thumbnail: string;
  rarity: string;
  stars: Stars;
  stats: Stats;
  slots: { [key: string]: Slot };
  enhanceValue: EnhanceValue;
  scrapValue: ScrapValue;
  skills: Skill[];
  limitBreaks: Array<string[]>;
  fleetTech: FleetTech;
  retrofit: boolean;
  retrofitId: string;
  retrofitProjects: RetrofitProjects;
  construction: Construction;
  obtainedFrom: ObtainedFrom;
  misc: Misc;
  skins: Skin[];
  gallery: Gallery[];
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
/*
type ShipsState = {
  ships: Ship[];
};
*/

type ShipsState = ShipData;

const initialState: ShipsState = {
  ships: [],
};

const shipListSlice = createSlice({
  name: 'shipListSlice',
  initialState,
  reducers: {
    setList(state, action: PayloadAction<ShipData>) {
      return action.payload;
    },
    resetList(state, action) {
      return initialState;
    },
    /*
    displayRepo(state, action: PayloadAction<CurrentRepo>) {
      const { org, repo } = action.payload
      state.org = org
      state.repo = repo
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setCurrentDisplayType(state, action: PayloadAction<CurrentDisplayPayload>) {
      const { displayType, issueId = null } = action.payload
      state.displayType = displayType
      state.issueId = issueId
    }
    */
  },
});

export const {} = shipListSlice.actions;

export default shipListSlice.reducer;
