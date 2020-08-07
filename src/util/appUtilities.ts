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
/*
const searchPredicate = (searchParameters: any) => (ele: ShipSimple | Ship) => {
  return ele.name.toLowerCase().includes(searchParameters.name.toLowerCase());
};
*/
/*
const hullPredicate = (searchParameters: any) => (ele: ShipSimple | Ship) => {
  if (searchParameters.hullTypeArr.length === 0) {
    return true;
  }
  return searchParameters.hullType[ele.hullType as string];
};

const nationalityPredicate = (searchParameters: any) => (ele: ShipSimple | Ship) => {
  if (searchParameters.nationalityArr.length === 0) {
    return true;
  }
  return searchParameters.nationality[ele.nationality as string];
};

const rarityPredicate = (searchParameters: any) => (ele: ShipSimple | Ship) => {
  if (searchParameters.rarityArr.length === 0) {
    return true;
  }
  return searchParameters.rarity[ele.rarity as string];
};
*/
/*
export const getSearchList = (list: ShipSimple[] | Ship[], searchParameters: any): ShipSimple[] => {
  return list
    .filter(searchPredicate(searchParameters))
    .filter(rarityPredicate(searchParameters))
    .filter(nationalityPredicate(searchParameters))
    .filter(hullPredicate(searchParameters));
};
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

export const saveShipData = (data = {}): void => {
  return ipcRenderer.invoke('save-ship-data', data).then((result: boolean) => {
    console.log('[appUtils: saveShipData] Ship data length: ', Object.keys(result).length);
    return;
  });
};

export const saveOwnedShipData = (data = {}): { isOk: boolean; msg: string } => {
  return ipcRenderer.invoke('save-owned-ships', data).then((result: { isOk: boolean; msg: string }) => {
    console.log('[appUtils: saveOwnedShipData] :', result.isOk);
    return result;
  });
};

export const initData = (): { shipData: Ship[]; config: any; ownedShips: string[]; msg: string } => {
  return ipcRenderer
    .invoke('initData')
    .then((result: { shipData: Ship[]; config: any; ownedShips: string[]; msg: string }) => {
      if (result.msg === 'success') {
        // console.log('initData: ', result.shipData.length);
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
