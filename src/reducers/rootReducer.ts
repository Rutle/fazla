import { combineReducers } from '@reduxjs/toolkit';
import shipSearchListSlice from './slices/shipSearchListSlice';
import ownedShipListSlice from './slices/ownedShipListSlice';
import programConfigSlice from './slices/programConfigSlice';
import appStateSlice from './slices/appStateSlice';
import ownedSearchListSlice from './slices/ownedSearchListSlice';
import formationGridSlice from './slices/formationGridSlice';
import searchParametersSlice from './slices/searchParametersSlice';
import toastSlice from './slices/toastSlice';

const rootReducer = combineReducers({
  shipSearchList: shipSearchListSlice,
  ownedShips: ownedShipListSlice,
  config: programConfigSlice,
  appState: appStateSlice,
  ownedSearchList: ownedSearchListSlice,
  formationGrid: formationGridSlice,
  searchParameters: searchParametersSlice,
  toastList: toastSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
