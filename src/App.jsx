// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login';
import Registrationpage from './component/Registrationpage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Add a default route */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Registrationpage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;