import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Formation {
  [key: number]: string;
}

const initialState: Formation = {};

const formationGridSlice = createSlice({
  name: 'formationGridSlice',
  initialState,
  reducers: {
    addShipToFormation(state, action: PayloadAction<{ index: number; id: string }>) {
      return {
        ...state,
        [action.payload.index]: action.payload.id,
      };
    },
    setFormation(state, action: PayloadAction<Formation>) {
      return initialState;
    },
    resetFormation() {
      return initialState;
    },
  },
});

export const { addShipToFormation, setFormation, resetFormation } = formationGridSlice.actions;

export default formationGridSlice.reducer;
