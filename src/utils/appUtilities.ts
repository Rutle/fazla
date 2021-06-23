import { eqTypes, hullTypes, hullTypesAbb, slotTypes } from '_/data/categories';
import { MAININDEX, SUBMARINE, VANGUARDINDEX } from '_/reducers/slices/formationGridSlice';
import { Equipment } from '_/types/equipmentTypes';
import { Ship, Slot } from '_/types/shipTypes';
import { BooleanSearchParam, VersionInfo, ResponseWithData, emptyVersionInfo, Formation } from '_/types/types';
import pako from 'pako';
import DataStore from './dataStore';
import { saveData } from './ipcAPI';

const SHIPDATAURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
const VERSIONINFO = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/version-info.json';
const EQDATAURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/equipments.json';

export const urlValidation = (str: string): boolean => {
  if (str === undefined || str === '') return false;
  const urlVal = 'https?://(www.)?azurlane.koumakan.jp.*';
  const flags = 'gi';
  const re = new RegExp(urlVal, flags);
  return re.test(str);
};

export const elapsedSinceUpdate = (ms: number): number => {
  const today = Date.now();
  const elapsed = today - ms;
  const days = Math.floor(elapsed / (24 * 60 * 60 * 1000));
  return days;
};

// TODO: More fields to check.
// TYPE guards
export const isBooleanObj = <T extends { All?: unknown }>(obj: T): obj is T & BooleanSearchParam => {
  return typeof obj.All === 'boolean';
};

// TODO: More fields to check.
export const isShipJson = <
  T extends { [key: string]: { names?: unknown; id?: unknown; class?: unknown; nationality?: unknown } }
>(
  o: T
): o is T & { [key: string]: Ship } => {
  return !Object.values(o).some((ele) => typeof ele.id !== 'string');
};

// TODO: Add more fields to check.
export const isVersionJson = <T extends { ships?: { 'version-number'?: unknown } }>(o: T): o is T & VersionInfo => {
  return o.ships !== undefined && typeof o.ships['version-number'] === 'number';
};

// TODO: Add more fields to check.
const eqTypeCheck = (e: { type?: unknown; id?: unknown; wikiUrl?: unknown; category?: unknown; names?: unknown }) => {
  return typeof e.id !== 'string';
};

export const isEquipmentJson = <
  T extends [{ type?: unknown; id?: unknown; wikiUrl?: unknown; category?: unknown; names?: unknown }]
>(
  o: T
): o is T & Equipment[] => {
  return !o.some(eqTypeCheck);
};

const isImportJson = <T extends { data?: unknown; name?: unknown }>(
  o: T
): o is T & { data: string[]; name: string } => {
  if (!(o.data && o.name)) return false;
  if (!(o.data instanceof Array)) return false;
  // if (!(o.equipment instanceof Array && !o.equipment.some((k) => !(k instanceof Array)))) return false;
  if (typeof o.name !== 'string') return false;

  return true;
};

// https://stackoverflow.com/a/62438143
export const safeJsonParse =
  <T>(guard: (o: unknown) => o is T) =>
  (text: string): T | boolean => {
    try {
      const parsed = JSON.parse(text) as T;
      return guard(parsed) ? parsed : false;
    } catch (e) {
      return false;
    }
  };

export const parseImportCode = (codeString: string): Formation | boolean => {
  try {
    const data = atob(codeString)
      .split('')
      .map((x) => x.charCodeAt(0));
    const f = new Uint8Array(data);
    const result = safeJsonParse(isImportJson)(pako.inflate(f, { to: 'string' }));
    if (result) return { ...(result as { data: string[]; name: string }), equipment: [] };
    return false;
  } catch (e) {
    return false;
  }
};

export const encodeFormation = (formation: Formation): string => {
  const { equipment, ...rest } = formation;
  const compressed = pako.deflate(JSON.stringify(formation));
  return btoa(String.fromCharCode.apply(null, compressed));
};

