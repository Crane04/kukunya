// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './components/Home';
import Login from './pages/Login';
// import Signup from './components/Signup';
// import Profile from './components/Profile';
// import ProtectedRoute from './components/ProtectedRoute';
// src/components/Navbar.js
import { Link } from 'react-router-dom';
const Home = () => {
  return <h2>Home Page</h2>;
};

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

const Profile = () => {
  return <h2>Profile Page</h2>;
};

// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Replace with actual authentication check

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};




const Signup = () => {
  return <h2>Signup Page</h2>;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
      </Routes>
    </Router>
  );
}

export default App;
