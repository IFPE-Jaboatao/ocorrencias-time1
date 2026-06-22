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
  login: (data: any) => void;
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
    const tokenCookie = Cookies.get("token");

    if (savedUser && roleCookie && tokenCookie) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("user_data");
        localStorage.removeItem("auth_token");
        Cookies.remove("user_role");
        Cookies.remove("token");
      }
    } else {
      localStorage.removeItem("user_data");
      localStorage.removeItem("auth_token");
      Cookies.remove("user_role");
      Cookies.remove("token");
    }
    setLoading(false);
  }, []);

  const login = (data: any) => {
    try {
      const token = data.access_token;

      if (!token) {
        throw new Error("Token não encontrado na resposta do servidor.");
      }
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payloadDecodificado = JSON.parse(window.atob(base64));

      console.log(
        "Payload extraído do Token com sucesso:",
        payloadDecodificado,
      );

      const userData: User = {
        name: payloadDecodificado.nome,
        funcao: payloadDecodificado.funcao.toLowerCase() as User["funcao"],
      };

      localStorage.setItem("auth_token", token);

      localStorage.setItem("user_data", JSON.stringify(userData));
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("user_role", userData.funcao.toUpperCase(), { expires: 1 });

      setUser(userData);

      router.push(`/dashboard/${userData.funcao}`);
    } catch (error) {
      console.error("Falha ao processar login com o novo formato:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user_data");
    Cookies.remove("user_role");
    Cookies.remove("token");
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
