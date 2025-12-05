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
    // addNotification: (state, action) => {
    //   const n = action.payload;

    //   state.all.unshift(n);

    //   switch (n.type) {
    //     case "followRequestSent":
    //       state.follows.followRequestSent.unshift(n);
    //       break;
    //     case "followRequestIncoming":
    //       state.follows.followRequestIncoming.unshift(n);
    //       break;
    //     case "followRequestAccepted":
    //       state.follows.followRequestAccepted.unshift(n);
    //       break;
    //     case "followRequestRejected":
    //       state.follows.followRequestRejected.unshift(n);
    //       break;
    //   }
    // }
    addNotification(state, action) {
  const notif = action.payload;

  state.all.push(notif);

  if (notif.type === "followRequestIncoming") {
    state.follows.followRequestIncoming.push(notif);
  }

  if (notif.type === "followRequestAccepted") {
    state.follows.followRequestAccepted.push(notif);
  }

  if (notif.type === "followRequestSent") {
    state.follows.followRequestSent.push(notif);
  }
}

  }
});

export const { addNotification } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
