import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../src/component/redux/authSlice";
import globalReducer from "../src/component/redux/globalSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    global: globalReducer,
  },
});