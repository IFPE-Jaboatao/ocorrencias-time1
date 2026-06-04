import { Label, TextInput, Select, Button, HelperText, Alert } from "flowbite-react";
import { OcorrenciaFormData } from "../../app/ocorrencia/page";
import { HiInformationCircle } from "react-icons/hi";

interface StepProps {
  formData: OcorrenciaFormData;
  atualizarDados: (dados: Partial<OcorrenciaFormData>) => void;
  onNext: () => void;
}

export default function Step1Identificacao({ formData, atualizarDados, onNext }: StepProps) {
  const matriculaInvalida = formData.matriculaCpf.length > 0 && formData.matriculaCpf.length < 3;
  const alunoNaoEncontrado = formData.matriculaCpf === "000"; 
  const matriculaVazia = formData.matriculaCpf.trim() === "";
  const tipoVazio = formData.tipoOcorrencia === "";

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

{alunoNaoEncontrado && (
  <Alert color="failure" icon={HiInformationCircle} className="rounded-md">
    <span className="font-medium">Erro na busca!</span> Nenhuma matrícula ou CPF correspondente foi encontrado no sistema do IFPE.
  </Alert>
)}
      <div>
        <Label htmlFor="matricula" className="text-gray-600 mb-2 block">Matrícula ou CPF do aluno</Label>
        <TextInput 
          id="matricula" 
          value={formData.matriculaCpf} 
          onChange={(e) => atualizarDados({ matriculaCpf: e.target.value })} 
          required 
          color={alunoNaoEncontrado ? "failure" : matriculaInvalida ? "warning" : matriculaVazia ? "gray" : "success"}
          className="[&_input]:rounded-md [&_input]:py-2.5 transition-all"
          />
          {matriculaInvalida && (
    <HelperText color="warning" className="mt-1 font-medium">
      ⚠️ O campo deve conter uma matrícula válida do estudante.
    </HelperText>
  )}
        
      </div>

      <div>
        <Label htmlFor="nome" className="text-gray-600 mb-2 block">Nome completo do aluno (campo automático)</Label>
        <TextInput id="nome" value={formData.nomeAluno} disabled placeholder="Buscando automaticamente..." className="[&_input]:rounded-md [&_input]:py-2.5 transition-all"/>
     {!alunoNaoEncontrado && formData.matriculaCpf === "111" && (
    <HelperText color="success" className="mt-1 font-medium flex items-center gap-1">
      ✓ Aluno integrado e validado via banco institucional.
    </HelperText>
  )}
  {matriculaVazia && (
    <HelperText color="gray" className="mt-1 text-xs text-gray-400">
      * Campo obrigatório. Por favor, preencha para prosseguir.
    </HelperText>
  )}
      </div>

      <div>
        <Label htmlFor="tipo" className="text-gray-600 mb-2 block">Tipo de ocorrência</Label>
        <Select 
          id="tipo" 
          color={tipoVazio ? "gray" : "success"}
          value={formData.tipoOcorrencia} 
          onChange={(e) => atualizarDados({ tipoOcorrencia: e.target.value })} 
          required
          className="[&_select]:rounded-md [&_select]:py-2.5 transition-all"
        >
          <option value="">Selecione uma opção</option>
          <option value="FALTA_INJUSTIFICADA">Falta Injustificada</option>
          <option value="CONDUTA_INDISCIPLINAR">Conduta Indisciplinar</option>
          <option value="BULLYING">Bullying</option>
          <option value="OUTROS">Outros</option>
        </Select>
        {tipoVazio && (
      <HelperText color="gray" className="mt-1 text-xs text-gray-400">
        * Seleção obrigatória. Escolha uma categoria de ocorrência institucional.
      </HelperText>
    )}
      </div>
    </form>
  );
}