import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '../../components/util/shipdata';

interface Formation {
  [key: string]: ShipSimple;
}

const initialState: Formation = {
  0: {
    id: '',
    name: '1',
    class: '',
  },
  1: {
    id: '',
    name: '2',
    class: '',
  },
  2: {
    id: '',
    name: '3',
    class: '',
  },
  3: {
    id: '',
    name: '4',
    class: '',
  },
  4: {
    id: '',
    name: '5',
    class: '',
  },
  5: {
    id: '',
    name: '6',
    class: '',
  },
};

const formationGridSlice = createSlice({
  name: 'formationGridSlice',
  initialState,
  reducers: {
    setShip(state, action: PayloadAction<{ index: number; data: ShipSimple }>) {
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
