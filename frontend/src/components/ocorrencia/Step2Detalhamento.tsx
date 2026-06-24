import { Label, Textarea, Button } from "flowbite-react";
import { OcorrenciaFormData } from "../../app/ocorrencias/page";

interface StepProps {
  formData: OcorrenciaFormData;
  atualizarDados: (dados: Partial<OcorrenciaFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Detalhamento({
  formData,
  atualizarDados,
  onNext,
  onBack,
}: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-1">
          Detalhamento da ocorrência
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Descreva a ocorrência em detalhes:
        </p>
      </div>

      <div className="flex-1">
        <Textarea
          id="detalhes"
          rows={6}
          value={formData.detalhamento}
          onChange={(e) => atualizarDados({ detalhamento: e.target.value })}
          placeholder="Digite aqui o relatório descritivo..."
          maxLength={2000}
          required
        />
      </div>
    </div>
  );
}
