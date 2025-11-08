import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './slice';
import authReducer from "../src/component/redux/authSlice";

export const store = configureStore({
  reducer: {
    example: exampleReducer, // you can add more slices later here
    auth: authReducer,
  },
});