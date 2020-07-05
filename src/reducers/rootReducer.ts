import { combineReducers } from '@reduxjs/toolkit';
// import projects from './slices/projects';

const rootReducer = combineReducers({});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
