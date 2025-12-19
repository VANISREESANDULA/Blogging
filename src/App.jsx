import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

// AUTH FILES
import Login from "./component/Login";
import Registrationpage from "./component/Registrationpage";
// HOMEPAGE SCREENS
import Home from "./component/homepage/Home";
import Explore from "./component/homepage/Explore";
import Messages from "./component/homepage/Messages";
import Notifications from "./component/homepage/Notifications";
import Bookmarks from "./component/homepage/Bookmarks";
import Profile from "./component/homepage/Profile";
import Settings from "./component/homepage/Settings";
import NotFound from "./component/homepage/NotFound";

import { socket } from "./socket";
import { addNotification } from "./component/redux/notificationsSlice";
import { updateFollowing, logout, setUser } from "./component/redux/authslice";


function App() {
  const isDark = useSelector((state) => state.theme.isDark);
  const currentFont = useSelector((state) => state.font.currentFont);
  const currentFontSize = useSelector((state) => state.font.currentFontSize);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // Apply theme to document root on mount and when theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Load selected font on mount and when font changes
  useEffect(() => {
    const FONT_OPTIONS = [
      { id: "inter", googleFont: "Inter", cssVariable: "'Inter', sans-serif" },
      { id: "poppins", googleFont: "Poppins", cssVariable: "'Poppins', sans-serif" },
      { id: "roboto", googleFont: "Roboto", cssVariable: "'Roboto', sans-serif" },
      { id: "playfair", googleFont: "Playfair Display", cssVariable: "'Playfair Display', serif" },
      { id: "lora", googleFont: "Lora", cssVariable: "'Lora', serif" },
      { id: "opensans", googleFont: "Open Sans", cssVariable: "'Open Sans', sans-serif" },
      { id: "montserrat", googleFont: "Montserrat", cssVariable: "'Montserrat', sans-serif" },
      { id: "raleway", googleFont: "Raleway", cssVariable: "'Raleway', sans-serif" },
      { id: "nunito", googleFont: "Nunito", cssVariable: "'Nunito', sans-serif" },
      { id: "ubuntu", googleFont: "Ubuntu", cssVariable: "'Ubuntu', sans-serif" },
      { id: "quicksand", googleFont: "Quicksand", cssVariable: "'Quicksand', sans-serif" },
      { id: "josefin", googleFont: "Josefin Sans", cssVariable: "'Josefin Sans', sans-serif" },
      { id: "sourceserif", googleFont: "Source Serif Pro", cssVariable: "'Source Serif Pro', serif" },
      { id: "sourcecode", googleFont: "Source Code Pro", cssVariable: "'Source Code Pro', monospace" },
      { id: "ibmlex", googleFont: "IBM Plex Mono", cssVariable: "'IBM Plex Mono', monospace" },
    ];

    const fontOption = FONT_OPTIONS.find((font) => font.id === currentFont);
    if (fontOption) {
      // Load Google Font
      const fontLink = document.getElementById("google-font-link") || document.createElement("link");
      fontLink.id = "google-font-link";
      fontLink.rel = "stylesheet";
      fontLink.href = `https://fonts.googleapis.com/css2?family=${fontOption.googleFont.replace(/ /g, "+")}&display=swap`;
      if (!document.head.contains(fontLink)) {
        document.head.appendChild(fontLink);
      }

      // Apply font to document
      document.documentElement.style.fontFamily = fontOption.cssVariable;
    }
  }, [currentFont]);

  // Apply font size on mount and when it changes
  useEffect(() => {
    const FONT_SIZE_OPTIONS = [
      { id: "xs", value: 0.875 },
      { id: "sm", value: 1 },
      { id: "md", value: 1.125 },
      { id: "lg", value: 1.25 },
      { id: "xl", value: 1.5 },
    ];

    const sizeOption = FONT_SIZE_OPTIONS.find((size) => size.id === currentFontSize);
    if (sizeOption) {
      document.documentElement.style.fontSize = `${sizeOption.value * 16}px`;
      document.documentElement.style.setProperty("--font-size-multiplier", sizeOption.value);
    }
  }, [currentFontSize]);

  // Validate token on app load and fetch current user
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // no token -> skip

      try {
        // Call backend to validate token and get current user
        const res = await axios.get("https://robo-zv8u.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If server returned user, set it in redux (and keep token in storage)
        if (res?.data) {
          dispatch(setUser(res.data));
        } else {
          // Unexpected response - clear auth
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch(logout());
        }
      } catch (err) {
        // Token invalid or other error -> clear storage and logout
        console.warn("Token validation failed, clearing auth:", err?.response?.status);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(logout());
      }
    };

    initAuth();
    // run once on mount
  }, [dispatch]);

  // Socket lifecycle: connect only when a validated user exists
  useEffect(() => {
    if (!user) {
      // ensure disconnected if no user
      try {
        socket.disconnect();
      } catch (e) {}
      return;
    }

    // Attach token (ensure it's the validated token)
    socket.auth = { token: localStorage.getItem("token") };
    socket.connect();

    socket.on("connect", () => {
      console.log("🔥 Socket connected:", socket.id);
      socket.emit("register", user._id);
    });

    // Incoming follow request
    socket.on("followRequestReceived", (data) => {
      console.log(" request recieved from",data);
        dispatch(addNotification({
    type: "followRequestIncoming",
    message: `${data.from} sent you a follow request`,
    from: data.from,          // ✅ ADD THIS
    fromId: data.fromId,
    createdAt: new Date().toISOString(),
  }));
    });
  socket.on("followRequestAccepted", async (data) => {

    console.log("request accepted by",data)
    const { byId,by,from,fromId } = data;
    console.log('heyyyyyyyyyyyyy',byId)
    console.log("hello",by)
      // ✅ Notification
  dispatch(addNotification({
    type: "followRequestAccepted",
    message: `${by} accepted your follow request`,
    createdAt: new Date().toISOString(),
  }));
  dispatch(updateFollowing({
    followingUser: {
      _id:  data.by._id ||byId,          // store as reference
      username:data.by || by,
      email:data.byId ||data.by.email,
         profilePhoto: data.by.profilePhoto
    }
  }));
});
    // Request rejected
    socket.on("followRequestRejected", (data) => {
      console.log("rejected  request by",data);
      dispatch(
        addNotification({
          type: "followRequestRejected",
          message: `${data.by} rejected your follow request`,
          createdAt: new Date().toISOString(),
        })
      );
    });
    // ❤️ LIKE
    socket.on("articleLiked", (data) => {
      console.log(data)
      dispatch(addNotification({
        id: Date.now(),
        type: "like",
        message: `${data.likedBy || data.comment.from} liked your article`,
        fromUser: data.likedBy,
        articleId: data.articleId,
        createdAt: new Date().toISOString(),
      }));
    });

    // 💬 COMMENT
    socket.on("newComment", (data) => {
      console.log(data)
      dispatch(addNotification({
        id: Date.now(),
        type: "comment",
        message: `${data.comment.user || data.comment.from} commented: "${data.comment.text}"`,
        fromUser: data.comment.by,
        articleId: data.articleId,
        createdAt: new Date().toISOString(),
      }));
    });
    

    return () => {
      socket.off("connect");
      socket.off("followRequestReceived");
      socket.off("followRequestAccepted");
      socket.off("followRequestRejected");
      socket.off("articleLiked");
      socket.off("newComment");
      try {
        socket.off();
        socket.disconnect();
      } catch (e) { }
    };
  }, [user, dispatch]);

  // Helper to protect routes (you can also move to a separate component)
  const requireAuth = (component) => (user ? component : <Navigate to="/login" />);


  const defaultRoute = user ? "/home" : "/register";

  return (
    <Router>
      <Routes>
        {/* DEFAULT → REGISTRATION PAGE or Home if logged in */}
        <Route path="/" element={<Navigate to={defaultRoute} />} />

        {/* AUTH */}
        <Route path="/register" element={user ? <Navigate to="/home" /> : <Registrationpage />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />

        {/* MAIN APP PAGES - protected */}
        <Route path="/home" element={requireAuth(<Home />)} />
        <Route path="/social" element={requireAuth(<Home />)} />
        <Route path="/explore" element={requireAuth(<Explore />)} />
        <Route path="/messages" element={requireAuth(<Messages />)} />
        <Route path="/notifications" element={requireAuth(<Notifications />)} />
        <Route path="/bookmarks" element={requireAuth(<Bookmarks />)} />
        <Route path="/profile" element={requireAuth(<Profile />)} />
        <Route path="/settings" element={requireAuth(<Settings />)} />

        {/* 404 PAGE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
