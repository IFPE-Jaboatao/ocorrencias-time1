"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner, Card, Button } from "flowbite-react";
import { HiCalendar, HiUpload, HiBell, HiCheckCircle } from "react-icons/hi";
import { api } from "@/services/api";

interface OcorrenciaAluno {
  id: number;
  titulo: string;
  categoria: string;
  severidade: string;
  dataOcorrencia: string;
}

export default function AlunoDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaAluno[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    const carregarOcorrenciasAluno = async () => {
      try {
        const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
        
        // 🟢 Consome o endpoint /aluno/ocorrencias que puxa as ocorrências do ID do usuário logado!
        const resposta = await api.get("/aluno/ocorrencias", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOcorrencias(resposta.data || []);
      } catch (error) {
        console.error("Erro ao carregar ocorrências do aluno:", error);
      } finally {
        setCarregandoDados(false);
      }
    };

    if (user) carregarOcorrenciasAluno();
  }, [user]);

  if (authLoading || !montado) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="pt-28 p-6 max-w-7xl mx-auto space-y-6">
      
      {/* 👋 BOAS-VINDAS PADRONIZADO */}
      <Card className="border-none shadow-sm bg-gradient-to-r from-green-50 to-white dark:from-gray-800 dark:to-gray-800">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white capitalize">
          Bem-vinda, {user?.name?.toLowerCase()}!
        </h5>
        <p className="font-normal text-xs text-gray-500 dark:text-gray-400">
          Acompanhe seu rendimento comportamental, prazos e notificações institucionais no iFlow.
        </p>
      </Card>

      {/* 📊 SEÇÃO SUPERIOR: AÇÕES REQUERIDAS E AVISOS (Figma Topo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bloco: Ações Requeridas */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 block"></span> Ações Requeridas:
            </h3>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-3 text-center leading-relaxed">
              Enviar comprovante para falta do dia <span className="text-green-700 dark:text-green-400 font-bold">22/03/2026</span>
            </p>
          </div>
          <Button color="success" size="sm" className="bg-green-700 hover:bg-green-600 font-bold rounded-xl py-1">
            <HiUpload className="mr-2 h-4 w-4" /> Enviar Comprovante
          </Button>
        </div>

        {/* Bloco: Avisos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-start space-y-3">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <HiBell className="text-yellow-500 text-sm" /> Avisos:
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed text-center py-2">
            Por gentileza comparecer na secretaria devido a abertura de uma ocorrência no dia <span className="font-semibold text-gray-800 dark:text-gray-200">20/04/2026</span>.
          </p>
        </div>

      </div>

      {/* ⏳ LINHA DO TEMPO: HISTÓRICO COMPORTAMENTAL (Figma Baixo) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider border-b border-gray-50 dark:border-gray-700 pb-3">
          Minha linha do tempo
        </h3>

        <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-6">
          {carregandoDados ? (
            <div className="text-xs text-gray-400 italic py-2">Buscando cronologia do iFlow...</div>
          ) : ocorrencias.length > 0 ? (
            ocorrencias.map((oc) => (
              <div key={oc.id} className="relative">
                {/* Marcador redondo na linha */}
                <span className="absolute -left-[31px] top-0.5 bg-green-700 text-white rounded-full p-1 flex items-center justify-center border-4 border-white dark:border-gray-800">
                  <HiCalendar size={10} />
                </span>
                
                {/* Conteúdo do item */}
                <div className="space-y-0.5 pl-2">
                  <span className="text-[10px] font-bold text-gray-400">
                    {oc.dataOcorrencia ? new Date(oc.dataOcorrencia).toLocaleDateString("pt-BR") : "S/D"}
                  </span>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                    {oc.titulo}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {oc.categoria?.replace(/_/g, " ").toLowerCase()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400 dark:text-gray-500 italic flex items-center gap-1.5 py-4">
              <HiCheckCircle className="text-green-600 text-sm" /> ✔️ Tudo regular! Nenhuma ocorrência registrada na sua ficha comportamental.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}