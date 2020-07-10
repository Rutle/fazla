import { combineReducers } from '@reduxjs/toolkit';
import shipListSlice from './slices/shipListSlice';
import shipDetailsSlice from './slices/shipDetailsSlice';
import ownedShipListSlice from './slices/ownedShipListSlice';
import programConfigSlice from './slices/programConfigSlice';
import listStateSlice from './slices/listStateSlice';

const rootReducer = combineReducers({
  shipList: shipListSlice,
  shipDetails: shipDetailsSlice,
  ownedShips: ownedShipListSlice,
  config: programConfigSlice,
  listState: listStateSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
