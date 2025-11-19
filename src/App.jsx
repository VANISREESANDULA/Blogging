// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './component/Login';
import Registrationpage from './component/Registrationpage';
import AddFriends from './component/AddFriends';
// import Layout from "./component/Layout";
import SettingsPage from './component/SettingsPage';
import Home from './component/Home';
import Bookmarks from './component/Bookmarks';

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>

          {/* DEFAULT ROUTE → REGISTRATION PAGE */}
          <Route path="/" element={<Navigate to="/register" />} />

          {/* AUTH ROUTES */}
          <Route path="/register" element={<Registrationpage />} />
          <Route path="/login" element={<Login />} />

          {/* SOCIAL APP ROUTES */}
          {/* <Route path="/explore" element={<Explore />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} /> */}

          {/* OTHER ROUTES */}
          <Route path="/home" element={<Home/>} />
          <Route path="/add-friends" element={<AddFriends />} />
          <Route path="/SettingsPage" element={<SettingsPage />} />
          <Route path="/Bookmarks" element={<Bookmarks/>} />
          {/* <Route path="/profile/:username" element={<ProfilePage />} /> */}

          {/* 404 PAGE */}
          {/* <Route path="*" element={<NotFound />} /> */}

        </Routes>

      </div>
    </Router>
  );
}

export default App;