/* https://stackoverflow.com/a/57888548 */
/* For now not used */
export const fetchWithTimeout = (url: string, ms: number): Promise<Response> => {
  const controller = new AbortController();
  const promise = fetch(url, { signal: controller.signal });
  const timeout = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(timeout));
};

export const handleHTTPError = (response: Response): Response => {
  if (!response.ok) {
    switch (response.status) {
      case 404:
        throw new Error('Given URL cannot be found. [404]');
      default:
        throw new Error('Something went wrong with retriving data. [default]');
    }
  }
  return response;
};
/**
 * Function that downloads latest ship data.
 * @param platform Platform: 'electron or 'web'.
 * @param storage LocalForage that uses IndexedDB.
 * @returns Object containing response data.
 */
export const downloadShipData = async (
  platform: string | undefined,
  storage?: LocalForage
): Promise<ResponseWithData> => {
  let isOk = false;
  let msg = '';
  try {
    let dataArr: Ship[] = [];
    let versInfo: VersionInfo = emptyVersionInfo();
    let eqArr: Equipment[] = [];
    let updateDate = '';
    await Promise.all([
      fetch(SHIPDATAURL).then(handleHTTPError),
      fetch(VERSIONINFO).then(handleHTTPError),
      fetch(EQDATAURL).then(handleHTTPError),
    ])
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then(async (results: [{ [key: string]: Ship }, VersionInfo, Equipment[]]) => {
        dataArr = [...Object.keys(results[0]).map((key) => results[0][key])];
        versInfo = { ...results[1] };
        eqArr = [...results[2]];
        if (platform === 'electron') {
          const saveResponse = await saveData([
            { data: results[0], fileName: 'ships' },
            { data: results[1], fileName: 'version-info' },
            { data: results[2], fileName: 'equipments' },
          ]);
          if (saveResponse.isOk) {
            isOk = true;
            updateDate = saveResponse.updateDate as string;
          } else {
            isOk = false;
            msg = 'There was a problem with saving data.';
          }
        }
        if (platform === 'web' && storage) {
          const shipRes = await storage.setItem('shipData', dataArr);
          const versionRes = await storage.setItem('versionInfo', versInfo);
          const timeOfUpdateCheck = await storage.setItem('timeOfUpdateCheck', Date.now());
          const eqRes = await storage.setItem('eqData', eqArr);
          const isEq = Object.keys(versionRes).length === Object.keys(versInfo).length;
          if (
            shipRes.length === dataArr.length &&
            isEq &&
            timeOfUpdateCheck !== null &&
            eqRes.length === eqArr.length
          ) {
            isOk = true;
          } else {
            isOk = false;
            msg = 'There was a problem with saving data.';
          }
        }
      })
      .catch((e: Error) => {
        isOk = false;
        msg = e.message;
      });
    return { isOk, msg, data: { shipData: dataArr, versionInfo: versInfo, eqData: eqArr }, updateDate };
  } catch (e) {
    // if (e instanceof Error) console.log('k', e.message);
    return { isOk: false, msg: 'Failed to download and save ship data.' };
  }
};
/**
 * Function to download latest version data and compare it with current data.
 * @param currentVersInfo Current version information.
 * @returns Object containing response.
 */
export const compareVersion = async (
  currentVersInfo: VersionInfo
): Promise<{ isOk: boolean; msg: string; isUpdReq: boolean }> => {
  let isOk = false;
  let msg = '';
  let isUpdReq = false;
  try {
    await fetch(VERSIONINFO)
      .then(handleHTTPError)
      .then((response) => response.json())
      .then((result: VersionInfo) => {
        const newShipVer = result.ships['version-number'];
        const newEqVer = result.equipments['version-number'];
        const currentShipVer = currentVersInfo.ships['version-number'];
        const currentEqVer = currentVersInfo.equipments['version-number'];
        isUpdReq = newShipVer > currentShipVer || newEqVer > currentEqVer;
        isOk = true;
      })
      .catch((e: Error) => {
        isOk = false;
        msg = e.message;
      });
    return { isOk, msg, isUpdReq };
  } catch (e) {
    // if (e instanceof Error) console.log('k', e.message);
    return { isOk: false, msg: 'Failed to download and check version data.', isUpdReq };
  }
};

