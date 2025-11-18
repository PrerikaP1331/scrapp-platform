// /client/src/context/AuthContext.js
import React, { createContext, useState } from "react";
import * as communityService from "../api/communityService";
import apiClient from "../api/axios";

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
    if (userData?.communityId) {
      localStorage.setItem("communityId", userData.communityId);
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
    const storedCommunityId = localStorage.getItem("communityId");
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
      if (storedCommunityId) {
        userData.communityId = storedCommunityId;
      }
      if (storedBusinessName) {
        userData.businessName = storedBusinessName;
      }
      setUser(userData);
    }
  }, []);

  React.useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (!authToken) return;
    (async () => {
      try {
        const me = await apiClient.get("/auth/me");
        const role = me?.data?.role;
        const name = me?.data?.name;
        const email = me?.data?.email;
        const phone = me?.data?.phone;
        const baseUser = { role, name, email, phone };
        if (role) localStorage.setItem("userRole", role);
        if (name) localStorage.setItem("userName", name);
        if (email) localStorage.setItem("userEmail", email);
        if (phone) localStorage.setItem("userPhone", phone);
        setUser({ ...(user || {}), ...baseUser });
      } catch (_) {}
      try {
        if ((user?.role || localStorage.getItem("userRole")) === "community_admin" && !localStorage.getItem("communityId")) {
          const c = await communityService.getAdminCommunity();
          const cid = c?._id || c?.id;
          if (cid) {
            localStorage.setItem("communityId", cid);
            setUser({ ...(user || {}), communityId: cid, communityName: c?.name || localStorage.getItem("communityName") || "" });
          }
        }
      } catch (_) {}
    })();
  }, [user?.role, user?.communityId]);

  const value = { user, token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
