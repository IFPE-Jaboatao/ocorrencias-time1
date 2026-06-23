"use client";
import { useState } from "react";
import { Card, Button } from "flowbite-react";
import Step1Identificacao from "@/components/ocorrencia/Step1Identificacao";
import Step2Detalhamento from "@/components/ocorrencia/Step2Detalhamento";
import Step3Upload from "@/components/ocorrencia/Step3Upload";
import Step4Revisao from "@/components/ocorrencia/Step4Revisao";
import LateralSteps from "@/components/ocorrencia/LateralSteps";

export interface OcorrenciaFormData {
  matriculaCpf: string;
  nomeAluno: string;
  tipoOcorrencia: string;
  detalhamento: string;
  anexos: File[];
}

export default function CadastrarOcorrenciaPage() {
  const [passo, setPasso] = useState<number>(1);
  const [formData, setFormData] = useState<OcorrenciaFormData>({
    matriculaCpf: "",
    nomeAluno: "",
    tipoOcorrencia: "",
    detalhamento: "",
    anexos: [],
  });

  const atualizarDados = (dados: Partial<OcorrenciaFormData>) => {
    setFormData((prev) => ({ ...prev, ...dados }));
  };

  const proximoPasso = () => setPasso((prev) => Math.min(prev + 1, 4));
  const passoAnterior = () => setPasso((prev) => Math.max(prev - 1, 1));

  const submeterFormulario = async () => {
    console.log("Enviando dados finais para a API:", formData);
    alert("Ocorrência registrada com sucesso!");
  };

  const passo1Valido = formData.matriculaCpf && formData.tipoOcorrencia;
  const passo2Valido = formData.detalhamento.trim().length > 0;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors pt-10">
      <Card className="w-full max-w-5xl shadow-xl border-none rounded-lg p-0 overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700 relative">
        {/* <div className="bg-[#5da16f] h-12 w-full flex items-center justify-center ">
          <div className="bg-white/20 p-1.5 rounded-md text-white text-xs font-bold pt-10">
            ✓ Registro de Ocorrência
          </div>
        </div> */}

        {/* 🟢 QUADRADINHOS SUPERIORES */}
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

        {/* 🟢 QUADRADINHOS INFERIORES  */}
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

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              {passo > 1 ? (
                <Button
                  color="light"
                  onClick={passoAnterior}
                  className="px-4 py-0.5 min-w-[100px] font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600
         transition-all rounded-md"
                >
                  Voltar
                </Button>
              ) : (
                <div />
              )}

              {passo < 4 ? (
                <Button
                  className="px-5 py-0.5 min-w-[160px] font-semibold bg-[#5da16f] enabled:hover:bg-[#4a8a59] text-white 
        border-none transition-all rounded-md shadow-sm"
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
                  className="px-5 py-0.5 min-w-[160px] font-semibold bg-[#5da16f] enabled:hover:bg-[#4a8a59] text-white 
        border-none transition-all rounded-md shadow-sm enabled:hover:bg-green-700"
                  onClick={submeterFormulario}
                >
                  Finalizar Registro
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