export const getHullTypeAbb = (hullType: string | undefined): string => {
  if (!hullType) return 'none';
  return hullTypesAbb[hullTypes[hullType]];
};

export const getFleet = (index: number, fleetCount: number): string => {
  if (MAININDEX[fleetCount].includes(index)) return 'main';
  if (VANGUARDINDEX[fleetCount].includes(index)) return 'vanguard';
  if (SUBMARINE[fleetCount].includes(index)) return 'submarine';
  return 'none';
};

interface ParsedSlot {
  [key: string]: string[];
}

interface ParsedFit {
  [key: string]: string[][];
}
export interface ParsedValues {
  parsedSlots: ParsedSlot[];
  parsedFits: ParsedFit[];
}

export const parseSlots = (slots: { [key: string]: Slot }, data: DataStore): ParsedValues => {
  // [{1: [006], 2: [002, 001], 3: [013]}, {1: [006], 2: [012], 3: [013]}]
  const baseSlots: ParsedSlot = {};
  const retroSlots: ParsedSlot = {};
  const baseFits: ParsedFit = {};
  const retroFits: ParsedFit = {};
  const hasRetrofitSlots = Object.keys(slots).some((key) => slotTypes[slots[key].type].length >= 2);
  Object.keys(slots).forEach((key) => {
    const slotIDs = slotTypes[slots[key].type];
    const baseSlot: string[] = slotIDs[0].map((eqID) => eqTypes[eqID]);
    let retroSlot: string[] = [];
    let retroFit: string[][] = [];
    const baseFit = slotIDs[0].map((eqID) => data.getEqId(eqTypes[eqID]));
    if (slotIDs.length > 1) {
      retroSlot = slotIDs[1].map((eqID) => eqTypes[eqID]);
      retroFit = slotIDs[1].map((eqID) => data.getEqId(eqTypes[eqID]));
    } else {
      retroSlot = baseSlot;
      retroFit = baseFit;
    }
    baseSlots[key] = baseSlot;
    retroSlots[key] = retroSlot;
    baseFits[key] = baseFit;
    retroFits[key] = retroFit;
  });
  if (hasRetrofitSlots) return { parsedSlots: [baseSlots, retroSlots], parsedFits: [baseFits, retroFits] };
  return { parsedSlots: [baseSlots], parsedFits: [baseFits] };
};

export const getFormationData = async (
  data: string[],
  shipData: DataStore
): Promise<{ data: Ship[][]; isSubFleet: boolean; fleetCount: number }> => {
  try {
    // Find Ship data for each ship ID in the formation and transform it to key-value pairs of
    // { ID:Ship }
    const formationShips = shipData
      .getShips()
      .filter((ship) => data.includes(ship.id))
      .reduce(
        (accumulator, currentValue) => Object.assign(accumulator, { [currentValue.id]: currentValue }),
        {} as { [key: string]: Ship }
      );
    const formLen = data.length;
    const fleetCount = Math.floor(formLen / 6);
    const form: Ship[][] = [];
    // Normal ships
    // Slice array of formation IDs into size 6 and match the ID with correct ship.
    for (let idx = 0; idx < fleetCount; idx += 1) {
      const temp = data.slice(idx * 6, idx * 6 + 6);
      form.push(temp.map((id) => formationShips[id]));
    }
    // Submarines
    // Submarines are at the end of the array.
    let isSubFleet = false;
    if (formLen === 15 || formLen === 27) {
      const temp = data.slice(-3);
      form.push(temp.map((id) => formationShips[id]));
      isSubFleet = true;
    } else {
      // In case of old formation data.
      isSubFleet = false;
    }
    return Promise.resolve({ data: form, isSubFleet, fleetCount });
  } catch (e) {
    return Promise.reject(new Error('Failed to form formation data.'));
  }
};
