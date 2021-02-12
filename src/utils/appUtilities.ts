import { saveShipData } from './ipcAPI';
import { Ship, BasicResponse, BooleanSearchParam } from '../types/types';

const SHIPAPIURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';

export const urlValidation = (str: string): boolean => {
  if (str === undefined || str === '') return false;
  const urlVal = 'https?://(www.)?azurlane.koumakan.jp.*';
  const flags = 'gi';
  const re = new RegExp(urlVal, flags);
  return re.test(str);
};

// TYPE guards
export const isBooleanObj = <T extends { All?: unknown }>(obj: T): obj is T & BooleanSearchParam => {
  return typeof obj.All === 'boolean';
};

export const isShipJson = <
  T extends { [key: string]: { names?: unknown; id?: unknown; class?: unknown; nationality?: unknown } }
>(
  o: T
): o is T & { [key: string]: Ship } => {
  return !Object.values(o).some((ele) => typeof ele.id !== 'string');
};

const isArrayJson = (o: unknown): o is string[] => {
  return o instanceof Array;
};

// https://stackoverflow.com/a/62438143
export const safeJsonParse = <T>(guard: (o: unknown) => o is T) => (text: string): T | boolean => {
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

export const downloadShipData = async (storage?: LocalForage): Promise<BasicResponse> => {
  let isOk = false;
  let msg = '';
  const platform = process.env.PLAT_ENV;
  try {
    await fetchWithTimeout(SHIPAPIURL, 20000)
      .then(handleHTTPError)
      .then((res) => res.json())
      .then(async (result: { [key: string]: Ship }) => {
        if (platform === 'electron') {
          const res = await saveShipData(result);
          isOk = res.isOk;
          msg = res.msg;
        }
        if (platform === 'web' && storage) {
          const dataArr = [...Object.keys(result).map((key) => result[key])];
          // localStorage.setItem('shipData', JSON.stringify(dataArr));
          storage
            .setItem('shipData', dataArr)
            .then(() => {
              isOk = true;
            })
            .catch(() => {
              isOk = false;
              msg = 'Failed to save ship data to storage.';
            });
        }
      })
      .catch((e: Error) => {
        isOk = false;
        msg = e.message;
      });
    return { isOk, msg };
  } catch (e) {
    // if (e instanceof Error) console.log('k', e.message);
    return { isOk: false, msg: 'Failed to download and save ship data.' };
  }
};
