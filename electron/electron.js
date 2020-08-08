"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
// Modules to control application life and create native browser window
var electron_1 = require("electron");
var electron_store_1 = require("electron-store");
var fs = require("fs");
var path = require("path");
var isDev = require("electron-is-dev");
require("electron-reload");
var mainWindow;
var electronStore = new electron_store_1["default"]();
var fsPromises = fs.promises;
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
    console.log("" + __dirname);
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
electron_1.ipcMain.handle('get-config', function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, electron_1.app.getPath('userData')];
    });
}); });
electron_1.ipcMain.handle('get-owned-ship-data', function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var ships;
    return __generator(this, function (_a) {
        ships = electronStore.get('ownedShips');
        if (ships) {
            return [2 /*return*/, { shipData: ships, isConfigShipData: true }];
        }
        else {
            return [2 /*return*/, { shipData: [], isConfigShipData: false }];
        }
        return [2 /*return*/];
    });
}); });
/* change to owned ship data ids */
electron_1.ipcMain.handle('save-ship-data', function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    var rawData, userDir, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                rawData = JSON.stringify(arg);
                if (!(process.env.NODE_ENV === 'development')) return [3 /*break*/, 2];
                console.log('DEVELOPMENT');
                return [4 /*yield*/, fsPromises.writeFile(path.join(__dirname, '../src/data/ships.json'), rawData, 'utf8')];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                userDir = electron_1.app.getPath('userData');
                return [4 /*yield*/, fsPromises.writeFile(userDir + "\\resources\\ships.json", rawData, 'utf8')];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.log('Failure save');
                return [2 /*return*/, { isOk: false, msg: error_1.message }];
            case 6:
                console.log('Successful save');
                return [2 /*return*/, { isOk: true, msg: 'Ship data saved succesfully.' }];
        }
    });
}); });
electron_1.ipcMain.handle('save-owned-ships', function (event, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            electronStore.set({
                ownedShips: data
            });
        }
        catch (error) {
            return [2 /*return*/, { isOk: false, msg: error.message }];
        }
        return [2 /*return*/, { isOk: true, msg: 'Owned ships succesfully saved.' }];
    });
}); });
electron_1.ipcMain.handle('initData', function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonData, dataArr, oShips, rawData, userDir, appDirCont, rawData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jsonData = {};
                dataArr = [];
                oShips = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                if (!(process.env.NODE_ENV === 'development')) return [3 /*break*/, 4];
                console.log('DEVELOPMENT');
                return [4 /*yield*/, fsPromises.readFile(path.join(__dirname, '../src/data/ships.json'), 'utf8')];
            case 2:
                rawData = _a.sent();
                return [4 /*yield*/, JSON.parse(rawData)];
            case 3:
                jsonData = _a.sent();
                dataArr = __spreadArrays(Object.keys(jsonData).map(function (key) { return jsonData[key]; }));
                oShips = electronStore.get('ownedShips');
                return [3 /*break*/, 7];
            case 4:
                userDir = electron_1.app.getPath('userData');
                return [4 /*yield*/, fsPromises.readdir(userDir + "\\resources")];
            case 5:
                appDirCont = _a.sent();
                console.log(appDirCont);
                return [4 /*yield*/, fsPromises.readFile(userDir + "\\resources\\ships.json", 'utf8')];
            case 6:
                rawData = _a.sent();
                jsonData = JSON.parse(rawData);
                dataArr = __spreadArrays(Object.keys(jsonData).map(function (key) { return jsonData[key]; }));
                oShips = electronStore.get('ownedShips');
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_2 = _a.sent();
                console.log('error', error_2);
                return [2 /*return*/, { shipData: dataArr, config: {}, ownedShips: oShips, msg: error_2.message }];
            case 9:
                console.log('dataArr: ', dataArr.length);
                return [2 /*return*/, { shipData: dataArr, config: {}, ownedShips: oShips, msg: 'success' }];
        }
    });
}); });
