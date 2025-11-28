// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from "./component/redux/authslice";
// // import globalReducer from "./component/redux/globalSlice";
// import articlesReducer from "./component/redux/articlesSlice";
// // import globalReducer from "./component/redux/userSlice";


// export const store = configureStore({
//   reducer: {
//      auth: authReducer,
//     //  global: globalReducer,
//      articles: articlesReducer,
//     //  userProfile: userProfileReducer, 
//   },
// });

import { configureStore } from "@reduxjs/toolkit";
import { authReducer, articlesReducer } from "./component/redux/authslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
  },
});