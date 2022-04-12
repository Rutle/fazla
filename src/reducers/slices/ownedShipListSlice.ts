import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, AppThunk } from '_/reducers/store';
import DataStore from '_/utils/dataStore';
import { saveOwnedShipData } from '_/utils/ipcAPI';
import { setErrorMessage, setIsUpdated } from './appStateSlice';
import { SearchAction, updateSearch } from './searchParametersSlice';

const initialState: string[] = [];

const ownedShipListSlice = createSlice({
  name: 'ownedShipListSlice',
  initialState,
  reducers: {
    resetList() {
      return initialState;
    },
    addShipId(state, action: PayloadAction<string>) {
      return [...state, action.payload];
    },
    setOwnedList(state, action: PayloadAction<string[]>) {
      return action.payload;
    },
    removeShipId(state, action: PayloadAction<string>) {
      const id = action.payload;
      const newState = state.filter((cId) => cId !== id);
      return newState;
    },
  },
});

export const { resetList, addShipId, setOwnedList, removeShipId } = ownedShipListSlice.actions;

/**
 * Add ship id to owned list.
 * @param {string} id Id of the ship.
 * @param {LocalForage} storage LocalForage store holding ship data.
 */
export const addShip =
  (id: string, storage?: LocalForage): AppThunk =>
  async (dispatch: AppDispatch, getState) => {
    let result: { isOk: boolean; msg: string } = { isOk: false, msg: '' };
    try {
      const platform = process.env.PLAT_ENV as string;
      const ownedShips = [...getState().ownedShips, id];
      if (platform === 'electron') {
        result = await saveOwnedShipData(ownedShips);
      }
      if (platform === 'web' && storage) {
        const res = await storage.setItem('ownedShips', ownedShips);
        result.isOk = res.length === ownedShips.length;
      }
      if (result.isOk) {
        dispatch(addShipId(id));
        dispatch(setIsUpdated({ key: 'OWNED', value: false }));
      }
    } catch (e) {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'There was an error with adding ship to docks.' }));
    }
  };

/**
 * Remove ship id from owned list.
 * @param {DataStore} shipData Datastore holding ship data.
 * @param {string} id Id of the ship.
 * @param {LocalForage} storage Holding data in IndexedDB.
 */
export const removeShip =
  (shipData: DataStore, id: string, storage?: LocalForage): AppThunk =>
  async (dispatch: AppDispatch, getState) => {
    let result: { isOk: boolean; msg: string } = { isOk: false, msg: '' };
    try {
      const platform = process.env.PLAT_ENV as string;
      const ownedShips = [...getState().ownedShips];
      const { appState } = getState();
      const newList = ownedShips.filter((cId) => cId !== id);
      if (platform === 'electron') {
        result = await saveOwnedShipData(newList);
      }
      if (platform === 'web' && storage) {
        const res = await storage.setItem('ownedShips', newList);
        result.isOk = res.length === newList.length;
      }
      if (result.isOk) {
        dispatch(setOwnedList(newList));
        dispatch(setIsUpdated({ key: 'OWNED', value: false }));
        if (appState.cToggle === 'OWNED') {
          dispatch(
            updateSearch(shipData, SearchAction.UpdateList, {
              list: 'OWNED',
            })
          );
        }
      }
    } catch (e) {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'There was an error with adding ship to docks.' }));
    }
  };
export default ownedShipListSlice.reducer;
