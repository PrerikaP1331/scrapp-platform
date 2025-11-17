// /client/src/context/AuthContext.js
import React, { createContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (userData, userToken) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("userRole", userData?.role || "individual");
    if (userData?.name) {
      localStorage.setItem("userName", userData.name);
    }
    if (userData?.email) {
      localStorage.setItem("userEmail", userData.email);
    }
    if (userData?.phone) {
      localStorage.setItem("userPhone", userData.phone);
    }
    if (userData?.recyclerProfileId) {
      localStorage.setItem("recyclerProfileId", userData.recyclerProfileId);
    }
    if (userData?.organizationId) {
      localStorage.setItem("organizationId", userData.organizationId);
    }
    if (userData?.organizationName) {
      localStorage.setItem("organizationName", userData.organizationName);
    }
    if (userData?.communityName) {
      localStorage.setItem("communityName", userData.communityName);
    }
    if (userData?.businessName) {
      localStorage.setItem("businessName", userData.businessName);
    }
    setUser(userData || { role: "individual" });
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("recyclerProfileId");
    localStorage.removeItem("organizationId");
    localStorage.removeItem("organizationName");
    localStorage.removeItem("communityName");
    localStorage.removeItem("businessName");
    setUser(null);
    setToken(null);
  };

  // Initialize user from localStorage on mount
  React.useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedPhone = localStorage.getItem("userPhone");
    const storedRecyclerProfileId = localStorage.getItem("recyclerProfileId");
    const storedOrganizationId = localStorage.getItem("organizationId");
    const storedOrganizationName = localStorage.getItem("organizationName");
    const storedCommunityName = localStorage.getItem("communityName");
    const storedBusinessName = localStorage.getItem("businessName");

    if (storedRole) {
      const userData = {
        role: storedRole,
        name: storedName || "User",
        email: storedEmail || "",
        phone: storedPhone || "",
      };
      if (storedRecyclerProfileId) {
        userData.recyclerProfileId = storedRecyclerProfileId;
      }
      if (storedOrganizationId) {
        userData.organizationId = storedOrganizationId;
      }
      if (storedOrganizationName) {
        userData.organizationName = storedOrganizationName;
      }
      if (storedCommunityName) {
        userData.communityName = storedCommunityName;
      }
      if (storedBusinessName) {
        userData.businessName = storedBusinessName;
      }
      setUser(userData);
    }
  }, []);

  const value = { user, token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
