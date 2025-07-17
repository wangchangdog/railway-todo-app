import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import { listSlice } from './list';
import { taskSlice } from './task';
import modalReducer from './modalSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    list: listSlice.reducer,
    task: taskSlice.reducer,
    modal: modalReducer,
  },
});
