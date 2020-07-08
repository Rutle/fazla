import { combineReducers } from '@reduxjs/toolkit';
import shipListSlice from './slices/shipListSlice';
import shipDetailsSlice from './slices/shipDetailsSlice';
import ownedShipListSlice from './slices/ownedShipListSlice';

const rootReducer = combineReducers({
  shipList: shipListSlice,
  shipDetails: shipDetailsSlice,
  ownedShips: ownedShipListSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
