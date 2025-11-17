// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login';
import Registrationpage from './component/Registrationpage';
import Home from './component/Home';
import AddFriends from './component/AddFriends';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Add a default route */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Registrationpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        <Route path="/add-friends" element={<AddFriends/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;