import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;

      // Support both response formats:
      // Format A (current backend): { token, message, user }
      // Format B (ApiResponse wrapper): { success, message, data: { accessToken, user } }
      const token = data?.token || data?.data?.accessToken || data?.accessToken;
      const userData = data?.user || data?.data?.user;

      if (token && userData) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userData);
        return { success: true };
      } else {
        return {
          success: false,
          message: data?.message || "Login failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || "Invalid email or password",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const data = response.data;

      // Support both response formats:
      // Format A (current backend): { token, message, user }
      // Format B (ApiResponse wrapper): { success, message, data: { accessToken, user } }
      const token = data?.token || data?.data?.accessToken || data?.accessToken;
      const userData = data?.user || data?.data?.user;

      if (token && userData) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userData);
        return { success: true };
      } else {
        return {
          success: false,
          message: data?.message || "Registration failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
