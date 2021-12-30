import { configureStore } from '@reduxjs/toolkit';

import studyMaterial from './slices/studyMaterial';
import tutoring from './slices/tutoring';
import user from './slices/user';
import authentication from './slices/authentication';

const store = configureStore({
  reducer: {
    studyMaterial,
    tutoring,
    user,
    authentication,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface ThunkApiConfig {
  state: RootState,
  dispatch: AppDispatch
}

export default store;
