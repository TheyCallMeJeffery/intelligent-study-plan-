import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Sending data to backend:', { username, password });

    const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    axios.post(`${backendURL}/api/token/`, { username, password })
      .then(response => {
        console.log('API Response:', response.data);

        if (response.data && response.data.access) {
          const token = response.data.access;
          console.log('Received token:', token);

          navigate('/schedule', { state: { token } });
        } else {
          console.error('Token not found in response');
          alert('Login failed: Token not found');
        }
      })
      .catch(error => {
        console.error('Login failed:', error);
        alert('Login failed: ' + (error.response?.data?.detail || error.message));
      });
  };

  const handleSignUpNavigate = () => {
    
    navigate('/signup');
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: 10, padding: 8, width: '100%' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: 20, padding: 8, width: '100%' }}
      />
      <button onClick={handleLogin} style={{ padding: 10, backgroundColor: 'blue', color: 'white', marginBottom: 10 }}>
        Login
      </button>
      <button onClick={handleSignUpNavigate} style={{ padding: 10, backgroundColor: 'green', color: 'white' }}>
        Sign Up
      </button>
    </div>
  );
};

export default LoginScreen;
