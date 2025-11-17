// /client/src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('userRole', userData?.role || 'individual');
    if (userData?.name) {
      localStorage.setItem('userName', userData.name);
    }
    if (userData?.recyclerProfileId) {
      localStorage.setItem('recyclerProfileId', userData.recyclerProfileId);
    }
    setUser(userData || { role: 'individual' });
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('recyclerProfileId');
    setUser(null);
    setToken(null);
  };

  // Initialize user from localStorage on mount
  React.useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('userName');
    const storedRecyclerProfileId = localStorage.getItem('recyclerProfileId');
    if (storedRole) {
      const userData = { 
        role: storedRole,
        name: storedName || 'User'
      };
      if (storedRecyclerProfileId) {
        userData.recyclerProfileId = storedRecyclerProfileId;
      }
      setUser(userData);
    }
  }, []);

  const value = { user, token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};