//----------------------------------------------------------------



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { combineReducers } from '@reduxjs/toolkit';

/* ============================================================
   AUTH THUNKS
============================================================ */

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://robo-1-qqhu.onrender.com/api/users/register",
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://robo-1-qqhu.onrender.com/api/users/login",
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

/* ============================================================
   AUTH SLICE
============================================================ */

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  registrationSuccess: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.registrationSuccess = null;

    },
    resetError(state) {
      state.error = null;
    },
    resetRegistrationSuccess(state) {
      state.registrationSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationSuccess = true;

         
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* ============================================================
   ARTICLE THUNKS
============================================================ */

// CREATE ARTICLE
export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (articleData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      console.log("Sending article data:", articleData);
      const response = await axios.post(
        "https://robo-1-qqhu.onrender.com/api/articles",
        articleData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Article creation error:", error.response?.status, error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Article creation failed"
      );
    }
  }
);

// GET ALL ARTICLES
// GET ALL ARTICLES
export const getArticles = createAsyncThunk(
  "articles/getArticles",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;

      // 1️⃣ Fetch all articles
      const articlesRes = await axios.get(
        "https://robo-1-qqhu.onrender.com/api/articles",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      let articles = articlesRes.data;

      // 2️⃣ Fetch author details for each article
      const enhancedArticles = await Promise.all(
        articles.map(async (article) => {
          try {
            const userRes = await axios.get(
              `https://robo-1-qqhu.onrender.com/api/users/${article.author}`, 
              {
                headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                },
              }
            );

            return {
              ...article,
              author: userRes.data, // attach user object
            };
          } catch {
            return {
              ...article,
              author: { username: "Unknown", email: "unknown" },
            };
          }
        })
      );

      return enhancedArticles;
    } catch (error) {
      console.error("getArticles error:", error.response?.status, error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch articles");
    }
  }
);




/* ============================================================
   ARTICLE SLICE
============================================================ */

const articleSlice = createSlice({
  name: "articles",
  initialState: {
    articles: [],
    loading: false,
    error: null,
    articleCreated: false,
  },
  reducers: {
    resetArticleCreated(state) {
      state.articleCreated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articleCreated = true;
        state.articles.push(action.payload);
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
//       // GET ARTICLES
      .addCase(getArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(getArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
  const { articleId, comment } = action.payload;
  const article = state.articles.find((a) => a._id === articleId);
  if (article) {
    article.comments = [...(article.comments || []), comment];
  }
})
.addCase(toggleLikeArticle.fulfilled, (state, action) => {
  const { articleId, data } = action.payload;
  const articleIndex = state.articles.findIndex(a => a._id === articleId);

  if (articleIndex !== -1) {
    state.articles[articleIndex].likeCount = data.likeCount;
    state.articles[articleIndex].likedBy = data.likedBy;
    state.articles[articleIndex].likedByCurrentUser = data.likedByCurrentUser;
  }
});



  },
});

/* ============================================================
   EXPORTS
============================================================ */

export const {
  logout,
  resetError,
  resetRegistrationSuccess,
} = authSlice.actions;

export const {
  resetArticleCreated,
} = articleSlice.actions;

// Combine reducers
export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  articles: articleSlice.reducer,
});

export const authReducer = authSlice.reducer;
export const articlesReducer = articleSlice.reducer;


export const addComment = createAsyncThunk(
  "articles/addComment",
  async ({ articleId, text }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      if (!token) return rejectWithValue("No token");

      const response = await axios.post(
        `https://robo-1-qqhu.onrender.com/api/articles/${articleId}/comment`,
        { text }, // Backend expects { text: "Your comment" }
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Comment Failed");
    }
  }
);



// LIKE OR UNLIKE ARTICLE
export const toggleLikeArticle = createAsyncThunk(
  "articles/toggleLikeArticle",
  async (articleId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const response = await axios.put(
        `https://robo-1-qqhu.onrender.com/api/articles/${articleId}/like`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      return {
        articleId,
        data: response.data, // updated likeCount & likedBy
      };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


// Inside redux/authslice.js
export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (articleId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;

      const response = await axios.delete(
        `https://robo-1-qqhu.onrender.com/api/articles/${articleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return { articleId };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

extraReducers: (builder) => {
  builder.addCase(deleteArticle.fulfilled, (state, action) => {
    state.articles = state.articles.filter(
      (article) => article._id !== action.payload.articleId
    );
  });
}



 