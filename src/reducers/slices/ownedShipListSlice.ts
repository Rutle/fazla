import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '../../util/shipdata';

const initialState: ShipSimple[] = [
  {
    id: '107',
    name: 'HMS Dido',
    class: 'Dido',
    rarity: 'Super Rare',
    nationality: 'Royal Navy',
    hullType: 'Light Cruiser',
  },
];

const ownedShipListSlice = createSlice({
  name: 'ownedShipListSlice',
  initialState,
  reducers: {
    resetList() {
      return initialState;
    },
    addShip(state, action: PayloadAction<ShipSimple>) {
      return [...state, action.payload];
    },
    removeShip(state, action: PayloadAction<string>) {
      return state.filter((item, index) => {
        if (item.id === action.payload) return false;
        return true;
      });
    },
  },
});

export const { resetList, addShip, removeShip } = ownedShipListSlice.actions;

export default ownedShipListSlice.reducer;
