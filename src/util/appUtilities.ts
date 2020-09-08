import { Ship } from './shipdatatypes';
import shipData from '../data/ships.json';
import { AppConfig } from '../reducers/slices/programConfigSlice';
import { Formation } from '../reducers/slices/formationGridSlice';
import DataStore from './dataStore';

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

interface BasicResponse {
  isOk: boolean;
  msg: string;
}

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

/**
 * Function that calls electron along with data to save data to .json file.
 * @param data Data that is saved to .json.
 */
export const saveShipData = async (data = {}): Promise<BasicResponse> => {
  return await ipcRenderer.invoke('save-ship-data', data).then((result: BasicResponse) => {
    return result;
  });
};

/**
 * Function that calls electron along with owned ship data to save data to config file.
 * @param {string[]} data Owned ship data to be saved to config.
 */
export const saveOwnedShipData = async (data: string[] = []): Promise<BasicResponse> => {
  return await ipcRenderer.invoke('save-owned-ships', data).then((result: BasicResponse) => {
    return result;
  });
};
/**
 * Function that calls electron to save given data to electron-store .json config file.
 * @param {Formation[]} data Formation data
 */
export const saveFormationData = async (data: Formation[] = []): Promise<BasicResponse> => {
  return await ipcRenderer.invoke('save-formation-data', data).then((result: BasicResponse) => {
    return result;
  });
};

/**
 * Function that calls electron to remove a formation from electron-store .json config file.
 * @param {number} index Formation index
 */
export const removeAFormation = async (index = 0): Promise<BasicResponse> => {
  return await ipcRenderer.invoke('remove-formation-by-index', index).then((result: BasicResponse) => {
    return result;
  });
};

/**
 * Function that calls electron to save config to electron-store .json config file.
 * @param {AppConfig} data Config data
 */
export const saveConfig = async (data: AppConfig): Promise<BasicResponse> => {
  return await ipcRenderer.invoke('save-config', data).then((result: BasicResponse) => {
    return result;
  });
};

export const initData = async (): Promise<{
  shipData: Ship[];
  config: AppConfig;
  ownedShips: string[];
  formations: Formation[];
  msg: string;
}> => {
  return ipcRenderer
    .invoke('initData')
    .then(
      (result: { shipData: Ship[]; config: AppConfig; ownedShips: string[]; formations: Formation[]; msg: string }) => {
        if (result.msg === 'success') {
          // console.log('initData: ', result.config);
          return { ...result };
        }
      },
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

/**
 * Function that calls electron to save config to electron-store .json config file.
 */
export const getDatastore = (): DataStore => {
  return ipcRenderer.sendSync('get-datastore');
};
