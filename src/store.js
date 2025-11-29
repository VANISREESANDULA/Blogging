import { configureStore } from "@reduxjs/toolkit";
import { authReducer, articlesReducer } from "./component/redux/authslice";
import themeReducer from "./component/redux/themeSlice";
import fontReducer from "./component/redux/fontSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
    theme: themeReducer,
    font: fontReducer,
  },
});


 

 

 