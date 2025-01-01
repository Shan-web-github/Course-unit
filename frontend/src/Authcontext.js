import React, { createContext, useState } from "react";
import {
  removeSessionData,
} from "./utils/storage/sessionStorageUtils";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, isAuthenticated: false });

  const logout = () => {
    removeSessionData("jwt_token");
    setAuth({ token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, 
    // loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
