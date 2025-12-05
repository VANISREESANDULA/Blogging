import { io } from "socket.io-client";

export const socket = io("https://robo-1-qqhu.onrender.com", {
  auth: {
    token: localStorage.getItem("token")
  }
});
