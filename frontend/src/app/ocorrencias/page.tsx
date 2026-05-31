"use client";
import { useState } from "react";
// 🚨 IMPORTANTE: Importamos apenas o Card, sem nenhum Provider fantasma que não existe
import { Card } from "flowbite-react"; ;
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

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
      <Card className="w-full max-w-5xl shadow-xl border-none rounded-lg p-0 overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700">
        
        {/* Banner Verde Superior */}
        <div className="bg-[#5da16f] h-12 w-full flex items-center justify-center">
          <div className="bg-white/20 p-1.5 rounded-md text-white text-xs font-bold">
            ✓ Registro de Ocorrência
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Menu Lateral Esquerdo */}
          <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-700 pr-4">
            <LateralSteps passoAtual={passo} />
          </div>

          {/* Área Dinâmica do Formulário */}
          <div className="md:col-span-2 flex flex-col justify-between min-h-[400px]">

          </div>
        </div>
      </Card>
    </main>
  );
}