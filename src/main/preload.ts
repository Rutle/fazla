import { ipcRenderer, contextBridge, shell } from 'electron';
console.log('[preload.js LOADED]');

const validSendChannels = ['close-application', 'restore-application', 'minimize-application', 'open-logs'];
const validSaveChannels = ['save-ship-data', 'save-owned-ships', 'save-formation-data', 'save-config'];
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    electronShell: async (str: string) => {
      await shell.openExternal(str);
    },
    electronInitData: async (channel: string, ...arg: any): Promise<any> => {
      if (channel === 'initData') {
        return ipcRenderer.invoke(channel);
      }
    },
    electronSaveData: async (channel: string, ...arg: any): Promise<any> => {
      if (validSaveChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, ...arg);
      }
    },
    electronRemoveAFormation: async (channel: string, ...arg: any): Promise<any> => {
      if (channel === 'remove-formation-by-index') {
        return ipcRenderer.invoke(channel, ...arg);
      }
    },
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
      if (validSendChannels.includes(channel)) {
        ipcRenderer.send(channel);
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