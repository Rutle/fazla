import { combineReducers } from '@reduxjs/toolkit';
import shipSearchListSlice from './slices/shipSearchListSlice';
import shipDetailsSlice from './slices/shipDetailsSlice';
import ownedShipListSlice from './slices/ownedShipListSlice';
import programConfigSlice from './slices/programConfigSlice';
import appStateSlice from './slices/appStateSlice';
import ownedSearchListSlice from './slices/ownedSearchListSlice';
import formationGridSlice from './slices/formationGridSlice';
import formationModalSlice from './slices/formationModalSlice';
import searchParametersSlice from './slices/searchParametersSlice';

const rootReducer = combineReducers({
  shipSearchList: shipSearchListSlice,
  shipDetails: shipDetailsSlice,
  ownedShips: ownedShipListSlice,
  config: programConfigSlice,
  appState: appStateSlice,
  ownedSearchList: ownedSearchListSlice,
  formationGrid: formationGridSlice,
  formationModal: formationModalSlice,
  searchParameters: searchParametersSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
