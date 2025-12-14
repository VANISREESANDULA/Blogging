import { io } from "socket.io-client";

export const socket = io("https://robo-zv8u.onrender.com", {
     transports: ["websocket"],
  autoConnect: false,
  auth: {
    token: localStorage.getItem("token")
  }
});
