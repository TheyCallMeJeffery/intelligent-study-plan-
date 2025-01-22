import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    axios.post(`${backendURL}/api/signup/`, { username, email, password })
      .then(() => {
        alert('User created successfully! Please log in.');
        navigate('/');
      })
      .catch((error) => {
        console.error('Sign up failed:', error);
        alert('Sign up failed: ' + (error.response?.data?.detail || error.message));
      });
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: 10, padding: 8, width: '100%' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: 10, padding: 8, width: '100%' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: 20, padding: 8, width: '100%' }}
      />
      <button onClick={handleSignUp} style={{ padding: 10, backgroundColor: 'green', color: 'white' }}>
        Sign Up
      </button>
      <button onClick={() => navigate('/')} style={{ padding: 10, backgroundColor: 'red', color: 'white', marginTop: 10 }}>
        Back to Login
      </button>
    </div>
  );
};

export default SignUpScreen;
