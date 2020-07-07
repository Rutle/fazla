import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipDataSimple } from '../../components/util/shipdata';

const initialState: ShipDataSimple = {
  ships: [],
};

const shipListSlice = createSlice({
  name: 'shipListSlice',
  initialState,
  reducers: {
    setList(state, action: PayloadAction<ShipDataSimple>) {
      return action.payload;
    },
    resetList() {
      return initialState;
    },
  },
});

export const { setList, resetList } = shipListSlice.actions;

export default shipListSlice.reducer;
