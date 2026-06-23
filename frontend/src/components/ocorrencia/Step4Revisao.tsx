import { Button, List } from "flowbite-react";
import { OcorrenciaFormData } from "../../app/ocorrencias/page";

interface Step4Props {
  formData: OcorrenciaFormData;
  onBack: () => void;
  onSubmit: () => void;
}

export default function Step4Revisao({
  formData,
  onBack,
  onSubmit,
}: Step4Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-1">
          Revisão final e envio
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Confira as informações antes de salvar o registro:
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md border border-gray-200 dark:border-gray-600 flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <strong>Matrícula do Aluno:</strong> {formData.alunoId}
        </p>
        <p>
          <strong>Tipo de Ocorrência:</strong>{" "}
          {formData.tipoOcorrencia.replace("_", " ")}
        </p>
        <p>
          <strong>Relato:</strong> {formData.detalhamento}
        </p>
        <p>
          <strong>Total de Anexos:</strong> {formData.anexos.length} arquivo(s)
        </p>
        {formData.anexos.length > 0 && (
          <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
            📎 Pronto para exibição local: {formData.anexos[0].name}
          </div>
        )}
      </div>
    </div>
  );
}
