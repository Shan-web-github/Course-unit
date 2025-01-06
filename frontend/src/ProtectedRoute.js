import { useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Authcontext";
import { getSessionData, removeSessionData } from "./utils/storage/sessionStorageUtils";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const ipAddress = process.env.REACT_APP_IPADDRESS;

  useEffect(() => {
    const storedToken = getSessionData("jwt_token");
    const checkToken = async () => {
      if (!storedToken) {
        setAuth({ token: null, isAuthenticated: false });
        navigate("/");
        return;
      } else {
        try {
          const headers = { authorization: `Bearer ${storedToken}` };
          const response = await axios.get(
            `http://${ipAddress}:5000/usersdata/access`,
            {
              headers
            });

          if (response.status === 200) {
            setAuth({ token: storedToken, isAuthenticated: true });
          } else {
            removeSessionData("jwt_token");
            setAuth({ token: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error("Token validation error:", error,storedToken);
          removeSessionData("jwt_token");
          setAuth({ token: null, isAuthenticated: false });
        }
      }
    };
    checkToken();
  }, [auth, setAuth, ipAddress, navigate]);

  return children;
};

export default ProtectedRoute;
