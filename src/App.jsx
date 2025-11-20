import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

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
