"use client";

import { useState } from "react";
import { Label, TextInput, Select, HelperText, Alert } from "flowbite-react";
import { OcorrenciaFormData } from "../../app/ocorrencias/page";
import { HiInformationCircle } from "react-icons/hi";
import { api } from "@/services/api";

interface StepProps {
  formData: OcorrenciaFormData;
  atualizarDados: (dados: Partial<OcorrenciaFormData>) => void;
  onNext: () => void;
  categoriasOcorrencia?: string[];
}

export default function Step1Identificacao({
  formData,
  atualizarDados,
  onNext,
  categoriasOcorrencia = [],
}: StepProps) {
  const [carregando, setCarregando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState(false);

  const matriculaInvalida =
    formData.alunoId.length > 0 && formData.alunoId.length < 3;
  const matriculaVazia = formData.alunoId.trim() === "";
  const tipoVazio = formData.tipoOcorrencia === "";

  const buscarAlunoNoBanco = async () => {
    const valor = formData.alunoId.trim();
    if (valor.length < 3) return;

    setCarregando(true);
    setErroValidacao(false);

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const resposta = await api.get(`/ocorrencias/alunos/validar/${valor}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      atualizarDados({ nomeAluno: resposta.data.nome });
    } catch (error) {
      atualizarDados({ nomeAluno: "" });
      setErroValidacao(true);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.alunoId &&
      formData.tipoOcorrencia &&
      !matriculaInvalida &&
      !erroValidacao &&
      formData.nomeAluno
    ) {
      onNext();
    }
  };

  const listaCategorias =
    categoriasOcorrencia.length > 0
      ? categoriasOcorrencia
      : ["FALTA_INJUSTIFICADA", "CONDUTA_INDISCIPLINAR", "BULLYING", "OUTROS"];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-1">
          Identificação do Aluno
        </h2>
        <p className="text-sm text-gray-500 mb-4">preencha os dados básicos:</p>
      </div>

      {erroValidacao && (
        <Alert
          color="failure"
          icon={HiInformationCircle}
          className="rounded-md"
        >
          <span className="font-medium">Erro na busca!</span> Nenhuma matrícula
          ou ID correspondente foi encontrado no sistema do IFPE.
        </Alert>
      )}

      <div>
        <Label
          htmlFor="matricula"
          className="text-gray-600 mb-2 block font-medium"
        >
          Matrícula ou ID do Aluno *
        </Label>
        <TextInput
          id="matricula"
          placeholder="Ex: 20261ADS0042 ou ID numérico"
          value={formData.alunoId}
          onChange={(e) => {
            setErroValidacao(false);
            atualizarDados({ alunoId: e.target.value, nomeAluno: "" });
          }}
          onBlur={buscarAlunoNoBanco}
          required
          color={
            erroValidacao
              ? "failure"
              : matriculaInvalida
                ? "warning"
                : formData.nomeAluno
                  ? "success"
                  : "gray"
          }
          className="[&_input]:rounded-md [&_input]:py-2.5 transition-all"
        />
        {carregando && (
          <p className="text-xs text-blue-500 mt-1 animate-pulse">
            Consultando banco institucional do IFPE...
          </p>
        )}
        {matriculaInvalida && (
          <HelperText color="warning" className="mt-1 font-medium">
            ⚠️ O campo deve conter uma matrícula ou ID válido do estudante.
          </HelperText>
        )}
      </div>

      <div>
        <Label htmlFor="nome" className="text-gray-600 mb-2 block">
          Nome completo do aluno (campo automático)
        </Label>
        <TextInput
          id="nome"
          value={formData.nomeAluno}
          disabled
          placeholder="Será validado pelo banco institucional..."
          className="[&_input]:rounded-md [&_input]:py-2.5 transition-all bg-gray-100"
        />
        {formData.nomeAluno && (
          <HelperText
            color="success"
            className="mt-1 font-medium flex items-center gap-1"
          >
            ✓ Aluno integrado e validado via banco institucional.
          </HelperText>
        )}
      </div>

      <div>
        <Label htmlFor="tipo" className="text-gray-600 mb-2 block">
          Tipo de ocorrência
        </Label>
        <Select
          id="tipo"
          color={tipoVazio ? "gray" : "success"}
          value={formData.tipoOcorrencia}
          onChange={(e) => atualizarDados({ tipoOcorrencia: e.target.value })}
          required
          className="[&_select]:rounded-md [&_select]:py-2.5 transition-all"
        >
          <option value="">Selecione uma opção</option>
          {listaCategorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/_/g, " ")}
            </option>
          ))}
        </Select>
        {tipoVazio && (
          <HelperText color="gray" className="mt-1 text-xs text-gray-400">
            * Seleção obrigatória. Escolha uma categoria de ocorrência
            institucional.
          </HelperText>
        )}
      </div>
    </form>
  );
}
