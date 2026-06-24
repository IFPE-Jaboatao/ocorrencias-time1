"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner, Card, Badge } from "flowbite-react";
import { HiCalendar, HiBell, HiExclamationCircle, HiCheckCircle } from "react-icons/hi";
import { api } from "@/services/api";

interface OcorrenciaDependente {
  id: number;
  titulo: string;
  categoria: string;
  dataOcorrencia: string;
  aluno: {
    usuario: { nome: string };
  };
}

export default function ResponsavelDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaDependente[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [montado, setMontado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<"requerida" | "tudo_em_dia">("requerida");

useEffect(() => {
    setMontado(true);
    const carregarDadosResponsavel = async () => {
      try {
        const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
        
        const resposta = await api.get("/responsavel/ocorrencias", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resposta && resposta.data) {
          setOcorrencias(resposta.data);
        }
      } catch (error) {
        console.warn("Rota /responsavel/ocorrencias não encontrada ou indisponível no momento. Usando array vazio.");
        setOcorrencias([]); 
      } finally {
        setCarregandoDados(false);
      }
    };

    if (user) carregarDadosResponsavel();
  }, [user]);

  if (authLoading || !montado) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner size="xl" />
      </div>
    );
  }
  const pendentesCiencia = ocorrencias.filter(oc => oc.id); 

  return (
    <div className="pt-28 p-6 max-w-7xl mx-auto space-y-6">
            <Card className="border-none shadow-sm bg-gradient-to-r from-green-50 to-white dark:from-gray-800 dark:to-gray-800">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white capitalize">
          Bem-vinda, {user?.name?.toLowerCase()}!
        </h5>
        <p className="font-normal text-xs text-gray-500 dark:text-gray-400">
          Acompanhe e valide o registro de ocorrências escolares dos seus dependentes.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              Resumo:
            </h3>
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <button
                onClick={() => setAbaAtiva("requerida")}
                className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${abaAtiva === "requerida" ? "bg-green-700 text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}
              >
                Ação Requerida
              </button>
              <button
                onClick={() => setAbaAtiva("tudo_em_dia")}
                className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${abaAtiva === "tudo_em_dia" ? "bg-green-700 text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}
              >
                Tudo em dia
              </button>
            </div>

            <div className="mt-4 text-center text-sm py-2">
              {abaAtiva === "requerida" ? (
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Existem <span className="text-red-500 font-bold">{pendentesCiencia.length}</span> ocorrências aguardando sua assinatura de ciência.
                </p>
              ) : (
                <p className="text-green-600 dark:text-green-400 font-semibold flex items-center justify-center gap-1">
                  <HiCheckCircle size={16} /> Tudo assinado e regularizado!
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <HiBell className="text-yellow-500 text-sm" /> Avisos:
          </h3>
          <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed text-center py-4 flex flex-col items-center justify-center gap-2">
            <HiExclamationCircle size={24} className="text-red-500" />
            <p className="max-w-xs font-medium">
              {ocorrencias.length > 0 
                ? `${ocorrencias[0].aluno?.usuario?.nome} foi notificado com uma ocorrencia de ${ocorrencias[0].categoria?.toLowerCase().replace(/_/g, " ")}`
                : "Nenhum aviso ou notificação crítica recente."}
            </p>
          </div>
        </div>

      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider border-b border-gray-50 dark:border-gray-700 pb-3">
          Minha linha do aluno
        </h3>

        <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-6">
          {carregandoDados ? (
            <div className="text-xs text-gray-400 italic py-2">Buscando cronologia escolar...</div>
          ) : ocorrencias.length > 0 ? (
            ocorrencias.map((oc) => (
              <div key={oc.id} className="relative">
                <span className="absolute -left-[31px] top-0.5 bg-green-700 text-white rounded-full p-1 flex items-center justify-center border-4 border-white dark:border-gray-800">
                  <HiCalendar size={10} />
                </span>
                
                <div className="space-y-0.5 pl-2">
                  <span className="text-[10px] font-bold text-gray-400">
                    {oc.dataOcorrencia ? new Date(oc.dataOcorrencia).toLocaleDateString("pt-BR") : "S/D"}
                  </span>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                      {oc.titulo}
                    </h4>
                    <Badge color="indigo" size="xs">{oc.aluno?.usuario?.nome?.split(" ")[0]}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {oc.categoria?.replace(/_/g, " ").toLowerCase()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400 dark:text-gray-500 italic flex items-center gap-1.5 py-4">
              <HiCheckCircle className="text-green-600 text-sm" /> Seus dependentes não possuem ocorrências registradas.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}