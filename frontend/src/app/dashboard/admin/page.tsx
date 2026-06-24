"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner, Card, Button } from "flowbite-react";
import { ListaUsuarios } from "@/components/ListaUsuarios";
import Link from "next/link";
import { HiPlusCircle, HiUserAdd, HiClipboardList, HiClock, HiCheckCircle } from "react-icons/hi";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [metricas, setMetricas] = useState({ total: 0, pendentes: 0, taxaResolucao: "0%" });
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    const carregarMetricasAdmin = async () => {
      try {
        const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
                const resposta = await api.get("/ocorrencias/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetricas({
          total: resposta.data.total ?? 0,
          pendentes: resposta.data.pendentes ?? 0,
          taxaResolucao: resposta.data.taxaResolucao ?? "0%",
        });
      } catch (error) {
        console.error("Erro ao buscar métricas do admin:", error);
      } finally {
        setCarregandoDados(false);
      }
    };

    if (user) carregarMetricasAdmin();
  }, [user]);
  if (authLoading || !montado) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
<div className="p-8 max-w-7xl mx-auto mt-20 min-h-screen">
      
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-2xl border-none shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize">
          Bem-vindo, {user?.name?.toLowerCase()}!
        </h1>
        <p className="font-normal text-xs text-gray-500 dark:text-gray-400 mt-1">
          Painel de controle centralizado. Gerencie usuários, perfis e monitore o fluxo de resoluções.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 items-stretch">
        
        <div className="bg-white dark:bg-gray-800 px-6 py-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 min-h-[120px]">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            <HiClipboardList size={26} />
          </div>
<div>
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total de Ocorrências</p>
          <h2 className="text-3xl font-black text-gray-800 dark:text-white mt-1">
            {carregandoDados ? "..." : metricas.total}
          </h2>
        </div>
        </div>
        <div className="bg-white dark:bg-gray-800 px-6 py-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 min-h-[120px]">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl text-yellow-600 dark:text-yellow-400 flex-shrink-0">
            <HiClock size={26} />
          </div>
          <div>
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Ocorrências Pendentes</p>
          <h2 className="text-3xl font-black text-yellow-600 mt-1">
            {carregandoDados ? "..." : metricas.pendentes}
          </h2>
        </div>
        </div>

        <div className="bg-white dark:bg-gray-800 px-6 py-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 min-h-[120px]">
          <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400 flex-shrink-0">
            <HiCheckCircle size={26} />
          </div>
          <div>
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Taxa de Resolução</p>
          <h2 className="text-3xl font-black text-green-600 mt-1">
            {carregandoDados ? "..." : metricas.taxaResolucao}
          </h2>
        </div>
        </div>

        <div className="flex flex-col gap-3 justify-between h-full">
          <Link 
            href="/ocorrencias" 
            className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all text-xs text-center min-h-[54px]"
          >
            <HiPlusCircle size={18} /> Cadastrar nova ocorrência
          </Link>

          <Link 
            href="/dashboard/admin/cadastrar-usuario" 
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all text-xs text-center border border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 min-h-[54px]"
          >
            <HiUserAdd size={18} /> Cadastrar novo perfil
          </Link>
        </div>

      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />
      
      <div className="flex flex-col gap-4">
        <div>
          <Button
            color="light"
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Visualizar todos perfis
          </Button>
        </div>
        <ListaUsuarios />
      </div>
    </div>
  );
}
