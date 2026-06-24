import { Label, FileInput, Button } from "flowbite-react";
import { OcorrenciaFormData } from "../../app/ocorrencias/page";
import { HiCloudUpload } from "react-icons/hi";

interface StepProps {
  formData: OcorrenciaFormData;
  atualizarDados: (dados: Partial<OcorrenciaFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Upload({
  formData,
  atualizarDados,
  onNext,
  onBack,
}: StepProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const arquivos = Array.from(e.target.files);
      atualizarDados({ anexos: arquivos });
      const leitor = new FileReader();
      leitor.onloadend = () => {
        if (typeof leitor.result === "string") {
          localStorage.setItem("evidencia_demonstracao", leitor.result);
          localStorage.setItem("evidencia_nome", arquivos[0].name);
        }
      };
      leitor.readAsDataURL(arquivos[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-1">
          Upload de anexos e comprovantes
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Adicionar justificativas (anexos, comprovantes, etc):
        </p>
      </div>

      <div className="flex w-full items-center justify-center">
        <Label
          htmlFor="dropzone-file"
          className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <HiCloudUpload className="mb-3 h-10 w-10 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Clique para fazer upload</span> ou
              arraste o arquivo
            </p>
            <p className="text-xs text-gray-500">PDF, PNG ou JPG (Max. 10MB)</p>
          </div>
          <FileInput
            id="dropzone-file"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
        </Label>
      </div>

      {formData.anexos.length > 0 && (
        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded-md">
          <strong>Arquivos selecionados:</strong>{" "}
          {formData.anexos.map((f) => f.name).join(", ")}
        </div>
      )}
    </div>
  );
}
