import { combineReducers } from '@reduxjs/toolkit';
import shipListSlice from './slices/shipListSlice';
import shipDetailsSlice from './slices/shipDetailsSlice';

const rootReducer = combineReducers({
  shipList: shipListSlice,
  shipDetails: shipDetailsSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
