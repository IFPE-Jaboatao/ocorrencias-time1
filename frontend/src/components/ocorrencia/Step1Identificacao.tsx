import { Label, TextInput, Select, Button } from "flowbite-react";
import { OcorrenciaFormData } from "../../app/ocorrencia/page";

interface StepProps {
  formData: OcorrenciaFormData;
  atualizarDados: (dados: Partial<OcorrenciaFormData>) => void;
  onNext: () => void;
}

export default function Step1Identificacao({ formData, atualizarDados, onNext }: StepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.matriculaCpf && formData.tipoOcorrencia) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-1">Identificação do Aluno</h2>
        <p className="text-sm text-gray-500 mb-4">preencha os dados básicos:</p>
      </div>

      <div>
        <Label htmlFor="matricula" className="text-gray-600 mb-2 block">Matrícula ou CPF do aluno</Label>
        <TextInput 
          id="matricula" 
          value={formData.matriculaCpf} 
          onChange={(e) => atualizarDados({ matriculaCpf: e.target.value })} 
          required 
        />
      </div>

      <div>
        <Label htmlFor="nome" className="text-gray-600 mb-2 block">Nome completo do aluno (campo automático)</Label>
        <TextInput id="nome" value={formData.nomeAluno} disabled placeholder="Buscando automaticamente..." />
      </div>

      <div>
        <Label htmlFor="tipo" className="text-gray-600 mb-2 block">Tipo de ocorrência</Label>
        <Select 
          id="tipo" 
          value={formData.tipoOcorrencia} 
          onChange={(e) => atualizarDados({ tipoOcorrencia: e.target.value })} 
          required
        >
          <option value="">Selecione uma opção</option>
          <option value="FALTA_INJUSTIFICADA">Falta Injustificada</option>
          <option value="CONDUTA_INDISCIPLINAR">Conduta Indisciplinar</option>
          <option value="BULLYING">Bullying</option>
          <option value="OUTROS">Outros</option>
        </Select>
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" className="bg-[#5da16f] enabled:hover:bg-[#4a8a59]">Avançar</Button>
      </div>
    </form>
  );
}