"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  name: string;
  funcao: "admin" | "aluno" | "professor" | "responsavel";
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user_data");
    const roleCookie = Cookies.get("user_role");

    if (savedUser && roleCookie) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("user_data");
        Cookies.remove("user_role");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    try {
      localStorage.setItem("user_data", JSON.stringify(userData));
      Cookies.set("user_role", userData.funcao.toUpperCase(), { expires: 1 });

      setUser(userData);
      router.push(`/dashboard/${userData.funcao.toLowerCase()}`);
    } catch (error) {
      console.error("Falha ao processar login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user_data");
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
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
