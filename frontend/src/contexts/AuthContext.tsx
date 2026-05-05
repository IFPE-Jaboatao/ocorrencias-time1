"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface User {
  name: string;
  funcao: "admin" | "aluno" | "professor" | "responsavel";
}

interface DecodedToken {
  funcao: "admin" | "aluno" | "professor" | "responsavel";
  name?: string;
  email?: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const savedUser = localStorage.getItem("user_data");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("user_data");
        Cookies.remove("token");
        Cookies.remove("user_role");
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userName = decoded.name
        ? decoded.name
        : decoded.email?.split("@")[0] || "Usuário";

      const userData: User = {
        name: userName,
        funcao: decoded.funcao,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));

      Cookies.set("token", token, { expires: 1 });
      Cookies.set("user_role", decoded.funcao.toUpperCase(), { expires: 1 });

      setUser(userData);

      router.push(`/dashboard/${decoded.funcao.toLowerCase()}`);
    } catch (error) {
      console.error("Falha ao processar login no contexto:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    Cookies.remove("token");
    Cookies.remove("user_role");

    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
