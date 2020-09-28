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
// import DataStore from '../src/util/dataStore';
var mainWindow;
var electronStore = new electron_store_1["default"]({
    cwd: electron_1.app.getPath('userData')
});
var fsPromises = fs.promises;
// const shipData = new DataStore();
var SHIPAPIURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
var THEMECOLOR = 'dark';
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        width: 1350,
        height: 900,
        frame: false,
        //thickFrame: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : "file://" + path.join(__dirname, '../build/index.html'));
    mainWindow.removeMenu();
    // Open the DevTools.
    if (isDev)
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
/*
if (process.env.NODE_ENV === 'development') {
  console.log('DEVELOPMENT', ' load .json');
  const rawData = fs.readFileSync(path.join(__dirname, '../src/data/ships.json'), 'utf8');
  const jsonData = JSON.parse(rawData);
  const dataArr = [...Object.keys(jsonData).map((key) => jsonData[key])];
  shipData.setArray(dataArr);
}
*/
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
electron_1.ipcMain.on('open-logs', function () {
    var userDir = electron_1.app.getPath('userData');
    console.log(userDir + "\\logs");
});
/**
 * Get owned ship data from config data file.
 */
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
/**
 * Save ship data to json file.
 */
electron_1.ipcMain.handle('save-ship-data', function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    var today, date, rawData_1, userDir_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                today = new Date();
                date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                rawData_1 = JSON.stringify(arg);
                if (!(process.env.NODE_ENV === 'development')) return [3 /*break*/, 3];
                return [4 /*yield*/, fsPromises.writeFile(path.join(__dirname, '../src/data/ships.json'), rawData_1, 'utf8')];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                userDir_1 = electron_1.app.getPath('userData');
                return [4 /*yield*/, fsPromises
                        .access(userDir_1 + "\\resources\\ships.json", fs.constants.F_OK)
                        .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('can access, has been created. do not create directory but just save.');
                                    return [4 /*yield*/, fsPromises.writeFile(userDir_1 + "\\resources\\ships.json", rawData_1, 'utf8')];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })["catch"](function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.error('cannot access, not created yet. create directory now.');
                                    return [4 /*yield*/, fsPromises.mkdir(userDir_1 + "\\resources")];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, fsPromises.writeFile(userDir_1 + "\\resources\\ships.json", rawData_1, 'utf8')];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                electronStore.set('config.updateDate', date);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.log('Failure save');
                return [2 /*return*/, { updateDate: date, isOk: false, msg: error_1.message }];
            case 7: return [2 /*return*/, { updateDate: date, isOk: true, msg: 'Ship data saved succesfully.' }];
        }
    });
}); });
/**
 * Save owned ship data to config data file.
 */
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
        return [2 /*return*/, { isOk: true, msg: 'Owned ships saved succesfully.' }];
    });
}); });
/**
 * Function that saves given formation data.
 */
electron_1.ipcMain.handle('save-formation-data', function (event, data) { return __awaiter(void 0, void 0, void 0, function () {
    var fData;
    return __generator(this, function (_a) {
        try {
            fData = data;
            electronStore.set({
                formations: fData
            });
        }
        catch (e) {
            return [2 /*return*/, { isOk: false, msg: e.message }];
        }
        return [2 /*return*/, { isOk: true, msg: 'Formation data saved succesfully.' }];
    });
}); });
/**
 * Function that saves given config data.
 */
electron_1.ipcMain.handle('save-config', function (event, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            electronStore.set({ config: data });
        }
        catch (e) {
            return [2 /*return*/, { isOk: false, msg: e.message }];
        }
        return [2 /*return*/, { isOk: true, msg: 'Config data saved succesfully.' }];
    });
}); });
/**
 * Function removes formation from .json config file.
 */
