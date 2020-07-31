// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import 'electron-reload';

let mainWindow: BrowserWindow;
const electronStore = new Store();

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 900,
    // titleBarStyle: 'hidden',
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
  console.log(`${__dirname}`);
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

/*
ipcMain.on('get-config', () => {
  console.log(app.getPath('userData'));
});
*/

ipcMain.handle('get-config', async (event, arg) => {
  return app.getPath('userData');
});

ipcMain.handle('get-ship-data', async (event) => {
  const ships = electronStore.get('ships');
  if (ships) {
    return { shipData: ships, isConfigShipData: true };
  } else {
    return { shipData: [], isConfigShipData: false };
  }
});

ipcMain.handle('save-ship-data', async (event, arg) => {
  // console.log('save, ', arg[100]);
  // console.log(app.getPath('userData'));
  electronStore.set({
    ships: arg,
  });
  // console.log(electronStore.get('ships.100.rarity'));
});
