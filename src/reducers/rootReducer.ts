import { combineReducers } from '@reduxjs/toolkit';
import shipListSlice from './slices/shipListSlice';
import shipDetailsSlice from './slices/shipDetailsSlice';
import ownedShipListSlice from './slices/ownedShipListSlice';
import programConfigSlice from './slices/programConfigSlice';
import listStateSlice from './slices/listStateSlice';
import ownedSearchListSlice from './slices/ownedSearchListSlice';
import formationGridSlice from './slices/formationGridSlice';

const rootReducer = combineReducers({
  shipList: shipListSlice,
  shipDetails: shipDetailsSlice,
  ownedShips: ownedShipListSlice,
  config: programConfigSlice,
  listState: listStateSlice,
  ownedSearchList: ownedSearchListSlice,
  formationGrid: formationGridSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
