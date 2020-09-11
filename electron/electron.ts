// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import * as fs from 'fs';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import 'electron-reload';
import { Ship, Formation, AppConfig } from '../src/util/types';
// import DataStore from '../src/util/dataStore';

let mainWindow: BrowserWindow;
const electronStore = new Store();
const fsPromises = fs.promises;
// const shipData = new DataStore();

const SHIPAPIURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
const THEMECOLOR = 'dark';

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 900,
    frame: false,
    //thickFrame: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  mainWindow.removeMenu();
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
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

/**
 * Get owned ship data from config data file.
 */
ipcMain.handle('get-owned-ship-data', async (event) => {
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
  try {
    const rawData = JSON.stringify(arg);
    if (process.env.NODE_ENV === 'development') {
      console.log('DEVELOPMENT');
      await fsPromises.writeFile(path.join(__dirname, '../src/data/ships.json'), rawData, 'utf8');
    } else {
      const userDir = app.getPath('userData');
      await fsPromises.writeFile(`${userDir}\\resources\\ships.json`, rawData, 'utf8');
    }
  } catch (error) {
    console.log('Failure save');
    return { isOk: false, msg: error.message };
  }
  console.log('Successful save');
  return { isOk: true, msg: 'Ship data saved succesfully.' };
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
    return { isOk: false, msg: e.message };
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
    return { isOk: false, msg: e.message };
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
    return { isOk: false, msg: e.message };
  }
  return { isOk: true, msg: 'Formation data saved succesfully.' };
});

/**
 * Initialize by getting data from .json and config data from config file.
 */
ipcMain.handle('initData', async (event, arg) => {
  let jsonData: { [key: string]: Ship } = {};
  let dataArr: Ship[] = [];
  let oShips: string[] = [];
  let formationData: Formation[] = [];
  let configData: AppConfig = { jsonURL: '', themeColor: 'dark', firstTime: false, formHelpTooltip: true };

  try {
    if (!electronStore.has('firstRun')) {
      electronStore.set('firstRun', false);
      electronStore.set({
        config: {
          jsonURL: SHIPAPIURL,
          themeColor: THEMECOLOR,
          formHelpTooltip: true,
          firstTime: true,
        },
        ownedShips: [],
        formations: [],
      });
    }
    configData = electronStore.get('config') as AppConfig;
    if (process.env.NODE_ENV === 'development') {
      console.log('DEVELOPMENT');
      const rawData = await fsPromises.readFile(path.join(__dirname, '../src/data/ships.json'), 'utf8');
      jsonData = await JSON.parse(rawData);
      dataArr = [...Object.keys(jsonData).map((key) => jsonData[key])];
      oShips = electronStore.get('ownedShips') as string[];
      formationData = electronStore.get('formations') as Formation[];
    } else {
      const userDir = app.getPath('userData');
      const appDirCont = await fsPromises.readdir(`${userDir}\\resources`);
      console.log(appDirCont);
      const rawData = await fsPromises.readFile(`${userDir}\\resources\\ships.json`, 'utf8');
      jsonData = JSON.parse(rawData);
      dataArr = [...Object.keys(jsonData).map((key) => jsonData[key])];
      oShips = electronStore.get('ownedShips') as string[];
      formationData = electronStore.get('formations') as Formation[];
    }
  } catch (error) {
    console.log('error', error);
    return { shipData: dataArr, config: configData, ownedShips: oShips, formations: formationData, msg: error.message };
  }
  console.log('dataArr: ', dataArr.length);
  return { shipData: dataArr, config: configData, ownedShips: oShips, formations: formationData, msg: 'success' };
});
/*
ipcMain.handle('get-ship-data', async (event, arg) => {
  return shipData;
});

ipcMain.handle('get-ship-by-id', async (event, id) => {
  return shipData.getShipById(id);
});
*/
