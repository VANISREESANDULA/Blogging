// import { configureStore } from "@reduxjs/toolkit";
// import themeReducer from "./component/redux/themeSlice";
// import fontReducer from "./component/redux/fontSlice";
// import { authReducer, articlesReducer } from "./component/redux/authSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     articles: articlesReducer, // matches articleSlice name + Home selector
//     theme: themeReducer,
//     font: fontReducer,
//   },
// });

import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./component/redux/themeSlice";
import fontReducer from "./component/redux/fontSlice";
import { authReducer, articlesReducer} from "./component/redux/authslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
    theme: themeReducer,
    font: fontReducer,
  },
});







 

 

 