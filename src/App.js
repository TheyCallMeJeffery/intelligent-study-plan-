import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import SignUpScreen from './screens/SignUpScreen';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/schedule" element={<ScheduleScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
