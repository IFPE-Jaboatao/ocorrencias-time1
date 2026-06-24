"use client";
import { useState, useEffect } from "react";
import { Badge } from "flowbite-react";
import { HiSearch, HiUser, HiTag, HiInformationCircle } from "react-icons/hi";
import { api } from "@/services/api";

interface Ocorrencia {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  severidade: string;
  status: string;
  dataOcorrencia: string;
  dataCriacao: string;
  ciencia: boolean;
  aluno: {
    id: number;
    matricula: string;
    usuario?: { nome: string; email: string };
    turma?: { nome: string } | null;
  } | null;
  autorUsuario: {
    id: number;
    nome: string;
    funcao: string;
  } | null;
}

export default function HistoricoOcorrenciasPage() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [ocorrenciaSelecionada, setOcorrenciaSelecionada] =
    useState<Ocorrencia | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    const carregarOcorrencias = async () => {
      try {
        setCarregando(true);
        const token =
          localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token");

        const resposta = await api.get("/ocorrencias?limit=50", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resposta.data && resposta.data.ocorrencias) {
          setOcorrencias(resposta.data.ocorrencias);
        } else if (Array.isArray(resposta.data)) {
          setOcorrencias(resposta.data);
        }
      } catch (error) {
        console.error("Erro ao carregar lista de ocorrências:", error);
      } finally {
        setCarregando(false);
      }
    };
    carregarOcorrencias();
  }, []);

  const ocorrenciasFiltradas = ocorrencias.filter((oc) => {
    if (!oc) return false;
    const titulo = oc.titulo ? oc.titulo.toLowerCase() : "";
    const nomeAluno =
      oc.aluno && oc.aluno.usuario && oc.aluno.usuario.nome
        ? oc.aluno.usuario.nome.toLowerCase()
        : "";
    const matricula =
      oc.aluno && oc.aluno.matricula ? oc.aluno.matricula.toLowerCase() : "";
    const busca = termoBusca.toLowerCase();

    return (
      titulo.includes(busca) ||
      nomeAluno.includes(busca) ||
      matricula.includes(busca)
    );
  });

  const getSeveridadeColor = (sev: string) => {
    switch (sev?.toUpperCase()) {
      case "ALTA":
        return "failure";
      case "MÉDIA":
        return "warning";
      default:
        return "indigo";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ABERTA":
        return "failure";
      case "EM_ACOMPANHAMENTO":
        return "warning";
      case "RESOLVIDA":
        return "success";
      default:
        return "gray";
    }
  };

  if (!montado)
    return (
      <div className="pt-28 text-center text-gray-400">Carregando iFlow...</div>
    );

  return (
    <div className="pt-28 p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Histórico Geral de Ocorrências
          </h2>

          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <HiSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="Buscar por aluno, título..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-100 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4">Estudante</th>
                <th className="px-6 py-4">Ocorrência</th>
                <th className="px-6 py-4">Severidade</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {carregando ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-gray-400 py-6 italic"
                  >
                    Carregando registros do iFlow...
                  </td>
                </tr>
              ) : ocorrenciasFiltradas.length > 0 ? (
                ocorrenciasFiltradas.map((oc) => (
                  <tr
                    key={oc.id}
                    onClick={() => setOcorrenciaSelecionada(oc)}
                    className={`cursor-pointer transition-colors border-b dark:border-gray-700 ${ocorrenciaSelecionada?.id === oc.id ? "bg-green-50/70 dark:bg-gray-700" : "hover:bg-gray-50/50 dark:hover:bg-gray-700/40 bg-white dark:bg-gray-800"}`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      <div>
                        {oc.aluno?.usuario?.nome || "Estudante sem Nome"}
                      </div>
                      <div className="text-xs text-gray-400 font-normal">
                        {oc.aluno?.matricula || "S/M"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      <div className="font-medium">{oc.titulo}</div>
                      <div className="text-xs text-gray-400">
                        {oc.dataOcorrencia
                          ? new Date(oc.dataOcorrencia).toLocaleDateString(
                              "pt-BR",
                            )
                          : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        color={getSeveridadeColor(oc.severidade)}
                        size="xs"
                        className="w-fit"
                      >
                        {oc.severidade}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        color={getStatusColor(oc.status)}
                        size="xs"
                        className="w-fit"
                      >
                        {oc.status?.replace(/_/g, " ")}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-6">
                    Nenhuma ocorrência encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COLUNA DA DIREITA: DETALHES DA OCORRÊNCIA SELECIONADA */}
      <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit max-h-[78vh] overflow-y-auto">
        {ocorrenciaSelecionada ? (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-green-700 dark:text-green-400 text-center border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center justify-center gap-2">
              <HiInformationCircle size={20} /> Detalhes do Registro
            </h3>

            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <HiUser /> Aluno Envolvido
              </h4>
              <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">
                {ocorrenciaSelecionada.aluno?.usuario?.nome || "Não informado"}
              </p>
              <p className="text-xs text-gray-500">
                <strong>Matrícula:</strong>{" "}
                {ocorrenciaSelecionada.aluno?.matricula || "Não informada"}{" "}
                <br />
                <strong>Turma:</strong>{" "}
                {ocorrenciaSelecionada.aluno?.turma?.nome || "ADS 3º Período"}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <HiTag /> Descrição do Fato
              </h4>
              <div className="bg-green-50/40 dark:bg-gray-700/20 p-4 rounded-xl border border-green-100/30 dark:border-gray-600">
                <h5 className="font-bold text-gray-800 dark:text-white text-sm mb-1">
                  {ocorrenciaSelecionada.titulo}
                </h5>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {ocorrenciaSelecionada.descricao ||
                    "Nenhuma descrição detalhada foi fornecida."}
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1 bg-gray-50/50 dark:bg-gray-700/10 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <p>
                <strong>Categoria:</strong>{" "}
                {ocorrenciaSelecionada.categoria?.replace(/_/g, " ")}
              </p>
              <p>
                <strong>Registrado em:</strong>{" "}
                {ocorrenciaSelecionada.dataCriacao
                  ? new Date(ocorrenciaSelecionada.dataCriacao).toLocaleString(
                      "pt-BR",
                    )
                  : ""}
              </p>
              <p>
                <strong>Autor do Registro:</strong>{" "}
                {ocorrenciaSelecionada.autorUsuario?.nome || "Professor/Admin"}
              </p>
              <p>
                <strong>Ciência dos Responsáveis:</strong>{" "}
                {ocorrenciaSelecionada.ciencia
                  ? "✅ Confirmada"
                  : "⏳ Pendente"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 dark:text-gray-500 py-24 text-sm font-medium">
            💡 Selecione uma ocorrência na tabela para expandir o dossiê e os
            detalhes do acontecimento.
          </div>
        )}
      </div>
    </div>
  );
}
