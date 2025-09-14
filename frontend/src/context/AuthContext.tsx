import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  userId: number | null;
  login: (token: string, role: string, userId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [userId, setUserId] = useState<number | null>(localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")!) : null);

  const login = (newToken: string, newRole: string , newUserId: number) => {
    setToken(newToken);
    setRole(newRole);
    setUserId(newUserId);
    console.log("UserId",newUserId);
    console.log("token",newToken);
    console.log("role",newRole);
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("userId", newUserId.toString());
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
