import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { name: string; hullType: string; nationality: string; rarity: string } = {
  name: '',
  hullType: '',
  nationality: '',
  rarity: '',
};

const searchParametersSlice = createSlice({
  name: 'searchParametersSlice',
  initialState,
  reducers: {
    setParameter(state, action: PayloadAction<{ key: string; value: string }>) {
      console.log('search parameter slice: ', action.payload);
      const { key, value } = action.payload;
      return { ...state, [key]: value };
    },
    resetParameters() {
      return initialState;
    },
  },
});

export const { setParameter, resetParameters } = searchParametersSlice.actions;

export default searchParametersSlice.reducer;
