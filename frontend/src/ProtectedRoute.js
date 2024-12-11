import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Authcontext";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // `null` indicates pending check

  useEffect(() => {
    if (!auth.token) {
      navigate("/"); // Redirect to sign-in page if no token
    } else {
      setIsAuthenticated(true); // User is authenticated
    }
  }, [auth.token, navigate]);

  // Avoid rendering until authentication check is complete
  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return children;
};

export default ProtectedRoute;


