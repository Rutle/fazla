import { eqTypes, fleets, hullTypes, hullTypesAbb, slotTypes } from '_/data/categories';
import { MAININDEX, SUBMARINE, VANGUARDINDEX } from '_/reducers/slices/formationGridSlice';
import { Equipment } from '_/types/equipmentTypes';
import { Ship, Slot } from '_/types/shipTypes';
import { BooleanSearchParam, VersionInfo, ResponseWithData, emptyVersionInfo, Formation } from '_/types/types';
import pako from 'pako';
import DataStore from './dataStore';
import { saveData } from './ipcAPI';

const SHIPDATAURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
// const SHIPDATAURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/ships.json';
const VERSIONINFO = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/version-info.json';
// const VERSIONINFO = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/version.json';
const EQDATAURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/equipments.json';
// const EQDATAURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/dist/equipments.json';

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
    if (result) return { ...(result as Formation) };
    return false;
  } catch (e) {
    return false;
  }
};

export const encodeFormation = (formation: Formation): string => {
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

export const getFleet = (data: { hullType?: string; index?: number; fleetCount?: number }): string => {
  const { hullType, index, fleetCount } = data;
  if (hullType) {
    if (fleets.MAIN.includes(hullType)) return 'main';
    if (fleets.VANGUARD.includes(hullType)) return 'vanguard';
    if (fleets.SUBS.includes(hullType)) return 'submarine';
  }
  if (index !== undefined && fleetCount !== undefined) {
    if (MAININDEX[fleetCount].includes(index)) return 'main';
    if (VANGUARDINDEX[fleetCount].includes(index)) return 'vanguard';
    if (SUBMARINE[fleetCount].includes(index)) return 'submarine';
  }

  return 'none';
};

export interface ParsedSlot {
  [key: string]: {
    str: string;
    slot: Slot;
  }[];
}

/**
 * Parses ship equipment slot-data from generic string to proper slot categories.
 * @param {Object} slots Object containing equipment slot data.
 * @param {class} data Ship data.
 * @param {boolean|undefined} hasRetrofit If the ship has retrofit.
 * @returns {Object[]} Parsed data object.
 */
export const parseSlots = async (
  slots: { [key: string]: Slot },
  // data: DataStore,
  hasRetrofit?: boolean
): Promise<ParsedSlot[]> => {
  // [{1: [006], 2: [002, 001], 3: [013]}, {1: [006], 2: [012], 3: [013]}]
  try {
    const baseSlots: ParsedSlot = {};
    const retroSlots: ParsedSlot = {};
    Object.keys(slots).forEach((key) => {
      const slotIDs = slotTypes[slots[key].type];
      const baseSlot = slotIDs[0].map((eqID) => ({ str: `${eqTypes[eqID]}`, slot: slots[key] }));
      let retroSlot: {
        str: string;
        slot: Slot;
      }[] = [];
      if (slotIDs.length > 1) {
        retroSlot = slotIDs[1].map((eqID) => ({ str: `${eqTypes[eqID]}`, slot: slots[key] }));
      } else {
        retroSlot = baseSlot;
      }
      baseSlots[key] = baseSlot;
      retroSlots[key] = retroSlot;
    });
    if (hasRetrofit) return Promise.resolve([baseSlots, retroSlots]);
    return Promise.resolve([baseSlots]);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return Promise.reject(new Error(e.message));
    }
    return Promise.reject(new Error('Unable to parse slots data.'));
  }
};

export interface ParsedFit {
  [key: string]: Equipment[];
}
/**
 * Parses ship equipment slot-data from generic string to proper slot categories.
 * @param {Object} slots Object containing equipment slot data.
 * @param {class} data Ship data.
 * @param {boolean} combineResult Should the slot results be combined in case of retrofit
 * @param {boolean|undefined} hasRetrofit If the ship has retrofit.
 * @returns {Object[]} Parsed data object.
 */
export const parseFits = (
  slots: { [key: string]: Slot },
  data: DataStore,
  combineResult = false,
  hasRetrofit?: boolean
): ParsedFit[] => {
  // TODO: ADD try/catch + promise.
  const baseFits: ParsedFit = {};
  const retroFits: ParsedFit = {};
  Object.keys(slots).forEach((key) => {
    const slotIDs = slotTypes[slots[key].type];
    let retroFit: Equipment[] = [];
    // List of equipment that fit the slot. Reduce it into a single array.
    const baseFit = slotIDs[0].reduce((acc, eqID) => [...acc, ...data.getEqsByType(eqTypes[eqID])], []);
    if (slotIDs.length > 1) {
      retroFit = slotIDs[1].reduce((acc, eqID) => [...acc, ...data.getEqsByType(eqTypes[eqID])], []);
    } else {
      retroFit = baseFit;
    }
    // Combine base equipment and retrofit equipment into one array. [[baseslot] * N, [retrofitslot] * M]
    if (hasRetrofit && combineResult && slotIDs.length > 1) {
      baseFits[key] = [...baseFit, ...retroFit];
    } else {
      baseFits[key] = baseFit;
      retroFits[key] = retroFit;
    }
  });
  if (hasRetrofit && !combineResult) return [baseFits, retroFits];
  return [baseFits];
};

