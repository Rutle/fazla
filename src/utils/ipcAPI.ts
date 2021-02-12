import { BasicResponse, Ship, Formation, AppConfig } from '_/types/types';
import { urlValidation } from './appUtilities';

// Renderer to Main
export const closeWindow = (): void => {
  window.api.electronIpcSend('close-application');
};

export const restoreWindow = (): void => {
  window.api.electronIpcSend('restore-application');
};

export const minimizeWindow = (): void => {
  window.api.electronIpcSend('minimize-application');
};

export const maximizeWindow = (): void => {
  window.api.electronIpcSend('maximize-application');
};

export const openLogs = (): void => {
  window.api.electronIpcSend('open-logs');
};

export const checkResource = async (): Promise<BasicResponse> => {
  return window.api.electronCheckResources('resource-check');
};

/**
 * Function that calls electron along with data to save data to .json file.
 * @param data Data that is saved to .json.
 */
export const saveShipData = async (data = {}): Promise<BasicResponse> => {
  return window.api.electronSaveData('save-ship-data', data).then((result: BasicResponse) => {
    return result;
  });
};

/**
 * Function that calls electron along with owned ship data to save data to config file.
 * @param {string[]} data Owned ship data to be saved to config.
 */
export const saveOwnedShipData = async (data: string[] = []): Promise<BasicResponse> => {
  return window.api.electronSaveData('save-owned-ships', data).then((result: BasicResponse) => {
    return result;
  });
};
/**
 * Function that calls electron to save given data to electron-store .json config file.
 * @param {Formation[]} data Formation data
 */
export const saveFormationData = async (data: Formation[] = []): Promise<BasicResponse> => {
  return window.api.electronSaveData('save-formation-data', data).then((result: BasicResponse) => {
    return result;
  });
};

/**
 * Function that calls electron to remove a formation from electron-store .json config file.
 */
export const removeAFormation = async (index = 0): Promise<BasicResponse> => {
  return window.api.electronRemoveAFormation('remove-formation-by-index', index).then((result: BasicResponse) => {
    return result;
  });
};

export const renameAFormation = async (idx: number, name: string): Promise<BasicResponse> => {
  return window.api
    .electronRenameFormation('rename-formation-by-index', { idx, name })
    .then((result: BasicResponse) => {
      return result;
    });
};

/**
 * Function that calls electron to save config to electron-store .json config file.
 * @param {AppConfig} data Config data
 */
export const saveConfig = async (data: AppConfig): Promise<BasicResponse> => {
  return window.api.electronSaveData('save-config', data).then((result: BasicResponse) => {
    return result;
  });
};

export const openWikiUrl = async (str: string): Promise<void> => {
  if (urlValidation(str)) {
    return window.api.electronShell(str);
  }
  return Promise.resolve();
};

export const initData = async (
  platform: string
): Promise<
  {
    shipData: Ship[];
    config: AppConfig;
    ownedShips: string[];
    formations: Formation[];
  } & BasicResponse
> => {
  if (platform === 'electron') {
    return window.api
      .electronInitData('initData')
      .then(
        (
          result: { shipData: Ship[]; config: AppConfig; ownedShips: string[]; formations: Formation[] } & BasicResponse
        ) => result
      );
  }
  if (platform === 'web') {
    const shipData = JSON.parse(localStorage.getItem('shipData') as string) as Ship[];
    const config = JSON.parse(localStorage.getItem('config') as string) as AppConfig;
    const ownedShips = (JSON.parse(localStorage.getItem('ownedShips') as string) as string[]) || [];
    const formations = (JSON.parse(localStorage.getItem('formations') as string) as Formation[]) || [];
    let isOk = false;
    let msg = '';
    let code = '';
    if (shipData) {
      isOk = true;
    } else {
      msg = 'Could not find ship data.';
      code = 'ResNotFound';
    }

    return { shipData, config, ownedShips, formations, isOk, msg, code };
  }
  return {
    shipData: [],
    config: { jsonURL: '', themeColor: 'dark', firstTime: true, formHelpTooltip: false, isToast: true, updateDate: '' },
    ownedShips: [],
    formations: [],
    isOk: false,
    msg: '',
    code: '',
  };
};
