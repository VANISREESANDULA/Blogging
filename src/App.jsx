// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login';
import Registrationpage from './component/Registrationpage';
import Home from './component/Home';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/Login" />} />
          <Route path="/register" element={<Registrationpage />} />
          <Route path="/login" element={<Login />} />
           <Route path="/home" element={<Home/>} />
        </Routes>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;