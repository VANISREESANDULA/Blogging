// // 

// // src/component/redux/authSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // ✅ Register User
// export const registerUser = createAsyncThunk(
//   "auth/registerUser",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("http://192.168.0.66:5000/api/users/register", userData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Registration failed");
//     }
//   }
// );

// // ✅ Login User
// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("http://192.168.0.66:5000/api/users/login", userData);
//       // Example: response.data should include a token and user info
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     token: null,
//     loading: false,
//     success: false,
//     error: null,
//     registrationSuccess: false,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.success = false;
//       state.registrationSuccess = false;
//     },
//     resetRegistrationSuccess: (state) => {
//       state.registrationSuccess = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ✅ Register
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.registrationSuccess = false;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.registrationSuccess = true;
//         // Don't set user or token - we don't want auto-login
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.registrationSuccess = false;
//       })

//       // ✅ Login
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { logout, resetRegistrationSuccess } = authSlice.actions;
// export default authSlice.reducer;



// src/component/redux/appSlices.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ============================================================
   AUTH THUNKS
============================================================ */

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://192.168.0.212:5000/api/users/register",
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://192.168.0.212:5000/api/users/login",
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

/* ============================================================
   ARTICLES THUNKS
============================================================ */

// Get All Articles
export const fetchArticles = createAsyncThunk(
  "articles/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://192.168.0.212:5000/api/articles");
      return res.data;
    } catch (err) {
      return rejectWithValue("Unable to fetch articles");
    }
  }
);

// Create Article
export const createArticle = createAsyncThunk(
  "articles/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://192.168.0.212:5000/api/articles", data);
      return res.data;
    } catch (err) {
      return rejectWithValue("Unable to create article");
    }
  }
);

// Like Article
export const likeArticle = createAsyncThunk(
  "articles/like",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://192.168.0.212:5000/api/articles/${id}/like`
      );
      return { id, likes: res.data.likes };
    } catch (err) {
      return rejectWithValue("Unable to like article");
    }
  }
);

// Add Comment
export const addComment = createAsyncThunk(
  "articles/comment",
  async ({ id, comment }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://192.168.0.212:5000/api/articles/${id}/comment`,
        { comment }
      );
      return { id, comments: res.data.comments };
    } catch (err) {
      return rejectWithValue("Unable to add comment");
    }
  }
);

/* ============================================================
   AUTH SLICE
============================================================ */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    success: false,
    error: null,
    registrationSuccess: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.success = false;
      state.registrationSuccess = false;
    },
    resetRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* ============================================================
   ARTICLES SLICE
============================================================ */

const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      // Create Article
      .addCase(createArticle.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // Like Article
      .addCase(likeArticle.fulfilled, (state, action) => {
        const article = state.list.find((a) => a._id === action.payload.id);
        if (article) article.likes = action.payload.likes;
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const article = state.list.find((a) => a._id === action.payload.id);
        if (article) article.comments = action.payload.comments;
      });
  },
});

/* ============================================================
   EXPORT ALL AT ONE PLACE
============================================================ */

export const { logout, resetRegistrationSuccess } = authSlice.actions;

export const authReducer = authSlice.reducer;
export const articlesReducer = articlesSlice.reducer;
