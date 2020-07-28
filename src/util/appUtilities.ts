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
