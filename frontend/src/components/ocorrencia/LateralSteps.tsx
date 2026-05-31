"use client";
import { HiCheck } from "react-icons/hi"; // Reutilizando o React Icons que você já tem!

export default function LateralSteps({ passoAtual }: { passoAtual: number }) {
  const etapas = [
    { id: 1, label: "Identificação do Aluno" },
    { id: 2, label: "Detalhamento da ocorrência" },
    { id: 3, label: "Upload de anexos e comprovantes" },
    { id: 4, label: "Revisão final e envio" },
  ];

  return (
    <div className="flex flex-col gap-10 relative mt-6 ml-4">
      {/* 🟢 Linha vertical customizada em Tailwind */}
      <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gray-200 z-0" />

      {etapas.map((etapa) => {
        const ativo = passoAtual === etapa.id;
        const concluido = passoAtual > etapa.id;

        return (
          <div key={etapa.id} className="flex items-center gap-4 z-10 relative">
            {/* 🟢 Bolinha Indicadora com as cores do iFlow */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                ${concluido 
                  ? "bg-[#5da16f] text-white" 
                  : ativo 
                    ? "bg-[#5da16f] text-white ring-4 ring-green-100 shadow-sm" 
                    : "bg-gray-100 text-gray-400 border border-gray-300"}`}
            >
              {concluido ? <HiCheck className="w-5 h-5" /> : etapa.id}
            </div>

            {/* 🟢 Texto da Etapa */}
            <div className="flex flex-col">
              <span
                className={`text-sm font-semibold transition-all duration-300 ${
                  ativo ? "text-gray-800 font-bold" : "text-gray-400"
                }`}
              >
                {etapa.label}
              </span>
              {ativo && (
                <span className="text-[11px] text-[#5da16f] font-medium -mt-0.5">
                  passo {etapa.id}: dados básicos
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}