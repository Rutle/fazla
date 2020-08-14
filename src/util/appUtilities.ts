import { ShipSimple, Ship } from './shipdatatypes';
import shipData from '../data/ships.json';
import { AppConfig } from '../reducers/slices/appStateSlice';
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

/*
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const app = electron.remote.app;
const ipcRenderer  = electron.ipcRenderer;
// to send and receive answer from main process such as loading config file/data on startup.
https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args

// for config
https://www.npmjs.com/package/electron-store#how-do-i-get-store-values-in-the-renderer-process-when-my-store-was-initialized-in-the-main-process
*/

// Renderer to Main
export const closeWindow = (): void => {
  ipcRenderer.send('close-application');
};

export const restoreWindow = (): void => {
  ipcRenderer.send('restore-application');
};

export const minimizeWindow = (): void => {
  ipcRenderer.send('minimize-application');
};

export const maximizeWindow = (): void => {
  ipcRenderer.send('maximize-application');
};

const openUrl = (str: string): void => {
  electron.shell.openExternal(str);
};

export const getConfig = (): void => {
  ipcRenderer.invoke('get-config', 'test').then((result: any) => {
    console.log(result);
  });
};

export const getShipData = (): { data: ShipSimple[]; isTempData: boolean } => {
  return ipcRenderer.invoke('get-ship-data').then((result: { shipData: any; isConfigShipData: boolean }) => {
    /*
    console.log(
      '[appUtils: getShipData] Ship data length: ',
      Object.keys(result.shipData).length,
      'isConfig :',
      result.isConfigShipData,
    );
    */
    if (!result.isConfigShipData) {
      // console.log('No data in config');
      // return { data: getShipsSimple('', shipData), isTempData: !result.isConfigShipData };
    }
    // console.log('data in config');
    // return { data: getShipsSimple('', result.shipData), isTempData: !result.isConfigShipData };
  });
};
/**
 * Function that calls electron along with data to save data to .json file.
 * @param data Data that is saved to .json.
 */
export const saveShipData = async (data = {}): Promise<{ isOk: boolean; msg: string }> => {
  return await ipcRenderer.invoke('save-ship-data', data).then((result: { isOk: boolean; msg: string }) => {
    console.log('[appUtils: saveShipData] Ship data save: ', result.isOk);
    return result;
  });
};

/**
 * Function that calls electron along with owned ship data to save data to config file.
 * @param {string[]} data Owned ship data to be saved to config.
 */
export const saveOwnedShipData = async (data: string[] = []): Promise<{ isOk: boolean; msg: string }> => {
  return await ipcRenderer.invoke('save-owned-ships', data).then((result: { isOk: boolean; msg: string }) => {
    console.log('[appUtils: saveOwnedShipData] :', result.isOk);
    return result;
  });
};

export const initData = async (): Promise<{
  shipData: Ship[];
  config: AppConfig;
  ownedShips: string[];
  msg: string;
}> => {
  return ipcRenderer
    .invoke('initData')
    .then((result: { shipData: Ship[]; config: AppConfig; ownedShips: string[]; msg: string }) => {
      if (result.msg === 'success') {
        console.log('initData: ', result.config);
        return { ...result };
      }
    });
};

// Data utilities

/**
 * Returns lists of ships with simpler details.
 * @param name Substring to search for.
 * @param data Json data to search from.
 */
export const getShipsSimpleById = (id: string, data = {}): ShipSimple[] => {
  let t: ShipSimple[] = [];
  t = Object.assign(
    Object.keys(data)
      .filter((e) => {
        if ((data as any)[e].id.toLowerCase().includes(id.toLowerCase())) return true;
        return false;
      })
      .map((key) => ({
        name: (data as any)[key].names.en,
        id: (data as any)[key].id,
        class: (data as any)[key].class,
        rarity: (data as any)[key].rarity,
        hullType: (data as any)[key].hullType,
        nationality: (data as any)[key].nationality,
      })),
  );
  return t;
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
