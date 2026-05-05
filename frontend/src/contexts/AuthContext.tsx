"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface User {
  name: string;
  role: "ADMIN" | "ALUNO" | "PROFESSOR";
}

interface DecodedToken {
  role: "ADMIN" | "ALUNO" | "PROFESSOR";
  name?: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user_data");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const userData: User = {
        name: decoded.name || "Usuário",
        role: decoded.role,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));

      setUser(userData);

      router.push(`/dashboard/${decoded.role.toLowerCase()}`);
    } catch (error) {
      console.error("Falha no Login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
