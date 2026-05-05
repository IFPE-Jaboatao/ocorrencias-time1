"use client";
import { useState } from "react";
import { Button, Card, Label, TextInput, Spinner, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

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
    setStatus({ type: "loading", message: "" });

    try {
      const data = await api.post("/auth/login", {
        email: loginEmail.trim(),
        senha: senha,
      });

      if (data && data.access_token) {
        console.log("Token confirmado! Iniciando sessão...");
        realizarLoginContexto(data.access_token);
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
    <main className="min-h-screen bg-gradient-to-br from-[#f8faf9] to-[#e6f2ea] flex items-center justify-center p-4 relative overflow-hidden">
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
      <Card className="max-w-md w-full shadow-2xl border-none backdrop-blur-md rounded-md bg-white z-10">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-700">Login</h1>
          <p className="text-gray-500 text-sm">Sistema de Ocorrências iFlow</p>
        </div>

        {status.type === "error" && (
          <Alert color="failure" icon={HiInformationCircle} className="mb-2">
            {status.message}
          </Alert>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="usuario" className="text-gray-600 font-medium">
                Usuário
              </Label>
            </div>
            <TextInput
              id="usuario"
              placeholder="digite seu email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              color={status.type === "error" ? "failure" : "gray"}
              required
              disabled={status.type === "loading"}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="senha" className="text-gray-600 font-medium">
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
              required
              disabled={status.type === "loading"}
            />
          </div>

          <Button
            type="submit"
            className="bg-[#5da16f] enabled:hover:bg-[#4a8a59] transition-all"
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
