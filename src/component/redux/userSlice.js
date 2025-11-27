// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import API from "../../api/articlesApi";

// // GET PROFILE + POSTS OF USER
// export const getUserProfile = createAsyncThunk(
//   "user/profile",
//   async (username, { rejectWithValue }) => {
//     try {
//       const res = await API.get(`/api/users/${username}`);
//       return res.data; // {profile, posts}
//     } catch (error) {
//       return rejectWithValue("Unable to load user profile");
//     }
//   }
// );

// const userSlice = createSlice({
//   name: "userProfile",
//   initialState: {
//     profile: null,
//     posts: [],
//     loading: false,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(getUserProfile.pending, (state) => {
//       state.loading = true;
//     });

//     builder.addCase(getUserProfile.fulfilled, (state, action) => {
//       state.loading = false;
//       state.profile = action.payload.profile;
//       state.posts = action.payload.posts;
//     });

//     builder.addCase(getUserProfile.rejected, (state) => {
//       state.loading = false;
//       state.profile = null;
//     });
//   },
// });

// export default userSlice.reducer;
