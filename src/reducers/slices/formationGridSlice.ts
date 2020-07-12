import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '../../components/util/shipdata';

interface Formation {
  [key: string]: ShipSimple;
}

const initialState: Formation = {
  0: {
    id: '',
    name: '',
    class: '',
  },
  1: {
    id: '',
    name: '',
    class: '',
  },
  2: {
    id: '',
    name: '',
    class: '',
  },
  3: {
    id: '',
    name: '',
    class: '',
  },
  4: {
    id: '',
    name: '',
    class: '',
  },
  5: {
    id: '',
    name: '',
    class: '',
  },
};

const formationGridSlice = createSlice({
  name: 'formationGridSlice',
  initialState,
  reducers: {
    setShip(state, action: PayloadAction<{ index: number; data: ShipSimple }>) {
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
