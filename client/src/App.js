// /client/src/App.js (Corrected with All Providers)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';

// Pages
import LoginPage from './pages/LoginPage/LoginPage';
import SelectRolePage from './pages/SelectRolePage/SelectRolePage';
import IndividualSignUpPage from './pages/IndividualSignUpPage/IndividualSignUpPage';
import LandingPage from './pages/LandingPage/LandingPage';
import CommunitySignUpPage from './pages/CommunitySignUpPage/CommunitySignUpPage';
import CorporateSignUpPage from './pages/CorporateSignUpPage/CorporateSignUpPage'; 
import RecyclerSignUpPage from './pages/RecyclerSignUpPage/RecyclerSignUpPage';

function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <Router>
          <Notifications />
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<Navigate to="/signup/select-role" replace />} />
              <Route path="signup/select-role" element={<SelectRolePage />} />
              <Route path="signup/individual" element={<IndividualSignUpPage />} />
              <Route path="signup/community" element={<CommunitySignUpPage />} />
              <Route path="signup/corporate" element={<CorporateSignUpPage />} />
              <Route path="signup/recycler" element={<RecyclerSignUpPage />} />
            </Route>
            
            <Route path="/dashboard" element={<h1>Welcome! You are logged in.</h1>} />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;