import { ipcRenderer, contextBridge } from 'electron';
console.log('preload.js loaded');
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "api", {
    /*
    closeApp: (channel: string, data: any) => {
      // whitelist channels
      let validChannels = ["close-application"];
      if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
      }
      ipcRenderer.send('close-application');
  },*/
    electronIpcSend: (channel: string, ...arg: any) => {
      let validChannels = ["close-application"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, arg);
      }
    },
      /*
      receive: (channel: string, func: (arg0: any) => void) => {
          let validChannels = ["close-application"];
          if (validChannels.includes(channel)) {
              // Deliberately strip event as it includes `sender` 
              ipcRenderer.on(channel, (event, ...args) => func(...args));
          }
      }
      */
  }
);