"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner, Card, Badge } from "flowbite-react";
import { HiPlusCircle, HiEye, HiClipboardList, HiBell } from "react-icons/hi";
import Link from "next/link";
import { api } from "@/services/api";

interface OcorrenciaRecente {
  id: number;
  titulo: string;
  status: string;
  dataOcorrencia: string;
  aluno?: {
    usuario?: { nome: string };
    turma?: { nome: string };
  };
}

interface Metricas {
  total: number;
  pendentes: number;
  resolvidas: number;
}

export default function ProfessorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [metricas, setMetricas] = useState<Metricas>({ total: 0, pendentes: 0, resolvidas: 0 });
  const [recentes, setRecentes] = useState<OcorrenciaRecente[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    const carregarPainel = async () => {
      try {
        const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
        
        const resposta = await api.get("/ocorrencias/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMetricas({
          total: resposta.data.total || 0,
          pendentes: resposta.data.pendentes || 0,
          resolvidas: resposta.data.resolvidas || 0,
        });
        setRecentes(resposta.data.ocorrenciasRecentes || []);
      } catch (error) {
        console.error("Erro ao carregar dados do painel do professor:", error);
      } finally {
        setCarregandoDados(false);
      }
    };

    if (user) carregarPainel();
  }, [user]);

  if (authLoading || !montado) {
    return (
      <div className="flex justify-center items-center min-h-screen" role="status">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="pt-28 p-6 max-w-7xl mx-auto space-y-6">
      
      <Card className="border-none shadow-sm bg-gradient-to-r from-green-50 to-white dark:from-gray-800 dark:to-gray-800">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white capitalize">
          Bem-vinda, {user?.name?.toLowerCase()}!
        </h5>
        <p className="font-normal text-xs text-gray-500 dark:text-gray-400">
          Aqui você pode gerenciar todas as suas ocorrências de forma integrada no iFlow.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center text-center">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-400 mb-3">
            <HiClipboardList size={28} />
          </div>
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Total de Ocorrências
          </h3>
          <p className="text-5xl font-black text-gray-800 dark:text-white mt-2">
            {carregandoDados ? "..." : metricas.total}
          </p>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <HiBell className="text-yellow-500" /> Minhas ocorrências recentes
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400">
              <thead className="text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-700/50 text-[10px] tracking-wider border-b dark:border-gray-700">
                <tr>
                  <th className="py-3 px-2">Nome</th>
                  <th className="py-3 px-2">Turma</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {carregandoDados ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center italic text-gray-400">Buscando iFlow...</td>
                  </tr>
                ) : recentes.length > 0 ? (
                  recentes.map((oc) => (
                    <tr key={oc.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="py-3 px-2 font-semibold text-gray-900 dark:text-white">
                        <div>{oc.aluno?.usuario?.nome || "Estudante"}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{oc.titulo}</div>
                      </td>
                      <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                        {oc.aluno?.turma?.nome || "ADS 3a"}
                      </td>
                      <td className="py-3 px-2">
                        <Badge color={oc.status === "RESOLVIDA" ? "success" : "failure"} className="w-fit">
                          {oc.status?.toLowerCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-400 italic">
                      Nenhuma ocorrência recente registrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-4 justify-center">
          
          <Link 
            href="/ocorrencias"
            className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold p-4 rounded-xl shadow-sm transition-all text-sm text-center border border-transparent"
          >
            <HiPlusCircle size={20} /> Cadastrar nova ocorrência
          </Link>

          <Link 
            href="/historico-ocorrencias"
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold p-4 rounded-xl shadow-sm transition-all text-sm text-center border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <HiEye size={20} /> Visualizar histórico geral
          </Link>

        </div>

      </div>

    </div>
  );
}