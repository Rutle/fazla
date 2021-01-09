import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, AppThunk } from '_/reducers/store';
import { saveOwnedShipData } from '../../utils/appUtilities';
import { setErrorMessage } from './appStateSlice';

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
export const addShip = (id: string, name: string): AppThunk => async (dispatch: AppDispatch, getState) => {
  let result: { isOk: boolean; msg: string } = { isOk: false, msg: '' };
  try {
    const ownedShips = [...getState().ownedShips, id];
    // result = await saveOwnedShipData(ownedShips);
    if (result.isOk) {
      dispatch(addShipId(id));
    }
  } catch (e) {
    dispatch(setErrorMessage({ cState: 'ERROR', eMsg: e.message, eState: 'ERROR' }));
  }
};
export default ownedShipListSlice.reducer;
