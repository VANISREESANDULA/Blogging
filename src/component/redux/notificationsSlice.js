// notificationsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  all: [],
  follows: {
    followRequestSent: [],
    followRequestIncoming: [],
    followRequestAccepted: [],
    followRequestRejected: [],
  },
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action) {
      const notif = action.payload;
      // newest first
      state.all.unshift(notif);
      
      switch (notif.type) {
        case "followRequestSent":
          state.follows.followRequestSent.unshift(notif);
          break;
        case "followRequestIncoming":
          state.follows.followRequestIncoming.unshift(notif);
          break;
        case "followRequestAccepted":
          state.follows.followRequestAccepted.unshift(notif);
          break;
        case "followRequestRejected":
          state.follows.followRequestRejected.unshift(notif);
          break;
        default:
          break;
      }
    },
    removeIncomingRequest(state, action) {
          const id = action.payload;
          state.follows.followRequestIncoming =
          state.follows.followRequestIncoming.filter(
          (req) => req.fromId !== id
    );
},
// followRequestAccepted(state, action) {
//    const { senderId } = action.payload;

//    state.follows.followRequestSent = 
//        state.follows.followRequestSent.filter(n => n.fromId !== senderId);

//    state.follows.followRequestAccepted.push(action.payload);
// },
// removePendingRequest(state, action) {
//   const id = action.payload;

//   state.all = state.all.filter(
//     (n) =>
//       !(n.type === "followRequestSent" && n.toId === id)
//   );
// }
  },
});


export const { addNotification, removeIncomingRequest,followRequestAccepted,removePendingRequest } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
