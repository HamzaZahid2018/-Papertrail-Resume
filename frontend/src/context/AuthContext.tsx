import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../services/apiClient.ts";

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const profile: User = await apiClient.get("/auth/me");
      setUser(profile);
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // API expects OAuth2 form data
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
      
      const res: LoginResponse = await apiClient.post("/auth/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      
      localStorage.setItem("access_token", res.access_token);
      await fetchProfile();
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/register", { email, password });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