export interface FormationData {
  fleets: Ship[][];
  fleetCount: number;
  equipment: string[][][];
  // isOldFormation: boolean;
  convertAction?: 'SUB' | 'EQSTRUCTURE';
}
/**
 * Function that takes formation data, that just contains IDs, and returns more detailed data back.
 * @param {Object} formation Formation data
 * @param {Object} shipData Ship data in the Datastore.
 * @returns {Object} A Promise containing detailed data.
 */
export const getFormationData = async (formation: Formation, shipData: DataStore): Promise<FormationData> => {
  try {
    const formLen = formation.data.length;
    const eqLen = formation.equipment.length;
    let convertAction: 'SUB' | 'EQSTRUCTURE' | undefined;
    // Old formation without submarines but no equipment either.
    if (formLen === 12 || formLen === 24)
      return Promise.resolve({
        fleets: [],
        fleetCount: 0,
        equipment: [],
        convertAction: 'SUB',
      });
    // Add some checks
    if (!(eqLen === 45 || eqLen === 81 || eqLen === 15 || eqLen === 27))
      throw new Error('Equipment data structure is not correct.');
    if (!(formLen === 15 || formLen === 27)) {
      throw new Error('Fleet data structure is not correct.');
    }

    // Find Ship data for each ship ID in the formation and transform it to key-value pairs of
    // { ID: Ship }
    const formationShips = shipData
      .getShips()
      .filter((ship) => formation.data.includes(ship.id))
      .reduce(
        (accumulator, currentValue) => Object.assign(accumulator, { [currentValue.id]: currentValue }),
        {} as { [key: string]: Ship }
      );

    const fleetCount = Math.floor(formLen / 6);
    const form: Ship[][] = [];

    // Normal ships
    // Slice array of formation IDs into size 6 and match the ID with correct ship.
    for (let idx = 0; idx < fleetCount; idx += 1) {
      const temp = formation.data.slice(idx * 6, idx * 6 + 6);
      form.push(temp.map((id) => formationShips[id]));
    }

    // Submarines
    const eqData: string[][][] = [];
    const temp = formation.data.slice(-3);
    form.push(temp.map((id) => formationShips[id]));

    // Equipment TODO: Should I also add the general equipment slots?
    // Old equipment array length 15/27
    // New equipment array length 45/87
    // New with all equipment slots: 75/135
    // Take older equipment structure in consideration just in case if someone has actually used the website
    if (eqLen === 15 || eqLen === 27) {
      convertAction = 'EQSTRUCTURE';
      for (let idx = 0; idx <= fleetCount; idx += 1) {
        const tempEq = formation.equipment.slice(idx * 6, idx * 6 + 6);
        const tempNames: string[][] = [];
        for (let shipIdx = 0; shipIdx < tempEq.length; shipIdx += 1) {
          const t = tempEq[shipIdx] as string[];
          tempNames.push(t.map((id) => shipData.getEqNameByCustomId(id)));
        }
        eqData.push(tempNames);
      }
    } else {
      // New style equipment of the formation for vanguard and main
      for (let idx = 0; idx < fleetCount; idx += 1) {
        const tempEq = formation.equipment.slice(idx * 6 * 3, idx * 6 * 3 + 6 * 3) as string[];
        const tempNames: string[][] = [];
        for (let slotIdx = 0; slotIdx < tempEq.length; slotIdx += 3) {
          const e = tempEq.slice(slotIdx, slotIdx + 3).map((id) => shipData.getEqNameByCustomId(id));
          tempNames.push(e);
        }
        eqData.push(tempNames);
      }
      const subEq = formation.equipment.slice(-(3 * 3));
      const tempNames: string[][] = [];

      // For submarines
      for (let slotIdx = 0; slotIdx < subEq.length; slotIdx += 3) {
        const tempEq = subEq.slice(slotIdx, slotIdx + 3) as string[];
        tempNames.push(tempEq.map((id) => shipData.getEqNameByCustomId(id)));
      }
      eqData.push(tempNames);
    }
    if (convertAction)
      return Promise.resolve({
        fleets: form,
        fleetCount,
        equipment: eqData,
        convertAction,
      });
    return Promise.resolve({
      fleets: form,
      fleetCount,
      equipment: eqData,
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return Promise.reject(new Error(e.message));
    }
    return Promise.reject(new Error('Something went wrong when parsing formation data.'));
  }
};
