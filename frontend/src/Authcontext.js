import React, { createContext, useState} from "react";
import {
  // getSessionData,
  removeSessionData,
} from "./utils/storage/sessionStorageUtils";

// import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, isAuthenticated: false });
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const validateToken = async () => {
  //     const storedToken = getSessionData("jwt_token");

  //     if (!storedToken) {
  //       setAuth({ token: null, isAuthenticated: false });
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const headers = { authorization: `Bearer ${storedToken}` };
  //       const response = await axios.get(
  //         "http://localhost:5000/usersdata/access",
  //         { headers }
  //       );

  //       if (response.status === 200) {
  //         setAuth({ token: storedToken, isAuthenticated: true });
  //       } else {
  //         removeSessionData("jwt_token");
  //         setAuth({ token: null, isAuthenticated: false });
  //       }
  //     } catch (error) {
  //       console.error("Token validation error:", error);
  //       removeSessionData("jwt_token");
  //       setAuth({ token: null, isAuthenticated: false });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   validateToken();
  // }, []);

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
