import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowMinimize, faWindowMaximize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
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
document.onreadystatechange = (event) => {
  if (document.readyState == 'complete') {
    handleWindowControls();
  }
};

function handleWindowControls() {
  document.getElementById('close-button').addEventListener('click', (event) => {
    win.close();
  });
}
*/
const TitleBar: React.FC = () => {
  const closeWindow = () => {
    ipcRenderer.send('close-application');
  };
  return (
    <header id="titlebar">
      <div id="drag-region">
        <div id="window-title">
          <span>Azur Lane</span>
        </div>
        <div id="window-controls">
          <div className="button" id="min-button">
            <FontAwesomeIcon icon={faWindowMinimize} size="xs" />
          </div>
          <div className="button" id="max-button">
            <FontAwesomeIcon icon={faWindowMaximize} size="xs" />
          </div>
          <div className="button" id="restore-button">
            <FontAwesomeIcon icon={faWindowRestore} size="xs" />
          </div>
          <div className="button" id="close-button" onClick={() => closeWindow()}>
            <FontAwesomeIcon icon={faTimes} size="xs" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TitleBar;
