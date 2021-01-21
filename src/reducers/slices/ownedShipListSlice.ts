import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, AppThunk } from '_/reducers/store';
import DataStore from '_/utils/dataStore';
import { Ship } from '_/utils/types';
import { saveOwnedShipData } from '../../utils/appUtilities';
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
 */
export const addShip = (id: string): AppThunk => async (dispatch: AppDispatch, getState) => {
  let result: { isOk: boolean; msg: string } = { isOk: false, msg: '' };
  try {
    const ownedShips = [...getState().ownedShips, id];
    result = await saveOwnedShipData(ownedShips);
    if (result.isOk) {
      dispatch(addShipId(id));
      dispatch(setIsUpdated({ key: 'OWNED', value: false }));
    }
  } catch (e) {
    dispatch(
      setErrorMessage({ cState: 'ERROR', eMsg: 'There was an error with adding ship to docks.', eState: 'ERROR' })
    );
  }
};

/**
 * Remove ship id from owned list.
 * @param {string} id Id of the ship.
 */
export const removeShip = (shipData: DataStore, id: string): AppThunk => async (dispatch: AppDispatch, getState) => {
  let result: { isOk: boolean; msg: string } = { isOk: false, msg: '' };
  try {
    const ownedShips = [...getState().ownedShips];
    const newList = ownedShips.filter((cId) => cId !== id);
    result = await saveOwnedShipData(newList);
    if (result.isOk) {
      dispatch(setOwnedList(newList));
      dispatch(setIsUpdated({ key: 'OWNED', value: false }));
      dispatch(
        updateSearch(shipData, SearchAction.UpdateList, {
          name: '',
          cat: '',
          param: '',
          list: 'OWNED',
          id: '',
        })
      );
    }
  } catch (e) {
    dispatch(
      setErrorMessage({ cState: 'ERROR', eMsg: 'There was an error with adding ship to docks.', eState: 'ERROR' })
    );
  }
};
export default ownedShipListSlice.reducer;
