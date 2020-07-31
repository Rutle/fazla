import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ship } from '../../util/shipdatatypes';

interface Formation {
  [key: string]: Ship;
}

const initialState: Formation = {};

const formationGridSlice = createSlice({
  name: 'formationGridSlice',
  initialState,
  reducers: {
    setShip(state, action: PayloadAction<{ index: number; data: Ship }>) {
      console.log(action.payload.data);
      return {
        ...state,
        [action.payload.index]: action.payload.data,
      };
    },
    setFormation(state, action: PayloadAction<Formation>) {
      return initialState;
    },
    resetList() {
      return initialState;
    },
  },
});

export const { setShip } = formationGridSlice.actions;

export default formationGridSlice.reducer;
