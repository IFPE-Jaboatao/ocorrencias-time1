"use client";
import { useState, useEffect } from "react";
import { Card, Button, Alert } from "flowbite-react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import Step1Identificacao from "@/components/ocorrencia/Step1Identificacao";
import Step2Detalhamento from "@/components/ocorrencia/Step2Detalhamento";
import Step3Upload from "@/components/ocorrencia/Step3Upload";
import Step4Revisao from "@/components/ocorrencia/Step4Revisao";
import LateralSteps from "@/components/ocorrencia/LateralSteps";
import { api } from "@/services/api";

export interface OcorrenciaFormData {
  alunoId: string;
  nomeAluno: string;
  tipoOcorrencia: string;
  detalhamento: string;
  titulo: string;
  severidade: string;
  dataOcorrencia: string;
  anexos: File[];
}

export default function CadastrarOcorrenciaPage() {
  const [passo, setPasso] = useState<number>(1);
  const [statusEnvio, setStatusEnvio] = useState<{
    tipo: "sucesso" | "erro" | null;
    mensagem: string;
  }>({
    tipo: null,
    mensagem: "",
  });

  const [formData, setFormData] = useState<OcorrenciaFormData>({
    alunoId: "",
    nomeAluno: "",
    tipoOcorrencia: "",
    detalhamento: "",
    titulo: "",
    severidade: "Média",
    dataOcorrencia: new Date().toISOString().substring(0, 16),
    anexos: [],
  });

  useEffect(() => {
    if (statusEnvio.tipo) {
      const timer = setTimeout(() => {
        setStatusEnvio({ tipo: null, mensagem: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusEnvio]);

  const atualizarDados = (dados: Partial<OcorrenciaFormData>) => {
    setFormData((prev) => ({ ...prev, ...dados }));
  };

  const proximoPasso = () => setPasso((prev) => Math.min(prev + 1, 4));
  const passoAnterior = () => setPasso((prev) => Math.max(prev - 1, 1));

  const submeterFormulario = async () => {
    const valorDigitado = formData.alunoId.trim();
    const ehApenasNumero = /^\d+$/.test(valorDigitado);

    const payload = {
      alunoId: ehApenasNumero ? Number(valorDigitado) : undefined,
      matriculaAluno: !ehApenasNumero ? valorDigitado : undefined,
      categoria: formData.tipoOcorrencia,
      severidade: formData.severidade,
      titulo: formData.titulo || `Ocorrência - Identificador ${valorDigitado}`,
      descricao: formData.detalhamento,
      dataOcorrencia: new Date(formData.dataOcorrencia).toISOString(),
      turmaId: null,
    };

    try {
      const resposta = await api.post("/ocorrencias", payload);

      if (resposta.status === 200 || resposta.status === 201) {
        setStatusEnvio({
          tipo: "sucesso",
          mensagem:
            "Sucesso! A ocorrência foi registrada e integrada ao sistema do IFPE.",
        });

        setPasso(1);
        setFormData({
          alunoId: "",
          nomeAluno: "",
          tipoOcorrencia: "",
          detalhamento: "",
          titulo: "",
          severidade: "Média",
          dataOcorrencia: new Date().toISOString().substring(0, 16),
          anexos: [],
        });
      }
    } catch (error: any) {
      console.error(error);
      setStatusEnvio({
        tipo: "erro",
        mensagem:
          error.response?.data?.message ||
          "Não foi possível salvar o registro. Tente novamente.",
      });
    }
  };

  const passo1Valido =
    formData.alunoId.trim() !== "" &&
    formData.tipoOcorrencia !== "" &&
    formData.nomeAluno.trim() !== "";
  const passo2Valido = formData.detalhamento.trim().length > 0;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors pt-10 relative">
      <div className="fixed top-6 right-6 z-50 max-w-md w-full flex flex-col gap-3 transition-all duration-300">
        {statusEnvio.tipo === "sucesso" && (
          <Alert
            color="success"
            icon={HiCheckCircle}
            rounded
            className="shadow-lg border-l-4 border-green-500 bg-white dark:bg-gray-800"
          >
            <span className="font-bold text-green-700 dark:text-green-400">
              {statusEnvio.mensagem}
            </span>
          </Alert>
        )}
        {statusEnvio.tipo === "erro" && (
          <Alert
            color="failure"
            icon={HiXCircle}
            rounded
            className="shadow-lg border-l-4 border-red-500 bg-white dark:bg-gray-800"
          >
            <span className="font-bold text-red-700 dark:text-red-400">
              🚨 {statusEnvio.mensagem}
            </span>
          </Alert>
        )}
      </div>

      <Card className="w-full max-w-5xl shadow-xl border-none rounded-lg p-0 overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700 relative">
        {/* 🟢 QUADRADINHOS DE DESIGN */}
        <div className="absolute top-5 right-0 flex flex-col gap-1 opacity-40 pointer-events-none select-none z-0">
          <div className="flex gap-1 justify-end">
            <div className="w-6 h-6 bg-[#5da16f] rounded-sm" />
            <div className="w-6 h-6 bg-[#5da16f] rounded-sm" />
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 bg-[#5da16f] rounded-sm" />
            <div className="w-6 h-6 bg-[#5da16f] rounded-sm" />
            <div className="w-6 h-6 bg-[#5da16f] rounded-sm" />
          </div>
        </div>

        <div className="absolute bottom-0 left-1 flex gap-1 items-end opacity-40 pointer-events-none select-none z-0">
          <div className="flex flex-col gap-1">
            <div className="w-6 h-6 bg-[#5da16f] rounded-sm" />
            <div className="w-6 h-6 bg-[#5da16f] rounded-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-6 h-6 bg-[#5da16f] rounded-sm" />
            <div className="w-6 h-6 bg-[#5da16f] rounded-sm" />
          </div>
          <div className="w-6 h-6 bg-[#5da16f] rounded-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 relative z-10">
          <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-700 pr-4">
            <LateralSteps passoAtual={passo} />
          </div>

          <div className="md:col-span-2 flex flex-col justify-between min-h-[420px]">
            <div className="flex-1">
              {passo === 1 && (
                <Step1Identificacao
                  formData={formData}
                  atualizarDados={atualizarDados}
                  onNext={proximoPasso}
                />
              )}
              {passo === 2 && (
                <Step2Detalhamento
                  formData={formData}
                  atualizarDados={atualizarDados}
                  onNext={proximoPasso}
                  onBack={passoAnterior}
                />
              )}
              {passo === 3 && (
                <Step3Upload
                  formData={formData}
                  atualizarDados={atualizarDados}
                  onNext={proximoPasso}
                  onBack={passoAnterior}
                />
              )}
              {passo === 4 && (
                <Step4Revisao
                  formData={formData}
                  onBack={passoAnterior}
                  onSubmit={submeterFormulario}
                />
              )}
            </div>

            <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              {passo === 1 &&
                !passo1Valido &&
                formData.alunoId.trim() !== "" && (
                  <p className="text-sm text-red-500 font-medium text-right animate-pulse">
                    ⚠️ Para avançar, certifique-se de selecionar o tipo e de que
                    o aluno foi validado.
                  </p>
                )}

              {passo === 1 && formData.alunoId.trim() === "" && (
                <p className="text-sm text-gray-400 font-medium text-right">
                  * Preencha a matrícula e selecione a categoria para liberar o
                  avanço.
                </p>
              )}

              <div className="flex justify-between items-center w-full">
                {passo > 1 ? (
                  <Button
                    color="light"
                    onClick={passoAnterior}
                    className="px-4 py-0.5 min-w-[100px] font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 transition-all rounded-md"
                  >
                    Voltar
                  </Button>
                ) : (
                  <div />
                )}

                {passo < 4 ? (
                  <Button
                    className="px-5 py-0.5 min-w-[160px] font-semibold bg-[#5da16f] enabled:hover:bg-[#4a8a59] text-white border-none transition-all rounded-md shadow-sm"
                    onClick={proximoPasso}
                    disabled={
                      (passo === 1 && !passo1Valido) ||
                      (passo === 2 && !passo2Valido)
                    }
                  >
                    Avançar
                  </Button>
                ) : (
                  <Button
                    className="px-5 py-0.5 min-w-[160px] font-semibold bg-[#5da16f] enabled:hover:bg-[#4a8a59] text-white border-none transition-all rounded-md shadow-sm enabled:hover:bg-green-700"
                    onClick={submeterFormulario}
                  >
                    Finalizar Registro
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
