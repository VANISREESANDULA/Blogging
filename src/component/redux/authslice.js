import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { combineReducers } from '@reduxjs/toolkit';
import { notificationReducer } from "./notificationsSlice";
import { addNotification } from "./notificationsSlice";
import { removeIncomingRequest } from "./notificationsSlice";
import { socket } from "../../socket";

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://robo-zv8u.onrender.com/api/users/register",
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
        "https://robo-zv8u.onrender.com/api/users/login",
        data
      );
      console.log("from code ", response.data)

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

/*AUTH SLICE*/

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  registrationSuccess: null,
  followRequestStatus: null,
  followRequestMessage: "",
  acceptFollowStatus: null,
  acceptFollowMessage: "",
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

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setUser(state, action) {
      state.user = action.payload;   
  localStorage.setItem("user", JSON.stringify(action.payload));
    },
    resetError(state) {
      state.error = null;
    },
    resetRegistrationSuccess(state) {
      state.registrationSuccess = null;
    },
    followRequestSent(state, action) {
      state.followRequestStatus = "success";
      state.followRequestMessage = action.payload;
    },
    followRequestError(state, action) {
      state.followRequestStatus = "error";
      state.followRequestMessage = action.payload;
    },
    acceptFollowSuccess(state, action) {
      state.acceptFollowStatus = "success";
      state.acceptFollowMessage = action.payload;
    },

    acceptFollowError(state, action) {
      state.acceptFollowStatus = "error";
      state.acceptFollowMessage = action.payload;
    },
    addFollower(state, action) {
  const follower = action.payload.follower;

  if (!state.user) return;

  if (!state.user.followers) {
    state.user.followers = [];
  }

  const exists = state.user.followers.some(
    (u) => u._id === follower._id
  );

  if (!exists) {
    state.user.followers.push(follower);
  }

  localStorage.setItem("user", JSON.stringify(state.user));
},
   updateFollowing(state, action) {
      const { followingUser } = action.payload;
      if (!state.user) return;

      const exists = state.user.following?.some(
        (u) => u._id === followingUser._id
      );

      if (!exists) {
        state.user.following = [
          ...(state.user.following || []),
          followingUser
        ];
      }

      localStorage.setItem("user", JSON.stringify(state.user));
    },
    
    moveFollowRequestToAccepted(state, action) {
  const { fromId, from, createdAt } = action.payload;

  // remove from incoming
  state.follows.followRequestIncoming =
    state.follows.followRequestIncoming.filter(
      (req) => req.fromId !== fromId
    );

  // add to accepted
  state.follows.followRequestAccepted.unshift({
    type: "followRequestAccepted",
    from,
    fromId,
    message: `You accepted ${from} request`,
    createdAt,
  });
}

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

        // SAVE TO LOCAL STORAGE
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

/* ARTICLE THUNKS */
// CREATE ARTICLE
export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (articleData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      console.log("Sending article data:", articleData);
      const response = await axios.post(
        "https://robo-zv8u.onrender.com/api/articles",
        articleData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      // Return both created article and current user so reducer can enrich immediately
      return { article: response.data, author: getState().auth.user };
    } catch (error) {
      console.error("Article creation error:", error.response?.status, error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Article creation failed"
      );
    }
  }
);

