import { combineReducers } from '@reduxjs/toolkit';
import shipListSlice from './slices/shipListSlice';
import shipDetailsSlice from './slices/shipDetailsSlice';
import ownedShipListSlice from './slices/ownedShipListSlice';
import programConfigSlice from './slices/programConfigSlice';
import listStateSlice from './slices/listStateSlice';
import ownedSearchListSlice from './slices/ownedSearchListSlice';
import formationGridSlice from './slices/formationGridSlice';
import formationModalSlice from './slices/formationModalSlice';
import searchParametersSlice from './slices/searchParametersSlice';
import fullShipListSlice from './slices/fullShipListSlice';

const rootReducer = combineReducers({
  shipList: shipListSlice,
  shipDetails: shipDetailsSlice,
  ownedShips: ownedShipListSlice,
  config: programConfigSlice,
  listState: listStateSlice,
  ownedSearchList: ownedSearchListSlice,
  formationGrid: formationGridSlice,
  formationModal: formationModalSlice,
  searchParameters: searchParametersSlice,
  fullList: fullShipListSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
