import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useSelector } from "react-redux";

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
// import AddFriends from "./component/homepage/AddFriends";
import NotFound from "./component/homepage/NotFound";
// import Index from "./component/homepage/Index";

function App() {
  const isDark = useSelector((state) => state.theme.isDark);
  const currentFont = useSelector((state) => state.font.currentFont);
  const currentFontSize = useSelector((state) => state.font.currentFontSize);

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

  return (
    <Router>
      <Routes>

        {/* DEFAULT → REGISTRATION PAGE */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* AUTH */}
        <Route path="/register" element={<Registrationpage />} />
        <Route path="/login" element={<Login />} />

        {/* MAIN APP PAGES */}
        <Route path="/home" element={<Home />} />
        <Route path="/social" element={<Home />} />
        {/* <Route path="/index" element={<Index />} /> */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        {/* <Route path="/add-friends" element={<AddFriends />} /> */}

        {/* 404 PAGE */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;








 
 


