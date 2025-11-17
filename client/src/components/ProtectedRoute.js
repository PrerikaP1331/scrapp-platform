// /client/src/components/ProtectedRoute.js (Corrected and Robust)
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles = ['individual'] }) {
  const { user, token } = useContext(AuthContext);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give context time to initialize from localStorage
    const timer = setTimeout(() => setIsChecking(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Still checking - show nothing while context initializes
  if (isChecking) {
    return null;
  }

  // Check if token exists
  const authToken = token || localStorage.getItem('token');
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // Check user role
  const userRole = user?.role || localStorage.getItem('userRole');
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
}

export default ProtectedRoute;