import { hullTypes, hullTypesAbb } from '_/data/categories';
import { MAININDEX, SUBMARINE, VANGUARDINDEX } from '_/reducers/slices/formationGridSlice';
import { Ship, BooleanSearchParam, VersionInfo, ResponseWithData, emptyVersionInfo } from '_/types/types';
import { saveData } from './ipcAPI';

const SHIPDATAURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
const VERSIONINFO = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/version-info.json';

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

const isArrayJson = (o: unknown): o is string[] => {
  return o instanceof Array;
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

export const parseImportCode = (codeString: string): string[] | boolean => {
  try {
    const jsonString = atob(codeString);
    const result = safeJsonParse(isArrayJson)(jsonString);
    if (result) return result;
    return false;
  } catch (e) {
    return false;
  }
};

export const encodeFormation = (formation: string[]): string => {
  const d = JSON.stringify(formation);
  return btoa(d);
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
    let updateDate = '';
    await Promise.all([fetch(SHIPDATAURL).then(handleHTTPError), fetch(VERSIONINFO).then(handleHTTPError)])
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then(async (results: [{ [key: string]: Ship }, VersionInfo]) => {
        dataArr = [...Object.keys(results[0]).map((key) => results[0][key])];
        versInfo = { ...results[1] };
        if (platform === 'electron') {
          const saveResponse = await saveData([
            { data: results[0], fileName: 'ships' },
            { data: results[1], fileName: 'version-info' },
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
          const versionRes = await storage.setItem('versionInfo', results[1]);
          const timeOfUpdateCheck = await storage.setItem('timeOfUpdateCheck', Date.now());
          const isEq = Object.keys(versionRes).length === Object.keys(results[1]).length;
          if (shipRes.length === dataArr.length && isEq && timeOfUpdateCheck !== null) {
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
    return { isOk, msg, data: { shipData: dataArr, versionInfo: versInfo }, updateDate };
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
        const newVer = result.ships['version-number'];
        const currentVer = currentVersInfo.ships['version-number'];
        isUpdReq = newVer > currentVer;
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
