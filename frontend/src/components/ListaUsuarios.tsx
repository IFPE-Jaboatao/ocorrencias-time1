"use client";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

export function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const resposta = await api.get("/usuario");
        console.log("O que veio da API do iFlow:", resposta);
        setUsuarios(resposta.data);
      } catch (error) {
        console.error("Erro ao listar usuários:", error);
      } finally {
        setLoading(false);
      }
    }
    buscarUsuarios();
  }, []);

  if (loading)
    return <div className="text-sm text-gray-500">Carregando perfis...</div>;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Nome</th>
            <th className="px-6 py-3">E-mail</th>
            <th className="px-6 py-3">CPF</th>
            <th className="px-6 py-3">Função</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {usuarios.map((usr: any) => (
            <tr
              key={usr.id}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {usr.name || usr.nome}
              </td>
              <td className="px-6 py-4">{usr.email}</td>
              <td className="px-6 py-4">{usr.cpf}</td>
              <td className="px-6 py-4">
                <span className="capitalize px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {usr.funcao}
                </span>
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
