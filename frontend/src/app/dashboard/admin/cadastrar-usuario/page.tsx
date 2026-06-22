"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Label,
  TextInput,
  Select,
  Alert,
  Spinner,
} from "flowbite-react";
import { HiInformationCircle, HiCheckCircle } from "react-icons/hi";
import { api } from "@/services/api";

enum Funcao {
  ADMIN = "admin",
  PROFESSOR = "professor",
  ALUNO = "aluno",
  RESPONSAVEL = "responsavel",
}

export default function RegisterPage() {
  const [funcao, setFuncao] = useState<string>("");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    matricula: "",
    turmaId: "",
    telefone: "",
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | "loading" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!funcao) {
      setStatus({ type: "error", message: "Por favor, selecione um perfil." });
      return;
    }

    setStatus({ type: "loading", message: "" });

    const payload: any = {
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      senha: formData.senha,
      cpf: formData.cpf.replace(/\D/g, ""),
      funcao: funcao,
    };

    // Filtros condicionais baseados no DTO
    if (funcao === Funcao.PROFESSOR || funcao === Funcao.ALUNO) {
      payload.matricula = formData.matricula.trim();
    }
    if (funcao === Funcao.ALUNO) {
      payload.turmaId = Number(formData.turmaId);
    }
    if (funcao === Funcao.RESPONSAVEL) {
      payload.telefone = formData.telefone.trim();
    }

    try {
      const response = await api.post("/auth/register", payload);

      setStatus({
        type: "success",
        message: response.message || "Cadastro realizado com sucesso!",
      });

      setFormData({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        matricula: "",
        turmaId: "",
        telefone: "",
      });
      setFuncao("");
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      setStatus({
        type: "error",
        message:
          error.message || "Erro ao realizar o cadastro. Verifique os dados.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8faf9] to-[#e6f2ea] flex items-center justify-center p-4 relative overflow-hidden pt-10">
      {/* 🔹 ESQUERDA */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "calc(48% + 280px)",
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
          left: "calc(50% + 280px)",
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

      <Card className="max-w-xl w-full shadow-2xl border-none backdrop-blur-md bg-white rounded-md z-10 p-2">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-700">Cadastro</h1>
          <p className="text-gray-500 text-sm">
            Registre novos perfis no iFlow
          </p>
        </div>

        {status.type === "error" && (
          <Alert color="failure" icon={HiInformationCircle} className="mb-2">
            {status.message}
          </Alert>
        )}

        {status.type === "success" && (
          <Alert color="success" icon={HiCheckCircle} className="mb-2">
            {status.message}
          </Alert>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleCadastrar}>
          <div>
            <Label
              htmlFor="funcao"
              className="text-gray-600 font-medium mb-1 block"
            >
              Selecione o Perfil
            </Label>
            <Select
              id="funcao"
              value={funcao}
              onChange={(e) => setFuncao(e.target.value)}
              required
            >
              <option value="">Escolha uma opção...</option>
              <option value={Funcao.ALUNO}>Aluno</option>
              <option value={Funcao.PROFESSOR}>Professor</option>
              <option value={Funcao.RESPONSAVEL}>Responsável</option>
              <option value={Funcao.ADMIN}>Administrador</option>
            </Select>
          </div>

          {funcao && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all">
              <div className="md:col-span-2">
                <Label htmlFor="nome" className="text-gray-600 block mb-1">
                  Nome Completo
                </Label>
                <TextInput
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Digite o nome completo"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-600 block mb-1">
                  Email
                </Label>
                <TextInput
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="exemplo@ifpe.edu.br"
                />
              </div>

              <div>
                <Label htmlFor="senha" className="text-gray-600 block mb-1">
                  Senha Provisória
                </Label>
                <TextInput
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  placeholder="Digite a senha"
                />
              </div>

              <div className={funcao === Funcao.ADMIN ? "md:col-span-2" : ""}>
                <Label htmlFor="cpf" className="text-gray-600 block mb-1">
                  CPF
                </Label>
                <TextInput
                  id="cpf"
                  type="text"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  placeholder="Apenas os 11 números"
                  maxLength={11}
                />
              </div>

              {(funcao === Funcao.ALUNO || funcao === Funcao.PROFESSOR) && (
                <div>
                  <Label
                    htmlFor="matricula"
                    className="text-gray-600 block mb-1"
                  >
                    Matrícula
                  </Label>
                  <TextInput
                    id="matricula"
                    type="text"
                    value={formData.matricula}
                    onChange={handleChange}
                    required
                    placeholder="Número da matrícula"
                  />
                </div>
              )}

              {funcao === Funcao.ALUNO && (
                <div>
                  <Label htmlFor="turmaId" className="text-gray-600 block mb-1">
                    ID da Turma
                  </Label>
                  <TextInput
                    id="turmaId"
                    type="number"
                    value={formData.turmaId}
                    onChange={handleChange}
                    required
                    placeholder="Ex: 1"
                  />
                </div>
              )}

              {funcao === Funcao.RESPONSAVEL && (
                <div>
                  <Label
                    htmlFor="telefone"
                    className="text-gray-600 block mb-1"
                  >
                    Telefone do Responsável
                  </Label>
                  <TextInput
                    id="telefone"
                    type="text"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    placeholder="Ex: +5581999999999"
                  />
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="bg-[#5da16f] enabled:hover:bg-[#4a8a59] transition-colors mt-2 rounded-md py-0.5 text-white"
            disabled={status.type === "loading" || !funcao}
          >
            {status.type === "loading" ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>Cadastrando...</span>
              </div>
            ) : (
              "Cadastrar"
            )}
          </Button>
        </form>
      </Card>
    </main>
  );
}
