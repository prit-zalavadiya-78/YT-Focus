import { createContext, useState, useEffect, useContext } from "react"; // ✅ Added useContext
import api from "../services/api";

const AuthContext = createContext();

// ✅ THE MISSING EXPORT: Custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is already logged in on page load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // If we have a token, fetch the user details
          const { data } = await api.get("/auth/me");
          setUser(data);
        } catch (error) {
          console.log("Token expired or invalid");
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      
      localStorage.setItem("token", data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  // 3. Register Function
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      
      localStorage.setItem("token", data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message);
      return { 
        success: false, 
        message: error.response?.data?.message || "Registration failed" 
      };
    }
  };

  // 4. Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;