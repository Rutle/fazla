import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ListState {
  id: string;
  index: number;
}

const initialState = {
  all: {
    id: '',
    index: '',
  },
  owned: {
    id: '',
    index: '',
  },
};

const listStateSlice = createSlice({
  name: 'listStateSlice',
  initialState,
  reducers: {
    setListState(state, action: PayloadAction<{ key: string; data: ListState }>) {
      return {
        ...state,
        [action.payload.key]: action.payload.data,
      };
    },
    resetList() {
      return initialState;
    },
  },
});

export const { setListState, resetList } = listStateSlice.actions;

export default listStateSlice.reducer;
