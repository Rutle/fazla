import { ShipSimple, Ship } from './shipdatatypes';
import shipData from '../data/ships.json';
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
/*
debugger;
        const appPath = app.getAppPath();
        console.log(appPath);
        const path = app.getPath('userData');
        console.log(path);
        fs.readdir(appPath + '/data', (err, files) => {
            debugger;
            this.setState({files: files});
        });
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

export const openUrl = (str: string): void => {
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
      return { data: getShipsSimple('', shipData), isTempData: !result.isConfigShipData };
    }
    // console.log('data in config');
    return { data: getShipsSimple('', result.shipData), isTempData: !result.isConfigShipData };
  });
};

export const saveShipData = (data = {}): void => {
  return ipcRenderer.invoke('save-ship-data', data).then((result: boolean) => {
    console.log('[appUtils: saveShipData] Ship data length: ', Object.keys(result).length);
    return;
  });
};

export const getShipById = (id: string, useTempData: boolean): Ship => {
  if (useTempData) return getShipTempById(id);
  return ipcRenderer.invoke('get-ship-by-id', id).then((result: Ship) => {
    return result;
  });
};

// Data utilities
/**
 * Return detailed ship list.
 * @param name Substring to search for.
 */
const getShipsFull = (name: string): Ship[] => {
  let t: Ship[] = [];
  t = Object.assign(
    Object.keys(shipData)
      .filter((e) => {
        if ((shipData as any)[e].names.en.toLowerCase().includes(name.toLowerCase())) return true;
        return false;
      })
      .map((key) => (shipData as any)[key]),
  );
  return t;
};
/**
 * Returns lists of ships with simpler details.
 * @param name Substring to search for.
 * @param data Json data to search from.
 */
const getShipsSimple = (name: string, data = {}): ShipSimple[] => {
  let t: ShipSimple[] = [];
  t = Object.assign(
    Object.keys(data)
      .filter((e) => {
        if ((data as any)[e].names.code.toLowerCase().includes(name.toLowerCase())) return true;
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
/**
 * Return data of a ship by ID.
 * @param id ID of a ship.
 */
const getShipTempById = (id: string): Ship => (shipData as never)[id];
