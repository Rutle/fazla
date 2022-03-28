// types.ts

import { Equipment } from './equipmentTypes';
import { Ship } from './shipTypes';

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
      electronInitData: (channel: string) => Promise<AppDataObject & BasicResponse>;
    };
  }
}

export interface CurrentState {
  cState: 'INIT' | 'RUNNING' | 'ERROR' | 'UPDATING' | 'SAVING' | 'DOWNLOADING';
  cMsg: string;
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
export interface AppDataObject {
  shipData: Ship[];
  config: AppConfig;
  ownedShips: string[];
  formations: Formation[];
  versionData: VersionInfo;
  eqData: Equipment[];
}
export interface BasicResponse {
  isOk: boolean;
  msg: string;
}
export interface ResponseWithData extends BasicResponse {
  updateDate?: string;
  code?: string;
  data?: {
    shipData?: Ship[];
    versionInfo?: VersionInfo;
    eqData?: Equipment[];
  };
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
  fleet: 'ALL' | 'VANGUARD' | 'MAIN' | 'SUBMARINE';
};

export type Formation = {
  // Array of Ids (ships)
  data: string[];
  // Array of Arrays (equips for ships).
  // string[] is new form to save space
  // string[][] old form
  equipment: string[] | string[][];
  // Name of the fleet
  name: string;
};

export interface VersionInfo {
  ships: {
    'version-number': number;
    'last-data-refresh-date': number;
    hash: string;
    'number-of-ships': number;
  };
  equipments: {
    'version-number': number;
    'last-data-refresh-date': number;
    hash: string;
  };
  chapters: { 'version-number': number };
  barrages: { 'version-number': number };
  voicelines: { 'version-number': number };
  'version-number': number;
}

export const emptyVersionInfo = (): VersionInfo => ({
  ships: {
    'version-number': NaN,
    'last-data-refresh-date': NaN,
    hash: '',
    'number-of-ships': NaN,
  },
  equipments: {
    'version-number': NaN,
    'last-data-refresh-date': NaN,
    hash: '',
  },
  chapters: { 'version-number': NaN },
  barrages: { 'version-number': NaN },
  voicelines: { 'version-number': NaN },
  'version-number': NaN,
});
export interface ShipSimple {
  id: string;
  index: number;
}

export interface SaveDataObject {
  data: { [key: string]: Ship } | VersionInfo | Equipment[];
  fileName: string;
}