// GET ALL ARTICLES
export const getArticles = createAsyncThunk(
  "articles/getArticles",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;
      const currentUserId = auth.user?._id || auth.user?.id;

      // 1️⃣ Fetch all articles
      const articlesRes = await axios.get(
        "https://robo-zv8u.onrender.com/api/articles",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      let articles = articlesRes.data;

      // 2️⃣ Fetch author details for each article and enrich liked flags
      const enhancedArticles = await Promise.all(
        articles.map(async (article) => {
          const likedBy = article.likedBy || [];
          // If backend already returned full author object, use it directly
          if (article.author && typeof article.author === "object") {
            return {
              ...article,
              author: article.author,
              likedByCurrentUser: currentUserId ? likedBy.includes(currentUserId) : false,
              likeCount: likedBy.length,
            };
          }

          // Otherwise, article.author is likely an id string — try to fetch the user
          try {
            const userRes = await axios.get(
              `https://robo-zv8u.onrender.com/api/users/${article.author}`,
              {
                headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                },
              }
            );

            return {
              ...article,
              author: userRes.data,
              likedByCurrentUser: currentUserId ? likedBy.includes(currentUserId) : false,
              likeCount: likedBy.length,
            };
          } catch {
            return {
              ...article,
              author: { username: "Unknown", email: "unknown" },
              likedByCurrentUser: currentUserId ? likedBy.includes(currentUserId) : false,
              likeCount: likedBy.length,
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

/*ARTICLE SLICE*/

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

    // Optimistic local toggle: updates likedBy, likeCount and likedByCurrentUser synchronously
    optimisticToggleLike(state, action) {
      const { articleId, currentUserId } = action.payload;
      const idx = state.articles.findIndex((a) => a._id === articleId);
      if (idx === -1) return;

      const likedBy = state.articles[idx].likedBy || [];
      const has = likedBy.includes(currentUserId);

      if (has) {
        state.articles[idx].likedBy = likedBy.filter((id) => id !== currentUserId);
      } else {
        state.articles[idx].likedBy = [...likedBy, currentUserId];
      }

      state.articles[idx].likeCount = state.articles[idx].likedBy.length;
      state.articles[idx].likedByCurrentUser = !has;
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

        const newArticle = action.payload;

        // Attach the logged-in user as author immediately
        const currentUser = state.auth?.user || null;
        if (currentUser) {
          newArticle.author = currentUser;
        }

        state.articles.unshift(newArticle);
      })

      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ARTICLES
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

      // ADD COMMENT: replace article with updated article returned by backend
      .addCase(addComment.fulfilled, (state, action) => {
        const updatedArticle = action.payload.article;  // backend returns entire updated article

        const index = state.articles.findIndex(a => a._id === updatedArticle._id);
        if (index !== -1) {
          state.articles[index] = updatedArticle;  // replace article with updated version
        }
      })

      // LIKE/UNLIKE: reconcile server response
      .addCase(toggleLikeArticle.fulfilled, (state, action) => {
        const { articleId, data, currentUserId } = action.payload;

        const idx = state.articles.findIndex((a) => a._id === articleId);
        if (idx === -1) return;

        const updated = data.article; // backend returns updated article

        state.articles[idx].likedBy = updated.likedBy || [];
        state.articles[idx].likeCount = (updated.likedBy || []).length;
        state.articles[idx].likedByCurrentUser =
          currentUserId ? (updated.likedBy || []).includes(currentUserId) : false;

        // Also update author/content/comments if backend returned them
        if (updated.author) state.articles[idx].author = updated.author;
        if (updated.content) state.articles[idx].content = updated.content;
        if (updated.comments) state.articles[idx].comments = updated.comments;
      })

      .addCase(toggleLikeArticle.rejected, (state, action) => {
        // on rejection we don't know specifics here; UI triggers a refetch to reconcile
      });

  },
});



/*EXPORTS */

export const {
  logout,
  resetError,
  resetRegistrationSuccess,
  followRequestSent,
  followRequestError,
  acceptFollowSuccess,
  acceptFollowError,
  // updateFollowRelation,
} = authSlice.actions;

export const {
  resetArticleCreated,
  optimisticToggleLike,
} = articleSlice.actions;

// Combine reducers
export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  articles: articleSlice.reducer,
  notifications: notificationReducer,
});

export const authReducer = authSlice.reducer;
export const articlesReducer = articleSlice.reducer;
export const {  updateFollowing } = authSlice.actions;
export const { setUser } = authSlice.actions;



/*  ASYNC THUNKS- addComment, toggleLikeArticle, deleteArticle*/

export const addComment = createAsyncThunk(
  "articles/addComment",
  async ({ articleId, text }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      if (!token) return rejectWithValue("No token");

      const response = await axios.post(
        `https://robo-zv8u.onrender.com/api/articles/${articleId}/comment`,
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

// Optimistic toggle like thunk (server reconciliation happens in fulfilled)
export const toggleLikeArticle = createAsyncThunk(
  "articles/toggleLikeArticle",
  async (articleId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      const currentUserId = -state.auth.user?._1d || + state.auth.user?.id || state.auth.user?._id;

      const response = await axios.put(
        `https://robo-zv8u.onrender.com/api/articles/${articleId}/like`,
        {},
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );

     
      return {
        articleId,
        data: response.data,
        currentUserId,
      };
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || "Like failed", articleId });
    }
  }
);


