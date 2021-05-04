import { ipcRenderer, contextBridge, shell } from 'electron';
import { AppConfig, BasicResponse, Formation, Ship, VersionInfo } from '_/types/types';

const validSendChannels = [
  'close-application',
  'restore-application',
  'minimize-application',
  'open-logs',
  'maximize-application',
];
const validSaveChannels = ['save-data', 'save-owned-ships', 'save-formation-data', 'save-config'];
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  electronShell: async (str: string) => {
    await shell.openExternal(str);
  },
  electronInitData: async (channel: string): Promise<unknown> => {
    if (channel === 'initData') {
      return ipcRenderer.invoke(channel) as Promise<
        {
          shipData: Ship[];
          config: AppConfig;
          ownedShips: string[];
          formations: Formation[];
          versionInfo: VersionInfo;
        } & BasicResponse
      >;
    }
    return Promise.resolve();
  },
  electronCheckResources: async (channel: string): Promise<unknown> => {
    if (channel === 'resource-check') {
      return ipcRenderer.invoke(channel) as Promise<BasicResponse>;
    }
    return Promise.resolve();
  },
  electronSaveData: async (channel: string, ...arg: unknown[]): Promise<unknown> => {
    if (validSaveChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...arg) as Promise<BasicResponse>;
    }
    return Promise.resolve();
  },
  electronRemoveAFormation: async (channel: string, index: number): Promise<unknown> => {
    if (channel === 'remove-formation-by-index') {
      return ipcRenderer.invoke(channel, index) as Promise<BasicResponse>;
    }
    return Promise.resolve();
  },
  electronRenameFormation: async (channel: string, index: number): Promise<unknown> => {
    if (channel === 'rename-formation-by-index') {
      return ipcRenderer.invoke(channel, index) as Promise<BasicResponse>;
    }
    return Promise.resolve();
  },
  electronIpcSend: (channel: string) => {
    if (validSendChannels.includes(channel)) {
      ipcRenderer.send(channel);
    }
  },
});
