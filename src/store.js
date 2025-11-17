import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './slice';
import authReducer from "./component/redux/authslice";
import globalReducer from "./component/redux/globalSlice";

export const store = configureStore({
  reducer: {
    // example: exampleReducer, // you can add more slices later here
     auth: authReducer,
     global: globalReducer,
  },
});