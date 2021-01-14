// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import * as fs from 'fs';
import * as url from 'url';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { Ship, Formation, AppConfig } from '../utils/types';
// import DataStore from '../src/util/dataStore';

let mainWindow: Electron.BrowserWindow;
const electronStore = new Store({
  cwd: app.getPath('userData'),
});
const fsPromises = fs.promises;
// const shipData = new DataStore();

const SHIPAPIURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
const THEMECOLOR = 'dark';

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 900,
    frame: false,
    //thickFrame: true,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.bundle.js'),
    },
  });

  // mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow
    .loadURL(
      url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true,
      }),
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
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/*
if (process.env.NODE_ENV === 'development') {
  console.log('DEVELOPMENT', ' load .json');
  const rawData = fs.readFileSync(path.join(__dirname, '../src/data/ships.json'), 'utf8');
  const jsonData = JSON.parse(rawData);
  const dataArr = [...Object.keys(jsonData).map((key) => jsonData[key])];
  shipData.setArray(dataArr);
}
*/
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
  console.log('logs');
  console.log(`${userDir}\\logs`);
});

/**
 * Get owned ship data from config data file.
 */
ipcMain.handle('get-owned-ship-data', async () => {
  const ships = electronStore.get('ownedShips');
  if (ships) {
    return { shipData: ships, isConfigShipData: true };
  } else {
    return { shipData: [], isConfigShipData: false };
  }
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
          console.log('can access, has been created. do not create directory but just save.');
          await fsPromises.writeFile(`${userDir}\\resources\\ships.json`, rawData, 'utf8');
        })
        .catch(async () => {
          console.error('cannot access, not created yet. create directory now.');
          await fsPromises.mkdir(`${userDir}\\resources`);
          await fsPromises.writeFile(`${userDir}\\resources\\ships.json`, rawData, 'utf8');
        });
    }
    electronStore.set('config.updateDate', date);
  } catch (error) {
    console.log('Failure save');
    return { updateDate: date, isOk: false, msg: error.message };
  }
  return { updateDate: date, isOk: true, msg: 'Ship data saved succesfully.' };
});
/**
 * Save owned ship data to config data file.
 */
ipcMain.handle('save-owned-ships', async (event, data) => {
  try {
    electronStore.set({
      ownedShips: data,
    });
  } catch (error) {
    return { isOk: false, msg: error.message };
  }
  return { isOk: true, msg: 'Owned ships saved succesfully.' };
});
/**
 * Function that saves given formation data.
 */
ipcMain.handle('save-formation-data', async (event, data) => {
  try {
    const fData = data as Formation[];
    electronStore.set({
      formations: fData,
    });
  } catch (e) {
    return { isOk: false, msg: 'Failed to save formation data.' };
  }
  return { isOk: true, msg: 'Formation data saved succesfully.' };
});

/**
 * Function that saves given config data.
 */
ipcMain.handle('save-config', async (event, data) => {
  try {
    electronStore.set({ config: data });
  } catch (e) {
    return { isOk: false, msg: 'Failed to save config data.' };
  }
  return { isOk: true, msg: 'Config data saved succesfully.' };
});

/**
 * Function removes formation from .json config file.
 */
ipcMain.handle('remove-formation-by-index', async (event, data) => {
  try {
    const idx = data as number;
    const formationData = electronStore.get('formations') as Formation[];
    const newForms = formationData.filter((item, index) => index !== idx);
    electronStore.set({
      formations: newForms,
    });
  } catch (e) {
    return { isOk: false, msg: 'Failed to remove formation.' };
  }
  return { isOk: true, msg: 'Formation data saved succesfully.' };
});

ipcMain.handle('rename-formation-by-index', async (event, data) => {
  try {
    const idx = data.idx;
    const newName = data.name;
    const formationData = electronStore.get('formations') as Formation[];
    const newForms = formationData.map((item, index) => {
      if (index !== idx) {
        return item;
      }
      return {
        ...item,
        name: newName,
      };
    });
    electronStore.set({
      formations: newForms,
    });
  } catch (e) {
    return { isOk: false, msg: 'Failed to rename formation.' };
  }
  return { isOk: true, msg: 'Formation name changed succesfully.'};
})

/**
 * Initialize by getting data from .json and config data from config file.
 */
ipcMain.handle('initData', async () => {
  console.log('INIT DATA');
  let jsonData: { [key: string]: Ship } = {};
  let dataArr: Ship[] = [];
  let oShips: string[] = [];
  let formationData: Formation[] = [];
  let configData: AppConfig = {
    jsonURL: '',
    themeColor: 'dark',
    firstTime: false,
    formHelpTooltip: true,
    isToast: true,
    updateDate: '',
  };

  try {
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
    if (process.env.NODE_ENV === 'development') {
      const rawData = await fsPromises.readFile(path.join(__dirname, '../src/data/ships.json'), 'utf8');
      jsonData = await JSON.parse(rawData);
      dataArr = [...Object.keys(jsonData).map((key) => jsonData[key])];
      oShips = electronStore.get('ownedShips') as string[];
      formationData = electronStore.get('formations') as Formation[];
    } else {
      const userDir = app.getPath('userData');
      const resourceDir = process.resourcesPath;
      await fsPromises
        .access(`${userDir}\\resources\\ships.json`, fs.constants.F_OK)
        .then(async () => {
          console.log('can access, has been created. use file from appdata (updated at least once)');
          const rawData = await fsPromises.readFile(`${userDir}\\resources\\ships.json`, 'utf8');
          jsonData = JSON.parse(rawData);
        })
        .catch(async () => {
          console.error('cannot access, not created yet. use file provided in build');
          const rawData = await fsPromises.readFile(`${resourceDir}\\ships.json`, 'utf8');
          jsonData = JSON.parse(rawData);
        });
      dataArr = [...Object.keys(jsonData).map((key) => jsonData[key])];
      oShips = electronStore.get('ownedShips') as string[];
      formationData = electronStore.get('formations') as Formation[];
    }
    return {
      shipData: dataArr,
      config: configData,
      ownedShips: oShips,
      formations: formationData,
      isOk: true,
      msg: 'success',
    };
  } catch (error) {
    return {
      shipData: dataArr,
      config: configData,
      ownedShips: oShips,
      formations: formationData,
      isOk: false,
      msg: error.message,
    };
  }
});
/*
ipcMain.handle('get-ship-data', async (event, arg) => {
  return shipData;
});

ipcMain.handle('get-ship-by-id', async (event, id) => {
  return shipData.getShipById(id);
});
*/
