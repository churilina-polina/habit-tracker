import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("habitly_token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      client.get("/auth/me").then(({ data }) => setUser(data)).catch(() => {});
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const { data } = await client.post("/auth/login", { email, password });
    localStorage.setItem("habitly_token", data.access_token);
    setToken(data.access_token);
  };

  const register = async (email, name, password) => {
    await client.post("/auth/register", { email, name, password });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("habitly_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