//  send follow request

export const sendFollowRequest = (username) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem("token");
    console.log("TOKEN USED:", token);
    const res = await fetch("https://robo-zv8u.onrender.com/api/follow/send-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUsername: username }),
    });

    const data = await res.json();
    console.log("Backend response:", data);


    if (!res.ok) {
      return dispatch(followRequestError(data.message || "Failed to send follow request"));
    }

    dispatch(followRequestSent(data.message || "Request sent successfully"));

    // add notification
    dispatch(addNotification({
      type: "followRequestSent",
      message: `You sent a follow request to ${username}`,
      createdAt: new Date().toISOString(),

    }));
    //EMIT SOCKET EVENT TO BACKEND
    socket.emit("followRequestReceived", {
      targetUsername: username
    });

  } catch (error) {
    dispatch(followRequestError(error.message));
  }
};





export const acceptFollowRequest = ({ followerId, from }) => async (dispatch, getState) => {
  console.log("request accepted by",from)
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://robo-zv8u.onrender.com/api/follow/accept-request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ followerId }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return dispatch(acceptFollowError(data.message));
    }
     console.log('heyyyyyyy',from)
     const currentUser = getState().auth.user;
     const followerData = data.user || {};
     const state = getState();
// try to find username from incoming notifications
const incomingReq = state.notifications.follows.followRequestIncoming.find(
  (req) => req.fromId === followerId
);

const fromUsername =
  incomingReq?.from ||
  incomingReq?.username ||
  data.user?.username ||
  "User";

    dispatch(addNotification({
      type: "followRequestAccepted",
      // message: `You accepted ${data.user.username}'s request`,
       message: `You accepted ${fromUsername}  request`,
      createdAt: new Date().toISOString()
    }));
     console.log(
  "Redux followers:",
  getState().auth.user.followers
);
    dispatch(addFollower({
  follower: {
    _id: followerId,
    username: from,
    email: followerData.email || "",
    profilePhoto: followerData.profilePhoto || null
  }
}));
    dispatch(moveFollowRequestToAccepted({
  fromId: followerId,
  from: fromUsername,
  createdAt: new Date().toISOString(),
}));

   socket.emit("followRequestAccepted", {
     to: followerId,
      byId: currentUser._id,
      by: currentUser.username
});
// 1️⃣ REMOVE incoming request from UI
dispatch(removeIncomingRequest(followerId));

// 2️⃣ ADD accepted notification
dispatch(addNotification({
  type: "followRequestAccepted",
  message: `You accepted ${from} request`,
  fromId: followerId,
  createdAt: new Date().toISOString(),
}));

    dispatch(acceptFollowSuccess("Follow request accepted"));
    return data;
    
    

  } catch (error) {
    dispatch(acceptFollowError(error.message));
  }
};

export const rejectFollowRequest = (followerId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("https://robo-zv8u.onrender.com/api/follow/reject-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ followerId }),
    });

    const data = await res.json();

    if (!res.ok) {
      return dispatch(
        addNotification({
          type: "error",
          message: data.message || "Failed to reject request",
          createdAt: new Date().toISOString()
        })
      );
    }

    // Success notification
    dispatch(addNotification({
      type: "followRequestRejected",
      message: `You rejected ${data.user.username}'s request`,
      createdAt: new Date().toISOString()
    }));

    // EMIT REALTIME REJECTION
    socket.emit("followRequestRejected", {
      followerId
    });
    // 1️⃣ REMOVE incoming request from UI
dispatch(removeIncomingRequest(followerId));

// 2️⃣ ADD accepted notification
dispatch(addNotification({
  type: "followRequestAccepted",
  message: `You accepted ${from} request`,
  fromId: followerId,
  createdAt: new Date().toISOString(),
}));
    // socket.emit("reject-follow-request", data);
    return data;
  } catch (error) {
    console.error("Reject error:", error);
  }
};


// delete article

export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (articleId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.token;

      const response = await axios.delete(
        `https://robo-zv8u.onrender.com/api/articles/${articleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { articleId };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
