import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ EXPORT THIS FUNCTION (this was missing before)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (values, { rejectWithValue }) => {
    try {
      values.forEach((ele)=>{
        console.log(ele);
        
      })
      
      // const formData = new FormData();

      // // Append all input fields
      // console.log(values)
      // Object.keys(values).forEach((key) => {
      //   formData.append(key, values[key]);
      // });

      // Append cropped image file (if exists)
      // if (croppedImageFile) {
      //   formData.append("profileImage", croppedImageFile);
      // }

      // formData.forEach((ele)=>{
      //   console.log(ele);
        
      // });
      

      const response = await axios.post("http://192.168.0.86:5000/api/users/register", values, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (err) {
      console.log(err)
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Default export reducer
export default authSlice.reducer;






// // src/redux/formSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const submitFormData = createAsyncThunk(
//   "form/submitFormData",
//   async ({ formValues, croppedImageFile }, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();

//       // ✅ Append text fields
//       Object.keys(formValues).forEach((key) => {
//         formData.append(key, formValues[key]);
//       });

//       // ✅ Append image file
//       if (croppedImageFile) {
//         formData.append("profileImage", croppedImageFile);
//       }

//       const response = await axios.post("http://localhost:5000/api/register", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Something went wrong");
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "form",
//   initialState: {
//     loading: false,
//     success: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(submitFormData.pending, (state) => {
//         state.loading = true;
//         state.success = false;
//         state.error = null;
//       })
//       .addCase(submitFormData.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(submitFormData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default authSlice.reducer;






// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // ✅ API call for sign up
// export const registerUser = createAsyncThunk(
//   "auth/registerUser",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.message);

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default authSlice.reducer;
