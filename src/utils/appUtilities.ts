import { AppConfig, Formation, Ship, BasicResponse } from './types';
import DataStore from './dataStore';
/*
interface BasicResponse {
  isOk: boolean;
  msg: string;
  updateDate?: string;
}
*/
declare global {
  interface Window {
      api: {
        electronIpcSend: (channel: string, ...arg: any) => void;
        electronShell: (str: string) => Promise<void>;
        electronSaveData: (channel: string, ...arg: any) => Promise<BasicResponse>;
        electronRemoveAFormation: (channel: string, ...arg: any) => Promise<BasicResponse>;
        electronInitData: (channel: string, ...arg: any) => Promise< 
        {
          shipData: Ship[];
          config: AppConfig;
          ownedShips: string[];
          formations: Formation[];
        } & BasicResponse
      >;
      }
  }
}
// Renderer to Main
export const closeWindow = (): void => {
  window.api.electronIpcSend('close-application');
};

export const restoreWindow = (): void => {
  window.api.electronIpcSend('restore-application');
};

export const minimizeWindow = (): void => {
  window.api.electronIpcSend('minimize-application');
};

export const maximizeWindow = (): void => {
  window.api.electronIpcSend('maximize-application');
};

const openUrl = async (str: string) => {
  if (urlValidation(str)) {
    await window.api.electronShell(str);
  }
};

export const openLogs = (): void => {
  window.api.electronIpcSend('open-logs');
};

/**
 * Function that calls electron along with data to save data to .json file.
 * @param data Data that is saved to .json.
 */
export const saveShipData = async (data = {}): Promise<BasicResponse> => {
  return await window.api.electronSaveData('save-ship-data', data).then((result: BasicResponse) => {
    return result;
  });
};

/**
 * Function that calls electron along with owned ship data to save data to config file.
 * @param {string[]} data Owned ship data to be saved to config.
 */
export const saveOwnedShipData = async (data: string[] = []): Promise<BasicResponse> => {
  return await window.api.electronSaveData('save-owned-ships', data).then((result: BasicResponse) => {
    return result;
  })
  /*
  return await ipcRenderer.invoke('save-owned-ships', data).then((result: BasicResponse) => {
    return result;
  });
  */
};
/**
 * Function that calls electron to save given data to electron-store .json config file.
 * @param {Formation[]} data Formation data
 */
export const saveFormationData = async (data: Formation[] = []): Promise<BasicResponse> => {
  return await window.api.electronSaveData('save-formation-data', data).then((result: BasicResponse) => {
    return result;
  })
  /*
  return await ipcRenderer.invoke('save-formation-data', data).then((result: BasicResponse) => {
    return result;
  });
  */
};

/**
 * Function that calls electron to remove a formation from electron-store .json config file.
 * @param {number} index Formation index
 */
export const removeAFormation = async (index = 0): Promise<BasicResponse> => {
  return await window.api.electronRemoveAFormation('remove-formation-by-index', index).then((result: BasicResponse) => {
    return result;
  })
  /*
  return await ipcRenderer.invoke('remove-formation-by-index', index).then((result: BasicResponse) => {
    return result;
  });
  */
};

/**
 * Function that calls electron to save config to electron-store .json config file.
 * @param {AppConfig} data Config data
 */
export const saveConfig = async (data: AppConfig): Promise<BasicResponse> => {
  return await window.api.electronSaveData('save-config', data).then((result: BasicResponse) => {
    return result;
  })
  /*
  return await ipcRenderer.invoke('save-config', data).then((result: BasicResponse) => {
    return result;
  });
  */
};

export const initData = async (): Promise< 
  {
    shipData: Ship[];
    config: AppConfig;
    ownedShips: string[];
    formations: Formation[];
  } & BasicResponse
> => {
  return window.api.electronInitData('initData')
    .then(
      (
        result: { shipData: Ship[]; config: AppConfig; ownedShips: string[]; formations: Formation[] } & BasicResponse,
      ) => result,
    );
};

export const openWikiUrl = (str: string): void => {
  openUrl(str);
};

export const urlValidation = (str: string): boolean => {
  if (str === undefined || str === '') return false;
  const urlVal = 'https?://(www.)?azurlane.koumakan.jp.*';
  const flags = 'gi';
  const re = new RegExp(urlVal, flags);
  return re.test(str);
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
