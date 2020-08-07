import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
// import { useDispatch } from 'react-redux';
import rootReducer, { RootState } from './reducers/rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware({ immutableCheck: false, serializableCheck: false })],
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
// export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
