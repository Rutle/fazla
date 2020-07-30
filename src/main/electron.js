"use strict";
exports.__esModule = true;
// Modules to control application life and create native browser window
var electron_1 = require("electron");
var path = require("path");
var isDev = require("electron-is-dev");
require("electron-reload");
var mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        width: 1350,
        height: 900,
        // titleBarStyle: 'hidden',
        frame: false,
        //thickFrame: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : "file://" + path.join(__dirname, '../build/index.html'));
    mainWindow.removeMenu();
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.whenReady().then(function () {
    createWindow();
    electron_1.app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
electron_1.ipcMain.on('close-application', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.ipcMain.on('minimize-application', function () {
    mainWindow.minimize();
});
electron_1.ipcMain.on('maximize-application', function () {
    mainWindow.maximize();
});
electron_1.ipcMain.on('restore-application', function () {
    mainWindow.restore();
});
electron_1.ipcMain.on('get-config', function () {
    console.log(electron_1.app.getPath('userData'));
});
