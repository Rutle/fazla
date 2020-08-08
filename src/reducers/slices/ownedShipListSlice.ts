import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '../../util/shipdatatypes';
import { AppDispatch, AppThunk } from '../../store';
import { saveOwnedShipData } from '../../util/appUtilities';
import { setCurrentState } from './appStateSlice';

const initialState: string[] = [];

const ownedShipListSlice = createSlice({
  name: 'ownedShipListSlice',
  initialState,
  reducers: {
    resetList() {
      return initialState;
    },
    addShipId(state, action: PayloadAction<string>) {
      console.log('addShip', [...state, action.payload]);
      return [...state, action.payload];
    },
    setOwnedList(state, action: PayloadAction<string[]>) {
      return action.payload;
    },
    removeShip(state, action: PayloadAction<string>) {
      const id = action.payload;
      const newState = state.filter((cId) => cId !== id);
      return newState;
    },
  },
});

export const { resetList, addShipId, setOwnedList, removeShip } = ownedShipListSlice.actions;

/**
 * Add ship id to owned list and to the config file.
 * @param {string} id Id of the ship.
 */
export const addShip = (id: string): AppThunk => async (dispatch: AppDispatch, getState) => {
  let result: { isOk: boolean; msg: string } = { isOk: false, msg: '' };
  try {
    console.log('[SAVE]: Slice saving owned ship data: current ships:', getState().ownedShips);
    const ownedShips = [...getState().ownedShips, id];
    console.log('[SAVE]: new ship ID: ', id, ' new list: ', ownedShips);
    result = await saveOwnedShipData(ownedShips);
  } catch (e) {
    console.log('[SAVE]: Slice owned ship data error: ', e);
    dispatch(setCurrentState({ cState: 'ERROR', cMsg: e.message }));
  }
  console.log(result);
  if (result.isOk) {
    console.log('[SAVE]: is OK');
    dispatch(addShipId(id));
  } else {
    console.log('[SAVE]: result not ok', result.isOk, result.msg);
  }

  // dispatch(setCurrentState({ cState: 'RUNNING', cMsg: 'Running.' }));
};
export default ownedShipListSlice.reducer;
