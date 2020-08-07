import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '../../util/shipdatatypes';

const initialState: string[] = [];

const ownedShipListSlice = createSlice({
  name: 'ownedShipListSlice',
  initialState,
  reducers: {
    resetList() {
      return initialState;
    },
    addShip(state, action: PayloadAction<string>) {
      console.log('addShip', [...state, action.payload]);
      return [...state, action.payload];
    },
    removeShip(state, action: PayloadAction<string>) {
      const id = action.payload;
      const newState = state.filter((cId) => cId !== id);
      return newState;
    },
  },
});

export const { resetList, addShip, removeShip } = ownedShipListSlice.actions;

export default ownedShipListSlice.reducer;
