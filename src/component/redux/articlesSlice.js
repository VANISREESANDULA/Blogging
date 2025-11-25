import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import API from "../../api/articlesApi"; // <-- Make sure this is correct

// ============================
// GET ALL ARTICLES
// ============================
export const fetchArticles = createAsyncThunk(
  "articles/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/articles");
      return res.data;
    } catch (err) {
      return rejectWithValue("Unable to fetch articles");
    }
  }
);

// ============================
// CREATE ARTICLE
// ============================
export const createArticle = createAsyncThunk(
  "articles/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/articles", data);
      return res.data;
    } catch (err) {
      return rejectWithValue("Unable to create article");
    }
  }
);

// ============================
// LIKE / UNLIKE ARTICLE
// ============================
export const likeArticle = createAsyncThunk(
  "articles/like",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.put(`/articles/${id}/like`);
      return { id, likes: res.data.likes };
    } catch (err) {
      return rejectWithValue("Unable to like article");
    }
  }
);

// ============================
// ADD COMMENT
// ============================
export const addComment = createAsyncThunk(
  "articles/comment",
  async ({ id, comment }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/articles/${id}/comment`, { comment });
      return { id, comments: res.data.comments };
    } catch (err) {
      return rejectWithValue("Unable to add comment");
    }
  }
);

// ============================
// SLICE
// ============================
const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    // --------------------
    // GET ARTICLES
    // --------------------
    builder.addCase(fetchArticles.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(fetchArticles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // --------------------
    // CREATE ARTICLE
    // --------------------
    builder.addCase(createArticle.fulfilled, (state, action) => {
      state.list.unshift(action.payload); // add to top
    });

    // --------------------
    // LIKE ARTICLE
    // --------------------
    builder.addCase(likeArticle.fulfilled, (state, action) => {
      const article = state.list.find((a) => a._id === action.payload.id);
      if (article) article.likes = action.payload.likes;
    });

    // --------------------
    // ADD COMMENT
    // --------------------
    builder.addCase(addComment.fulfilled, (state, action) => {
      const article = state.list.find((a) => a._id === action.payload.id);
      if (article) article.comments = action.payload.comments;
    });
  }
});

export default articlesSlice.reducer;
