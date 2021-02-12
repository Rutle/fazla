// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import Store from 'electron-store';
import * as fs from 'fs';
import * as url from 'url';
import * as path from 'path';
import isDev from 'electron-is-dev';
import { isShipJson, safeJsonParse } from '_/utils/appUtilities';
import { Ship, Formation, AppConfig } from '_/types/types';

let mainWindow: Electron.BrowserWindow;
const electronStore = new Store({
  cwd: app.getPath('userData'),
});
const fsPromises = fs.promises;

const SHIPAPIURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
const THEMECOLOR = 'dark';

function createWindow(): void {
  // Create the browser window.
  // const width = electronStore.get('windowWidth');
  // const height = electronStore.get('windowHeight');
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.bundle.js'),
    },
  });

  mainWindow
    .loadURL(
      url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true,
      })
    )
    .finally(() => {
      /* no action */
    });

  mainWindow.removeMenu();
  // Open the DevTools.
  if (isDev) mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('close-application', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('minimize-application', () => {
  mainWindow.minimize();
});

ipcMain.on('maximize-application', () => {
  mainWindow.maximize();
});

ipcMain.on('restore-application', () => {
  mainWindow.restore();
});

ipcMain.on('open-logs', () => {
  const userDir = app.getPath('userData');
  shell.showItemInFolder(userDir);
  // console.log('logs');
  // console.log(`${userDir}\\logs`);
});

ipcMain.handle('resource-check', async () => {
  try {
    let isOk = true;
    const msg = '';
    let code = '';
    // userData is the appData path
    const userDir = app.getPath('userData');
    if (process.env.NODE_ENV !== 'development') {
      await fsPromises
        .access(`${userDir}\\resources\\ships.json`, fs.constants.F_OK)
        .then(() => {
          // console.log('can access, has been created.');
          isOk = true;
          code = 'ResFound';
        })
        .catch(() => {
          // console.log('cannot access, not created yet.');
          isOk = true;
          code = 'ResNotFound';
        });
    }
    return { isOk, msg, code };
  } catch (e) {
    return { isOk: false, msg: 'Resource check failed.', code: 'Error' };
  }
});

/**
 * Get owned ship data from config data file.
 */
ipcMain.handle('get-owned-ship-data', async () => {
  const ships = await electronStore.get('ownedShips');
  if (ships) {
    return { shipData: ships, isConfigShipData: true };
  }
  return { shipData: [], isConfigShipData: false };
});

/**
 * Save ship data to json file.
 */
ipcMain.handle('save-ship-data', async (event, arg) => {
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  try {
    const rawData = JSON.stringify(arg);
    if (process.env.NODE_ENV === 'development') {
      await fsPromises.writeFile(path.join(__dirname, '../src/data/ships.json'), rawData, 'utf8');
    } else {
      const userDir = app.getPath('userData');
      await fsPromises
        .access(`${userDir}\\resources\\ships.json`, fs.constants.F_OK)
        .then(async () => {
          // console.log('can access, has been created. do not create directory but just save.');
          await fsPromises.writeFile(`${userDir}\\resources\\ships.json`, rawData, 'utf8');
        })
        .catch(async () => {
          // console.error('cannot access, not created yet. create directory now.');
          await fsPromises.mkdir(`${userDir}\\resources`, { recursive: true });
          await fsPromises.writeFile(`${userDir}\\resources\\ships.json`, rawData, 'utf8');
        });
    }
    electronStore.set('config.updateDate', date);
    return { updateDate: date, isOk: true, msg: 'Ship data saved succesfully.' };
  } catch (error) {
    return { updateDate: date, isOk: false, msg: 'Failed to save ship data.', code: 'Failure' };
  }
});

/**
 * Save owned ship data to config data file.
 */
ipcMain.handle('save-owned-ships', (event, data: string[]) => {
  try {
    electronStore.set({
      ownedShips: data,
    });
    return { isOk: true, msg: 'Owned ships saved succesfully.' };
  } catch (error) {
    return { isOk: false, msg: 'Failed to save owned ships.', code: 'Failure' };
  }
});
/**
 * Function that saves given formation data.
 */
ipcMain.handle('save-formation-data', (event, data: Formation[]) => {
  try {
    electronStore.set({
      formations: data,
    });
    return { isOk: true, msg: 'Formation data saved succesfully.' };
  } catch (e) {
    return { isOk: false, msg: 'Failed to save formation data.', code: 'Failure' };
  }
});

/**
 * Function that saves given config data.
 */
ipcMain.handle('save-config', (event, data: AppConfig) => {
  try {
    electronStore.set({ config: data });
    return { isOk: true, msg: 'Config data saved succesfully.' };
  } catch (e) {
    return { isOk: false, msg: 'Failed to save config data.', code: 'Failure' };
  }
});

/**
 * Function removes formation from .json config file.
 */
ipcMain.handle('remove-formation-by-index', (event, data) => {
  try {
    const idx = data as number;
    const formationData = electronStore.get('formations') as Formation[];
    const newForms = formationData.filter((item, index) => index !== idx);
    electronStore.set({
      formations: newForms,
    });
    return { isOk: true, msg: 'Formation data saved succesfully.' };
  } catch (e) {
    return { isOk: false, msg: 'Failed to remove formation.', code: 'Failure' };
  }
});

ipcMain.handle('rename-formation-by-index', (event, data: { idx: number; name: string }) => {
  try {
    const { idx, name } = data;
    const formationData = electronStore.get('formations') as Formation[];
    const newForms = formationData.map((item, index) => {
      if (index !== idx) {
        return item;
      }
      return {
        ...item,
        name,
      };
    });
    electronStore.set({
      formations: newForms,
    });
    return { isOk: true, msg: 'Formation name changed succesfully.' };
  } catch (e) {
    return { isOk: false, msg: 'Failed to rename formation.', code: 'Failure' };
  }
});

/**
 * Initialize by getting data from .json and config data from config file.
 */
ipcMain.handle('initData', async () => {
  let jsonData: { [key: string]: Ship } = {};
  let dataArr: Ship[] = [];
  let oShips: string[] = [];
  let formationData: Formation[] = [];
  let isOk = false;
  let msg = 'testi';
  let code = 'ResFound';
  let configData: AppConfig = {
    jsonURL: '',
    themeColor: 'dark',
    firstTime: false,
    formHelpTooltip: true,
    isToast: true,
    updateDate: '',
  };

  try {
    // userData is the appData path
    const userDir = app.getPath('userData');
    // resourcesPath is the installation path
    // const resourceDir = process.resourcesPath;
    // console.log(userDir, resourceDir);
    if (!electronStore.has('firstRun')) {
      electronStore.set('firstRun', false);
      electronStore.set({
        config: {
          jsonURL: SHIPAPIURL,
          themeColor: THEMECOLOR,
          formHelpTooltip: true,
          firstTime: true,
          isToast: true,
          updateDate: '',
        },
        ownedShips: [],
        formations: [],
      });
    }
    configData = electronStore.get('config') as AppConfig;
    let rawData = '';
    if (process.env.NODE_ENV === 'development') {
      rawData = await fsPromises.readFile(path.join(__dirname, '../src/data/ships.json'), 'utf8');
    } else {
      await fsPromises
        .access(`${userDir}\\resources\\ships.json`, fs.constants.F_OK)
        .then(async () => {
          // console.log('can access, has been created. use file from appdata (updated/downloaded at least once)');
          rawData = await fsPromises.readFile(`${userDir}\\resources\\ships.json`, 'utf8');
          code = 'ResFound';
          msg = 'Json data found and loaded.';
        })
        .catch(() => {
          // console.log('Cannot access .json data even in appData.');
          // rawData = await fsPromises.readFile(`${resourceDir}\\ships.json`, 'utf8');
          // const rawData = await fsPromises.readFile(path.join(__dirname, '../src/data/ships.json'), 'utf8');
          msg = 'Cannot access and load .json data.';
          code = 'ResNotFound';
        });
    }
    if (code === 'ResFound') {
      // Parse and check JSON data (at least partially)
      const result = safeJsonParse(isShipJson)(rawData);
      if (result) {
        jsonData = result as { [key: string]: Ship };
        dataArr = [...Object.keys(jsonData).map((key) => jsonData[key])];
        oShips = electronStore.get('ownedShips') as string[];
        formationData = electronStore.get('formations') as Formation[];
        isOk = true;
      } else {
        msg = "JSON data parsing failed. JSON didn't pass checks.";
        code = 'JSONParseFail';
        isOk = true;
      }
    }
    return {
      shipData: dataArr,
      config: configData,
      ownedShips: oShips,
      formations: formationData,
      isOk,
      msg,
      code,
    };
  } catch (error) {
    return {
      shipData: dataArr,
      config: configData,
      ownedShips: oShips,
      formations: formationData,
      isOk: false,
      msg: 'Data initialization failed.',
      code: 'InitError',
    };
  }
});
