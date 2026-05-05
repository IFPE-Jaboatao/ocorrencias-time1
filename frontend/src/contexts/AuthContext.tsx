"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface User {
  name: string;
  role: "ADMIN" | "ALUNO" | "PROFESSOR";
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user_data");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const userRole = decoded.role;
      const userName = decoded.name || "Usuário";

      const userData = { name: userName, role: userRole };
      localStorage.setItem("token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));

      setUser(userData);
      router.push(`/dashboard/${userRole.toLowerCase()}`);
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
