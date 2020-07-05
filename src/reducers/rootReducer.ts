import { combineReducers } from '@reduxjs/toolkit';
import shipListSlice from './slices/shipListSlice';

const rootReducer = combineReducers({
  shipList: shipListSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