electron_1.ipcMain.handle('remove-formation-by-index', function (event, data) { return __awaiter(void 0, void 0, void 0, function () {
    var idx_1, formationData, newForms;
    return __generator(this, function (_a) {
        try {
            idx_1 = data;
            formationData = electronStore.get('formations');
            newForms = formationData.filter(function (item, index) { return index !== idx_1; });
            electronStore.set({
                formations: newForms
            });
        }
        catch (e) {
            return [2 /*return*/, { isOk: false, msg: e.message }];
        }
        return [2 /*return*/, { isOk: true, msg: 'Formation data saved succesfully.' }];
    });
}); });
/**
 * Initialize by getting data from .json and config data from config file.
 */
electron_1.ipcMain.handle('initData', function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonData, dataArr, oShips, formationData, configData, rawData, userDir_2, resourceDir_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jsonData = {};
                dataArr = [];
                oShips = [];
                formationData = [];
                configData = {
                    jsonURL: '',
                    themeColor: 'dark',
                    firstTime: false,
                    formHelpTooltip: true,
                    updateDate: ''
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                if (!electronStore.has('firstRun')) {
                    electronStore.set('firstRun', false);
                    electronStore.set({
                        config: {
                            jsonURL: SHIPAPIURL,
                            themeColor: THEMECOLOR,
                            formHelpTooltip: true,
                            firstTime: true,
                            updateDate: ''
                        },
                        ownedShips: [],
                        formations: []
                    });
                }
                configData = electronStore.get('config');
                if (!(process.env.NODE_ENV === 'development')) return [3 /*break*/, 4];
                return [4 /*yield*/, fsPromises.readFile(path.join(__dirname, '../src/data/ships.json'), 'utf8')];
            case 2:
                rawData = _a.sent();
                return [4 /*yield*/, JSON.parse(rawData)];
            case 3:
                jsonData = _a.sent();
                dataArr = __spreadArrays(Object.keys(jsonData).map(function (key) { return jsonData[key]; }));
                oShips = electronStore.get('ownedShips');
                formationData = electronStore.get('formations');
                return [3 /*break*/, 6];
            case 4:
                userDir_2 = electron_1.app.getPath('userData');
                resourceDir_1 = process.resourcesPath;
                return [4 /*yield*/, fsPromises
                        .access(userDir_2 + "\\resources\\ships.json", fs.constants.F_OK)
                        .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var rawData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('can access, has been created. use file from appdata (updated at least once)');
                                    return [4 /*yield*/, fsPromises.readFile(userDir_2 + "\\resources\\ships.json", 'utf8')];
                                case 1:
                                    rawData = _a.sent();
                                    jsonData = JSON.parse(rawData);
                                    return [2 /*return*/];
                            }
                        });
                    }); })["catch"](function () { return __awaiter(void 0, void 0, void 0, function () {
                        var rawData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.error('cannot access, not created yet. use file provided in build');
                                    return [4 /*yield*/, fsPromises.readFile(resourceDir_1 + "\\ships.json", 'utf8')];
                                case 1:
                                    rawData = _a.sent();
                                    jsonData = JSON.parse(rawData);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 5:
                _a.sent();
                dataArr = __spreadArrays(Object.keys(jsonData).map(function (key) { return jsonData[key]; }));
                oShips = electronStore.get('ownedShips');
                formationData = electronStore.get('formations');
                _a.label = 6;
            case 6: return [2 /*return*/, {
                    shipData: dataArr,
                    config: configData,
                    ownedShips: oShips,
                    formations: formationData,
                    isOk: true,
                    msg: 'success'
                }];
            case 7:
                error_2 = _a.sent();
                return [2 /*return*/, {
                        shipData: dataArr,
                        config: configData,
                        ownedShips: oShips,
                        formations: formationData,
                        isOk: false,
                        msg: error_2.message
                    }];
            case 8: return [2 /*return*/];
        }
    });
}); });
/*
ipcMain.handle('get-ship-data', async (event, arg) => {
  return shipData;
});

ipcMain.handle('get-ship-by-id', async (event, id) => {
  return shipData.getShipById(id);
});
*/
