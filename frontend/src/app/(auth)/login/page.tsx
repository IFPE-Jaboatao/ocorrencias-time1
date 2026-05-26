"use client";
import { useState } from "react";
import { Button, Card, Label, TextInput, Spinner, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { DarkThemeToggle } from "flowbite-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState<{
    type: "error" | "loading" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const { login: realizarLoginContexto } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail.trim() || !senha) {
      setStatus({ type: "error", message: "Preencha todos os campos." });
      return;
    }

    setStatus({ type: "loading", message: "" });

    try {
      const data = await api.post("/auth/login", {
        email: loginEmail.trim(),
        senha: senha,
      });

      if (data && data.funcao) {
        console.log("Login autorizado! Iniciando sessão...");
        realizarLoginContexto(data);
      } else {
        setStatus({ type: "error", message: "Resposta inválida do servidor." });
      }
    } catch (error: any) {
      console.error("Erro capturado:", error);
      setStatus({
        type: "error",
        message:
          error.status === 401
            ? "E-mail ou senha incorretos."
            : "Erro de conexão com o iFlow.",
      });
    }
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8faf9] to-[#e6f2ea] dark:from-[#111827] dark:to-[#1f2937] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => {
            const html = document.documentElement;
            html.classList.toggle("dark");
            localStorage.setItem(
              "flowbite-theme-mode",
              html.classList.contains("dark") ? "dark" : "light",
            );
          }}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
        >
          {/* Lua - aparece no modo claro */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 block dark:hidden"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          {/* Sol - aparece no modo escuro */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 hidden dark:block"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {/* 🔹 ESQUERDA */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "calc(48% + 240px)",
          top: "32%",
          transform: "translateY(-50%)",
        }}
      >
        <div className="relative" style={{ width: "90px", height: "270px" }}>
          <div
            className="absolute bg-[#6ab17e] rounded-lg"
            style={{ width: "26px", height: "26px", top: "0px", left: "64px" }}
          />
          <div
            className="absolute bg-[#6ab17e] rounded-xl"
            style={{ width: "44px", height: "44px", top: "38px", left: "46px" }}
          />
          <div
            className="absolute bg-[#6ab17e] rounded-xl"
            style={{ width: "44px", height: "44px", top: "94px", left: "0px" }}
          />
          <div
            className="absolute bg-[#6ab17e] rounded-lg"
            style={{ width: "24px", height: "44px", top: "94px", left: "52px" }}
          />
          <div
            className="absolute bg-[#6ab17e] rounded-xl"
            style={{ width: "44px", height: "44px", top: "146px", left: "0px" }}
          />
          <div
            className="absolute bg-[#6ab17e] rounded-lg"
            style={{
              width: "24px",
              height: "44px",
              top: "146px",
              left: "52px",
            }}
          />
          <div
            className="absolute bg-[#6ab17e] rounded-xl"
            style={{ width: "44px", height: "44px", top: "198px", left: "0px" }}
          />
        </div>
      </div>

      {/* DIREITA */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "calc(50% + 240px)",
          top: "70%",
          transform: "translateY(-44%)",
        }}
      >
        <div className="relative" style={{ width: "100px", height: "300px" }}>
          <div
            className="absolute bg-[#6ab17e] rounded-lg"
            style={{ width: "36px", height: "36px", top: "0px", left: "0px" }}
          />
          <div
            className="absolute bg-[#6ab17e] rounded-lg"
            style={{ width: "36px", height: "36px", top: "0px", left: "46px" }}
          />
          <div
            className="absolute bg-[#6ab17e] rounded-full"
            style={{ width: "8px", height: "8px", top: "56px", left: "-18px" }}
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute bg-[#6ab17e] rounded-xl"
              style={{
                width: "36px",
                height: "36px",
                top: `${48 + Math.floor(i / 2) * 48}px`,
                left: `${(i % 2) * 46}px`,
              }}
            />
          ))}
          <div
            className="absolute bg-[#6ab17e] rounded-xl"
            style={{
              width: "36px",
              height: "36px",
              top: "145px",
              left: "-45px",
            }}
          />
          <div
            className="absolute bg-[#6ab17e] rounded-lg"
            style={{ width: "28px", height: "28px", top: "190px", left: "4px" }}
          />
        </div>
      </div>
      <Card className="max-w-md w-full shadow-2xl border-none backdrop-blur-md rounded-md bg-white dark:bg-gray-800 z-10">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-100">
            Login
          </h1>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            Sistema de Ocorrências iFlow
          </p>
        </div>

        {status.type === "error" && (
          <Alert
            color="failure"
            icon={HiInformationCircle}
            className="mb-2 text-red-700 bg-red-50 border border-red-300"
          >
            {status.message}
          </Alert>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="usuario"
                className="text-gray-600 dark:text-gray-300 font-medium"
              >
                Usuário
              </Label>
            </div>
            <TextInput
              id="usuario"
              placeholder="digite seu email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              color={status.type === "error" ? "failure" : "gray"}
              disabled={status.type === "loading"}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="senha"
                className="text-gray-600 dark:text-gray-300 font-medium"
              >
                Senha
              </Label>
            </div>
            <TextInput
              id="senha"
              type="password"
              placeholder="digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              color={status.type === "error" ? "failure" : "gray"}
              disabled={status.type === "loading"}
            />
          </div>

          <Button
            type="submit"
            className="bg-[#5da16f] enabled:hover:bg-[#4a8a59] transition-all py-2.5"
            disabled={status.type === "loading"}
          >
            {status.type === "loading" ? (
              <div className="flex items-center gap-3">
                <Spinner size="sm" light={true} />
                <span>Autenticando...</span>
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </Card>
    </main>
  );
}
