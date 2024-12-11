import React, { createContext, useState, useEffect } from "react";
import {
  getSessionData,
  removeSessionData,
} from "./utils/storage/sessionStorageUtils";

import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, isAuthenticated: false });

  useEffect(() => {
    const validateToken = async(token) => {
      try {
        // Call API to validate token
        const headers = { authorization: `Bearer ${token}` };
        await axios.get(
          "http://localhost:5000/usersdata/access",
          { headers }
        ).then((res) =>{
            if (res.status === 200) {
                setAuth({ token, isAuthenticated: true });
              } else {
                setAuth({ token: null, isAuthenticated: false });
              }
        }).catch((error) =>{
            console.error("Token validation error:", error);
        });
      } catch (error) {
        console.error("Token validation error:", error);
        setAuth({ token: null, isAuthenticated: false });
      }
    };
    // On app load, check if the token exists in localStorage/sessionStorage
    const storedToken = getSessionData('jwt_token');
    if (storedToken) {
      validateToken(storedToken);
    }
  });

  const logout = () => {
    removeSessionData('jwt_token');
    setAuth({ token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
