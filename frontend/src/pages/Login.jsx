import React, { useState } from 'react';
import '../css/Login.css';
import postData from '../helpers/postData';  // Adjust the path if necessary

const Login = () => {
  const [customId, setCustomId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await postData('/auth/organizations/signin', { customId, password });
      console.log(response)
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Handle successful login, e.g., store token, redirect to another page
        console.log('Login successful', response);
        setError(response.message)
        window.location.href = '/';
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      console.error("Login request error: ", error);
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="customId">ID</label>
            <input
              type="text"
              id="customId"
              placeholder="Enter Custom ID"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
