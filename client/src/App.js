// /client/src/App.js (Updated with Redirect)

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // 1. Import Navigate
import { Notifications } from '@mantine/notifications';

// Layouts
import PublicLayout from './layouts/PublicLayout';

// Pages
import LoginPage from './pages/LoginPage/LoginPage';
import SelectRolePage from './pages/SelectRolePage/SelectRolePage';
import IndividualSignUpPage from './pages/IndividualSignUpPage/IndividualSignUpPage';
import LandingPage from './pages/LandingPage/LandingPage';

function App() {
  return (
    <Router>
      <Notifications />
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<h1>Homepage Placeholder</h1>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="landing" element={<LandingPage />} />
          
          {/* 2. Add this new route for redirection */}
          <Route path="signup" element={<Navigate to="/signup/select-role" replace />} />
          
          <Route path="signup/select-role" element={<SelectRolePage />} />
          <Route path="signup/individual" element={<IndividualSignUpPage />} />
        </Route>
        
        <Route path="/dashboard" element={<h1>Welcome! You are logged in.</h1>} />
      </Routes>
    </Router>
  );
}

export default App;