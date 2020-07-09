import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Setting {
  key: string;
  value: string;
}

const initialState = {
  themeColor: 'dark',
};

const programConfigSlice = createSlice({
  name: 'programConfigSlice',
  initialState,
  reducers: {
    setState(state, action: PayloadAction<Setting>) {
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    },
    resetState(state, action) {
      return initialState;
    },
  },
});

export const { setState, resetState } = programConfigSlice.actions;

export default programConfigSlice.reducer;
